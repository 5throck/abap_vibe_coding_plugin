#!/usr/bin/env bun
/**
 * sync-md.ts - Update memory/MEMORY.md index
 * Usage:
 *   bun scripts/sync-md.ts "YYYY-MM-DD" "summary"
 *   bun scripts/sync-md.ts --check          # dry-run validation
 *
 * If the date already exists, the summary is updated (not duplicated).
 * Idempotent — safe for both hook and dev-sync callers.
 *
 * @module sync-md
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

// ── Parse arguments ───────────────────────────────────────────────────────────
const DRY_RUN = process.argv[2] === "--check";
const DATE = DRY_RUN ? new Date().toISOString().slice(0, 10) : (process.argv[2] || new Date().toISOString().slice(0, 10));
const SUMMARY = DRY_RUN ? "update" : (process.argv[3] || "update");

// ── Resolve paths ──────────────────────────────────────────────────────────────
const scriptDir = path.dirname(import.meta.path);
const projectRoot = path.resolve(scriptDir, "..");
const memoryDir = path.join(projectRoot, "memory");
const memoryFile = path.join(memoryDir, "MEMORY.md");

const HEADER = "# Memory Index\n\n| Date | Summary |\n|------|----------|";
const ROW_PATTERN = `| [${DATE}](${DATE}.md) |`;

// ── Dry-run ────────────────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log("✅ sync-md.ts: syntax OK (dry-run mode)");
  process.exit(0);
}

// ── Main ───────────────────────────────────────────────────────────────────────
mkdirSync(memoryDir, { recursive: true });

if (!existsSync(memoryFile)) {
  writeFileSync(memoryFile, `${HEADER}\n`, "utf-8");
}

const content = readFileSync(memoryFile, "utf-8");

if (content.includes(`[${DATE}]`)) {
  // Update existing entry's summary (idempotent — safe for hook + dev-sync)
  const updated = content.replace(
    new RegExp(`\\| \\[${DATE}\\]\\(${DATE}\\.md\\) \\|[^|]*\\|`, "g"),
    `| [${DATE}](${DATE}.md) | ${SUMMARY} |`
  );
  writeFileSync(memoryFile, updated, "utf-8");
} else {
  const appended = content.endsWith("\n") ? content : `${content}\n`;
  writeFileSync(memoryFile, `${appended}| [${DATE}](${DATE}.md) | ${SUMMARY} |\n`, "utf-8");
}
