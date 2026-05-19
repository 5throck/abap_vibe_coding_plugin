# Task Handoff Template

> **Usage**: Copy this file to `scratch/task-YYYY-MM-DD-NNN.md` at the start of each task.
> Each agent fills in their section, then passes to the next role.
> The PM archives the completed file to `memory/YYYY-MM-DD.md` after git commit.

---

## 0. Request

**Received by (PM)**: <!-- date and time -->
**User Request**:
> <!-- paste original user request verbatim -->

**Classification**: `ABAP Dev` / `Graph Analysis` / `Debug` / `Infra` / `Interface`
**Package**: `$TMP` / <!-- named package -->
**Affected Object Types**: PROG / CLAS / INTF / FUNC / DDLS / TABLE / CDS

**Agents Selected**:
- Business: <!-- SD / LE / PP / MM / FI / CO Analyst -->
- Technical: <!-- Architect / ABAP Developer / DBA / QA / DevOps / Interface Expert -->

---

## 0-A. PM Parallel Dispatch (Phase 1 — Read-Only)

> PM dispatches all read-only subagents **in a single message** (parallel).
> Wait for all 3 results before proceeding to §1 Business Analysis.

```
Agent 1 — sap-investigator
  Task: Scan existing codebase for related objects
  Input: package=$TMP, keywords=["<keyword1>", "<keyword2>"]
  Expected output: matching object list + source snippets

Agent 2 — read-only-analyst
  Task: Query SAP tables for AS-IS data
  Input: module=<SD|MM|FI|...>
  Queries to run:
    - <!-- AS-IS query 1 -->
    - <!-- AS-IS query 2 -->
  Expected output: PRD draft with AS-IS findings and AC candidates

Agent 3 — schema-inspector
  Task: Inspect table structures and CDS dependencies
  Input: tables=["<TABLE1>", "<TABLE2>"], cds_views=["<VIEW1>"]
  Expected output: field lists, key fields, CDS dependency tree
```

**Merge rule**: Collect all 3 outputs → PM synthesizes into §1 and §2.
**Abort condition**: If any subagent returns an error, PM resolves before proceeding.

---

## 1. Business Analysis

**Agent**: <!-- e.g., SD Analyst -->

### AS-IS

<!-- Describe the current state. Include RunQuery / GetTableContents results. -->

```sql
-- query used
```

| Field | Value |
|-------|-------|
| <!-- key finding --> | <!-- result --> |

### GAP

<!-- What is wrong or missing? -->

### TO-BE Requirements

<!-- Describe the desired state in business terms. -->

### Acceptance Criteria

- [ ] **AC-01**: <!-- measurable condition -->
- [ ] **AC-02**: <!-- measurable condition -->
- [ ] **AC-03**: <!-- measurable condition -->

**Handoff to Architect**: <!-- summary of objects affected and key tables -->
**Handoff to DBA**: <!-- table list needing structure review -->

---

## 1-A. Governance Approval

> PM must obtain explicit approval before proceeding to Technical Design.

**Agent**: PM (with Architect input)
**Tools**: `AnalyzeCallGraph`, `GetCDSDependencies`, `GetCDSImpactAnalysis`

### Impact Summary

| Affected Object | Type | Callers | Risk |
|-----------------|------|:-------:|------|
| <!-- name --> | PROG/CLAS/DDLS | <!-- n --> | Low / Medium / High |

### Risk Assessment

- **Scope**: <!-- number of objects affected -->
- **Downtime required**: Yes / No
- **Transport needed**: Yes / No → Transport #: `<!-- NPL KXXXXXX -->`
- **Rollback plan**: <!-- describe or "N/A" -->

### Approval

- [ ] **PM approved** — impact is understood and acceptable
- [ ] **Transport request created**: `<!-- transport number -->` (if required)
- [ ] **Stakeholder notified** (if High risk)

> ⚠️ Do **not** proceed to §2 Technical Design until all boxes above are checked.

---

## 2. Technical Design

**Agent**: Architect
**Tools used**: `AnalyzeCallGraph`, `GetCDSDependencies`, `GrepPackages`

### Impact Analysis

```
-- AnalyzeCallGraph or GrepPackages result
```

