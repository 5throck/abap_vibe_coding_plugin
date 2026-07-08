# Changelog

All notable changes to **abap-harness-engineering** are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Changed
- **[2026-07-08]**: chore: update memory logs for 3-layer skill architecture PR


### Changed
- **[2026-07-08]**: chore: update memory log


### Added
- **[2026-07-08]**: Cross-platform skills (sync, project-review, meeting) for Claude, Gemini, and Antigravity
- **[2026-07-08]**: `.claude/commands/project-review.md`: 6-phase PM-led workspace audit command
- **[2026-07-08]**: `.gemini/commands/sync.md`, `.gemini/commands/project-review.md`, `.gemini/commands/meeting.md`
- **[2026-07-08]**: `.codex/config.toml` + `.codex/hooks.json`: Codex platform configuration
- **[2026-07-08]**: `skills/project-review/SKILL.md` registration stub
- **[2026-07-08]**: `skills/meeting-facilitation/SKILL.md` registration stub
- **[2026-07-08]**: `agents/handoff-spec_ko.md`: Korean translation of agent handoff spec
- **[2026-07-08]**: `deliverables/` templates (10 files): SRS, Technical Design, Implementation Plan, QA Report, etc.
- **[2026-07-08]**: `docs/co-abap.context.md`: ABAP-specific configuration layer
- **[2026-07-08]**: `scripts/agent-create.ts`, `agent-delete.ts`, `agent-list.ts`, `agent-verify.ts`: Agent CRUD CLI

### Changed
- **[2026-07-08]**: `AGENTS.md`: Expanded to 505 lines with 6-Phase Workflow, Deliverables Pipeline, PM Dispatch Protocol
- **[2026-07-08]**: `CLAUDE.md`: Added CLI vs Desktop App section, 3-Tier Model Mapping, plugin Setup guide
- **[2026-07-08]**: `GEMINI.md`: Added recommended mode, custom commands, coexistence/migration notes
- **[2026-07-08]**: `.claude/settings.json`: Fixed `SAP_ALLOWED_PACKAGES`, added hooks and `enableAllProjectMcpServers`
- **[2026-07-08]**: `.claude/commands/sync.md`: Added Pre-PR Security Gate
- **[2026-07-08]**: Synced 8 agent files from upstream (pm, dba, handoff-spec, read-only-analyst, security-monitor, test-runner)
- **[2026-07-08]**: `scripts/audit.sh` + `audit.ps1`: CONSTITUTION.md check downgraded to WARN for distributable plugins
- **[2026-07-08]**: `scripts/sync-md.ts`, `scripts/audit.ts`, `scripts/setup.ts`, `scripts/vsp-publish.ts`: New TypeScript implementations (Bun runtime, single source of truth)
- **[2026-07-08]**: `scripts/dev-sync.ts`: Updated to call .ts scripts directly; removed sh/ps1 fallback paths
- **[2026-07-08]**: `.githooks/pre-commit`, `.githooks/pre-push`: Migrated from `audit.sh` to `bun scripts/audit.ts`

### Removed
- **[2026-07-08]**: 16 shell script files deleted: `audit.sh/.ps1`, `dev-sync.sh/.ps1`, `git-sync.sh/.ps1`, `setup.sh/.ps1`, `sync-md.sh/.ps1`, `vsp-audit.sh/.ps1`, `vsp-publish.sh/.ps1`, `vsp-task.sh/.ps1`
- **[2026-07-08]**: `hooks/hooks.json`, `.codex/hooks.json`: Removed duplicate PostToolUse hook definitions (consolidated to `.claude/settings.json`)
- **[2026-07-08]**: `scripts/gen-pr-body.sh/.ps1`, `scripts/health-check.sh`, `scripts/sync-mcp.sh`: Removed obsolete scripts

