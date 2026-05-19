# abap-harness-engineering

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)

A Claude Code plugin providing a complete AI Harness Engineering framework for SAP ABAP development. Includes 15 specialized agents, 8 skills, 7 commands, and MCP integration via the `vsp` server.

## Features

- **15 Agents**: Technical architect, code writer, Fiori developer, form expert, GUI scripter, business analysts (SD/MM/FI/CO/PP/LE), QA runner, schema inspector, SAP investigator
- **8 Skills**: ABAP development workflows, post-write quality gate, and 6 SAP ERP module knowledge bases (SD, MM, FI, CO, PP, LE)
- **7 Commands**: `/triage`, `/transport`, `/post-write`, `/sync`, `/new-task`, `/memlog`, `/celebrate`
- **MCP Integration**: `vsp` server for full SAP ADT access in hyperfocused mode

## Prerequisites

- Claude Code CLI or Desktop App
- SAP system with ADT (ABAP Development Tools) access
- `vsp` binary (see Installation below)

## Installation

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

Copy `.env.sample` and set your SAP credentials:
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

**From Marketplace:** Install via Claude Code settings → Plugins → Search "abap-harness-engineering"

## Usage

### Quick Start — Triage a Task

```
/triage Fix the SD billing report for customer 1000
```

This will:
1. Detect the SD module
2. Create a task file in `scratch/`
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

## Architecture

### Harness Engineering Workflow

```
Phase 1 (Parallel): sap-investigator + read-only-analyst + schema-inspector
        ↓
Phase 2 (Serial):   architect → code-writer
        ↓
Phase 3 (Serial):   test-runner
        ↓
Phase 4:            /post-write → /transport release → /sync
```

### Agent Roles

| Agent | Phase | Parallelizable |
|-------|-------|:--------------:|
| sap-investigator | 1 | ✅ |
| read-only-analyst | 1 | ✅ |
| schema-inspector | 1 | ✅ |
| sd/mm/fi/co/pp/le-analyst | 1 | ✅ |
| architect | 2 | ❌ |
| code-writer | 2 | ❌ |
| fiori-developer | 2 | ❌ (writes) |
| form-expert | 2 | ❌ (writes) |
| gui-scripter | 2 | ❌ |
| test-runner | 3 | ❌ |

## MCP Configuration

The plugin configures the `vsp` MCP server automatically. The server runs in `hyperfocused` mode with access to `Z*`, `$TMP`, `$ZADT_VSP`, and `$VSP_ADT` packages.

Supported features:
- `VSP_FEATURE_ABAPGIT=on` — abapGit integration
- `VSP_FEATURE_TRANSPORT=on` — CTS transport management
- `VSP_FEATURE_UI5=on` — Fiori/UI5 support
- `VSP_FEATURE_RAP=on` — ABAP RESTful Application Programming

## Hooks

A `PostToolUse` hook fires after every Write/Edit tool call and runs `scripts/sync-md.sh` for documentation audit.

> **Note**: Hooks do not fire in Claude Code Desktop App. Run `/post-write` manually after each ABAP write in Desktop sessions.

## License

AGPL v3 — see [LICENSE](./LICENSE) for details.
