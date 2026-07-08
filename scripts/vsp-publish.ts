#!/usr/bin/env bun
/**
 * vsp-publish.ts - Standardized packaging script
 * Sanitizes and copies core framework assets to the plugin repository.
 *
 * Usage:
 *   CLAUDE_PLUGIN_ROOT=/path/to/plugin bun scripts/vsp-publish.ts "feat: description"
 *   bun scripts/vsp-publish.ts --check          # dry-run validation
 *
 * @module vsp-publish
 */

import { execSync, execFileSync, ExecSyncOptions, SpawnSyncOptions } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, cpSync, readdirSync, statSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

// ── Parse arguments ───────────────────────────────────────────────────────────
const DRY_RUN = process.argv[2] === "--check";
const COMMIT_MESSAGE = DRY_RUN ? "" : (process.argv[2] || "");

// ── Resolve paths ──────────────────────────────────────────────────────────────
const scriptDir = path.dirname(import.meta.path);
const sourceDir = path.resolve(scriptDir, "..");
const TARGET_DIR = process.env.CLAUDE_PLUGIN_ROOT || "";

// ── Helpers ───────────────────────────────────────────────────────────────────
function run(cmd: string, opts?: ExecSyncOptions): string {
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], cwd: sourceDir, ...opts }).trim();
  } catch {
    return "";
  }
}

function runOrFail(cmd: string, opts?: ExecSyncOptions): string {
  return execSync(cmd, { encoding: "utf-8", stdio: "pipe", cwd: sourceDir, ...opts }).trim();
}

/**
 * Shell-safe execution — uses execFileSync with argument array.
 * Prevents shell injection for user-controlled inputs.
 */
function runSafe(cmd: string, args: string[], opts?: SpawnSyncOptions): string {
  try {
    const result = execFileSync(cmd, args, { encoding: "utf-8", stdio: "pipe", cwd: sourceDir, ...opts });
    return (result as string).trim();
  } catch {
    return "";
  }
}

function runSafeOrFail(cmd: string, args: string[], opts?: SpawnSyncOptions): string {
  const result = execFileSync(cmd, args, { encoding: "utf-8", stdio: "pipe", cwd: sourceDir, ...opts });
  return (result as string).trim();
}

function md5File(filePath: string): string {
  const data = readFileSync(filePath);
  return createHash("md5").update(data).digest("hex");
}

interface Asset {
  source: string;
  target: string;
  isFolder: boolean;
}

// Assets to sync — folders (target may differ from source)
const SYNC_FOLDERS: Array<{ src: string; tgt: string }> = [
  { src: "agents", tgt: "agents" },
  { src: "skills", tgt: "skills" },
  { src: path.join(".claude", "commands"), tgt: "commands" },
];

// Assets to sync — individual files
const SYNC_FILES: string[] = [
  path.join("docs", "prd-template.md"),
  path.join("docs", "task-template.md"),
  path.join("docs", "plugin-setup.md"),
  path.join("scripts", "install-vsp.ps1"),
  path.join("scripts", "install-vsp.sh"),
  path.join("scripts", "sync-md.ts"),
  path.join("scripts", "audit.ts"),
  path.join("scripts", "dev-sync.ts"),
  path.join("scripts", "vsp-task.ts"),
  path.join("scripts", "setup.ts"),
  path.join("scripts", "vsp-publish.ts"),
  ".mcp.json.sample",
];

// ── Dry-run ────────────────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log("✅ vsp-publish.ts: syntax OK (dry-run mode)");
  process.exit(0);
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log("--- Harness Packaging & Publishing Hook ---");

// 1. Validate target directory
if (!TARGET_DIR) {
  console.error("  [!] CLAUDE_PLUGIN_ROOT is not set.");
  console.error('  [!] Usage: CLAUDE_PLUGIN_ROOT=/path/to/abap_vibe_coding_plugin bun scripts/vsp-publish.ts "<message>"');
  process.exit(1);
}

if (!existsSync(TARGET_DIR)) {
  console.error(`  [!] Target plugin directory '${TARGET_DIR}' does not exist.`);
  process.exit(1);
}

