---
name: sync
status: active
scope: common
description: >
  Full sync pipeline that commits the current development session to Git.
  Runs documentation audit, updates memory index, auto-adds CHANGELOG entry,
  guards against sensitive files, creates a PR branch, and opens a GitHub PR.
  Use when: ending a development session, committing changes, or syncing to Git.
owner: pm
version: 1.0.0
last_reviewed: 2026-07-08
metadata:
  type: process
  triggers:
    - sync
    - commit session
    - push changes
    - end of session
---

## Sync Pipeline

Full sync pipeline: memlog → sync-md → changelog → commit → PR.

### Execution

Run the following command via terminal:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/dev-sync.ts" "$ARGUMENTS"
```

`$ARGUMENTS` should be a conventional commit message (e.g. `feat: add ZCL_MY_CLASS`).
If `$ARGUMENTS` is empty, prompt the user for a commit message before running.

### Pipeline Steps

The script performs the following 6-stage pipeline:

1. **Write daily session log** — Appends entry to `memory/YYYY-MM-DD.md` with file list
2. **Update MEMORY.md index** — Calls `scripts/sync-md.ts` to update the central index
3. **Auto-add CHANGELOG entry** — Appends `$ARGUMENTS` under `[Unreleased]` if not already present
4. **Sensitive file guard** — Blocks if untracked or staged `.pem`, `.key`, `.env`, `credentials.json`, etc. detected
5. **Branch / Commit / Push** — Creates PR branch if on main/master, stages all files, commits, pushes
   - `audit.ts` runs automatically via pre-commit hook during `git commit`
6. **Open PR** — Uses `.github/pull_request_template.md` or `gh pr create --fill` to open a PR

If audit fails, fix the reported issue before re-running the pipeline.

### Pre-PR Security Gate (public repos only)

Before pushing/creating PR, check if the repo is public:

```bash
gh repo view --json isPrivate -q '.isPrivate' 2>/dev/null
```

If the result is `false` (public repo): check for existing advisories in `security/` directory, then pause for user confirmation.

- If CRITICAL advisories are found: show the warning and **pause** — let the user decide whether to proceed or stop.
- If no CRITICAL advisories: continue with push and PR.

For private repos: skip this gate entirely.

### Options

| Flag | Description |
|------|-------------|
| `--check` | Dry-run mode — validates script syntax only, no git changes |

### Graceful Degradation

- **No `gh` CLI**: PR creation is skipped; branch, commit, and push still proceed
- **No git remote**: Push and PR steps are skipped; local commit still proceeds
- **Existing PR for branch**: Skips duplicate PR creation (detects via `gh pr list --head <branch>`)
