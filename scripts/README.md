# ABAP Harness Engineering Plugin - Bun Scripts

Cross-platform TypeScript scripts powered by [Bun](https://bun.sh).

## Prerequisites

Install Bun (one-time setup):

```bash
# Windows
powershell -c "irm bun.sh/install.ps1"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

## Available Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `dev-sync.ts` | Full pipeline: memlog → sync-md → changelog → audit → commit → PR | `bun run dev-sync "feat: description"` |
| `audit.ts` | Documentation integrity check | `bun run audit` |
| `vsp-sync.ts` | Sync memory logs, update index, commit | `bun run vsp-sync "type: summary"` |
| `vsp-task.ts` | Create new task file in scratch/tasks/ | `bun run vsp-task "task-name"` |
| `vsp-audit.ts` | Wrapper for audit.ts | `bun run vsp-audit` |
| `sync-md.ts` | Update memory/MEMORY.md index | `bun run sync-md "YYYY-MM-DD" "summary"` |
| `git-sync.ts` | Commit and push changes | `bun run git-sync "message"` |
| `gen-pr-body.ts` | Generate PR body from commit + diff | `bun run gen-pr-body "commit message"` |
| `post-write.ts` | QA chain reminder for Desktop App | `bun run post-write` |

## Direct Execution

Scripts can also be executed directly:

```bash
bun scripts/dev-sync.ts "feat: add feature"
bun scripts/audit.ts
```

## Legacy Wrappers

The original `.sh` and `.ps1` scripts are retained for backward compatibility.

## Cross-Platform Compatibility

All `.ts` scripts work on Windows, macOS, and Linux without modification.

Bun provides:
- Single-source TypeScript (no build step)
- Native async/await
- Built-in file system operations (`Bun.file`, `Bun.write`)
- Cross-platform shell operations (`Bun.$`)

*Last Updated: 2026-05-24*
