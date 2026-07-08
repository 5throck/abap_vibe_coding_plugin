---
name: sync
description: Sync today's development session to Git — run the documentation audit, update the memory index, and commit all changes with a conventional commit message.
argument-hint: "<conventional-commit-message>"
allowed-tools: ["Bash"]
---

# Sync

Sync today's development session to Git: run the documentation audit, update the memory index, and commit all changes.

Run:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/dev-sync.ts" "$ARGUMENTS"
```

`$ARGUMENTS` should be a conventional commit message (e.g. `feat: add ZCL_MY_CLASS`).
If `$ARGUMENTS` is empty, prompt the user for a commit message before running.

## Pipeline Steps

The script performs the following 6-stage pipeline:

1. **Write daily session log** — Appends entry to `memory/YYYY-MM-DD.md` with file list
2. **Update MEMORY.md index** — Calls `scripts/sync-md.ts` to update the central index
3. **Auto-add CHANGELOG entry** — Appends `$ARGUMENTS` under `[Unreleased]` if not already present
4. **Sensitive file guard** — Blocks if untracked or staged `.pem`, `.key`, `.env`, `credentials.json`, etc. detected
5. **Branch / Commit / Push** — Creates PR branch if on main/master, stages all files, commits, pushes
   - `audit.ts` runs automatically via pre-commit hook during `git commit`
6. **Open PR** — Uses `.github/pull_request_template.md` or `gh pr create --fill` to open a PR

If audit fails, fix the reported issue before re-running `/sync`.

## Pre-PR Security Gate (public repos only)

Before pushing/creating PR, check if the repo is public:

```bash
gh repo view --json isPrivate -q '.isPrivate' 2>/dev/null
```

If the result is `false` (public repo): check for existing advisories in `security/` directory, then pause for user confirmation.

- If CRITICAL advisories are found: show the warning and **pause** — let the user decide whether to proceed or stop.
- If no CRITICAL advisories: continue with push and PR.

For private repos: skip this gate entirely.
