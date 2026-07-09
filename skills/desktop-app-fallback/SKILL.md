---
name: desktop-app-fallback
description: Manual Post-Write QA chain for Claude Code Desktop App (hooks don't fire)
metadata:
  type: task
  triggers:
    - desktop app
    - manual QA
    - hooks not firing
    - Claude Desktop
---

# Desktop App Post-Write Fallback

## When to Use

Use this skill when working in the **Claude Code Desktop App**, where `PostToolUse` hooks do not fire automatically.

## Trigger

After any `WriteSource` or `EditSource` operation in the Desktop App.

## Manual QA Chain

Run the following command manually after each write operation:

```
/post-write
```

This command runs the complete QA chain:
- SyntaxCheck
- RunUnitTests
- RunATCCheck

## Expected Results

| Step | Required | Action on Fail |
|------|:--------:|----------------|
| Syntax Check | ✅ Pass | Fix syntax errors, re-run |
| Unit Tests | ⚠️ Best effort | Fix bugs if critical |
| ATC Check | ✅ P1 must pass | Fix P1 findings, document P2/P3 |

## After QA Pass

1. Sync changes: `/sync`
2. Create transport if needed: `/transport`

---

*Plugin: abap-harness-engineering*
