# Changelog

All notable changes to **abap-harness-engineering** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changed
- Add ## Environment Setup section and register Session Start Skills in docs/context.md

### Changed
- Add standard slash commands, smart pre-commit hook (memory/ exclusion), and Coding Guidelines section to docs/context.md

### Fixed (2026-05-22 Skill Command Wrappers)
- `.claude/commands/abap-dev.md`: New wrapper — registers `abap-dev` skill for Skill tool invocation
- `.claude/commands/sap-sd/mm/fi/co/le/pp.md`: Six new wrappers — all SAP module skills now invocable via `Skill("sap-*")`
- `.claude/commands/post-write.md`: Thin wrapper delegating to `skills/post-write-chain/SKILL.md`

### Changed (2026-05-22)
- `scripts/audit.sh` / `audit.ps1`: New standard audit entry point (replaces vsp-audit as primary)
- `scripts/vsp-audit.sh` / `vsp-audit.ps1`: Now legacy wrappers delegating to audit.sh/ps1
- `scripts/sync-md.sh` / `sync-md.ps1`: Updated to call audit.sh/ps1 directly
- `.claude/settings.json`: Added PostToolUse hook (Write|Edit → sync-md)

### Fixed (2026-05-22)
- `scripts/sync-md.sh` / `sync-md.ps1`: Skip audit hook for temporary/generated MD files (`scratch/`, `memory/`, `docs/superpowers/`) via `CLAUDE_FILE_PATHS` env var check

### Added (2026-05-21 Project Constitution Compliance)
- `scripts/dev-sync.sh` / `dev-sync.ps1`: Project Constitution §3 standard entry-point wrappers delegating to `vsp-sync.*`
- `docs/context.md`: Full project context — Project Overview, Tech Stack, Architecture, Agents, Skills, Dev Workflow, Key Files, Gotchas
- `memory/MEMORY.md`: Memory system bootstrap — log index for session development history
- `.gitignore`: Added `!memory/MEMORY.md` exception so the index is tracked while daily logs remain gitignored

### Changed (2026-05-21 Project Constitution Compliance)
- `commands/sync.md`: Updated script invocation from `vsp-sync.sh` → `dev-sync.sh`
- `CLAUDE.md`: Added Session Start directive, Development Commands section, Memory & Git rules; updated Last Updated to 2026-05-21

### Added (2026-05-21)
- `.githooks/pre-push`: Added Git hook to block direct pushes to `main` branch; enforces PR-based workflow.
- `.github/workflows/auto-merge.yml`: Added GitHub Actions workflow that automatically Squash & Merges a PR when it receives an "Approved" review.
- `skills/sap-sd/SKILL.md`, `sap-mm`, `sap-fi`, `sap-co`, `sap-pp`, `sap-le`: Synced BAPI lifecycle expansions from the core repository.
- `.gitignore`: Added `.claude/settings.local.json` to prevent local configurations from being committed.
- `.githooks/pre-commit`: Added Git hook to enforce `CHANGELOG.md` updates on every commit.

### Changed (2026-05-21)
- `docs/plugin-setup.md`: Standardized environment variables to use `SAP_*` prefix instead of legacy `VSP_*` prefix.
- `docs/plugin-setup.md`: Added instructions for configuring `core.hooksPath` to enforce git hooks.
- `README_ko.md`: Restored and translated the missing packaging exclusions note to match the English `README.md` for 100% parity.

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
- `CHANGELOG.md` (this file)

### Changed
- `plugin.json`: rewritten to full marketplace schema (added `$schema`, `displayName`, `repository`, `homepage`, `mcpServers`, `userConfig`; removed explicit component arrays in favour of auto-discovery)
- `plugin.json`: license identifier updated from `AGPL-3.0` to `AGPL-3.0-only` (current SPDX 3.x standard)
- `hooks/hooks.json`: added missing top-level `"hooks"` wrapper; removed invalid `SessionStart` event (not a supported Claude Code hook); replaced `$CLAUDE_PLUGIN_ROOT` with `${CLAUDE_PLUGIN_ROOT}`
- `CLAUDE.md`: clarified difference between marketplace `userConfig` and standalone `.mcp.json` credential flows
- `docs/plugin-setup.md`: corrected example SAP URL from `http://vhcalnplci:50000` to `https://vhcalnplci:44300` (HTTPS ADT port)
- `scripts/vsp-audit.ps1`: enforced script pairing (removed `sync-md` exemption, activated `$failed = $true`); added Check 5 — MCP prefix consistency (detects `VSP_*` env vars in `.mcp.json`)
- `scripts/vsp-audit.sh`: added Check 5 — MCP prefix consistency (detects `VSP_*` env vars in `.mcp.json`)

### Fixed
- Agent `color` values corrected to allowed set (`blue`, `cyan`, `green`, `yellow`, `magenta`, `red`):
  - `pm`: `gold` → `yellow`
  - `devops-admin`: `orange` → `yellow`
  - `dba`, `read-only-analyst`, `sap-investigator`, `schema-inspector`: `purple` → `magenta`
- `agents/pm.md`: removed non-existent `browser_subagent` tool reference
