#!/usr/bin/env bun
// gen-pr-body.ts — Generate a structured PR body from commit message + diff
// Usage: bun scripts/gen-pr-body.ts "commit message"
// Output: PR body markdown (stdout)

const args = process.argv.slice(2);
const commitMsg = args[0];

if (!commitMsg) {
  console.error("Usage: bun scripts/gen-pr-body.ts \"<commit message>\"");
  process.exit(1);
}

const today = new Date().toISOString().split('T')[0];

// Collect changed files
let files = "";
let diffStat = "";

try {
  files = Bun.$`git diff --name-only HEAD~1 HEAD`.quiet().text().trim() ||
          Bun.$`git diff --cached --name-only`.quiet().text().trim() ||
          Bun.$`git show --name-only --format="" HEAD`.quiet().text().trim() || "";
} catch {
  files = "";
}

try {
  diffStat = Bun.$`git diff --stat HEAD~1 HEAD`.quiet().text().trim() ||
             Bun.$`git diff --cached --stat`.quiet().text().trim() || "";
} catch {
  diffStat = "";
}

const fileList = files
  .split('\n')
  .filter(f => f)
  .slice(0, 30)
  .map(f => `- ${f}`)
  .join('\n');

// Check if claude CLI is available for AI mode
const claudeCheck = Bun.$`command -v claude`.quiet().exitCode === 0;

if (claudeCheck) {
  const prompt = `Generate a GitHub Pull Request body for the following change.
Output ONLY the PR body in markdown — no explanation, no code fences around the whole output.

Commit message : ${commitMsg}
Date           : ${today}

Changed files  :
${files}

Diff summary   :
${diffStat}

Use EXACTLY this structure (keep all section headers, fill placeholders):

## Why
[1-3 sentences: what problem does this solve and why now?]

## What Changed
[concise bullet list of actual changes — be specific, not generic]

## Test Plan
- [ ] \`bun scripts/audit.ts\` passes
- [ ] [add relevant manual or automated test steps]

## Security Checklist
- [ ] No secrets, credentials, or API keys committed
- [ ] No \`.env\` files staged (use \`.env.sample\` for templates)
- [ ] Dependencies unchanged or reviewed for new CVEs

## Notes
[Breaking changes, deployment steps, or reviewer guidance. Write 'None' if not applicable.]

---
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`;

  const result = Bun.$`claude -p ${prompt}`.quiet().text().trim();
  if (result) {
    console.log(result);
    process.exit(0);
  }
}

// Fallback mode: structured template with auto-filled fields
const prBody = `## Why
${commitMsg}

## What Changed
${fileList || "- No files changed"}

## Test Plan
- [ ] \`bun scripts/audit.ts\` passes
- [ ] CHANGELOG.md updated under \`[Unreleased]\`

## Security Checklist
- [ ] No secrets, credentials, or API keys committed
- [ ] No \`.env\` files staged (use \`.env.sample\` for templates)
- [ ] Dependencies unchanged or reviewed for new CVEs

## Notes
None

---
Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`;

console.log(prBody);
