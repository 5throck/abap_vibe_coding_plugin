#!/usr/bin/env bun
/**
 * vsp-task.ts - Create a new task file in scratch/tasks/
 * Usage:
 *   bun scripts/vsp-task.ts [task-name]
 *   bun scripts/vsp-task.ts --check          # dry-run validation
 *
 * Creates a new task file from docs/task-template.md (or a minimal inline template).
 *
 * @module vsp-task
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

// ── Parse arguments ───────────────────────────────────────────────────────────
const NAME = process.argv[2] || "new-task";
const DRY_RUN = NAME === "--check";

// ── Resolve paths ──────────────────────────────────────────────────────────────
const scriptDir = path.dirname(import.meta.path);
const projectRoot = path.resolve(scriptDir, "..");
const scratchDir = path.join(projectRoot, "scratch", "tasks");
const templateFile = path.join(projectRoot, "docs", "task-template.md");

// ── Helpers ───────────────────────────────────────────────────────────────────
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function now(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}

function nextSeq(): number {
  const date = today();
  mkdirSync(scratchDir, { recursive: true });

  if (!existsSync(scratchDir)) return 1;

  const files = readdirSync(scratchDir)
    .filter((f) => f.startsWith(`task-${date}-`) && f.endsWith(".md"))
    .map((f) => {
      const match = f.match(/task-\d{4}-\d{2}-\d{2}-(\d+)\.md$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => n > 0);

  return files.length > 0 ? Math.max(...files) + 1 : 1;
}

const MINIMAL_TEMPLATE = `# Task — <!-- date and time -->

## 0. Request

**Received by (PM)**: <!-- date and time -->
**User Request**:
> <!-- paste original user request verbatim -->

**Classification**: <!-- Debug / Graph Analysis / Interface / Infra / ABAP Dev -->
**Package**: $TMP
**Affected Object Types**: <!-- fill after investigation -->

## 1. Business Analysis
<!-- Fill after read-only-analyst / sap-investigator / schema-inspector results -->

## 2. Technical Design
<!-- Fill after architect report -->

## 3. Implementation Log
<!-- Fill as code-writer completes steps -->

## 4. QA / Test Results
<!-- Fill after test-runner report -->

## 5. Finalization
<!-- Memory log entry, transport number, git commit -->
`;

// ── Dry-run ────────────────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log("✅ vsp-task.ts: syntax OK (dry-run mode)");
  process.exit(0);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const DATE = today();
const TIME = now();
const seq = String(nextSeq()).padStart(3, "0");
const targetFileName = `task-${DATE}-${seq}.md`;
const targetPath = path.join(scratchDir, targetFileName);

let templateContent: string;

if (existsSync(templateFile)) {
  templateContent = readFileSync(templateFile, "utf-8")
    .replace(/<!-- date and time -->/g, TIME)
    .replace(/<!-- paste original user request verbatim -->/g, `Request for: ${NAME}`)
    .replace(/\]\(\.\.\/skills\//g, "](../../skills/");
} else {
  console.warn("⚠️  task-template.md not found. Using minimal template.");
  templateContent = MINIMAL_TEMPLATE
    .replace(/<!-- date and time -->/g, TIME)
    .replace(/<!-- paste original user request verbatim -->/g, `Request for: ${NAME}`);
}

writeFileSync(targetPath, templateContent, "utf-8");
console.log(`Created new task: ${targetFileName}`);
console.log(`Path: ${targetPath}`);
