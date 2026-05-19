# abap-harness-engineering

[![라이선스: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)

SAP ABAP 개발을 위한 완전한 **AI 하네스 엔지니어링** 프레임워크를 제공하는 Claude Code 플러그인입니다. 15개의 전문 에이전트, 8개의 스킬, 7개의 커맨드, 그리고 `vsp` 서버를 통한 MCP 연동을 포함합니다.

> **하네스 엔지니어링이란?**
> 전문화된 AI 에이전트들이 구조화된 환경 안에서 협업하는 방법론으로, AI 기반 SAP 개발을 예측 가능하고 거버넌스가 적용된 방식으로 수행할 수 있게 합니다. PM 주도의 거버넌스 모델은 실제 소프트웨어 엔지니어링 팀을 모방합니다. 비즈니스 애널리스트가 요구사항을 정의하고, 아키텍트가 설계하며, 개발자가 구현하고, QA가 검증합니다. [참조 구현체 →](#참조-구현체-abap_vibe_coding)

---

## 주요 기능

- **15개 에이전트**: 기술 아키텍트, 코드 작성자, Fiori 개발자, 폼 전문가, GUI 스크립터, 비즈니스 애널리스트(SD/MM/FI/CO/PP/LE), QA 실행자, 스키마 검사자, SAP 조사자
- **8개 스킬**: ABAP 개발 워크플로우, Post-Write 품질 게이트, SAP ERP 모듈 지식 베이스 6종(SD, MM, FI, CO, PP, LE)
- **7개 커맨드**: `/triage`, `/transport`, `/post-write`, `/sync`, `/new-task`, `/memlog`, `/celebrate`
- **MCP 연동**: `vsp` 서버를 통한 하이퍼포커스 모드의 SAP ADT 전체 접근

---

## 사전 요구사항

- Claude Code CLI 또는 Desktop App
- ADT(ABAP Development Tools) 접근이 가능한 SAP 시스템
- `vsp` 바이너리 (아래 설치 방법 참고)

---

## 설치

### 1. vsp 바이너리 설치

**Unix/macOS:**
```bash
bash scripts/install-vsp.sh
```

**Windows:**
```powershell
.\scripts\install-vsp.ps1
```

특정 버전을 설치하려면 태그를 지정합니다:
```bash
bash scripts/install-vsp.sh v2.38.1        # Unix/macOS
.\scripts\install-vsp.ps1 -Version v2.38.1 # Windows
```

### 2. SAP 연결 설정

`.mcp.json.sample`을 `.mcp.json`으로, `.env.sample`을 `.env`로 복사한 뒤 SAP 연결 정보를 입력합니다:
```bash
export SAP_URL=https://your-sap-host:8080
export SAP_USER=your-username
export SAP_PASSWORD=your-password
export SAP_CLIENT=100
```

또는 쉘 프로파일이나 Claude Code 환경 변수로 설정하세요.

### 3. 플러그인 설치

**로컬 테스트:**
```bash
cc --plugin-dir /path/to/abap-harness-engineering
```

**마켓플레이스에서 설치:** Claude Code 설정 → 플러그인 → "abap-harness-engineering" 검색

---

## 사용법

### 빠른 시작 — 태스크 트리아지

```
/triage Fix the SD billing report for customer 1000
```

실행 결과:
1. SD 모듈을 자동 감지
2. `scratch/`에 태스크 파일 생성
3. 3개의 읽기 전용 에이전트를 위한 병렬 디스패치 블록 생성

### 트랜스포트 관리

```
/transport list
/transport create feat: add ZCL_MY_CLASS
/transport add NPL_K000001 /sap/bc/adt/programs/programs/ZPROG_EXAMPLE
/transport release NPL_K000001
```

### 품질 게이트

```
/post-write ZCL_MY_CLASS
```

### Git 동기화

```
/sync feat: implement SD billing fix
```

---

## 아키텍처

### 하네스 엔지니어링 워크플로우

```
Phase 1 (병렬): sap-investigator + read-only-analyst + schema-inspector
        ↓
Phase 2 (직렬): architect → code-writer
        ↓
Phase 3 (직렬): test-runner
        ↓
Phase 4:        /post-write → /transport release → /sync
```

### 에이전트 역할

| 에이전트 | 단계 | 병렬 실행 |
|---------|------|:---------:|
| sap-investigator | 1 | ✅ |
| read-only-analyst | 1 | ✅ |
| schema-inspector | 1 | ✅ |
| sd/mm/fi/co/pp/le-analyst | 1 | ✅ |
| architect | 2 | ❌ |
| code-writer | 2 | ❌ |
| fiori-developer | 2 | ❌ (쓰기 작업) |
| form-expert | 2 | ❌ (쓰기 작업) |
| gui-scripter | 2 | ❌ |
| test-runner | 3 | ❌ |

---

## MCP 설정

플러그인은 `vsp` MCP 서버를 자동으로 구성합니다. 서버는 `hyperfocused` 모드로 실행되며 `Z*`, `$TMP`, `$ZADT_VSP`, `$VSP_ADT` 패키지에 접근할 수 있습니다.

지원 기능:
- `VSP_FEATURE_ABAPGIT=on` — abapGit 연동
- `VSP_FEATURE_TRANSPORT=on` — CTS 트랜스포트 관리
- `VSP_FEATURE_UI5=on` — Fiori/UI5 지원
- `VSP_FEATURE_RAP=on` — ABAP RESTful Application Programming

`vsp` 서버 외에 두 개의 문서 MCP 서버도 등록됩니다:
- `abap-docs` — [mcp-abap.marianzeis.de](https://mcp-abap.marianzeis.de)를 통한 ABAP 언어 레퍼런스 및 오브젝트 검색
- `sap-docs` — [mcp-sap-docs.marianzeis.de](https://mcp-sap-docs.marianzeis.de)를 통한 SAP Help Portal 검색

---

## 훅(Hooks)

Write/Edit 툴 호출 이후 `PostToolUse` 훅이 실행되어 `scripts/sync-md.sh`로 문서 감사를 수행합니다.

> **참고**: Claude Code Desktop App에서는 훅이 실행되지 않습니다. Desktop 세션에서 ABAP 쓰기 작업 후에는 `/post-write`를 수동으로 실행하세요.

---

## 참조 구현체: abap_vibe_coding

이 플러그인은 **[5throck/abap_vibe_coding](https://github.com/5throck/abap_vibe_coding)** 프로젝트를 패키징하여 배포 가능한 형태로 만든 것입니다. 해당 프로젝트는 실제 SAP ABAP 개발에 사용되는 완전히 운영 중인 하네스 엔지니어링 환경입니다.

참조 프로젝트는 이 플러그인에 포함되지 않은 추가 컨텍스트를 제공합니다:

| 문서 | 설명 |
|------|------|
| [AGENTS.md](https://github.com/5throck/abap_vibe_coding/blob/main/AGENTS.md) | 전체 에이전트 역할 정의, 핸드오프 프로토콜, 거버넌스 모델 |
| [docs/context.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/context.md) | 공유 프로젝트 컨텍스트: 코드베이스 맵, 빌드 커맨드, ABAP 개발 규칙 |
| [docs/setup-guide.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/setup-guide.md) | 단계별 환경 구성 가이드 (MCP, SAP ADT, abapGit, AI 에이전트) |
| [docs/task-template.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/task-template.md) | 전체 태스크 핸드오프 템플릿 (§0 트리아지 → §5 최종화) |
| [docs/testing-guidelines.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/testing-guidelines.md) | ABAP 단위 테스트 표준 및 ATC 우선순위 기준 |
| [docs/prd-template.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/prd-template.md) | 비즈니스 분석을 위한 PRD / 인수 조건 템플릿 |
| [docs/security.md](https://github.com/5throck/abap_vibe_coding/blob/main/docs/security.md) | 추적 문서 보안 정책 및 pre-commit 스캔 규칙 |
| [memory/MEMORY.md](https://github.com/5throck/abap_vibe_coding/blob/main/memory/MEMORY.md) | 개발 이력 및 아키텍처 결정 사항 인덱스 |

> 참조 프로젝트는 이 플러그인과 동일한 에이전트, 스킬, 커맨드를 포함하며, 실제 개발 작업의 스크래치 파일, 메모리 로그, 세션 이력도 함께 포함합니다.

---

## 라이선스

AGPL v3 — 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.

---

*Last Updated: 2026-05-19*
