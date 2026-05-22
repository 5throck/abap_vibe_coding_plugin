# CLAUDE.md

Claude Code configuration for the **abap-harness-engineering** plugin — an AI Harness Engineering framework for SAP ABAP development.

> **Doc intent:** This file is Claude Code-specific. Shared project context (architecture, agents, skills, workflows) lives in [../abap_vibe_coding/docs/context.md](../abap_vibe_coding/docs/context.md). Agent roles live in [../abap_vibe_coding/AGENTS.md](../abap_vibe_coding/AGENTS.md) (see parent project).

Parent project: https://github.com/5throck/abap_vibe_coding

---

## Session Start

At the start of every Claude Code session, run this checklist:

```
0. git config core.hooksPath .githooks         # activate hooks (run once per clone)
1. Read ../../CONSTITUTION.md                  # workspace design standard
2. Read ../abap_vibe_coding/docs/context.md    # full architecture map, ABAP rules, workflow
3. Read AGENTS.md                              # plugin agent roster
4. Read ../abap_vibe_coding/memory/MEMORY.md  # recent session history (skip if absent)
5. Load skills/abap-dev/SKILL.md              # SAP dev workflows
6. Load skills/post-write-chain/SKILL.md      # mandatory QA chain after any write
```

---

## Setup

1. **Install the vsp binary** (in the consumer project root)
   ```bash
   bash scripts/install-vsp.sh
   ```

2. **Configure SAP credentials**

   **Marketplace install (recommended)**: Claude Code prompts for SAP credentials when you enable the plugin (`/plugin enable abap-harness-engineering`). Credentials are passed securely via `userConfig` — no file needed.

   **Manual / standalone install**: Copy the sample and edit it:
   ```bash
   cp .mcp.json.sample .mcp.json
   ```
   Edit `.mcp.json` and fill in your SAP system URL, username, and password. This file is gitignored — never commit it.

3. **Enable the MCP server** in `.claude/settings.local.json` (in the consumer project root):
   ```json
   { "enableAllProjectMcpServers": true }
   ```
   > **Note — two MCP config files**: `plugin.json` contains `mcpServers` with `userConfig` substitution for marketplace installs. `.mcp.json` is a standalone fallback for direct development use (no userConfig, reads SAP credentials from environment variables or the file itself). The plugin runtime uses `plugin.json`; `.mcp.json` is only needed for manual testing outside the plugin lifecycle.

## Consumer Project Integration

When this plugin is installed in a consumer project:
- **Marketplace install**: SAP credentials are supplied via the `userConfig` prompts at enable time and injected into the `abap` MCP server automatically. No `.mcp.json` is needed.
- **Manual install**: The configuration is read from the **consumer project's root `.mcp.json`**, not the plugin directory. Make sure `.mcp.json` is placed in your target project.
- **Hooks**: The plugin's `hooks/hooks.json` will automatically fire in the consumer project's CLI sessions. (CLI sessions only; Desktop App users must run `/post-write` manually.) The underlying hook scripts execute with a cross-platform fallback sequence (`bash` → `pwsh` → `powershell`) to ensure seamless execution on Windows environments. (Note: These automatic hooks rely on the `CLAUDE_PLUGIN_ROOT` environment variable being populated by the plugin runtime. For direct manual testing or execution outside the hook lifecycle, execute `scripts/sync-md.sh` or `scripts/sync-md.ps1` directly from your workspace root.)

---

## Development Commands

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
| Hooks | 1 | `hooks/hooks.json` |

**Commands**: celebrate, memlog, new-task, post-write, sync, transport, triage

**Agents**: architect, co-analyst, code-writer, dba, devops-admin, fi-analyst, fiori-developer, form-expert, gui-scripter, interface-expert, le-analyst, mm-analyst, pm, pp-analyst, read-only-analyst, sap-investigator, schema-inspector, sd-analyst, test-runner

**Skills**: abap-dev, post-write-chain, sap-co, sap-fi, sap-le, sap-mm, sap-pp, sap-sd

---

## Key Workflows

```
/triage
  → Phase 1 parallel agents (sap-investigator, read-only-analyst, schema-inspector)
  → architect (technical design)
  → code-writer (implementation)
  → /post-write (quality gate: SyntaxCheck → RunUnitTests → RunATCCheck)
  → /transport (create/release CTS transport)
  → /sync (commit and push)
```

---

## Important: Desktop App Hook Limitation

**PostToolUse hooks do NOT fire in Claude Code Desktop App.**

After any `WriteSource` or `EditSource` call in the Desktop App, run the quality gate manually:

```
/post-write
```

This runs SyntaxCheck → RunUnitTests → RunATCCheck. Skipping it risks committing broken code.

In the CLI, the hook fires automatically via `hooks/hooks.json`.

---

## Memory & Git

- Session logs: `memory/YYYY-MM-DD.md` — append after each meaningful session
- Memory index: `memory/MEMORY.md` — updated automatically by `/sync`
- All git artifacts (commit messages, PR titles, branch names) must be in **English**
- Branch naming: `pr/<YYYYMMDD-HHmmss>-<slug>` (auto-created by dev-sync on main)

---

### Optimal Interaction Guidelines
- **XML Tagging**: Utilize XML tags like `<thought>`, `<plan>`, and `<execution>` to structure complex reasoning and plans before generating final responses.
- **Tone**: Maintain an objective, highly analytical tone. Focus on systematic execution.

---

*Last Updated: 2026-05-23*
