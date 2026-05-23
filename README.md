# abap-harness-engineering

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)

A Claude Code plugin providing a complete **AI Harness Engineering** framework for SAP ABAP development. Includes 19 specialized agents, 8 skills, 7 commands, and MCP integration via the `vsp` server.

> **What is Harness Engineering?**
> A methodology where specialized AI agents collaborate within a structured environment - ensuring AI-driven SAP development is predictable, governed, and auditable. The PM-led governance model mirrors a real software engineering team: business analysts define requirements, architects design the solution, developers implement it, and QA verifies it. See the [reference implementation ->](#reference-implementation-abap_vibe_coding)

---

## Features

- **19 Agents**: Global PM, technical architect, code writer, DBA, Interface Expert, DevOps / Admin, Fiori developer, form expert, GUI scripter, business analysts (SD/MM/FI/CO/PP/LE), QA runner, schema inspector, SAP investigator
- **8 Skills**: ABAP development workflows, post-write quality gate, and 6 SAP ERP module knowledge bases (SD, MM, FI, CO, PP, LE)
- **7 Commands**: `/triage`, `/transport`, `/post-write`, `/sync`, `/new-task`, `/memlog`, `/celebrate`
- **MCP Integration**: `vsp` server for full SAP ADT access in hyperfocused mode

---

## Prerequisites

- Claude Code CLI or Desktop App
- SAP system with ADT (ABAP Development Tools) access
- `vsp` binary (see Installation below)

---

## Installation

For a step-by-step walk-through on installing, registering the plugin hooks, and connecting your first consumer repository, please see:

* **[docs/plugin-setup.md](./docs/plugin-setup.md)**

### 1. Install the vsp Binary

**Unix/macOS:**
```bash
bash scripts/install-vsp.sh
```

**Windows:**
```powershell
.\scripts\install-vsp.ps1
```

To install a specific version, pass the tag:
```bash
bash scripts/install-vsp.sh v2.38.1        # Unix/macOS
.\scripts\install-vsp.ps1 -Version v2.38.1 # Windows
```

### 2. Configure SAP Connection

Copy `.mcp.json.sample` to `.mcp.json` and `.env.sample` to `.env`, then fill in your SAP credentials:
```bash
export SAP_URL=https://your-sap-host:8080
export SAP_USER=your-username
export SAP_PASSWORD=your-password
export SAP_CLIENT=100
```

Or set them in your shell profile / Claude Code environment.

### 3. Install the Plugin

**Local testing:**
```bash
cc --plugin-dir /path/to/abap-harness-engineering
```

**From Marketplace:** Install via Claude Code settings -> Plugins -> Search "abap-harness-engineering"

---

## Usage

### Quick Start - Triage a Task

```
/triage Fix the SD billing report for customer 1000
```

This will:
1. Detect the SD module
2. Create a task file in `scratch/tasks/`
3. Generate parallel dispatch blocks for 3 read-only agents

### Transport Management

```
/transport list
/transport create feat: add ZCL_MY_CLASS
/transport add NPL_K000001 /sap/bc/adt/programs/programs/ZPROG_EXAMPLE
/transport release NPL_K000001
```

### Quality Gate

```
/post-write ZCL_MY_CLASS
```

### Sync to Git

```
/sync feat: implement SD billing fix
```

---

## Architecture

### Harness Engineering Workflow

```
Phase 1 (Parallel): sap-investigator + read-only-analyst + schema-inspector
        |
Phase 2 (Serial):   architect -> code-writer
        |
Phase 3 (Serial):   test-runner
        |
Phase 4:            /post-write -> /transport release -> /sync
```

### Agent Roles

| Agent | Phase | Parallelizable |
|-------|-------|:--------------:|
| pm | 1 | Serial |
| sap-investigator | 1 | Parallel |
| read-only-analyst | 1 | Parallel |
| schema-inspector | 1 | Parallel |
| sd/mm/fi/co/pp/le-analyst | 1 | Parallel |
| architect | 2 | Serial |
| dba | 2 | Parallel |
| interface-expert | 2 | Parallel |
| code-writer | 2 | Serial |
| fiori-developer | 2 | Design parallel / write serial |
| form-expert | 2 | Design parallel / write serial |
| gui-scripter | 2 | Serial |
| test-runner | 3 | Serial after write |
| devops-admin | 4 | Serial |

---

## MCP Configuration

The plugin provides MCP configuration assets and integration. Note that the consumer project still needs `.mcp.json` or target environment variables configured in its root directory to initialize the connection. The server runs in `hyperfocused` mode with access to `Z*`, `$TMP`, `$ZADT_VSP`, and `$VSP_ADT` packages.

Supported features:
- `SAP_FEATURE_ABAPGIT=on` - abapGit integration
- `SAP_FEATURE_TRANSPORT=on` - CTS transport management
- `SAP_FEATURE_UI5=on` - Fiori/UI5 support
- `SAP_FEATURE_RAP=on` - ABAP RESTful Application Programming

In addition to the `vsp` server, the provided MCP configuration sample includes two documentation MCP servers:
- `abap-docs` - ABAP language reference and object search via [mcp-abap.marianzeis.de](https://mcp-abap.marianzeis.de)
- `sap-docs` - SAP Help Portal search via [mcp-sap-docs.marianzeis.de](https://mcp-sap-docs.marianzeis.de)

---

## Hooks

In Claude Code CLI sessions, a `PostToolUse` hook fires after every Write/Edit tool call and runs `scripts/sync-md.sh` for documentation audit.

> **Note**: Hooks do not fire in Claude Code Desktop App. Run `/post-write` manually after each ABAP write in Desktop sessions. Also, note that automatic hooks rely on the `CLAUDE_PLUGIN_ROOT` environment variable being populated by the plugin runtime. For direct manual testing or execution outside the hook lifecycle, execute `scripts/sync-md.sh` or `scripts/sync-md.ps1` directly from your workspace root.

---

## Reference Implementation: abap_vibe_coding

This plugin is the packaged, distributable form of the **[5throck/abap_vibe_coding](https://github.com/5throck/abap_vibe_coding)** project. 

> **Note**: This plugin intentionally excludes live memory logs, scratch files, and full governance docs (like `AGENTS.md`, `docs/context.md`, and `docs/tooling-matrix.md`) to maintain it as a lightweight, executable package. Additionally, Gemini/Codex-specific configurations (such as `GEMINI.md` and `.codex/`) are omitted and remain in the reference implementation or consumer project. 

The reference project provides the complete operational context not included in this plugin:

| Resource | Description |
|----------|-------------|
| [AGENTS.md](https://github.com/5throck/abap_vibe_coding/blob/main/AGENTS.md) | Full agent role definitions, handoff protocols, and governance model |
| [docs/context.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md) | Shared project context: codebase map, build commands, ABAP dev rules |
| [docs/setup-guide.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/setup-guide.md) | Step-by-step environment setup (MCP, SAP ADT, abapGit, AI agents) |
| [docs/task-template.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/task-template.md) | Full task handoff template (§0 Triage -> §5 Finalization) |
| [docs/testing-guidelines.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/testing-guidelines.md) | ABAP Unit test standards and ATC priority thresholds |
| [docs/prd-template.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/prd-template.md) | PRD / Acceptance Criteria template for business analysis |
| [docs/security.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/security.md) | Sanitization policy for tracked docs and pre-commit scan rules |
| [memory/MEMORY.md](https://github.com/5throck/abap_vibe_coding/blob/main/memory/MEMORY.md) | Index of development history and architectural decisions |
| [docs/plugin-setup.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/plugin-setup.md) | Setup guide for the Claude Code plugin |

> The reference project contains the same agents, skills, and commands as this plugin, plus live scratch files, memory logs, and session history from real development work.

---

## License

AGPL v3 - see [LICENSE](./LICENSE) for details.

---

*Last Updated: 2026-05-19*


This will trigger the Phase 0 Dynamic Team Assembly process to align roles and skills.
