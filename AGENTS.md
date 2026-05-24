# AGENTS.md —abap-harness-engineering Plugin

Canonical agent roster for the **abap-harness-engineering** Claude Code plugin.
All agent definitions live in [`agents/`](agents/). This file is the shared index read by all AI tools.

> Full architecture context and workflow: [`https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md`](https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md)
> Detailed orchestration contract: [`https://github.com/5throck/abap_vibe_coding/blob/main/AGENTS.md`](https://github.com/5throck/abap_vibe_coding/blob/main/AGENTS.md)

---

## 🏢 Business Group (Project Governance & Analysis)

### 👑 Global Project Manager (PM)
- **File**: [`agents/pm.md`](agents/pm.md)
- **Role**: Entry point for all user requests — triage, subagent dispatch, quality gates, finalization
- **Tools**: `ListTransports`, `GrepPackages`, `SearchObject`, `RunUnitTests`, `RunATCCheck`
- **Triage shortcut**: `/triage <request>` auto-classifies, creates task file, generates parallel dispatch block

### Business Analysts (Module Domain Experts)

| Agent | File | Module | Trigger Keywords |
|-------|------|:------:|------------------|
| `sd-analyst` | [`agents/sd-analyst.md`](agents/sd-analyst.md) | SD —Sales & Distribution | Sales Order, Delivery, Billing, Shipping, VA*, VL*, VF*, VK* |
| `mm-analyst` | [`agents/mm-analyst.md`](agents/mm-analyst.md) | MM —Materials Management | Purchasing, Inventory, PO, GR, MRP, MAT, MARA |
| `fi-analyst` | [`agents/fi-analyst.md`](agents/fi-analyst.md) | FI —Financial Accounting | Journal, G/L, Account, BKPF, BSEG, FAGLFLEXA |
| `co-analyst` | [`agents/co-analyst.md`](agents/co-analyst.md) | CO —Controlling | Cost Center, CO-PA, Profitability, Internal Order |
| `pp-analyst` | [`agents/pp-analyst.md`](agents/pp-analyst.md) | PP —Production Planning | Production Order, BOM, Routing, MRP, Work Center |
| `le-analyst` | [`agents/le-analyst.md`](agents/le-analyst.md) | LE —Logistics Execution | Shipment, Transport, Warehouse, WM, EWM, Handling Unit |

---

## 🛠️ Technical Group (Implementation & Verification)

### Orchestration

| Agent | File | Role |
|-------|------|------|
| `architect` | [`agents/architect.md`](agents/architect.md) | Technical design, impact analysis, implementation approach |
| `devops-admin` | [`agents/devops-admin.md`](agents/devops-admin.md) | Transports, system config, abapGit, CTS management |

### Execution

| Agent | File | Role |
|-------|------|------|
| `code-writer` | [`agents/code-writer.md`](agents/code-writer.md) | ABAP implementation —WriteSource / EditSource |
| `read-only-analyst` | [`agents/read-only-analyst.md`](agents/read-only-analyst.md) | ABAP SQL queries, read-only investigation |
| `schema-inspector` | [`agents/schema-inspector.md`](agents/schema-inspector.md) | Table / structure read-only analysis |
| `sap-investigator` | [`agents/sap-investigator.md`](agents/sap-investigator.md) | Codebase scan, object search, existing code analysis |
| `dba` | [`agents/dba.md`](agents/dba.md) | Database design, table structures, SQL optimization |
| `interface-expert` | [`agents/interface-expert.md`](agents/interface-expert.md) | IDoc, RFC, API, integration patterns |
| `test-runner` | [`agents/test-runner.md`](agents/test-runner.md) | Unit tests, ATC checks, QA verification |

### Specialized Experts

| Agent | File | Role |
|-------|------|------|
| `fiori-developer` | [`agents/fiori-developer.md`](agents/fiori-developer.md) | UI5 / Fiori app development |
| `form-expert` | [`agents/form-expert.md`](agents/form-expert.md) | Smart Forms / Adobe Forms |
| `gui-scripter` | [`agents/gui-scripter.md`](agents/gui-scripter.md) | SAP GUI scripting automation |
| `security-monitor` | [`agents/security-monitor.md`](agents/security-monitor.md) | Security review, vulnerability assessment |

---

## Skills

| Skill | File | Trigger |
|-------|------|---------|
| `abap-dev` | [`skills/abap-dev/SKILL.md`](skills/abap-dev/SKILL.md) | Any ABAP development session |
| `post-write-chain` | [`skills/post-write-chain/SKILL.md`](skills/post-write-chain/SKILL.md) | After any WriteSource / EditSource |
| `desktop-app-fallback` | [`skills/desktop-app-fallback/SKILL.md`](skills/desktop-app-fallback/SKILL.md) | Desktop App manual QA |
| `source-command-celebrate` | [`skills/source-command-celebrate/SKILL.md`](skills/source-command-celebrate/SKILL.md) | After task completion |

---

## Dispatch Protocol (6-Phase)

```
Phase 1 (Parallel)  → Triage: pm dispatches read-only-analyst, schema-inspector, sap-investigator
Phase 2 (Serial)    → Business Analysis: Module analysts produce PRD/AC
Phase 3 (Serial)    → Governance: PM + Architect approve impact
Phase 4 (Serial)    → Design: Architect creates implementation plan
Phase 5 (Serial)    → Implementation: code-writer implements + post-write chain (SyntaxCheck → RunUnitTests → RunATCCheck)
Phase 6 (Serial)    → Finalization: pm runs /sync → PR created
```

### Parallel vs Serial Execution

**Phase 1 (Parallel) - Read-Only Research:**
- `sap-investigator`: Scan codebase for related objects
- `read-only-analyst`: Query SAP tables for AS-IS data
- `schema-inspector`: Inspect table structures and CDS dependencies

**All Other Phases (Serial) - Write Operations:**
- Never parallelize EditSource/WriteSource operations
- Each object must complete QA chain before next

---

## Handoff Specification

JSON-based handoff format: [`agents/handoff-spec.md`](agents/handoff-spec.md)

---

*Last Updated: 2026-05-25*
