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
bash "${CLAUDE_PLUGIN_ROOT:-.}/scripts/dev-sync.sh" "$ARGUMENTS"
```

$ARGUMENTS should be a conventional commit message (e.g. `feat: add ZCL_MY_CLASS`).
If $ARGUMENTS is empty, prompt the user for a commit message before running.

The script will:
1. Append a session entry to `memory/YYYY-MM-DD.md`
2. Update `memory/MEMORY.md` index via `sync-md.sh`
3. Auto-add `$ARGUMENTS` to `CHANGELOG.md [Unreleased]` if the section has no entries yet
4. Run `audit.sh` — must exit 0 before proceeding
5. Guard against sensitive files (`.pem`, `.key`, `.env`, `credentials.json`, etc.)
6. Create a new PR branch (if on main/master), commit all staged changes, push, and open a GitHub PR

If audit fails, fix the reported issue before re-running `/sync`.

## Pre-PR Security Gate (public repos only)

Before pushing/creating PR, check if the repo is public:

```bash
gh repo view --json isPrivate -q '.isPrivate' 2>/dev/null
```

If the result is `false` (public repo): run `/security-check --pr` (read-only advisory check).

- If CRITICAL advisories are found: show the warning and **pause** — let the user decide whether to proceed or stop.
- If no CRITICAL advisories: continue with push and PR.

For private repos: skip this gate entirely.
