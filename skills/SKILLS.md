# Skills Index

Auto-generated index of all available skills in the `skills/` directory for the **abap-harness-engineering** plugin.

## Core Skills

| Skill | Description | Type | Trigger |
|-------|-------------|------|---------|
| `abap-dev` | SAP ABAP development workflows and MCP tool optimization | domain | Session start |
| `post-write-chain` | Mandatory QA chain after any WriteSource/EditSource | process | After write operations |
| `desktop-app-fallback` | Manual Post-Write QA for Desktop App | task | Desktop App usage |
| `source-command-celebrate` | Celebration for successful task completion | task | After task completion |
| `dump-monitor` | ABAP short-dump monitoring and triage routing | core | System health check |
| `performance-tuning` | Standardized performance analysis for slow ABAP/SQL | core | Performance investigation |

## Module-Specific Skills

| Skill | Description | Type | Trigger |
|-------|-------------|------|---------|
| `sap-co` | Controlling module context | domain | CO tasks (cost centers, CO-PA) |
| `sap-fi` | Financial Accounting module context | domain | FI tasks (journal entries, GL) |
| `sap-le` | Logistics Execution module context | domain | LE tasks (shipping, warehouse) |
| `sap-mm` | Materials Management module context | domain | MM tasks (purchasing, inventory) |
| `sap-pp` | Production Planning module context | domain | PP tasks (BOM, routing) |
| `sap-sd` | Sales & Distribution module context | domain | SD tasks (sales orders, billing) |

## Process Skills

| Skill | Description | Type | Trigger |
|-------|-------------|------|---------|
| `meeting-facilitation` | Structured multi-agent meeting orchestration | process | `/meeting` command |
| `project-review` | PM-led workspace health audit and findings report | process | `/project-review` command |
| `sync` | Full sync pipeline (memlog → changelog → audit → commit → PR) | process | Session end |

## Skill Loading

Skills are auto-discovered from the `skills/` directory at session start.

To add a new skill:
1. Create `skills/<skill-name>/SKILL.md`
2. Add frontmatter with `name`, `description`, `metadata.type`, `metadata.triggers`
3. Add corresponding command files in `.claude/commands/` and `.gemini/commands/`
4. Skill will be automatically discovered

> **Note**: Commands (changelog, memlog, new-task, post-write, transport, triage, celebrate)
> are registered as slash commands in `.claude/commands/` and `.gemini/commands/`, not as skills.

---

*Generated: 2026-07-11*
*Source: abap-harness-engineering plugin*
