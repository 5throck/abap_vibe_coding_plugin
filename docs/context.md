# context.md

**abap-harness-engineering** — Claude Code plugin that packages the vsp SAP ABAP development harness as an installable plugin.

> **Shared reference for all AI tools** working on this plugin project.
> Plugin behavioral rules and orchestration live in `../AGENTS.md`.
> Per-session skills are auto-discovered from `../skills/` directory.
> Development history lives in `../memory/`.

---

## Project Overview

A Claude Code plugin that bundles the complete vsp/SAP ABAP Harness Engineering framework — agents, skills, commands, and hooks — for one-click installation into any consumer SAP development project via the Claude Code plugin marketplace or manual install.

**Parent project (harness source)**: https://github.com/5throck/abap_vibe_coding

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Plugin Runtime | Claude Code plugin system (`plugin.json`) |
| MCP Server | `vsp` Go binary — connects to SAP via ADT REST API |
| SAP Connection | Configured via `userConfig` (marketplace) or `.mcp.json` (manual) |
| Scripting | Bash (`.sh`) + PowerShell (`.ps1`) pairs for all automation |
| Hook Trigger | `hooks/hooks.json` → `scripts/sync-md.sh` → `vsp-audit.sh/ps1` |

---

## Environment Setup

**Marketplace install (recommended):**
```
/plugin enable abap-harness-engineering
```
Claude Code prompts for SAP credentials at enable time — no `.mcp.json` needed.

**Manual / standalone install:**
```bash
# 1. Install the vsp binary in the consumer project root
bash scripts/install-vsp.sh

# 2. Configure SAP credentials
cp .mcp.json.sample .mcp.json
# Edit .mcp.json — fill in SAP URL, username, password (gitignored)

# 3. Enable MCP server in .claude/settings.local.json
{ "enableAllProjectMcpServers": true }

# 4. Activate git hooks
git config core.hooksPath .githooks
```

Required config keys (`.mcp.json` for standalone):
- `SAP_URL` — SAP system base URL
- `SAP_USER` — SAP username
- `SAP_PASSWORD` — SAP password

---

## Architecture

```
abap_vibe_coding_plugin/
├── plugin.json          # Plugin manifest (mcpServers, userConfig prompts)
├── .mcp.json.sample     # Standalone fallback MCP config (manual install)
├── agents/              # 19 role-based agent definitions
├── commands/            # 7 slash commands (triage, sync, memlog, ...)
├── skills/              # 8 reusable workflow skills (SKILL.md per folder)
├── hooks/hooks.json     # PostToolUse hook — fires vsp-audit on every edit
├── scripts/             # Cross-platform automation (.sh + .ps1 pairs)
│   ├── dev-sync.*       # §3 standard sync entry point
│   ├── vsp-sync.*       # Full sync pipeline (audit → memory → git commit)
│   ├── vsp-audit.*      # Documentation & path integrity audit
│   ├── vsp-task.*       # Task file creation helper
│   └── sync-md.*        # Hook wrapper (PostToolUse trigger)
├── docs/                # Plugin-specific documentation
│   ├── context.md       # This file
│   ├── abap-dev-rules.md
│   ├── testing-guidelines.md
│   └── task-template.md
└── memory/              # Session development logs
    └── MEMORY.md        # Log index
```

---

## Agents

Full behavioral rules in each `agents/*.md` file. Summary:

| Agent | Role |
|-------|------|
| `pm` | Orchestrator — governs 6-phase workflow (Triage → Finalization) |
| `architect` | Technical Execution Lead — pattern selection (A/B/C), execution plan |
| `code-writer` | ABAP implementation — WriteSource / EditSource |
| `test-runner` | QA — SyntaxCheck → RunUnitTests → RunATCCheck |
| `dba` | Database / CDS / table design |
| `devops-admin` | Transports, system config, abapGit |
| `sap-investigator` | Cross-system read-only investigation |
| `schema-inspector` | Table / structure read-only analysis |
| `read-only-analyst` | ABAP SQL queries and reporting |
| `interface-expert` | RFC / BAPI / IDoc integration |
| `fiori-developer` | UI5 / Fiori app development |
| `form-expert` | Smart Forms / Adobe Forms |
| `gui-scripter` | SAP GUI scripting automation |
| `sd/mm/fi/co/pp/le-analyst` | SAP module domain experts (Business Group) |

