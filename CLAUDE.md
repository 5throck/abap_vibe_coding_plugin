# CLAUDE.md

Claude Code configuration for the **abap-harness-engineering** plugin — an AI Harness Engineering framework for SAP ABAP development.

Parent project: https://github.com/5throck/abap_vibe_coding

---

## Setup

1. **Install the vsp binary** (in the consumer project root)
   ```bash
   bash scripts/install-vsp.sh
   ```

2. **Configure SAP credentials** (in the consumer project root)
   ```bash
   cp .mcp.json.sample .mcp.json
   ```
   Edit `.mcp.json` and fill in your SAP system URL, username, and password. This file is gitignored — never commit it.

3. **Enable the MCP server** in `.claude/settings.local.json` (in the consumer project root):
   ```json
   { "enableAllProjectMcpServers": true }
   ```

## Consumer Project Integration

When this plugin is installed in a consumer project:
- **`.mcp.json` / `.env`**: The configuration is read from the **consumer project's root directory**, not the plugin directory. Make sure `.mcp.json` or `.env` is placed in your target project.
- **Hooks**: The plugin's `hooks/hooks.json` will automatically fire in the consumer project's CLI sessions. (CLI sessions only; Desktop App users must run `/post-write` manually.) The underlying hook scripts execute with a cross-platform fallback sequence (`bash` → `pwsh` → `powershell`) to ensure seamless execution on Windows environments. (Note: These automatic hooks rely on the `CLAUDE_PLUGIN_ROOT` environment variable being populated by the plugin runtime. For direct manual testing or execution outside the hook lifecycle, execute `scripts/sync-md.sh` or `scripts/sync-md.ps1` directly from your workspace root.)

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

*Last updated: 2026-05-19*
