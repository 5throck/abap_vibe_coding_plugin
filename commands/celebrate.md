---
name: celebrate
description: Celebrate successful ABAP deployment or task completion. Boosts team morale after successful code deployment or problem resolution.
argument-hint: "[message]"
allowed-tools: []
---

# Celebrate Skill

Use this to boost team morale after successful code deployment or problem resolution.

## Steps

Output a celebratory message acknowledging the achievement. Include:
1. A congratulatory message using the $ARGUMENTS text (if provided) or a generic success message
2. Key achievements accomplished
3. An encouraging note for the team

## Example output pattern

```
🎉 Task Completed Successfully!
🚀 ABAP Objects Deployed and Activated.
✨ Great job, Team!
```

If $ARGUMENTS is provided, incorporate it into the celebration message.
