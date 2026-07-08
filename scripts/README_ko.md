# 프로젝트 스크립트 (Project Scripts)

프로젝트 운영을 위한 유틸리티 스크립트입니다. 모든 유틸리티 스크립트는 TypeScript로 구현되며 Bun 런타임을 통해 실행됩니다.

## 사용 가능한 스크립트

### 부트스트랩 스크립트 (셸 전용)

Bun이 설치되기 전에 실행되어야 하므로 셸 스크립트로 유지됩니다:

| 스크립트 | 목적 |
|---------|------|
| `install-bun.sh` / `install-bun.ps1` | Bun 런타임 설치 |
| `install-vsp.sh` / `install-vsp.ps1` | vsp 바이너리 설치 |

### TypeScript (Bun) 스크립트

모든 유틸리티 스크립트는 TypeScript를 Single Source of Truth로 사용합니다:

| 스크립트 | 목적 |
|---------|------|
| `sync-md.ts` | memory/MEMORY.md 인덱스 업데이트 (PostToolUse 훅에서 호출) |
| `audit.ts` | 문서 및 파일 무결성 감사 |
| `dev-sync.ts` | 전체 동기화 파이프라인 (memlog → changelog → audit → commit → PR) |
| `setup.ts` | 초기 프로젝트 설정 (env, 의존성, 첫 커밋) |
| `vsp-task.ts` | 새 태스크 초기화 |
| `vsp-publish.ts` | 플러그인 에셋을 소비자 리포에 게시 |
| `verify-skills.ts` | `skills/` 디렉토리의 모든 스킬이 로드 가능한지 확인 |
| `agent-create.ts` | 새 에이전트 정의 파일 생성 |
| `agent-list.ts` | 메타데이터와 함께 모든 에이전트 나열 |
| `agent-delete.ts` | 에이전트 파일 삭제 |
| `agent-verify.ts` | 에이전트/문서 동기화 확인 |
| `dispatch.ts` | 에이전트 디스패치를 위한 메인 진입점 |
| `dispatch-parallel.ts` | 병렬 에이전트 디스패처 |
| `dispatch-serial.ts` | 종속성이 있는 직렬 에이전트 디스패처 |
| `retry-handler.ts` | 지수 백오프가 포함된 재시도 로직 |

모든 스크립트는 dry-run 검증을 위한 `--check` 플래그를 지원합니다:
```bash
bun scripts/dev-sync.ts --check   # 구문 검사만, git 변경 없음
```

## NPM 스크립트

`package.json`에 정의된 편의 단축키:

```bash
bun run verify-skills     # 스킬 확인
bun run agent:create      # 새 에이전트 생성
bun run agent:list        # 에이전트 목록
bun run agent:delete      # 에이전트 삭제
bun run agent:verify      # 에이전트/문서 동기화 확인
bun run dispatch:parallel # 병렬 디스패치 실행
bun run dispatch:serial   # 직렬 디스패치 실행
```

## 스크립팅 모델

이 프로젝트는 모든 유틸리티 스크립트에 **TypeScript (Bun)을 Single Source of Truth**로 사용합니다:

- **TypeScript (Bun)** - 모든 유틸리티 및 오케스트레이션 스크립트
- **셸 스크립트** - 부트스트랩 전용 (install-bun, install-vsp) — Bun이 존재하기 전에 실행되어야 함

## 파일 인코딩

모든 스크립트는 **UTF-8 (BOM 없음)**으로 저장해야 합니다.

---

*프로젝트 템플릿 - 필요에 따라 사용자 정의하세요*
