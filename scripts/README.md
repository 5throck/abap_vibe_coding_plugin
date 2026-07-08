# Project Scripts

Utility scripts for project operations. All utility scripts are implemented in TypeScript and run via the Bun runtime.

## Available Scripts

### Bootstrap Scripts (Shell Only)

These scripts must remain as shell scripts because they run before Bun is installed:

| Script | Purpose |
|--------|---------|
| `install-bun.sh` / `install-bun.ps1` | Install Bun runtime |
| `install-vsp.sh` / `install-vsp.ps1` | Install vsp binary |

### TypeScript (Bun) Scripts

All utility scripts use TypeScript as the single source of truth:

| Script | Purpose |
|--------|---------|
| `sync-md.ts` | Update memory/MEMORY.md index (called by PostToolUse hook) |
| `audit.ts` | Documentation and file integrity audit |
| `dev-sync.ts` | Full sync pipeline (memlog → changelog → audit → commit → PR) |
| `setup.ts` | Initial project setup (env, deps, first commit) |
| `vsp-task.ts` | Initialize new tasks |
| `vsp-publish.ts` | Publish plugin assets to consumer repo |
| `verify-skills.ts` | Verify all skills in `skills/` are loadable |
| `agent-create.ts` | Create new agent definition files |
| `agent-list.ts` | List all agents with metadata |
| `agent-delete.ts` | Delete agent files |
| `agent-verify.ts` | Verify agent/documentation synchronization |
| `dispatch.ts` | Main entry point for agent dispatch |
| `dispatch-parallel.ts` | Parallel agent dispatcher |
| `dispatch-serial.ts` | Serial agent dispatcher with dependencies |
| `retry-handler.ts` | Retry logic with exponential backoff |

All scripts support a `--check` flag for dry-run validation:
```bash
bun scripts/dev-sync.ts --check   # syntax check only, no git changes
```

## NPM Scripts

Convenience shortcuts defined in `package.json`:

```bash
bun run verify-skills     # Verify skills
bun run agent:create      # Create new agent
bun run agent:list        # List agents
bun run agent:delete      # Delete agent
bun run agent:verify      # Verify agent/documentation sync
bun run dispatch:parallel # Run parallel dispatch
bun run dispatch:serial   # Run serial dispatch
```

## Scripting Model

This project uses **TypeScript (Bun) as the single source of truth** for all utility scripts:

- **TypeScript (Bun)** for all utility and orchestration scripts
- **Shell Scripts** only for bootstrap (install-bun, install-vsp) — these must run before Bun exists

## File Encoding

All scripts MUST be saved as **UTF-8 (without BOM)**.

---

*Project template - customize as needed*
