## 프로젝트 리뷰 수정 계획

프로젝트 리뷰에서 발견된 22개 이슈 중 P1-P4 (19개)를 3개 배치로 수정합니다.

### Batch A: P1 Critical 핫픽스 (2개 파일)
1. **`.gemini/settings.json`** — `SAP_ALLOWED_PACKAGES` 복구 (`"Z*,,,"` → `"Z*,$TMP,$ZADT_VSP,$VSP_ADT"`) + codegraph 버전 핀 동기화 (`@colbymchenry/codegraph@0.9.7`, `-y` 제거)
2. **`.gemini/skills/sync/SKILL.md`** — bun 명령어 구문 수정 (닫는 따옴표 추가)

### Batch B: P2 플랫폼 파리티 + 스킬 프론트매터 (13개 파일)
3. **`.codex/config.toml`** — codegraph MCP 서버 추가
4-13. **10개 스킬 SKILL.md** — `metadata.type` 및 `triggers` 프론트매터 추가:
   - `abap-dev` (type: domain), `post-write-chain` (type: process), `desktop-app-fallback` (triggers만), `source-command-celebrate` (type: task)
   - `sap-sd`, `sap-co`, `sap-fi`, `sap-le`, `sap-mm`, `sap-pp` (type: domain 각각)
14. **`skills/SKILLS.md`** — 7개 유령 엔트리 (명령어가 스킬로 오등록) 제거
15. **`docs/context.md`** — `workspace standards` 끊어진 참조 5곳 제거 + 스킬 카운트 "11" → "13" 수정

### Batch C: P3-P4 문서 정리 (3개 파일 + 1 디렉토리)
16. **`agents/security-monitor.md`** — `examples` 블록 추가
17. **`scratch/`** — 빈 디렉토리 + `.gitkeep` 생성
18. **`AGENTS.md`** — `Last Updated` 날짜 업데이트
19. **`skills/sync/SKILL.md` + `.agents/skills/sync/SKILL.md`** — `--check` 드라이런 및 graceful degradation 문서화

### 제외 (P5 — 향후 별도 작업)
- Co-Authored-By 하드코딩, CLAUDE_PLUGIN_ROOT 이름, pre/post sync 훅, 15개 Gemini 명령 포팅

### 실행 순서
Batch A → Batch B → Batch C (순차 실행, 배치별 검증)
총 20개 파일 수정, 1개 디렉토리 생성