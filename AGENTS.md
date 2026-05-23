# AGENTS.md ??abap-harness-engineering Plugin

Canonical agent roster for the **abap-harness-engineering** Claude Code plugin.
All agent definitions live in [`agents/`](agents/). This file is the shared index read by all AI tools.

> Full architecture context and workflow: [`https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md`](https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md)

---

## Orchestration

| Agent | File | Color | Role |
|-------|------|:-----:|------|
| `pm` | `agents/pm.md` | ?윞 yellow | Global orchestrator ??triage, subagent dispatch, quality gates, finalization |
| `devops-admin` | `agents/devops-admin.md` | ?뵶 red | Transports, system config, abapGit, CTS management |

## Execution

| Agent | File | Color | Role |
|-------|------|:-----:|------|
| `code-writer` | `agents/code-writer.md` | ?윟 green | ABAP implementation ??WriteSource / EditSource |
| `read-only-analyst` | `agents/read-only-analyst.md` | ?뵷 blue | ABAP SQL queries, read-only investigation |
| `schema-inspector` | `agents/schema-inspector.md` | ?뵷 blue | Table / structure read-only analysis |
| `fiori-developer` | `agents/fiori-developer.md` | ?뵷 blue | UI5 / Fiori app development |
| `form-expert` | `agents/form-expert.md` | ?뵷 blue | Smart Forms / Adobe Forms |
| `gui-scripter` | `agents/gui-scripter.md` | ?뵷 blue | SAP GUI scripting automation |

## SAP Module Domain Experts (Business Group)

| Agent | File | Color | Module |
|-------|------|:-----:|--------|
| `sd-analyst` | `agents/sd-analyst.md` | ?윞 yellow | SD ??Sales & Distribution |
| `mm-analyst` | `agents/mm-analyst.md` | ?윞 yellow | MM ??Materials Management |
| `fi-analyst` | `agents/fi-analyst.md` | ?윞 yellow | FI ??Financial Accounting |
| `co-analyst` | `agents/co-analyst.md` | ?윞 yellow | CO ??Controlling |
| `pp-analyst` | `agents/pp-analyst.md` | ?윞 yellow | PP ??Production Planning |
| `le-analyst` | `agents/le-analyst.md` | ?윞 yellow | LE ??Logistics Execution |

---

## Skills

| Skill | File | Trigger |
|-------|------|---------|
| `abap-dev` | `skills/abap-dev/SKILL.md` | Any ABAP development session |
| `post-write-chain` | `skills/post-write-chain/SKILL.md` | After any WriteSource / EditSource |

---

## Dispatch Protocol (6-Phase)

```
Phase 1 ??Triage     : pm dispatches read-only-analyst, schema-inspector, sap-investigator in parallel
Phase 2 ??Analysis   : Agents return findings ??pm synthesizes requirements
Phase 3 ??Design     : Architect (from parent project) creates implementation plan
Phase 4 ??Impl       : code-writer implements (serial) ??post-write chain (SyntaxCheck ??RunUnitTests ??RunATCCheck)
Phase 5 ??QA         : All acceptance criteria verified
Phase 6 ??Finalize   : pm runs /sync ??PR created
```

> Agents not in this plugin (architect, dba, interface-expert, sap-investigator, test-runner) are defined in the parent project [`https://github.com/5throck/abap_vibe_coding/blob/main/agents/`](https://github.com/5throck/abap_vibe_coding/blob/main/agents/).

---

*Last Updated: 2026-05-23*


## Dynamic Roster Updates
**Note on Phase 0 Kickoff:** The PM agent is explicitly authorized to assess project requirements during kickoff and dynamically expand this AGENTS.md registry by creating new specialist agents or skills.

