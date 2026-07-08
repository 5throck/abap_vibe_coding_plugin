---
name: meeting
status: active
scope: gemini
description: >
  Gemini/Antigravity platform-specific meeting skill. Delegates to .gemini/commands/meeting.md.
owner: pm
version: 1.0.0
last_reviewed: 2026-07-08
metadata:
  type: process
  platform: gemini
  triggers:
    - meeting
    - agent discussion
    - collaborative decision
---

Gemini/Antigravity platform override for the `meeting` skill.

> **Gemini CLI**: Custom slash commands are not natively registered from `.gemini/commands/`.
> Read `.gemini/commands/meeting.md` to understand the process, then execute via terminal tools:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/sync-md.ts"
```

See `.gemini/commands/meeting.md` for full process documentation.
See `skills/meeting-facilitation/SKILL.md` for the cross-platform reference.
