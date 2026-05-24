#!/usr/bin/env bun
// vsp-sync.ts — Sync memory logs, update index, and commit to Git
// Usage: bun scripts/vsp-sync.ts "type: summary"

const args = process.argv.slice(2);
const message = args[0];

if (!message) {
  console.error("Error: Commit message is required.");
  console.error("Usage: bun scripts/vsp-sync.ts 'type: summary'");
  process.exit(1);
}

const now = new Date();
const date = now.toISOString().split('T')[0];

const scriptDir = import.meta.dir;
const memoryDir = `${scriptDir}/../memory`;
const memoryFile = `${memoryDir}/${date}.md`;
const indexFile = `${memoryDir}/MEMORY.md`;

console.log("--- VSP Sync & Report ---");

// Run vsp-audit first
const auditResult = Bun.$`bun scripts/vsp-audit.ts`.quiet();
if (auditResult.exitCode !== 0) {
  console.error("Audit failed. Aborting sync.");
  process.exit(1);
}

// 1. Check for today's memory log — auto-create if missing
if (!(await Bun.file(memoryFile).exists())) {
  console.log(`Memory log for today not found. Auto-creating ${date}.md...`);
  await Bun.mkdir(memoryDir, { recursive: true });

  const time = now.toTimeString().slice(0, 5);
  const defaultLog = `# Memory Log: ${date}

<!-- Auto-created by vsp-sync.ts. Add entries below. -->

## ${time} — Session

<!-- Describe what was done today -->
`;
  await Bun.write(memoryFile, defaultLog);
  console.log(`Created: ${memoryFile}`);
}

// 2. Update MEMORY.md index if needed
if (await Bun.file(indexFile).exists()) {
  const indexContent = await Bun.file(indexFile).text();
  if (!indexContent.includes(`[${date}](${date}.md)`)) {
    console.log("Updating memory index...");

    let summary = "Development update";

    // Try to get first header from memory file
    const memoryContent = await Bun.file(memoryFile).text();
    const headerMatch = memoryContent.match(/^## (.+)$/m);
    if (headerMatch) {
      summary = headerMatch[1];
    }

    // Extract summary from commit message if it has a colon
    const msgMatch = message.match(/:\s*(.+)/);
    if (msgMatch) {
      summary = msgMatch[1];
    }

    const newEntry = `| [${date}](${date}.md) | ${summary} |`;

    // Insert after the separator line
    const updatedIndex = indexContent.replace(
      /(^\|------\|---------\|$)/m,
      `$1\n${newEntry}`
    );
    await Bun.write(indexFile, updatedIndex);
  }
}

// 3. Git Commit
console.log("Committing to Git...");
Bun.$`git add -A`.quiet();
Bun.$`git commit -m ${message}`.quiet();

console.log("Sync complete!");
