# Memory Index

This directory stores date-stamped development logs for the **abap-harness-engineering** plugin project.

---

## When to Read

Do **not** open memory files at session start. Consult the relevant date file only when:
- A recurring or hard-to-diagnose error occurs
- You need to verify a past design decision
- You are investigating why something was implemented a certain way

## When to Write

After every session in which a plugin component is created or significantly changed,
append to `memory/YYYY-MM-DD.md` (create the file if it does not exist).

Required fields per entry:
- Component name and type (command/agent/skill/hook/script)
- Purpose summary
- Key technical decisions
- Issue history (symptom → root cause → resolution)

---

## Log Files

| Date | Summary |
|------|---------|

---

## Adding an Entry

When creating a new log file, add a row to the table above — newest date at the top.

Format: `| [YYYY-MM-DD](YYYY-MM-DD.md) | one-line summary |`

---

*Last Updated: 2026-05-21*
