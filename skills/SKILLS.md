# Skills Index

Auto-generated index of all available skills in the `skills/` directory for the **abap-harness-engineering** plugin.

## Core Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| `abap-dev` | SAP ABAP development workflows and MCP tool optimization | Session start |
| `post-write-chain` | Mandatory QA chain after any WriteSource/EditSource | After write operations |

## Module-Specific Skills

| Skill | Description | Trigger |
|-------|-------------|---------|
| `sap-co` | Controlling module context | CO tasks (cost centers, CO-PA) |
| `sap-fi` | Financial Accounting module context | FI tasks (journal entries, GL) |
| `sap-le` | Logistics Execution module context | LE tasks (shipping, warehouse) |
| `sap-mm` | Materials Management module context | MM tasks (purchasing, inventory) |
| `sap-pp` | Production Planning module context | PP tasks (BOM, routing) |
| `sap-sd` | Sales & Distribution module context | SD tasks (sales orders, billing) |

## Skill Loading

Skills are auto-discovered from the `skills/` directory at session start.

To add a new skill:
1. Create `skills/<skill-name>/SKILL.md`
2. Add frontmatter with `name`, `description`, `metadata.type`
3. Skill will be automatically discovered

---

*Generated: 2026-05-24*
*Source: abap-harness-engineering plugin*
