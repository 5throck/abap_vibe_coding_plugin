#!/usr/bin/env bun
/**
 * dev-sync.ts - Full pipeline: memlog → sync-md → changelog → audit → commit → PR
 * Cross-platform TypeScript implementation (via Bun runtime).
 * Single Source of Truth — replaces dev-sync.sh / dev-sync.ps1.
 *
 * Usage:
 *   bun scripts/dev-sync.ts "feat: description"
 *   bun scripts/dev-sync.ts --check          # dry-run: validate only, no git changes
 *
 * @module dev-sync
 */

import { execSync, execFileSync, ExecSyncOptions, SpawnSyncOptions } from "node:child_process";
import path from "node:path";
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync, readdirSync } from "node:fs";

// ── Parse arguments ───────────────────────────────────────────────────────────
const DRY_RUN = process.argv[2] === "--check";
const MSG = DRY_RUN ? "chore: update" : (process.argv[2] || "");
if (!DRY_RUN && !MSG) {
  console.error("Usage: bun scripts/dev-sync.ts \"<conventional-commit-message>\"");
  console.error("Example: bun scripts/dev-sync.ts \"feat: add ZCL_MY_CLASS\"");
  process.exit(1);
}

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

const BASE_OPTS: ExecSyncOptions = { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], cwd: projectRoot };

function run(cmd: string, opts?: ExecSyncOptions): string {
  try {
    return execSync(cmd, { ...BASE_OPTS, ...opts }).trim();
  } catch {
    return "";
  }
}

function runOrFail(cmd: string, opts?: ExecSyncOptions): string {
  return execSync(cmd, { encoding: "utf-8", stdio: "pipe", cwd: projectRoot, ...opts }).trim();
}

/**
 * Shell-safe execution — uses execFileSync with argument array to prevent
 * shell injection. All user-controlled inputs (MSG, branch, etc.) must
 * pass through this function instead of template-literal execSync.
 */
function runSafe(cmd: string, args: string[], opts?: SpawnSyncOptions): string {
  try {
    const result = execFileSync(cmd, args, { encoding: "utf-8", stdio: "pipe", cwd: projectRoot, ...opts });
    return (result as string).trim();
  } catch {
    return "";
  }
}

function runSafeOrFail(cmd: string, args: string[], opts?: SpawnSyncOptions): string {
  const result = execFileSync(cmd, args, { encoding: "utf-8", stdio: "pipe", cwd: projectRoot, ...opts });
  return (result as string).trim();
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

function isSensitive(filePath: string): boolean {
  // Extract basename to handle nested paths like config/.env
  const basename = path.basename(filePath);
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(basename));
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
const syncMdTs = path.join(scriptDir, "sync-md.ts");
if (existsSync(syncMdTs)) {
  runSafeOrFail("bun", [syncMdTs, DATE, MSG]);
} else {
  console.warn("⚠️  sync-md.ts not found — skipping MEMORY.md update");
}

// ── 3. Auto-add to CHANGELOG.md [Unreleased] if not already present ────────────
const changelogPath = path.join(projectRoot, "CHANGELOG.md");
if (existsSync(changelogPath)) {
  const content = readFileSync(changelogPath, "utf-8");
  const unreleasedMatch = content.match(/## \[Unreleased\]([\s\S]*?)(?=\n## |$)/);
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

// ── 4. Audit gate (pre-commit hook runs audit.ts on commit — skip here) ──────
// NOTE: audit.ts runs via .githooks/pre-commit during `git commit`.
// Skipping here avoids redundant double execution.

// ── 5. Guard against committing sensitive files (untracked) ──────────────────
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

// ── 6. Branch → commit → push ──────────────────────────────────────────────
let currentBranch = runOrFail("git rev-parse --abbrev-ref HEAD");
let branch: string;

if (currentBranch === "main" || currentBranch === "master") {
  const ts = new Date().toISOString().replace(/[-T:]/g, "").slice(0, 15);
  branch = `pr/${ts}-${slugify(MSG)}`;
  runSafeOrFail("git", ["checkout", "-b", branch]);
} else {
  branch = currentBranch;
  console.log(`ℹ️  Already on branch '${branch}' - committing here without creating a new branch.`);
}

runOrFail('git add -A');

// ── 6-B. Guard against sensitive files in staged set (not just untracked) ──
const stagedFiles = run("git diff --cached --name-only").split("\n").filter(Boolean);
const stagedSensitive = stagedFiles.filter(isSensitive);
if (stagedSensitive.length > 0) {
  // Unstage sensitive files before aborting (shell-safe arg array)
  runSafe("git", ["reset", "HEAD", "--", ...stagedSensitive]);
  console.error("❌ Potentially sensitive staged files detected — unstaged:");
  stagedSensitive.forEach((f) => console.error(`   ${f}`));
  console.error("   Stage files explicitly with 'git add <file>' or add them to .gitignore.");
  process.exit(1);
}

const commitBody = `${MSG}\n\n${CO_AUTHOR}`;
runSafeOrFail("git", ["commit", "-m", commitBody]);

// ── 7. Push (with pre-PR security gate for public repos) ──────────────────
// Pre-PR Security Gate — check if repo is public before pushing
const isPrivate = run("gh repo view --json isPrivate -q '.isPrivate' 2>/dev/null");
if (isPrivate === "false") {
  console.warn("⚠️  This is a PUBLIC repository.");
  console.warn("   Checking for sensitive content in staged files...");
  // Read security advisories if they exist
  const securityDir = path.join(projectRoot, "security");
  if (existsSync(securityDir)) {
    const securityFiles = readdirSync(securityDir).filter(f => f.endsWith(".md"));
    if (securityFiles.length > 0) {
      console.warn("   ⚠️  Security advisories found in security/:");
      securityFiles.forEach(f => console.warn(`     - security/${f}`));
      console.warn("   Review these advisories before proceeding.");
    }
  }
  console.warn("   Press Ctrl+C to abort, or wait 5 seconds to continue...");
  runSafe("sleep", ["5"]);
}

// Push with error handling for missing remote
try {
  runSafeOrFail("git", ["push", "-u", "origin", branch]);
} catch (e) {
  const remotes = run("git remote");
  if (!remotes) {
    console.error("❌ No git remote configured. Add one with: git remote add origin <url>");
  } else {
    console.error(`❌ Push failed. Remote 'origin' may not exist. Available remotes: ${remotes}`);
  }
  console.error("   Your commit is saved locally. Push manually when ready.");
  process.exit(1);
}

// ── 8. Open PR (graceful degradation if gh CLI not available) ────────────
const templatePath = path.join(projectRoot, ".github", "pull_request_template.md");
const hasGh = run("which gh || where gh 2>/dev/null") !== "";
if (!hasGh) {
  console.warn("⚠️  GitHub CLI (gh) not found — skipping PR creation.");
  console.warn("   Create a PR manually at your repository's URL.");
  console.log(`✅ Sync complete. Branch '${branch}' pushed. Create PR manually.`);
  process.exit(0);
}

if (existsSync(templatePath)) {
  runSafeOrFail("gh", ["pr", "create", "--title", MSG, "--body-file", templatePath]);
} else {
  runSafeOrFail("gh", ["pr", "create", "--title", MSG, "--fill"]);
}
