---
name: project-review
status: active
scope: common
description: >
  PM-led workspace health audit that scans project structure, documentation integrity,
  agent/skill parity, and platform configuration alignment to produce a prioritized findings report.
  Use when: running project health checks, auditing workspace consistency, verifying
  platform parity, or producing remediation plans.
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

## Project Review

PM-led workspace health audit. Systematically scans the project structure, documentation integrity, agent/skill consistency, and platform configuration alignment.

### Execution

Run the documentation audit first:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/audit.ts"
```

Then verify the expected directory structure:

```
agents/           — Agent role definitions (*.md)
skills/          — Skill definitions (*/SKILL.md)
scripts/         — Automation scripts (TypeScript via Bun)
docs/            — Shared documentation
deliverables/    — Requirements traceability matrix + templates
memory/          — Session logs (YYYY-MM-DD.md)
.githooks/        — Git hooks (pre-commit, pre-push)
security/         — Security advisories
```

### Review Process

#### Phase 1: Structure Scan

Check for:
- Missing TypeScript scripts in `scripts/` (all utilities should have `.ts` equivalents)
- Agents listed in `AGENTS.md` but missing `.md` files in `agents/`
- Skills listed in `skills/SKILLS.md` but missing `SKILL.md` files
- Stale or orphaned files

#### Phase 2: Content Integrity

**Agent files** (`agents/*.md`):
- Every agent file has valid YAML frontmatter (`name`, `model`, `description`)
- Handoff rules reference valid agent names

**Skill files** (`skills/*/SKILL.md`):
- Every skill has valid YAML frontmatter (`name`, `metadata.type`, `triggers`)
- `skills/SKILLS.md` index matches actual `skills/` directory contents

**Documentation** (`docs/`, `CLAUDE.md`, `GEMINI.md`, `AGENTS.md`):
- `docs/context.md` references match actual file locations
- `AGENTS.md` agent count matches files in `agents/`
- All files have consistent `Last Updated:` dates (not older than 30 days)

**CHANGELOG.md**:
- `[Unreleased]` section exists and is not empty, OR all entries have been released

#### Phase 2-A: Code Quality Scan (Optional — base-map MCP)

> **Availability**: This phase requires the `mcp__base-map__review_code` tool (base-map MCP server).
> If the tool is not available in the current environment, **skip this phase silently** —
> do not report it as a finding.

1. List all `scripts/*.ts` files in the project
2. For each file, invoke `mcp__base-map__review_code` with the file content
3. Parse the review output and classify findings into the existing priority framework:
   - Security vulnerabilities, injection risks → **P1 — Critical**
   - Logic errors, race conditions, incorrect error handling → **P2 — High**
   - Code style, naming conventions, complexity → **P3 — Medium**
   - Suggestions, minor improvements → **P4 — Low**
4. **Deduplicate**: exclude any findings already captured in Phase 1 or Phase 2
5. Add unique findings to the Phase 4 report

**Model selection**: Use `google/gemma-4-e4b` (default). If unavailable, call `mcp__base-map__models`
to discover available models and use the first listed model.

#### Phase 3: Platform Parity

| Check | Claude Code | Gemini CLI | Codex |
|-------|:-----------:|:----------:|:-----:|
| MCP servers | `.claude/settings.json` | `.gemini/settings.json` | `.codex/config.toml` |
| SAP_ALLOWED_PACKAGES | ✅ | ✅ | ✅ |
| Skills directory | — | `.gemini/settings.json` | `.codex/config.toml` |
| Slash commands | `.claude/commands/` | `.gemini/commands/` | N/A (use `skills/`) |
| Hooks | `.claude/settings.json` | N/A (manual) | `.codex/config.toml` |

**Critical parity rules:**
- `SAP_ALLOWED_PACKAGES` must be identical across all 3 platform configs
- Every Claude command must have a Gemini counterpart in `.gemini/commands/`
- Every Claude command must have a corresponding `skills/*/SKILL.md` for Antigravity
- Agent counts and names in `AGENTS.md` must match actual `agents/` files

#### Phase 4: Findings Report

Classify all findings by priority:

| Priority | Severity | Action |
|----------|----------|--------|
| **P1 — Critical** | Broken build, missing core files, security exposure | Fix immediately |
| **P2 — High** | Missing platform parity, stale definitions | Fix within 24h |
| **P3 — Medium** | Documentation drift, broken links, outdated dates | Fix within 1 week |
| **P4 — Low** | Cosmetic issues | Fix opportunistically |
| **P5 — Info** | Observations | Track for future |

#### Phase 5: Archive Report

Write findings to `memory/${DATE}-project-review.md` with review date, scope, summary statistics, and full findings table.

### Output Format

```
## Project Review Report — YYYY-MM-DD

**Scope**: Full / --area <specific>
**Files scanned**: N

### Summary
| Priority | Count |
|----------|:-----:|
| P1 — Critical | N |
| P2 — High | N |
| ...

### Findings
| # | Priority | Area | Finding | File(s) | Suggested Fix |
|---|----------|------|---------|---------|---------------|

### Next Steps
1. [Immediate] Fix P1 finding #1: ...
2. Batch P3-P5 into: /sync "chore: project review fixes"
```