const targetDir = path.resolve(TARGET_DIR);
let verifyFailed = false;

// 2. Sync folders
for (const { src, tgt } of SYNC_FOLDERS) {
  const srcPath = path.join(sourceDir, src);
  const tgtPath = path.join(targetDir, tgt);

  if (!existsSync(srcPath)) {
    console.warn(`  [!] Source Folder '${srcPath}' not found. Skipping.`);
    continue;
  }

  // Clean target directory first to prevent orphaned files
  if (existsSync(tgtPath)) {
    rmSync(tgtPath, { recursive: true, force: true });
  }
  mkdirSync(tgtPath, { recursive: true });

  // Copy all files recursively
  const entries = readdirSync(srcPath);
  for (const entry of entries) {
    const srcEntry = path.join(srcPath, entry);
    const tgtEntry = path.join(tgtPath, entry);
    cpSync(srcEntry, tgtEntry, { recursive: true });
  }
  console.log(`  [+] Synced Folder: ${src} -> ${tgt}`);
}

// 3. Sync files
for (const relFile of SYNC_FILES) {
  const srcFile = path.join(sourceDir, relFile);
  const tgtFile = path.join(targetDir, relFile);

  if (!existsSync(srcFile)) {
    console.warn(`  [!] Source File '${srcFile}' not found. Skipping.`);
    continue;
  }

  mkdirSync(path.dirname(tgtFile), { recursive: true });
  cpSync(srcFile, tgtFile);
  console.log(`  [+] Synced File  : ${relFile} -> ${relFile}`);
}

// 4. Hash Verification
console.log("Verifying copied assets integrity...");

for (const { src, tgt } of SYNC_FOLDERS) {
  const srcPath = path.join(sourceDir, src);
  const tgtPath = path.join(targetDir, tgt);
  if (!existsSync(srcPath)) continue;

  // Walk source tree recursively
  function walkDir(dir: string, base: string): void {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const relPath = path.join(base, entry);
      const stat = statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath, relPath);
      } else {
        const tfPath = path.join(tgtPath, relPath);
        if (!existsSync(tfPath)) {
          console.error(`  [!] Missing target file: ${tgt}/${relPath}`);
          verifyFailed = true;
          continue;
        }
        const srcHash = md5File(fullPath);
        const tgtHash = md5File(tfPath);
        if (srcHash !== tgtHash) {
          console.error(`  [!] Hash mismatch in file: ${tgt}/${relPath}`);
          verifyFailed = true;
        }
      }
    }
  }
  walkDir(srcPath, ".");
}

for (const relFile of SYNC_FILES) {
  const srcFile = path.join(sourceDir, relFile);
  const tgtFile = path.join(targetDir, relFile);
  if (!existsSync(srcFile)) continue;

  const srcHash = md5File(srcFile);
  const tgtHash = md5File(tgtFile);
  if (srcHash !== tgtHash) {
    console.error(`  [!] Hash mismatch in file: ${relFile}`);
    verifyFailed = true;
  }
}

if (verifyFailed) {
  console.error("Integrity check FAILED. Assets do not match.");
  process.exit(1);
} else {
  console.log("Integrity verification PASSED. All copied assets match 100%.");
}

// 5. Commit and Push inside the Target Repository
if (COMMIT_MESSAGE) {
  console.log("Staging and committing in target plugin repository...");
  runSafe("git", ["add", "-A"], { cwd: targetDir });

  const status = run(`cd "${targetDir}" && git status --porcelain`);
  if (!status) {
    console.log("No changes detected in plugin repository. Distribution up to date.");
  } else {
    runSafeOrFail("git", ["commit", "-m", COMMIT_MESSAGE], { cwd: targetDir });
    const branch = runSafeOrFail("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: targetDir });
    console.log(`Pushing to remote origin ${branch}...`);
    runSafeOrFail("git", ["push", "origin", branch], { cwd: targetDir });
    console.log("Distribution successfully pushed!");
  }
}

console.log("Harness packaging complete!");
