Run a comprehensive parallel project review using all available specialist agents.

Arguments: $ARGUMENTS (optional focus area or scope description)

Read and follow `skills/project-review/SKILL.md` exactly. The skill contains the full PM-led solo audit procedure:

1. **Phase 1 — Structure Scan**: check for missing scripts, orphaned agent/skill listings, stale files
2. **Phase 2 — Content Integrity**: validate agent/skill frontmatter, doc cross-references, CHANGELOG state
3. **Phase 2-A — Code Quality Scan** (optional, requires `mcp__base-map__review_code`): review `scripts/*.ts` for security/logic/style findings
4. **Phase 3 — Platform Parity**: verify Claude/Gemini/Codex config and command/skill parity
5. **Phase 4 — Findings Report**: classify findings P1–P5 by priority
6. **Phase 5 — Archive Report**: write findings to `memory/${DATE}-project-review.md`

## Platform Notes

- On Claude Code: use native `Agent` tool for parallel dispatch
- On Antigravity/Gemini CLI: delegates to `/meeting "project review" --agents [list] --rounds 2 --dialogue`
