---
name: project-review
description: >
  PM-led project health audit — scans workspace structure, documentation integrity,
  agent/skill parity, and platform configuration to produce a prioritized findings report.
owner: pm
version: 1.0.0
last_reviewed: 2026-07-08
metadata:
  type: process
  triggers:
    - project review
    - workspace health
    - audit
    - parity check
    - finding
---

# Project Review

PM-led workspace health audit. Systematically scans the project structure, documentation integrity, agent/skill consistency, and platform configuration alignment.

> **Gemini CLI**: Custom slash commands are not natively registered from `.gemini/commands/`.
> Read this file to understand the review process, then execute the steps directly using available tools.

## Usage

- **Full scan**: `/project-review` — all areas
- **Targeted scan**: `/project-review --area agents` — specific area only
- **Deep scan**: `/project-review --deep` — includes content-level analysis

## Review Process

### Phase 1: Structure Scan

Run the documentation audit via terminal:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/audit.ts"
```

Then verify the expected directory structure exists:

```
agents/           — Agent role definitions (*.md)
skills/           — Skill definitions (*/SKILL.md)
scripts/          — Automation scripts (TypeScript via Bun)
docs/             — Shared documentation
deliverables/    — Requirements traceability matrix + templates
memory/          — Session logs (YYYY-MM-DD.md)
.githooks/        — Git hooks (pre-commit, pre-push, commit-msg)
config/           — Configuration samples
security/         — Security advisories
```

Check for:
- Missing TypeScript scripts in `scripts/` (all utilities should have `.ts` equivalents)
- Agents listed in `AGENTS.md` but missing `.md` files in `agents/`
- Skills listed in `skills/SKILLS.md` but missing `SKILL.md` files
- Stale or orphaned files

### Phase 2: Content Integrity

**Agent files** (`agents/*.md`):
- Every agent file has valid YAML frontmatter (`name`, `model`, `description`)
- Handoff rules reference valid agent names

**Skill files** (`skills/*/SKILL.md`):
- Every skill has valid YAML frontmatter (`name`, `metadata.type`, `triggers`)
- `skills/SKILLS.md` index matches actual `skills/` directory contents

**Documentation** (`docs/`, `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`):
- `docs/context.md` references match actual file locations
- `AGENTS.md` agent count matches files in `agents/`
- No broken internal links

**CHANGELOG.md**:
- `[Unreleased]` section exists and is not empty, OR all entries have been released

### Phase 3: Platform Parity

Verify configuration consistency across all supported platforms:

| Check | Claude Code | Gemini CLI | Codex |
|-------|:-----------:|:----------:|:-----:|
| MCP servers (`abap`, `abap-docs`, `sap-docs`) | `.claude/settings.json` | `.gemini/settings.json` | `.codex/config.toml` |
| SAP_ALLOWED_PACKAGES value matches | ✅ | ✅ | ✅ |
| Skills directory configured | — | `.gemini/settings.json` | `.codex/config.toml` |
| PostToolUse hook defined | `.claude/settings.json` | N/A (manual) | N/A |
| Slash commands available | `.claude/commands/` | `.gemini/commands/` | N/A |

**Critical parity rules:**
- `SAP_ALLOWED_PACKAGES` must be identical across all 3 platform configs
- Every Claude command must have a Gemini counterpart in `.gemini/commands/`

### Phase 4: Findings Report

Classify all findings by priority:

| Priority | Severity | Action |
|----------|----------|--------|
| **P1 — Critical** | Broken build, missing core files, security exposure | Fix immediately |
| **P2 — High** | Missing platform parity, stale agent/skill definitions | Fix within 24h |
| **P3 — Medium** | Documentation drift, broken links, outdated dates | Fix within 1 week |
| **P4 — Low** | Cosmetic issues, inconsistent formatting | Fix opportunistically |
| **P5 — Info** | Observations, improvement suggestions | Track for future |

### Phase 5: Archive Report

Write findings to `memory/YYYY-MM-DD-project-review.md`:
- Review date and scope
- Summary statistics (files scanned, findings by priority)
- Full findings table: `| # | Priority | Area | Finding | File(s) | Suggested Fix |`
- Action items with owners

### Phase 6: Remediation Guidance

Output prioritized remediation plan:
1. P1/P2 findings first with exact fix commands
2. P3+ batched into a single sync commit
3. If >10 findings, recommend second pass after fixes

## Output Format

```
## Project Review Report — YYYY-MM-DD

**Scope**: Full / --area <specific>
**Files scanned**: N

### Summary
| Priority | Count |
|----------|:-----:|
| P1 — Critical | N |
| P2 — High | N |
| P3 — Medium | N |
| P4 — Low | N |
| P5 — Info | N |

### Findings
| # | Priority | Area | Finding | File(s) | Suggested Fix |
|---|----------|------|---------|---------|---------------|

### Next Steps
1. [Immediate] Fix P1: ...
2. [High] Fix P2: ...
3. Batch P3-P5 into: bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/dev-sync.ts" "chore: project review fixes"

Report archived: memory/YYYY-MM-DD-project-review.md
```
