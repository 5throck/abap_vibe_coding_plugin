---
name: sync
status: active
scope: gemini
description: >
  Gemini/Antigravity platform-specific sync skill. Delegates to .gemini/commands/sync.md.
owner: pm
version: 1.0.0
last_reviewed: 2026-07-08
metadata:
  type: process
  platform: gemini
  triggers:
    - sync
    - commit and push
    - create PR
---

Gemini/Antigravity platform override for the `sync` skill.

> **Gemini CLI**: Custom slash commands are not natively registered from `.gemini/commands/`.
> Read `.gemini/commands/sync.md` to understand the pipeline, then execute via terminal tools:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/dev-sync.ts" "$ARGUMENTS"
```

See `.gemini/commands/sync.md` for full pipeline documentation.
See `skills/sync/SKILL.md` for the cross-platform reference.
