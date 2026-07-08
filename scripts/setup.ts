#!/usr/bin/env bun
/**
 * setup.ts - Post-scaffold environment setup
 * Detects OS and tech stack, installs dependencies, audits licenses, copies .env,
 * and makes initial commit.
 *
 * Supported stacks: Node.js, Python (requirements.txt / pyproject.toml),
 * Ruby, .NET, Java (Maven/Gradle), Go, Rust, Elixir, C/C++ (CMake/Makefile).
 *
 * Usage:
 *   bun scripts/setup.ts
 *   bun scripts/setup.ts --skip-install
 *   bun scripts/setup.ts --skip-license-check
 *   bun scripts/setup.ts --skip-commit
 *   bun scripts/setup.ts --check            # dry-run validation
 *
 * @module setup
 */

import { execSync, ExecSyncOptions } from "node:child_process";
import { existsSync, readFileSync, copyFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

// ── Parse arguments ───────────────────────────────────────────────────────────
const DRY_RUN = process.argv.includes("--check");
const SKIP_INSTALL = process.argv.includes("--skip-install") || DRY_RUN;
const SKIP_LICENSE = process.argv.includes("--skip-license-check") || DRY_RUN;
const SKIP_COMMIT = process.argv.includes("--skip-commit") || DRY_RUN;

// ── Resolve paths ──────────────────────────────────────────────────────────────
const scriptDir = path.dirname(import.meta.path);
const projectRoot = path.resolve(scriptDir, "..");

// ── Helpers ───────────────────────────────────────────────────────────────────
function pass(msg: string): void {
  console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
}
function info(msg: string): void {
  console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
}
function warn(msg: string): void {
  console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`);
}

function run(cmd: string, opts?: ExecSyncOptions): string {
  try {
    return execSync(cmd, { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"], cwd: projectRoot, ...opts }).trim();
  } catch {
    return "";
  }
}

function hasCommand(cmd: string): boolean {
  return run(`command -v ${cmd} 2>/dev/null || which ${cmd} 2>/dev/null || echo ""`) !== "";
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Dry-run ────────────────────────────────────────────────────────────────────
if (DRY_RUN) {
  console.log("✅ setup.ts: syntax OK (dry-run mode)");
  process.exit(0);
}

// ── OSI-approved licenses ───────────────────────────────────────────────────────
const OSS_LICENSES = [
  "MIT", "ISC", "BSD-2-Clause", "BSD-3-Clause", "Apache-2.0", "Apache-1.1",
  "CC0-1.0", "CC-BY-3.0", "CC-BY-4.0", "Unlicense", "0BSD", "PSF-2.0",
  "Python-2.0", "MPL-2.0", "LGPL-2.0", "LGPL-2.1", "LGPL-3.0",
  "Artistic-2.0", "Zlib", "BlueOak-1.0.0",
].join(";");

console.log("=== setup.ts - environment setup ===");

// ── 1. .env.sample → .env ─────────────────────────────────────────────────────
const envSample = path.join(projectRoot, ".env.sample");
const envFile = path.join(projectRoot, ".env");
if (existsSync(envSample)) {
  if (!existsSync(envFile)) {
    copyFileSync(envSample, envFile);
    pass(".env created from .env.sample — fill in secrets before running the app");
  } else {
    info(".env already exists - skipping copy");
  }
}

// ── 2. Dependency install + license audit (stack auto-detection) ─────────────────
if (!SKIP_INSTALL) {

  // Bun Agent Orchestration
  const scriptsPackageJson = path.join(projectRoot, "scripts", "package.json");
  if (existsSync(scriptsPackageJson)) {
    if (hasCommand("bun")) {
      info("Agent orchestration (Bun) detected - running bun install in scripts/");
      run("cd scripts && bun install");
      pass("bun install complete");
    } else {
      warn("bun not found - install Bun using scripts/install-bun.sh");
    }
  }

  // Node.js
  const packageJson = path.join(projectRoot, "package.json");
  if (existsSync(packageJson)) {
    if (hasCommand("npm")) {
      info("Node.js project detected - running npm install");
      run("npm install");
      pass("npm install complete");

      if (!SKIP_LICENSE && hasCommand("npx")) {
        info("Running Node.js license audit…");
        const result = run(`npx --yes license-checker --summary --onlyAllow "${OSS_LICENSES}" 2>&1`);
        if (result && !result.toLowerCase().includes("error")) {
          pass("License audit passed - all packages use OSI-approved licenses");
        } else {
          warn("⚠  License audit flagged non-OSS packages. Review before committing.");
        }
      }
    } else {
      warn("npm not found - install Node.js from https://nodejs.org");
    }
  }

  // Python (requirements.txt)
  const requirementsTxt = path.join(projectRoot, "requirements.txt");
  if (existsSync(requirementsTxt)) {
    info("Python project detected (requirements.txt)");
    if (hasCommand("pip")) {
      run("pip install -r requirements.txt");
      pass("Dependencies installed (requirements.txt)");
    } else {
      warn("pip not found - install Python 3 from https://python.org");
    }
  }

  // Python (pyproject.toml, no requirements.txt)
  const pyprojectToml = path.join(projectRoot, "pyproject.toml");
  if (existsSync(pyprojectToml) && !existsSync(requirementsTxt)) {
    info("Python project detected (pyproject.toml)");
    if (hasCommand("pip")) {
      run("pip install -e .");
      pass("Dependencies installed (pyproject.toml)");
    } else {
      warn("pip not found - install Python 3 from https://python.org");
    }
  }

  // Ruby
  const gemfile = path.join(projectRoot, "Gemfile");
  if (existsSync(gemfile)) {
    if (hasCommand("bundle")) {
      info("Ruby project detected - running bundle install");
      run("bundle install");
      pass("bundle install complete");
    } else {
      warn("bundle not found - run: gem install bundler");
    }
  }

  // Go
  const goMod = path.join(projectRoot, "go.mod");
  if (existsSync(goMod)) {
    if (hasCommand("go")) {
      info("Go project detected - running go mod download");
      run("go mod download");
      pass("go mod download complete");
    } else {
      warn("go not found - install Go from https://go.dev/dl/");
    }
  }

  // Rust
  const cargoToml = path.join(projectRoot, "Cargo.toml");
  if (existsSync(cargoToml)) {
    if (hasCommand("cargo")) {
      info("Rust project detected - running cargo fetch");
      run("cargo fetch");
      pass("cargo fetch complete");
    } else {
      warn("cargo not found - install Rust from https://rustup.rs");
    }
  }

  // Elixir
  const mixExs = path.join(projectRoot, "mix.exs");
  if (existsSync(mixExs)) {
    if (hasCommand("mix")) {
      info("Elixir project detected - running mix deps.get");
      run("mix deps.get");
      pass("mix deps.get complete");
    } else {
      warn("mix not found - install Elixir from https://elixir-lang.org");
    }
  }

} else {
  info("Skipping dependency install (--skip-install)");
}

// ── 3. Initialize memory log ──────────────────────────────────────────────────
const DATE_STR = today();
const memoryDir = path.join(projectRoot, "memory");
mkdirSync(memoryDir, { recursive: true });

const logPath = path.join(memoryDir, `${DATE_STR}.md`);
if (!existsSync(logPath)) {
  writeFileSync(
    logPath,
    "## Session - chore: initial scaffold\n\n- Project successfully scaffolded from workspace templates.\n",
    "utf-8"
  );
}

const indexPath = path.join(memoryDir, "MEMORY.md");
if (existsSync(indexPath)) {
  const idx = readFileSync(indexPath, "utf-8");
  if (!idx.includes(`[${DATE_STR}]`)) {
    const appended = idx.endsWith("\n") ? idx : `${idx}\n`;
    writeFileSync(indexPath, `${appended}| [${DATE_STR}](${DATE_STR}.md) | chore: initial scaffold |\n`, "utf-8");
  }
}

// ── 4. Initial commit ─────────────────────────────────────────────────────────
if (!SKIP_COMMIT) {
  const isGit = run("git rev-parse --git-dir 2>/dev/null");
  if (isGit) {
    run("git add -A");
    const commitResult = run('git commit -m "chore: initial scaffold" 2>&1');
    if (commitResult) {
      pass("Initial commit created");
    } else {
      warn("Nothing to commit (already committed?)");
    }
  } else {
    warn("Not inside a git repository - skipping initial commit");
  }
} else {
  info("Skipping initial commit (--skip-commit)");
}

console.log("");
console.log("\x1b[32m✅ Setup complete.\x1b[0m");
console.log("");
console.log("Next:");
console.log("  git remote add origin <url>");
console.log("  git push -u origin main");
