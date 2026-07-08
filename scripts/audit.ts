#!/usr/bin/env bun
/**
 * audit.ts - Documentation integrity check
 * Checks that required files and sections exist before a commit.
 * Exit code 0 = pass, non-zero = fail.
 *
 * Usage:
 *   bun scripts/audit.ts
 *   bun scripts/audit.ts --check          # dry-run validation
 *
 * @module audit
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

// ── Parse arguments ───────────────────────────────────────────────────────────
const DRY_RUN = process.argv[2] === "--check";

// ── Resolve paths ──────────────────────────────────────────────────────────────
const scriptDir = path.dirname(import.meta.path);
const projectRoot = path.resolve(scriptDir, "..");

// ── Helpers ───────────────────────────────────────────────────────────────────
let errors = 0;

function red(msg: string): void {
  console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
}
function green(msg: string): void {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}
function warn(msg: string): void {
  console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);
}

function fileContains(filePath: string, pattern: string): boolean {
  if (!existsSync(filePath)) return false;
  return readFileSync(filePath, "utf-8").includes(pattern);
}

// ── Dry-run ────────────────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log("✅ audit.ts: syntax OK (dry-run mode)");
  process.exit(0);
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("=== audit.ts - workspace standards check ===");

// 1. CHANGELOG.md must exist
if (existsSync(path.join(projectRoot, "CHANGELOG.md"))) {
  green("CHANGELOG.md exists");
} else {
  red("CHANGELOG.md missing");
  errors++;
}

// 2. CONSTITUTION.md (optional for distributable plugin packages)
if (
  existsSync(path.join(projectRoot, "CONSTITUTION.md")) ||
  existsSync(path.join(projectRoot, "..", "CONSTITUTION.md"))
) {
  green("CONSTITUTION.md accessible");
} else {
  warn("CONSTITUTION.md not found (optional for distributable plugins)");
}

// 3. CHANGELOG.md must have [Unreleased] section
const changelogPath = path.join(projectRoot, "CHANGELOG.md");
if (existsSync(changelogPath)) {
  if (fileContains(changelogPath, "[Unreleased]")) {
    green("CHANGELOG.md has [Unreleased] section");
  } else {
    red("CHANGELOG.md is missing '[Unreleased]' section");
    errors++;
  }
}

// 4. AGENTS.md must exist
if (existsSync(path.join(projectRoot, "AGENTS.md"))) {
  green("AGENTS.md exists");
} else {
  red("AGENTS.md missing (required for agent-first projects)");
  errors++;
}

// 5. At least one agent file must exist in agents/
const agentsDir = path.join(projectRoot, "agents");
if (existsSync(agentsDir)) {
  const agentFiles = readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
  if (agentFiles.length > 0) {
    green("agents/ has agent files");
  } else {
    red("agents/ is empty - create at least agents/pm.md");
    errors++;
  }
} else {
  red("agents/ is missing - create at least agents/pm.md");
  errors++;
}

// ── Project-level checks (skip if docs/context.md absent) ──────────────────────
const contextMd = path.join(projectRoot, "docs", "context.md");
if (existsSync(contextMd)) {
  // 6. docs/context.md must have ## Coding Guidelines
  if (fileContains(contextMd, "## Coding Guidelines")) {
    green("docs/context.md has ## Coding Guidelines");
  } else {
    red("docs/context.md is missing '## Coding Guidelines' section");
    errors++;
  }

  // 7. .env.sample must exist
  if (existsSync(path.join(projectRoot, ".env.sample"))) {
    green(".env.sample exists");
  } else {
    warn(".env.sample not found - add one if this project uses environment variables");
  }

  // NOTE: scripts/ .sh/.ps1 parity check removed after TypeScript migration.
  // All utility scripts are now .ts (single source of truth).
} else {
  warn("docs/context.md not found - skipping project-level checks (workspace root)");
}

// ── Result ───────────────────────────────────────────────────────────────────
console.log("");
if (errors === 0) {
  console.log("\x1b[32m✅ All checks passed.\x1b[0m");
  process.exit(0);
} else {
  console.log(`\x1b[31m❌ ${errors} check(s) failed. Fix before committing.\x1b[0m`);
  process.exit(1);
}
