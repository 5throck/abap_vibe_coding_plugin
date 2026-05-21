# GEMINI.md

Gemini configuration for the **abap-harness-engineering** plugin — an AI Harness Engineering framework for SAP ABAP development.

> **Doc intent:** This file contains Gemini-specific overrides only. Shared project context (architecture, agents, skills, workflows) lives in [docs/context.md](docs/context.md). Agent roles live in [AGENTS.md](AGENTS.md) (see parent project).

Parent project: https://github.com/5throck/abap_vibe_coding

---

## Session Start

**When developing this plugin, read `docs/context.md` first** — it contains the full architecture map, agent/skill inventory, workflow pipeline, and gotchas.

---

## Setup

1. **Install the vsp binary** (in the consumer project root)
   ```bash
   bash scripts/install-vsp.sh
   ```

2. **Configure SAP credentials**
   - Credentials are passed securely via the MCP server settings.
   - For standalone development, copy the sample:
     ```bash
     cp .mcp.json.sample .mcp.json
     ```
     Edit `.mcp.json` and fill in your SAP system URL, username, and password. This file is gitignored.

3. **Enable the MCP server** in `.gemini/settings.local.json` (in the consumer project root):
   ```json
   { "enableAllProjectMcpServers": true }
   ```

## Gemini-Specific Workflows

### 1. Planning Mode & Architecture Changes
For complex tasks or architectural modifications, Gemini must enter **Planning Mode**:
1. Create a detailed technical design using the **Implementation Plan** artifact.
2. Obtain explicit user approval before modifying code.
3. Track tasks using `task.md` and document changes in `walkthrough.md`.
4. Ensure that after changes are verified, the outcomes are summarized in the project's `memory/YYYY-MM-DD.md` log.

### 2. Executing Custom Commands
Unlike Claude Code, Gemini does not natively register local custom slash commands from `commands/` or `.claude/commands/`. Instead:
- Automation workflows like `/sync`, `/post-write`, `/memlog` are simulated or executed directly as project scripts (e.g. executing `bash scripts/dev-sync.sh "feat: description"` or running the powershell equivalents via terminal tools).
- System-provided slash commands (like `/goal`, `/schedule`, `/browser`, `/grill-me`) can be recommended to the user.

### 3. Coexistence, Precedence & Migration of .claude
This project contains a `.claude/` directory. To prevent configuration drift and avoid issues when transitioning away from Claude Code, Gemini follows these rules:
- **Absolute Precedence**: `.gemini/` always takes absolute precedence over `.claude/`. If `.gemini/` exists, `.claude/` is ignored by Gemini to prevent duplicate or conflicting configurations.
- **Fallback (Coexistence Phase)**: If a project lacks a `.gemini/` directory but contains `.claude/`, Gemini will temporarily read and respect `.claude/settings.json`, `.claude/settings.local.json`, and `.claude/commands/` as the fallback source of truth.
- **Graceful Migration**: If the project transitions fully away from Claude Code, or if Gemini needs to write new project-level settings/commands, Gemini should proactively offer to migrate the `.claude/` configuration to `.gemini/` (copying and adapting files) rather than leaving legacy files orphaned.
- **Command Emulation**: Custom slash commands defined as markdown files in `commands/` or `.claude/commands/` must be emulated by Gemini. Read the `.md` file to understand the underlying script execution and run those commands directly via terminal tools.
- **Gemini Integration Rule**: Gemini can dynamically instantiate roles defined in `AGENTS.md` (in the parent project) using the `define_subagent` and `invoke_subagent` tools.

---

## Consumer Project Integration

When this plugin is installed in a consumer project:
- **Manual install**: The configuration is read from the **consumer project's root `.mcp.json` or `.gemini/settings.json`**, not the plugin directory.
- **Hooks**: Automated PostToolUse hooks are not supported in Gemini. Gemini must run the quality gate (`/post-write` emulation) manually by executing `scripts/sync-md.sh` or `scripts/sync-md.ps1` from the workspace root.

---

## Development Commands

Gemini should execute these commands via `run_command` (or its powershell equivalents on Windows):

```bash
# Sync session to Git (audit → memory → commit → PR)
bash scripts/dev-sync.sh "feat: description"

# Documentation audit only
bash scripts/vsp-audit.sh

# Publish plugin to marketplace
bash scripts/vsp-publish.sh

# Create new task file
bash scripts/vsp-task.sh "task-description"
```

---

## Component Overview

| Type | Count | Location |
|------|------:|---------|
| Commands | 7 | `commands/` |
| Agents | 19 | `agents/` |
| Skills | 8 | `skills/*/SKILL.md` |

---

## Memory & Git

- Session logs: `memory/YYYY-MM-DD.md` — append after each meaningful session
- Memory index: `memory/MEMORY.md` — updated automatically by `scripts/dev-sync.sh`
- All git artifacts (commit messages, PR titles, branch names) must be in **English**
- Branch naming: `pr/<YYYYMMDD-HHmmss>-<slug>` (auto-created by dev-sync on main)

---

*Last updated: 2026-05-21*
