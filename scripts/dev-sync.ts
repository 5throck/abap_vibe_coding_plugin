#!/usr/bin/env bun
// dev-sync.ts — Full pipeline: memlog → sync-md → changelog → audit → commit → PR
// Usage: bun scripts/dev-sync.ts "feat: description"

const args = process.argv.slice(2);
const msg = args[0] ?? "chore: update";

const now = new Date();
const date = now.toISOString().split('T')[0];

// ── 1. Write daily session log ─────────────────────────────────────────────────
await Bun.mkdir("memory", { recursive: true });

const gitResult = Bun.$`git status --short`.quiet().text() ?? "";
const fileChanges = gitResult
  .trim()
  .split('\n')
  .filter(line => line)
  .map(line => line.substring(3))
  .join(", ");

const memoryFile = `memory/${date}.md`;
const separator = (await Bun.file(memoryFile).exists()) ? "\n---\n\n" : "";

const logEntry = `${separator}## ${msg}
- **Files**: ${fileChanges || "none"}
- **Purpose**:
- **Decisions**:
- **Issues**: None
`;

await Bun.write(memoryFile, logEntry, { createPath: true });

// Append to existing content if file exists
if (separator) {
  const existing = await Bun.file(memoryFile).text();
  await Bun.write(memoryFile, existing + logEntry);
}

// ── 2. Update MEMORY.md index ─────────────────────────────────────────────────
const scriptDir = import.meta.dir;
await Bun.$`bun ${scriptDir}/sync-md.ts ${date} ${msg}`.quiet();

// ── 3. Auto-add to CHANGELOG.md [Unreleased] ───────────────────────────────────
const changelogFile = "CHANGELOG.md";
if (await Bun.file(changelogFile).exists()) {
  const changelog = await Bun.file(changelogFile).text();

  // Check if [Unreleased] section has no entries
  const unreleasedMatch = changelog.match(/## \[Unreleased\](.*?)(?=## |\$)/s);
  if (unreleasedMatch) {
    const section = unreleasedMatch[1];
    const hasEntries = /^[\s]*[-*]|^###/m.test(section);

    if (!hasEntries) {
      // Add entry after [Unreleased] header
      const updated = changelog.replace(
        /(## \[Unreleased\])/,
        `$1\n\n- ${msg}`
      );
      await Bun.write(changelogFile, updated);
      console.log(`📝 Auto-added changelog entry: ${msg}`);
    }
  }
}

// ── 4. Audit gate ──────────────────────────────────────────────────────────────
const auditResult = Bun.$`bun ${scriptDir}/audit.ts`.quiet();
if (auditResult.exitCode !== 0) {
  console.error("Audit failed. Aborting sync.");
  process.exit(1);
}

// ── 5. Branch → commit → push → PR ────────────────────────────────────────────
const branchResult = Bun.$`git rev-parse --abbrev-ref HEAD`.quiet().text().trim();
const currentBranch = branchResult || "main";

let targetBranch = currentBranch;

if (currentBranch === "main" || currentBranch === "master") {
  const timestamp = now.toISOString().replace(/[-:]/g, '').slice(0, 15);
  const slug = msg.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
  targetBranch = `pr/${timestamp}-${slug}`;

  Bun.$`git checkout -b ${targetBranch}`.quiet();
  console.log(`Created new branch: ${targetBranch}`);
} else {
  console.log(`ℹ️  Already on branch '${currentBranch}' — committing here without creating a new branch.`);
}

// Stage and commit
Bun.$`git add -A`.quiet();

// NOTE: This is a template script. Update the commit message or AI Co-Author below as needed for your specific project.
const commitMsg = `${msg}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Co-Authored-By: Gemini <noreply@google.com>
`;
Bun.$`git commit -m ${commitMsg}`.quiet();

Bun.$`git push -u origin ${targetBranch}`.quiet();

// ── Generate PR body and open PR ─────────────────────────────────────────────
let prBody = "";

const genPrBodyScript = `${scriptDir}/gen-pr-body.ts`;
if (await Bun.file(genPrBodyScript).exists()) {
  const prResult = Bun.$`bun ${genPrBodyScript} ${msg}`.quiet().text();
  prBody = prResult?.trim() ?? "";
}

if (prBody) {
  Bun.$`gh pr create --title ${msg} --body ${prBody}`.quiet();
} else if (await Bun.file(".github/pull_request_template.md").exists()) {
  Bun.$`gh pr create --title ${msg} --body-file .github/pull_request_template.md`.quiet();
} else {
  Bun.$`gh pr create --fill`.quiet();
}

console.log("Dev sync complete!");
