---
name: meeting
status: active
scope: claude
description: >
  Claude Code platform-specific meeting skill. Delegates to .claude/commands/meeting.md.
owner: pm
version: 1.4.0
last_reviewed: 2026-07-08
metadata:
  type: process
  platform: claude
  triggers:
    - meeting
    - agent discussion
    - collaborative decision
    - multi-agent coordination
---

Claude Code platform override for the `meeting` skill.

Use the native slash command:

```
/meeting "topic" --agents [agent1,agent2] --rounds 2 --dialogue
```

See `.claude/commands/meeting.md` for the full 8-step meeting process.
See `skills/meeting-facilitation/SKILL.md` for the cross-platform reference.
