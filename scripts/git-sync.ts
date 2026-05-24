#!/usr/bin/env bun
// git-sync.ts — Commit and push all changes to the current branch
// Usage: bun scripts/git-sync.ts "message"

const args = process.argv.slice(2);
const message = args[0] ?? "chore: auto-sync documentation and configuration";

console.log("--- Git Sync ---");

const branchResult = Bun.$`git rev-parse --abbrev-ref HEAD`.quiet().text().trim();
const branch = branchResult ?? "unknown";

console.log(`Branch: ${branch}`);

// Stage all changes
Bun.$`git add .`.quiet();

// Check if there are staged changes
const diffResult = Bun.$`git diff --cached --quiet`.quiet();
const hasChanges = diffResult.exitCode !== 0;

if (hasChanges) {
  Bun.$`git commit -m ${message}`.quiet();
  Bun.$`git push origin ${branch}`.quiet();
  console.log("Successfully synced to Git.");
} else {
  console.log("No changes to sync.");
}