---

## Skills

Auto-discovered from `skills/` directory. Each skill is `skills/<name>/SKILL.md`.

| Skill | Trigger |
|-------|---------|
| `abap-dev` | Any ABAP development session — MCP tool optimization |
| `post-write-chain` | After any WriteSource / EditSource — mandatory QA chain |
| `sap-sd` | SD module tasks |
| `sap-mm` | MM module tasks |
| `sap-fi` | FI module tasks |
| `sap-co` | CO module tasks |
| `sap-pp` | PP module tasks |
| `sap-le` | LE module tasks |

---

## Development Workflow

```
Edit plugin component (agent/skill/command/hook/script)
  ↓  PostToolUse hook → scripts/sync-md.sh → vsp-audit (automatic in CLI)

/sync "feat: description"
  ↓
  1. vsp-audit.sh       — abort on failure
  2. memory/YYYY-MM-DD.md — auto-create if missing
  3. MEMORY.md index     — update entry
  4. git add -A && git commit
  5. On main → create pr/<date>-<slug> branch → PR opened
```

**Plugin publish pipeline**:
```bash
bash scripts/vsp-publish.sh    # Package + publish to marketplace
```

---

## Key Files

| Path | Purpose |
|------|---------|
| `plugin.json` | Plugin manifest — entry point for Claude Code plugin runtime |
| `.mcp.json.sample` | Template for manual standalone MCP config |
| `hooks/hooks.json` | PostToolUse hook definition |
| `scripts/vsp-audit.sh/ps1` | Documentation integrity audit |
| `scripts/vsp-sync.sh/ps1` | Full sync pipeline |
| `docs/task-template.md` | Task file template for ABAP work tracking |
| `docs/testing-guidelines.md` | ATC/Unit test standards |

---

## Gotchas

- **Two MCP config files**: `plugin.json` uses `userConfig` for marketplace credential injection; `.mcp.json` is standalone fallback for manual testing — never commit `.mcp.json` with real credentials.
- **Hook execution**: Hooks fire only in CLI sessions via `CLAUDE_PLUGIN_ROOT`. For Desktop App or manual testing, run `scripts/sync-md.sh` directly.
- **Consumer project root**: When installed as a plugin, all script paths resolve against the **consumer project root**, not this plugin directory.
- **`vsp.exe` not in this repo**: The binary lives in the consumer project root. Run `bash scripts/install-vsp.sh` in the consumer project to install it.

---

*Last Updated: 2026-05-21*

---

## Session Start Skills
<!-- Skills listed here are loaded at the start of EVERY session by ALL AI tools. -->
<!-- Format: `skills/<name>/SKILL.md` — reason / trigger                          -->
- `skills/abap-dev/SKILL.md` — always load; SAP ABAP development workflows and tool settings
- `skills/post-write-chain/SKILL.md` — always load; mandatory QA chain after any write (SyntaxCheck → RunUnitTests → RunATCCheck)

---

## Coding Guidelines

> These rules apply to every AI tool working in this project.
> Full rationale: [CONSTITUTION.md §8](../../CONSTITUTION.md#8-coding-behavior-guidelines)

### 1. Think Before Coding
- State assumptions explicitly before implementing. If uncertain, ask — don't guess silently.
- **Secrets**: Never hardcode passwords, API tokens, or keys. Always use env vars / `.env.sample`.

### 2. Simplicity First
- Write the minimum code that solves the problem. Nothing speculative.

### 3. Surgical Changes
- Touch only what is necessary. Don't "improve" adjacent code.

### 4. Goal-Driven Execution
- Convert every task into a verifiable goal before starting.

### 5. Response Language
- All **conversational** replies → **Korean (한국어)** by default.
- All code, config, commit messages, PR titles, branch names → **English only**.
