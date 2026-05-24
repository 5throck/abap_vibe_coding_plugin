#!/usr/bin/env bun
// vsp-task.ts — Create a new task file in scratch/tasks/
// Usage: bun scripts/vsp-task.ts "task-name"

const args = process.argv.slice(2);
const name = args[0] ?? "new-task";

const now = new Date();
const date = now.toISOString().split('T')[0];
const time = now.toISOString().replace('T', ' ').slice(0, 19);

const scriptDir = import.meta.dir;
const scratchDir = `${scriptDir}/../scratch/tasks`;
const templateFile = `${scriptDir}/../docs/task-template.md`;

// Create scratch dir if it doesn't exist
await Bun.mkdir(scratchDir, { recursive: true });

// Inline template fallback
const defaultTemplate = `# Task — <!-- date and time -->

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

// Find next sequence number
let nextSeq = 1;
const existingFiles = [...new Bun.Glob(`task-${date}-*.md`).scanSync({ cwd: scratchDir })];
if (existingFiles.length > 0) {
  const maxSeq = existingFiles
    .map(f => f.replace(`task-${date}-`, '').replace('.md', ''))
    .map(Number)
    .filter(n => !isNaN(n))
    .reduce((max, n) => Math.max(max, n), 0);
  nextSeq = maxSeq + 1;
}

const seqStr = nextSeq.toString().padStart(3, '0');
const targetFileName = `task-${date}-${seqStr}.md`;
const targetFilePath = `${scratchDir}/${targetFileName}`;

// Get template content
let templateContent: string;
if (await Bun.file(templateFile).exists()) {
  templateContent = await Bun.file(templateFile).text();
} else {
  console.warn("Warning: task-template.md not found. Using minimal template.");
  templateContent = defaultTemplate;
}

// Substitute placeholders
let content = templateContent
  .replace(/<!-- date and time -->/g, time)
  .replace(/<!-- paste original user request verbatim -->/g, `Request for: ${name}`)
  .replace(/](\.\.\/skills\//g, '](../../skills/');

// Write task file
await Bun.write(targetFilePath, content);

console.log(`Created new task: ${targetFileName}`);
console.log(`Path: ${targetFilePath}`);
