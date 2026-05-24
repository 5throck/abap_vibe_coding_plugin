#!/usr/bin/env bun
// sync-md.ts — Update memory/MEMORY.md index
// Usage: bun scripts/sync-md.ts "YYYY-MM-DD" "summary"

const args = process.argv.slice(2);
const date = args[0] ?? new Date().toISOString().split('T')[0];
const summary = args[1] ?? "update";

const memoryFile = "memory/MEMORY.md";

// Initialize MEMORY.md if it doesn't exist
if (!(await Bun.file(memoryFile).exists())) {
  await Bun.write(memoryFile, "# Memory Index\n\n| Date | Summary |\n|------|----------|\n");
}

const content = await Bun.file(memoryFile).text();

// Only append if this date is not already in the index
if (!content.includes(`[${date}]`)) {
  const newEntry = `| [${date}](${date}.md) | ${summary} |`;
  await Bun.write(memoryFile, content.trimEnd() + "\n" + newEntry + "\n");
  console.log(`Updated memory index: ${date}`);
} else {
  console.log(`Date ${date} already in index, skipping.`);
}
