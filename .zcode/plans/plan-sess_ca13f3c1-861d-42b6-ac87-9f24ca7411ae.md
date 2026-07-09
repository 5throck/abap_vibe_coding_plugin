## Plan: project-review에 base-map MCP 통합

### 목적
project-review 스킬 실행 시 `mcp__base-map__review_code`를 사용해 `scripts/` 하위 TypeScript 파일들의 코드 품질을 검사하여 findings에 추가. 단, 모든 사용자가 base-map MCP를 사용할 수 있는 것은 아니므로 **가용성 조건부 실행** 패턴을 적용.

### 변경 대상 파일 (4개)

| # | File | Layer | Action |
|---|------|-------|--------|
| 1 | `skills/project-review/SKILL.md` | L0 | Phase 2에 "Optional: Code Quality Scan (base-map)" 섹션 추가 |
| 2 | `.agents/skills/project-review/SKILL.md` | L2 | L0와 동일하게 동기화 |
| 3 | `.claude/commands/project-review.md` | L1c | Phase 2에 base-map 코드 품질 스캔 단계 추가 |
| 4 | `.gemini/commands/project-review.md` | L1g | Phase 2에 base-map 코드 품질 스캔 단계 추가 |

### 설계: 가용성 조건부 실행 패턴

각 파일의 Phase 2 (Content Integrity) 다음에 새 섹션을 추가:

```markdown
#### Phase 2-A: Code Quality Scan (Optional — base-map MCP)

> **Availability**: This phase requires the `mcp__base-map__review_code` tool.
> If the tool is not available, skip this phase silently — do not report it as a finding.

1. List all `scripts/*.ts` files
2. For each file, call `mcp__base-map__review_code` with the file content
3. Parse findings and classify:
   - Security vulnerabilities → P1
   - Logic errors, race conditions → P2
   - Code style, naming, complexity → P3
   - Suggestions, minor improvements → P4
4. Deduplicate findings already captured in Phase 1-2
5. Add unique findings to the Phase 4 report

**Model**: Use `google/gemma-4-e4b` (default) or first available model from `mcp__base-map__models`.
```

### 핵심 원칙

1. **Silent skip**: base-map이 없으면 에러 없이 건너뜀 (P5 finding으로도 기록하지 않음)
2. **Deduplication**: Phase 1-2에서 이미 잡은 이슈는 중복 추가하지 않음
3. **Model fallback**: `models` API로 가용 모델 확인 후 첫 번째 모델 사용
4. **Finding 재분류**: base-map의 결과를 기존 P1-P5 체계에 매핑