## Why

This PR applies the comprehensive 3-phase project improvements from the parent `abap_vibe_coding` project to the plugin, ensuring architectural alignment while respecting the plugin's unique design constraints (marketplace distribution, plugin lifecycle, `userConfig` substitution).

## What Changed

### Phase 1: Foundation Layer

**Bun Runtime Migration** (commit `7469847`)
- Migrated all core scripts from dual `.sh`/`.ps1` to single-source `.ts` files
- Added `scripts/package.json` with npm script shortcuts
- Added `scripts/tsconfig.json` configured for Bun's TypeScript
- Added `scripts/README.md` with usage documentation
- Updated `.gitignore` to exclude `bun.lockb`

**New TypeScript Scripts (9 files)**
| Script | Purpose |
|--------|---------|
| `dev-sync.ts` | Full pipeline: memlog → sync-md → changelog → audit → commit → PR |
| `audit.ts` | Documentation integrity check |
| `vsp-sync.ts` | Memory sync and git commit |
| `vsp-task.ts` | Create task files |
| `sync-md.ts` | Update memory index |
| `git-sync.ts` | Git commit and push |
| `gen-pr-body.ts` | Generate PR body from commit + diff |
| `post-write.ts` | QA chain reminder for Desktop App |
| `vsp-audit.ts` | Wrapper for audit.ts |

**Benefits:**
- Single source of truth (no more dual `.sh`/`.ps1` maintenance)
- Cross-platform by design (Windows, macOS, Linux)
- Modern async/await and native JSON handling
- ~50ms startup (negligible vs human time)
- Legacy `.sh`/`.ps1` scripts retained for backward compatibility

### Phase 2: Orchestration Layer

**Agent Coordination** (commit `b23a282`)
- Added `skills/SKILLS.md` - auto-generated skill index
- Added `templates/dispatch-parallel.md` - parallel dispatch template
- Added `templates/dispatch-serial.md` - serial dispatch template
- Added `agents/handoff-spec.md` - JSON-based handoff format

### Phase 2.5: MCP Configuration

**MCP Single Source of Truth** (commit `abcf7e0`)
- Added `.mcp.json` as fallback for manual testing
- Updated `CHANGELOG.md` with all improvements

**Note:** For marketplace installs, `plugin.json` with `userConfig` substitution remains the primary MCP configuration source. `.mcp.json` serves as a standalone fallback for direct development use outside the plugin lifecycle.

## Architectural Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Script Runtime** | Bun (not Deno) | ~50ms vs ~200ms startup; native TypeScript |
| **MCP Config** | `.mcp.json` + `plugin.json` | `plugin.json` is primary for marketplace; `.mcp.json` for manual testing |
| **Hooks** | Kept `hooks/hooks.json` | Plugin uses Claude Code hooks, not git hooks |
| **Legacy Scripts** | Retained `.sh`/`.ps1` | Backward compatibility during transition |
| **Documentation** | References parent | Plugin delegates `docs/context.md`, `AGENTS.md` to parent project |

## Test Plan

- [ ] `bun scripts/audit.ts` passes
- [ ] `bun run dev-sync "test: verify Bun migration"` executes successfully
- [ ] Legacy `.sh`/`.ps1` scripts still work
- [ ] All 9 new TypeScript scripts execute without errors
- [ ] `skills/SKILLS.md` index is accurate
- [ ] Agent dispatch templates are valid Markdown
- [ ] CHANGELOG.md updated under `[Unreleased]`

## Verification Steps

```bash
# Install Bun (one-time)
powershell -c "irm bun.sh/install.ps1"

# Test TypeScript scripts
bun run audit
bun run dev-sync "test: verify Bun migration"
bun run vsp-task "test-task"

# Verify legacy scripts still work
bash scripts/vsp-sync.sh "test: legacy compatibility"
```

## Security Checklist

- [ ] No secrets, credentials, or API keys committed
- [ ] No `.env` files staged (use `.env.sample` for templates)
- [ ] Dependencies unchanged or reviewed for new CVEs
- [ ] `.mcp.json` is gitignored (contains SAP credentials as example)

## Notes

**Breaking Changes:** None

**Migration Guide:**
1. Install Bun: `powershell -c "irm bun.sh/install.ps1"` (Windows) or `curl -fsSL https://bun.sh/install | bash` (Unix/macOS)
2. Use `bun run <script>` or `bun scripts/<script>.ts` for new scripts
3. Legacy `.sh`/`.ps1` scripts continue to work during transition period

**Reviewer Guidance:**
- Focus on cross-platform compatibility of TypeScript scripts
- Verify that `.mcp.json` role as fallback (not primary) is documented
- Confirm that agent coordination templates match parent project

---

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
Co-Authored-By: Gemini <noreply@google.com>
