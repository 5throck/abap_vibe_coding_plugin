# GEMINI.md —abap-harness-engineering Plugin

> **Doc intent:** This file contains Gemini CLI / Antigravity-specific overrides only.
> Shared project context lives in [`https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md`](https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md).
> Agent roles live in [`agents/`](agents/) and [`AGENTS.md`](AGENTS.md).
> Workspace-level Gemini behaviors —[`https://raw.githubusercontent.com/5throck/ai-workspace-standards/main/GEMINI.md`](https://raw.githubusercontent.com/5throck/ai-workspace-standards/main/GEMINI.md).

---

## Context Loading

Load project files at session start using the `@` syntax:
```
@docs/context.md                            # full project knowledge (ABAP rules, build, codebase map)
@AGENTS.md                                  # plugin agent roster
@memory/MEMORY.md                           # recent changes (skip if file does not exist)
@skills/abap-dev/SKILL.md                   # SAP development workflows
@skills/post-write-chain/SKILL.md           # mandatory QA chain after any write
```

---

## Gemini-Specific Configuration

### Recommended Mode

Use `--mode hyperfocused` for all Gemini sessions via `.gemini/settings.json` (MCP server `abap`).

### Tool Name Mapping & Safeguards

Gemini CLI uses different tool names from Claude Code:

| Tool Category | Tool Name | Operational Guidance |
| :--- | :--- | :--- |
| **File Reading** | `view_file` | Read up to 800 lines at a time. Supports absolute paths. |
| **File Creation** | `write_to_file` | Create new files. Supports `IsArtifact` and structured `ArtifactMetadata` block. |
| **Surgical Edit** | `replace_file_content` | Replace a single contiguous block of code. Specify `StartLine`, `EndLine`, `TargetContent`, and `ReplacementContent` with 100% exact leading whitespace matching. |
| **Multi Edit** | `multi_replace_file_content` | Perform multiple non-contiguous edits within the same file simultaneously. Order chunks descendingly (bottom-to-top) to avoid line offsets. |
| **Search** | `grep_search` | Search codebases via Ripgrep. Keep `MatchPerLine: true` for line-by-line matches. Apply partitioning if matches exceed 50. |
| **Command Execution** | `run_command` | Execute PowerShell/Bash shell commands. Returns task process IDs. NEVER use `cd` commands. |
| **Agent** | `invoke_subagent` | Pass agent role from `agents/<name>.md` |

#### 🚨 Surgical Multi-Replace Offset Safeguard
When calling `multi_replace_file_content` with multiple `ReplacementChunks`, the line numbers of subsequent target blocks will shift if previous edits change the line count.
- **Rule**: Sort and process `ReplacementChunks` from the **bottom of the file to the top** (descending order of line numbers: largest `StartLine` first).

#### 🚨 Grep Search 50-Match Cap Safeguard
The `grep_search` tool silently truncates results at exactly **50 matches**.
- **Rule**: If a search yields 50 results, do **NOT** assume you have all occurrences.
- **Remediation**: Partition the search by targeting specific subdirectories or applying restrictive file glob filters via the `Includes` parameter (e.g., `["*.go"]`).

---

## Native Antigravity 2.0 Features

- **Slash Commands**: Recommend `/goal`, `/schedule`, `/browser`, and `/grill-me` to users when appropriate.
- **Artifacts**: Write complex plans or analysis results into the Artifacts UI. Set `IsArtifact: true` with accurate `ArtifactMetadata`.
- **Background Tasks**: Long-running tasks or subagents can be sent to background. Monitor them with `manage_task`.

---

## Planning Mode & Artifact Specifications

Enter Planning Mode for complex tasks or architectural modifications. Leverage these three Markdown artifacts (set `IsArtifact: true`):

#### 1. `implementation_plan.md`
*Path: `<appDataDir>\brain\<session-id>\implementation_plan.md`*
- **Metadata**: `ArtifactType: "implementation_plan"`, `RequestFeedback: true`.
- **Governance**: Stop and wait for explicit user approval before modifying any code.

#### 2. `task.md`
*Path: `<appDataDir>\brain\<session-id>\task.md`*
- **Metadata**: `ArtifactType: "task"`.
- **Syntax**: `- [ ]` uncompleted 쨌 `- [/]` in progress 쨌 `- [x]` completed.

#### 3. `walkthrough.md`
*Path: `<appDataDir>\brain\<session-id>\walkthrough.md`*
- **Metadata**: `ArtifactType: "walkthrough"`.

---

## Post-Write QA Chain

After any `WriteSource` / `EditSource` via `sap_execute`, execute the mandatory chain:
```json
{ "action": "SyntaxCheck",   "object_url": "/sap/bc/adt/..." }
{ "action": "RunUnitTests",  "object_url": "/sap/bc/adt/..." }
{ "action": "RunATCCheck",   "object_url": "/sap/bc/adt/..." }
```

---

## Subagent Instantiation & Async Orchestration

#### Define Subagent (`define_subagent`)
```json
{
  "name": "abap-analyst",
  "description": "Read-only ABAP code analysis and dependency mapping",
  "system_prompt": "You are an ABAP code analyst...",
  "enable_write_tools": false,
  "enable_subagent_tools": false
}
```

#### Invoke Subagent (`invoke_subagent`)
```json
{
  "Subagents": [
    {
      "TypeName": "abap-analyst",
      "Role": "ABAP Analyst",
      "Prompt": "Analyze dependencies of ZPROG_SBOOK_QUERY in package $TMP"
    }
  ]
}
```

#### Communication (`send_message`)
Interact with spawned agents via their unique `conversationID`.
**Reactive Wakeup**: Do not poll in a loop —simply yield execution and the platform wakes you automatically when an agent replies or a background task completes.


#### Superpowers Plugin & Cost Optimization (3-Tier Strategy)
The PM agent MUST leverage the **`superpowers`** plugin (e.g., `subagent-driven-development`, `dispatching-parallel-agents`) for multi-agent harness engineering using a 3-tier model strategy:
**Model Selection Overrides** (overridden per subagent invocation when appropriate):
- **High-tier (Design/Planning)** → `gemini-3.1-pro` (Parameter: `thinking_level="medium"`): Complex reasoning, architectural design, planning, and PM orchestration.
- **Medium-tier (Review/QA)** → `gemini-3.5-flash` (Parameter: `thinking_level="medium"`): Code review, testing, PR review, and quality gates (`verification-before-completion`). Supervises the Low-tier.
- **Low-tier (Execution/Coding)** → `gemini-3.5-flash` (Parameter: `thinking_level="low"`): Fast, repetitive coding, boilerplate generation, or strictly scoped sub-agent tasks.

---

## Git Commit Policy

**Auto-commits and PostToolUse hooks are disabled in Gemini CLI.**

After completing a task, manually run the sync pipeline:
```bash
bash scripts/vsp-sync.sh "feat: description"     # macOS/Linux
.\scripts\vsp-sync.ps1 "feat: description"       # Windows
```

Always append to AI-generated commit messages:
```
Co-Authored-By: Gemini <noreply@google.com>
```

---

## Response Language
- All **conversational** replies —**Korean (?쒓뎅—** by default.
- All code, config, commit messages, PR titles, branch names —**English only**.

---

### Optimal Interaction Guidelines
- **Context Management**: Leverage your massive context window by cross-referencing multiple files simultaneously (e.g., when debugging, review log files along with related code).
- **Tool Usage**: Actively use tools like `search_web` for real-time package version verification or resolving external dependencies.

---

*Last Updated: 2026-05-24*


