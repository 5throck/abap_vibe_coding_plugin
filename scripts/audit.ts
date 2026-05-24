#!/usr/bin/env bun
// audit.ts — Documentation integrity check
// Exit code 0 = pass, non-zero = fail

let errors = 0;

const red = (msg: string) => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`);
const green = (msg: string) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
const warn = (msg: string) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);

console.log("=== audit.ts — workspace standards check ===");

// Helper to check file existence
const exists = (path: string) => Bun.file(path).exists();

// 1. CHANGELOG.md must exist
if (await exists("CHANGELOG.md")) {
  green("CHANGELOG.md exists");
} else {
  red("CHANGELOG.md missing");
  errors++;
}

// 2. CONSTITUTION.md must be accessible (workspace root or one level up)
if (await exists("CONSTITUTION.md") || await exists("../CONSTITUTION.md")) {
  green("CONSTITUTION.md accessible");
} else {
  red("CONSTITUTION.md not found (expected at ./ or ../)");
  errors++;
}

// 3. CHANGELOG.md must have [Unreleased] section
if (await exists("CHANGELOG.md")) {
  const changelog = await Bun.file("CHANGELOG.md").text();
  if (changelog.includes("[Unreleased]")) {
    green("CHANGELOG.md has [Unreleased]");
  } else {
    red("CHANGELOG.md missing '[Unreleased]'");
    errors++;
  }
}

// Project-level checks (skip at workspace root where docs/context.md is absent)
if (await exists("docs/context.md")) {
  // 4. docs/context.md must have ## Coding Guidelines
  const context = await Bun.file("docs/context.md").text();
  if (context.includes("## Coding Guidelines")) {
    green("docs/context.md has ## Coding Guidelines");
  } else {
    red("docs/context.md missing '## Coding Guidelines'");
    errors++;
  }

  // 5. AGENTS.md must exist
  if (await exists("AGENTS.md")) {
    green("AGENTS.md exists");
  } else {
    red("AGENTS.md missing (required for agent-first projects)");
    errors++;
  }

  // 6. At least one agent file must exist in agents/
  const agentFiles = [...new Bun.Glob("*.md").scanSync("agents")];
  if (agentFiles.length > 0) {
    green(`agents/ has ${agentFiles.length} agent file(s)`);
  } else {
    red("agents/ is empty or missing — create at least agents/pm.md");
    errors++;
  }

  // 7. .env.sample must exist
  if (await exists(".env.sample")) {
    green(".env.sample exists");
  } else {
    warn(".env.sample not found — add one if this project uses environment variables");
  }

  // 8. scripts/ should have .ts scripts (Bun migration)
  const tsScripts = [...new Bun.Glob("*.ts").scanSync("scripts")];
  if (tsScripts.length > 0) {
    green(`scripts/ has ${tsScripts.length} TypeScript script(s)`);
  } else {
    warn("scripts/ has no TypeScript scripts — consider Bun migration");
  }
} else {
  warn("docs/context.md not found — skipping project-level checks (workspace root)");
}

console.log();

if (errors === 0) {
  console.log("\x1b[32m✅ All checks passed.\x1b[0m");
  process.exit(0);
} else {
  console.log(`\x1b[31m❌ ${errors} check(s) failed. Fix before committing.\x1b[0m`);
  process.exit(1);
}
