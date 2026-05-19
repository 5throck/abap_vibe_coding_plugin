# Changelog

All notable changes to **abap-harness-engineering** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changed
- `plugin.json`: rewritten to full marketplace schema (added `$schema`, `displayName`, `repository`, `homepage`, `mcpServers`, `userConfig`; removed explicit component arrays in favour of auto-discovery)
- `plugin.json`: license identifier updated from `AGPL-3.0` to `AGPL-3.0-only` (current SPDX 3.x standard)
- `hooks/hooks.json`: added missing top-level `"hooks"` wrapper; removed invalid `SessionStart` event (not a supported Claude Code hook); replaced `$CLAUDE_PLUGIN_ROOT` with `${CLAUDE_PLUGIN_ROOT}`
- `CLAUDE.md`: clarified difference between marketplace `userConfig` and standalone `.mcp.json` credential flows
- `docs/plugin-setup.md`: corrected example SAP URL from `http://vhcalnplci:50000` to `https://vhcalnplci:44300` (HTTPS ADT port)

### Fixed
- Agent `color` values corrected to allowed set (`blue`, `cyan`, `green`, `yellow`, `magenta`, `red`):
  - `pm`: `gold` → `yellow`
  - `devops-admin`: `orange` → `yellow`
  - `dba`, `read-only-analyst`, `sap-investigator`, `schema-inspector`: `purple` → `magenta`
- `agents/pm.md`: removed non-existent `browser_subagent` tool reference

### Added
- `CHANGELOG.md` (this file)

---

## [0.1.0] — 2026-05-19

### Added
- Initial release of the ABAP Harness Engineering plugin
- **19 Agents**: pm, architect, code-writer, dba, devops-admin, fiori-developer, form-expert, gui-scripter, interface-expert, test-runner, read-only-analyst, sap-investigator, schema-inspector, and 6 module analysts (sd, mm, fi, co, pp, le)
- **8 Skills**: abap-dev, post-write-chain, sap-sd, sap-mm, sap-fi, sap-co, sap-pp, sap-le
- **7 Commands**: triage, new-task, sync, transport, post-write, memlog, celebrate
- **MCP integration**: vsp (hyperfocused mode), abap-docs, sap-docs
- **Cross-platform hooks**: PostToolUse sync-md with bash → pwsh → powershell fallback
- **Scripts**: install-vsp, sync-md, vsp-audit, vsp-sync, vsp-task (`.sh` + `.ps1` pairs)
- **Docs**: abap-dev-rules, plugin-setup, prd-template, security, task-template, testing-guidelines
