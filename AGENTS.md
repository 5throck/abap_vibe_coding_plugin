# AGENTS.md — abap-harness-engineering Plugin

> This file is the canonical agent index for the abap-harness-engineering plugin project.
> It is auto-loaded by Claude Code at session start.
> All agent definitions live in `agents/*.md`.

## Agent Roster

| Group | Agent file | Role |
|-------|------------|------|
| Orchestration | `agents/pm.md` | PM orchestrator — owns the workflow, dispatches parallel tasks |
| Design | `agents/architect.md` | Architect — produces implementation plans and ADRs |
| Analysis | `agents/co-analyst.md` | CO module analyst — read-only investigation |
| Analysis | `agents/fi-analyst.md` | FI module analyst — read-only investigation |
| Analysis | `agents/mm-analyst.md` | MM module analyst — read-only investigation |
| Analysis | `agents/sd-analyst.md` | SD module analyst — read-only investigation |
| Analysis | `agents/le-analyst.md` | LE module analyst — read-only investigation |
| Analysis | `agents/pp-analyst.md` | PP module analyst — read-only investigation |
| Analysis | `agents/read-only-analyst.md` | General read-only investigation |
| Analysis | `agents/sap-investigator.md` | Deep SAP system investigation |
| Analysis | `agents/schema-inspector.md` | Database schema inspection |
| Execution | `agents/code-writer.md` | Code writer — implements approved plans |
| Execution | `agents/test-runner.md` | Test runner — verifies acceptance criteria and runs QA gate |
| Execution | `agents/dba.md` | Database administrator — schema and data changes |
| Execution | `agents/devops-admin.md` | DevOps admin — CI/CD and infrastructure |
| Execution | `agents/fiori-developer.md` | Fiori developer — UI5 frontend development |
| Execution | `agents/form-expert.md` | Form/Smartform expert |
| Execution | `agents/gui-scripter.md` | SAP GUI scripting |
| Execution | `agents/interface-expert.md` | Interface/IDoc/IDOC expert |

## Agent Dispatch Pattern (PM → Subagent)

Each implementation task follows a 3-role review cycle:
1. **Implementation subagent** executes the task
2. **Spec-compliance review subagent** checks against design
3. **Code-quality review subagent** checks for bugs and style
Loop and correct if issues found — maximum 3 iterations before escalating.

## Cross-References
- **Parent project agents**: [../abap_vibe_coding/AGENTS.md](../abap_vibe_coding/AGENTS.md)
- **Workspace design standard**: [../CONSTITUTION.md](../CONSTITUTION.md)

*Last Updated: 2026-05-22*
