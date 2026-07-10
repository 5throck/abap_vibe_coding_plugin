---
name: meeting-facilitation
status: active
scope: common
description: >
  Facilitates structured multi-agent meetings using the /meeting command for collaborative
  decision-making and problem resolution. Use when: running agent meetings, coordinating
  multi-agent discussions, or facilitating collaborative problem-solving sessions.
owner: pm
version: 1.4.0
last_reviewed: 2026-07-08
metadata:
  type: process
  triggers:
    - meeting
    - agent discussion
    - collaborative decision
    - multi-agent coordination
    - facilitate meeting
---

## Meeting Facilitation

Structured multi-agent meeting orchestration for collaborative decision-making and problem resolution.

### Execution

```bash
/meeting "meeting topic" --agents agent1,agent2 --rounds 2 --language ko --dialogue
```

**Parameters**:
- **Topic** (required): Clear meeting agenda
- **Participants** (optional): Agent names, or empty for all
- **Rounds** (optional): 1-3, default 2
- **Language** (optional): `ko` (default) or `en`
- **Mode** (optional): `--dialogue` for full transparency, default silent

### Meeting Process

#### Step 1: Setup

Detect available agents from `agents/*.md`. Filter to `--agents` list if specified. Validate at least one agent exists.

#### Step 2: Open Meeting

```
---------------------------------------- MEETING STARTED
Topic   : [topic]
Present : [agents]
Rounds  : [N]
Mode    : [Silent | Dialogue]
----------------------------------------
```

#### Step 3: Discussion Rounds

- PM acts as facilitator only — does NOT contribute opinions
- Each agent adopts persona and contributes 2-3 paragraphs per turn
- Must reference prior speakers by name and their specific points
- Agree, build on, or respectfully challenge — like real conversation
- End with concrete proposal or question to a named colleague
- Stop early if consensus reached (max 3 rounds)

#### Step 4: Synthesis

Cross-domain agent summarizes:
1. **Points of Agreement** (specific)
2. **Open Disagreements or Unresolved Questions**
3. **Action Items** (max 5) — owner + deliverable + tier

**Platform Parity Check (MANDATORY)**: Every action item affecting platform-specific files must have a paired counterpart or explicit platform declaration (`Claude` / `Antigravity` / `Both`).

#### Step 5: Archive Transcript — MANDATORY

Write to `memory/meeting-YYYY-MM-DD-[slug].md` in English, then:

```bash
bun "${CLAUDE_PLUGIN_ROOT:-.}/scripts/sync-md.ts" "YYYY-MM-DD" "[topic]" 2>/dev/null || true
```

#### Step 6: Close Meeting

```
---------------------------------------- MEETING CLOSED
----------------------------------------
Transcript path: memory/meeting-YYYY-MM-DD-[slug].md
```

#### Step 7: Task Conversion (Optional with --tasks)

Convert action items into tracked tasks if `--tasks` flag set.

### Quality Indicators

- Agents stay in character throughout
- Each agent references prior speakers by name
- Discussion converges or identifies clear blockers
- Action items have specific owners and deliverables