### Changed
- **[2026-07-08]**: **Scripting model**: Migrated from hybrid sh/ps1 + ts to **TypeScript (Bun) as single source of truth**. Only `install-bun.sh/.ps1` and `install-vsp.sh/.ps1` remain as shell bootstrap scripts.
- **[2026-07-08]**: `.claude/settings.json` PostToolUse hook: `bash scripts/sync-md.sh` → `bun scripts/sync-md.ts`
- **[2026-07-08]**: All documentation references updated: CLAUDE.md, GEMINI.md, README.md, README_ko.md, docs/context.md, docs/plugin-setup.md, docs/setup-guide.md, docs/co-abap.context.md, docs/antigravity-setup.md, agents/pm.md, skills/abap-dev/SKILL.md, all commands/*.md
- **[2026-07-08]**: `scripts/README.md`, `scripts/README_ko.md`: Rewritten to reflect TypeScript-only model
- **[2026-07-08]**: `scripts/package.json`: Added npm scripts for `sync-md`, `audit`, `sync`, `setup`, `task`, `publish`

### Fixed
- **[2026-05-25]**: fix: test changelog and memory automation

### Added
- **[2026-05-24]**: `.mcp.json`: Single Source of Truth for MCP configuration (abap, abap-docs, sap-docs)
- **[2026-05-24]**: Skills index (skills/SKILLS.md) with auto-discovery documentation
- **[2026-05-24]**: Agent dispatch templates (templates/dispatch-parallel.md, templates/dispatch-serial.md)
- **[2026-05-24]**: Agent handoff specification (agents/handoff-spec.md)
- **[2026-05-24]**: Desktop App fallback skill (skills/desktop-app-fallback/SKILL.md)
- **[2026-05-24]**: Bun-based TypeScript scripts (9 files) for cross-platform compatibility

### Changed
- **[2026-05-24]**: Documentation organization aligned with parent project improvements
- **[2026-05-24]**: Agent dispatch patterns standardized
- **[2026-05-24]**: README updated with current agent (20) and skill (9) counts

### Technical Details
- **[2026-05-24]**: Applied improvements from abap_vibe_coding parent project
- **[2026-05-24]**: Enhanced agent coordination with standardized templates
- **[2026-05-24]**: Improved error recovery and context passing patterns

### Added
- **[2026-05-23]**: `.githooks/pre-commit`: Add Markdown date auto-bumper and CHANGELOG auto-dating logic. Automatically updates `Last Updated:` date in staged `.md` files upon commit, and injects date into undated `CHANGELOG.md` entries.
- **[2026-05-23]**: `docs/context.md`: Add `security-monitor` (Security group) to Agents table.
- **[2026-05-23]**: `AGENTS.md`: Register `security-monitor` agent formally in the global Agent Roster.

### Changed
- **[2026-05-25]**: Unified **Hybrid Scripting Automation** model with core project. Utility `.ts` scripts (`dev-sync`, `audit`, etc.) removed to rely purely on native `.ps1`/`.sh`, keeping `.ts` specifically for Agent Orchestration (`dispatch`, `verify-skills`).

### Removed
- **[2026-05-23]**: `README.md` / `README_ko.md`: Remove obsolete manual kickoff instruction text.


### Added
- **[2026-05-23]**: GEMINI.md: full Antigravity 2.0 / Gemini CLI configuration with Context Loading, tool safeguards, Planning Mode artifacts, and Subagent orchestration
- **[2026-05-23]**: AGENTS.md: canonical 14-agent index with dispatch protocol and skills table

### Changed
- **[2026-05-23]**: CLAUDE.md: replace minimal session start with standard 6-step checklist

### Removed (2026-05-23 Plugin Intent Alignment)
- **[2026-05-23]**: `AGENTS.md`, `GEMINI.md`, `docs/context.md`, `memory/`: Removed live governance and memory artifacts from the plugin package to align with the lightweight design intent. These configurations now strictly live in the reference parent project `abap_vibe_coding`.
### Fixed (2026-05-23 Audit Script — Relative Link Filter)
- **[2026-05-23]**: `scripts/audit.sh` / `audit.ps1`: Add `../../` relative-path exclusion to markdown link checker — GitHub Security Advisory links (`../../security/advisories/new`) are cross-repo relative URLs, not local file paths, and must be excluded from broken-link validation


### Added (2026-05-23 Project Structure Compliance)
- **[2026-05-23]**: `SECURITY.md`: Security vulnerability reporting policy (CONSTITUTION §1 required file)
- **[2026-05-23]**: `.github/pull_request_template.md`: Standard PR body template (CONSTITUTION §1 required file)
- **[2026-05-23]**: `.gemini/settings.json`: Gemini CLI project settings (CONSTITUTION §1 required file)
- **[2026-05-23]**: `scripts/git-sync.sh` / `git-sync.ps1`: Cross-platform git sync script pair (CONSTITUTION §3 script parity rule)
- **[2026-05-23]**: `.claude/commands/triage.md`: Triage slash command — sync with abap_vibe_coding
- **[2026-05-23]**: `.claude/commands/transport.md`: Transport slash command — sync with abap_vibe_coding
- **[2026-05-23]**: `.claude/commands/celebrate.md`: Celebrate slash command — sync with abap_vibe_coding

### Fixed (2026-05-23 Project Structure Compliance)
- **[2026-05-23]**: `.claude/settings.json`: PostToolUse hook matcher extended to `Write|Edit|mcp__abap__WriteSource|mcp__abap__EditSource` — ABAP MCP write calls now trigger the sync-md audit script (parity with abap_vibe_coding)

### Changed
- **[2026-05-23]**: Add ## Environment Setup section and register Session Start Skills in docs/context.md

### Changed
- **[2026-05-23]**: Add standard slash commands, smart pre-commit hook (memory/ exclusion), and Coding Guidelines section to docs/context.md

### Fixed (2026-05-22 Skill Command Wrappers)
- **[2026-05-23]**: `.claude/commands/abap-dev.md`: New wrapper — registers `abap-dev` skill for Skill tool invocation
- **[2026-05-23]**: `.claude/commands/sap-sd/mm/fi/co/le/pp.md`: Six new wrappers — all SAP module skills now invocable via `Skill("sap-*")`
- **[2026-05-23]**: `.claude/commands/post-write.md`: Thin wrapper delegating to `skills/post-write-chain/SKILL.md`

### Changed (2026-05-22)
- **[2026-05-23]**: `scripts/audit.sh` / `audit.ps1`: New standard audit entry point (replaces vsp-audit as primary)
- **[2026-05-23]**: `scripts/vsp-audit.sh` / `vsp-audit.ps1`: Now legacy wrappers delegating to audit.sh/ps1
- **[2026-05-23]**: `scripts/sync-md.sh` / `sync-md.ps1`: Updated to call audit.sh/ps1 directly
- **[2026-05-23]**: `.claude/settings.json`: Added PostToolUse hook (Write|Edit → sync-md)

### Fixed (2026-05-22)
- **[2026-05-23]**: `scripts/sync-md.sh` / `sync-md.ps1`: Skip audit hook for temporary/generated MD files (`scratch/`, `memory/`, `docs/superpowers/`) via `CLAUDE_FILE_PATHS` env var check

### Added (2026-05-21 Project Constitution Compliance)
- **[2026-05-23]**: `scripts/dev-sync.sh` / `dev-sync.ps1`: Project Constitution §3 standard entry-point wrappers delegating to `vsp-sync.*`
- **[2026-05-23]**: `docs/context.md`: Full project context — Project Overview, Tech Stack, Architecture, Agents, Skills, Dev Workflow, Key Files, Gotchas
- **[2026-05-23]**: `memory/MEMORY.md`: Memory system bootstrap — log index for session development history
- **[2026-05-23]**: `.gitignore`: Added `!memory/MEMORY.md` exception so the index is tracked while daily logs remain gitignored

### Changed (2026-05-21 Project Constitution Compliance)
- **[2026-05-23]**: `commands/sync.md`: Updated script invocation from `vsp-sync.sh` → `dev-sync.sh`
- **[2026-05-23]**: `CLAUDE.md`: Added Session Start directive, Development Commands section, Memory & Git rules; updated Last Updated to 2026-05-21

### Added (2026-05-21)
- **[2026-05-23]**: `.githooks/pre-push`: Added Git hook to block direct pushes to `main` branch; enforces PR-based workflow.
- **[2026-05-23]**: `.github/workflows/auto-merge.yml`: Added GitHub Actions workflow that automatically Squash & Merges a PR when it receives an "Approved" review.
- **[2026-05-23]**: `skills/sap-sd/SKILL.md`, `sap-mm`, `sap-fi`, `sap-co`, `sap-pp`, `sap-le`: Synced BAPI lifecycle expansions from the core repository.
- **[2026-05-23]**: `.gitignore`: Added `.claude/settings.local.json` to prevent local configurations from being committed.
- **[2026-05-23]**: `.githooks/pre-commit`: Added Git hook to enforce `CHANGELOG.md` updates on every commit.

### Changed (2026-05-21)
- **[2026-05-23]**: `docs/plugin-setup.md`: Standardized environment variables to use `SAP_*` prefix instead of legacy `VSP_*` prefix.
- **[2026-05-23]**: `docs/plugin-setup.md`: Added instructions for configuring `core.hooksPath` to enforce git hooks.
- **[2026-05-23]**: `README_ko.md`: Restored and translated the missing packaging exclusions note to match the English `README.md` for 100% parity.

---

## [0.1.0] — 2026-05-19

### Added
- Initial release of the ABAP Harness Engineering plugin
- **19 Agents**: pm, architect, code-writer, dba, devops-admin, fiori-developer, form-expert, gui-scripter, interface-expert, test-runner, read-only-analyst, sap-investigator, schema-inspector, and 6 module analysts (sd, mm, fi, co, pp, le)
- **8 Skills**: abap-dev, post-write-chain, sap-sd, sap-mm, sap-fi, sap-co, sap-pp, sap-le
- **7 Commands**: triage, new-task, sync, transport, post-write, memlog, celebrate
- **MCP integration**: vsp (hyperfocused mode), abap-docs, sap-docs
- **Cross-platform hooks**: PostToolUse sync-md with bash → pwsh → powershell fallback
- **Scripts**: install-vsp, sync-md, vsp-audit, dev-sync, vsp-task (`.sh` + `.ps1` pairs)
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

