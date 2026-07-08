---
name: sync
status: active
scope: claude
description: >
  Claude Code platform-specific sync skill. Delegates to .claude/commands/sync.md.
owner: pm
version: 1.0.0
last_reviewed: 2026-07-08
metadata:
  type: process
  platform: claude
  triggers:
    - sync
    - commit and push
    - create PR
---

Claude Code platform override for the `sync` skill.

Use the native slash command:

```
/sync "type: description of changes"
```

See `.claude/commands/sync.md` for full pipeline documentation.
See `skills/sync/SKILL.md` for the cross-platform reference.
