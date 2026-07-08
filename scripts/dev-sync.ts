#!/usr/bin/env bun
/**
 * dev-sync.ts - Full pipeline: memlog → sync-md → changelog → audit → commit → PR
 * Cross-platform TypeScript implementation (via Bun runtime).
 * Mirrors dev-sync.sh / dev-sync.ps1 exactly.
 *
 * Usage:
 *   bun scripts/dev-sync.ts "feat: description"
 *   bun scripts/dev-sync.ts --check          # dry-run: validate only, no git changes
 *
 * @module dev-sync
 */

import { execSync, ExecSyncOptions } from "node:child_process";
import path from "node:path";
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from "node:fs";

// ── Parse arguments ───────────────────────────────────────────────────────────
const DRY_RUN = process.argv[2] === "--check";
const MSG = DRY_RUN ? "chore: update" : (process.argv[2] || "chore: update");

// ── Constants ──────────────────────────────────────────────────────────────────
const CO_AUTHOR = "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>";
const SENSITIVE_PATTERNS: RegExp[] = [
  /\.(pem|key|p12|pfx|jks|keystore)$/i,
  /^\.env(\.[^s][^a]|$)/,
  /credentials\.json$/i,
  /service.?account\.json$/i,
  /secrets\.ya?ml$/i,
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const scriptDir = path.dirname(import.meta.path);
const projectRoot = path.resolve(scriptDir, "..");

function run(cmd: string, opts?: ExecSyncOptions): string {
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], cwd: projectRoot, ...opts }).trim();
  } catch {
    return "";
  }
}

function runOrFail(cmd: string, opts?: ExecSyncOptions): string {
  return execSync(cmd, { encoding: "utf-8", stdio: "pipe", cwd: projectRoot, ...opts }).trim();
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function changelogCategory(msg: string): string {
  if (/^feat/i.test(msg)) return "### Added";
  if (/^fix/i.test(msg)) return "### Fixed";
  if (/^revert/i.test(msg)) return "### Removed";
  return "### Changed";
}

function slugify(msg: string, maxLen = 40): string {
  return msg
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLen);
}

function isSensitive(filename: string): boolean {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(filename));
}

function die(msg: string): never {
  console.error(msg);
  process.exit(1);
}

// ── Main ──────────────────────────────────────────────────────────────────────
const DATE = today();

if (DRY_RUN) {
  console.log("✅ dev-sync.ts: syntax OK (dry-run mode)");
  process.exit(0);
}

// ── 1. Write daily session log ─────────────────────────────────────────────────
const memoryDir = path.join(projectRoot, "memory");
mkdirSync(memoryDir, { recursive: true });

const memoryFile = path.join(memoryDir, `${DATE}.md`);
const gitStatus = run("git status --short");
const fileList = gitStatus
  .split("\n")
  .map((line) => line.replace(/^.{1,2}\s+/, "").trim())
  .filter(Boolean)
  .join(", ");

const separator = existsSync(memoryFile) ? "\n---\n\n" : "";
const entry = `${separator}## ${MSG}\n- **Files**: ${fileList}\n- **Purpose**: \n- **Decisions**: \n- **Issues**: None\n`;
appendFileSync(memoryFile, entry, "utf-8");

// ── 2. Update MEMORY.md index ─────────────────────────────────────────────────
const syncMdSh = path.join(scriptDir, "sync-md.sh");
const syncMdPs1 = path.join(scriptDir, "sync-md.ps1");
if (existsSync(syncMdSh)) {
  runOrFail(`bash "${syncMdSh}" "${DATE}" "${MSG}"`);
} else if (existsSync(syncMdPs1)) {
  runOrFail(`pwsh -NonInteractive -File "${syncMdPs1}" -Date "${DATE}" -Summary "${MSG}"`);
} else {
  console.warn("⚠️  sync-md.sh/ps1 not found — skipping MEMORY.md update");
}

// ── 3. Auto-add to CHANGELOG.md [Unreleased] if not already present ────────────
const changelogPath = path.join(projectRoot, "CHANGELOG.md");
if (existsSync(changelogPath)) {
  const content = readFileSync(changelogPath, "utf-8");
  const unreleasedMatch = content.match(/## \[Unreleased\]([\s\S]*?)(?=\n## |\z)/);
  if (unreleasedMatch) {
    const section = unreleasedMatch[1];
    if (!section.includes(MSG)) {
      const category = changelogCategory(MSG);
      const newContent = content.replace(
        /(## \[Unreleased\])/,
        `$1\n\n${category}\n- **[${DATE}]**: ${MSG}\n`
      );
      writeFileSync(changelogPath, newContent, "utf-8");
      console.log(`📝 Auto-added changelog entry: ${MSG}`);
    }
  }
}

// ── 4. Audit gate ──────────────────────────────────────────────────────────────
const auditSh = path.join(scriptDir, "audit.sh");
const auditPs1 = path.join(scriptDir, "audit.ps1");
if (existsSync(auditSh)) {
  runOrFail(`bash "${auditSh}"`);
} else if (existsSync(auditPs1)) {
  runOrFail(`pwsh -NonInteractive -File "${auditPs1}"`);
}

// ── 5. Guard against committing sensitive files ────────────────────────────────
const untrackedFiles = run("git ls-files --others --exclude-standard")
  .split("\n")
  .filter(Boolean);
const sensitive = untrackedFiles.filter(isSensitive);
if (sensitive.length > 0) {
  console.error("❌ Potentially sensitive untracked files detected - refusing git add -A:");
  sensitive.forEach((f) => console.error(`   ${f}`));
  console.error("   Stage files explicitly with 'git add <file>' or add them to .gitignore.");
  process.exit(1);
}

// ── 6. Branch → commit → push ────────────────────────────────────────────────
let currentBranch = runOrFail("git rev-parse --abbrev-ref HEAD");
let branch: string;

if (currentBranch === "main" || currentBranch === "master") {
  const ts = new Date().toISOString().replace(/[-T:]/g, "").slice(0, 15);
  branch = `pr/${ts}-${slugify(MSG)}`;
  runOrFail(`git checkout -b "${branch}"`);
} else {
  branch = currentBranch;
  console.log(`ℹ️  Already on branch '${branch}' - committing here without creating a new branch.`);
}

runOrFail('git add -A');
runOrFail(`git commit -m "${MSG}\\n\\n${CO_AUTHOR}"`);
runOrFail(`git push -u origin "${branch}"`);

// ── 7. Open PR ──────────────────────────────────────────────────────────────
const templatePath = path.join(projectRoot, ".github", "pull_request_template.md");
if (existsSync(templatePath)) {
  runOrFail(`gh pr create --title "${MSG}" --body-file "${templatePath}"`);
} else {
  runOrFail(`gh pr create --title "${MSG}" --fill`);
}