| Object | Type | Change Required | Risk |
|--------|------|-----------------|------|
| <!-- name --> | PROG/CLAS/... | Create / Modify / None | Low/Medium/High |

### Implementation Approach

- [ ] EditSource (surgical, <50 lines)
- [ ] WriteSource (full rewrite)
- [ ] ImportFromFile (>2000 lines)

### Execution Plan

**Pattern A — Small edit (single object, <50 lines)**
```
[parallel — dispatch as subagents in one message]
  Agent(sap-investigator): GrepObjects(object_url, "<old_string_pattern>")
  Agent(schema-inspector): GetSource(type, name)

[serial — PM executes directly, do NOT delegate]
  SyntaxCheck(object_url)
  EditSource(object_url, old_string, new_string)
  RunUnitTests(object_url)
  memory log → git commit
```

**Pattern B — New object or full rewrite**
```
[parallel — dispatch as subagents in one message]
  Agent(sap-investigator): GrepPackages(packages, pattern)
  Agent(read-only-analyst): RunQuery(...)
  Agent(schema-inspector): GetTable(table_name) × N

[serial — PM executes directly]
  WriteSource(object_url, source, mode=create|update)
  SyntaxCheck(object_url)
  RunUnitTests(object_url)
  memory log → git commit
```

**Pattern C — Multi-object refactor**
```
[parallel — dispatch as subagents in one message]
  Agent(sap-investigator): GrepPackages(packages, old_pattern)
  Agent(schema-inspector): GetCDSDependencies(ddls_name)

[serial per object — never parallelize writes]
  for each object in impact_list:
    SyntaxCheck → EditSource(replace_all=true) → verify
  RunUnitTests(all affected objects)
  memory log → git commit
```

**Risk level**: `Low` / `Medium` / `High`
**Reason**: <!-- why this risk level -->

**Handoff to ABAP Developer**: <!-- object_url list and change description -->
**Handoff to DBA**: <!-- SQL/CDS changes needed -->

---

## 3. Implementation

**Agent**: ABAP Developer / DBA

### Changes Made

| Object URL | Type | Tool Used | Status |
|------------|------|-----------|--------|
| `/sap/bc/adt/...` | PROG | EditSource | ✅ Done / ❌ Failed |

### Syntax Check Results

```
-- SyntaxCheck output
```

### Unit Test Results

```
-- RunUnitTests output
```

**Handoff to QA Engineer**: <!-- test scenarios based on AC list -->

---

## 4. QA Verification

**Agent**: QA Engineer
**Tools**: `RunUnitTests`, `RunATCCheck`

### 4.1 Unit Test Results

| AC | Test Method | Result |
|----|-------------|--------|
| AC-01 | `test_<!-- method name -->` | ✅ Pass / ❌ Fail |
| AC-02 | `test_<!-- method name -->` | ✅ Pass / ❌ Fail |

```
-- RunUnitTests output (paste raw)
```

### 4.2 ATC Check Results

```
-- RunATCCheck output (paste raw)
```

| Priority | Count | Action |
|----------|-------|--------|
| 1 (Error) | <!-- n → must be 0 --> | Fix before Activate |
| 2 (Warning) | <!-- n --> | PM review |
| 3 (Info) | <!-- n --> | Log only |

**ATC Gate**: [ ] Priority 1 count = 0 ✅

### 4.3 Issues Found

| # | Symptom | Root Cause | Resolution |
|---|---------|------------|------------|
| 1 | <!-- --> | <!-- --> | <!-- --> |

---

## 5. Finalization (PM)

### Memory Log Entry

Append to `memory/YYYY-MM-DD.md`:

```markdown
## <Object Name> (<Object Type>)
- **Package**: <package>
- **ADT URL**: /sap/bc/adt/...
- **Purpose**: <one-line summary>
- **Decisions**: <key technical decisions>
- **Issues**: <symptom → root cause → resolution>
- **MCP/Config changes**: <if any>
```

### Git Commit

```bash
git add -A
git commit -m "<type>: <summary>"
```

**Commit type**: `feat` / `fix` / `refactor` / `docs` / `chore`

### Final Report to User

- Objects changed: <!-- list -->
- AC status: <!-- X/Y passed -->
- ADT URL: <!-- primary object link -->
- Notes: <!-- anything the user should know -->

---
*Template version: 1.1 — 2026-05-05*
