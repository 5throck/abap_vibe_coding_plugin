# abap-harness-engineering

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](./LICENSE)
[![Claude Code Plugin](https://img.shields.io/badge/Claude_Code-Plugin-blue)](https://claude.com/claude-code)
[![MCP Compatible](https://img.shields.io/badge/MCP-Compatible-green)](https://modelcontextprotocol.io)

SAP ABAP 개발을 위한 완전한 **AI 하네스 엔지니어링** 프레임워크를 제공하는 Claude Code 플러그인입니다. 20개의 전문 에이전트, 9개의 스킬, 7개의 커맨드, 그리고 `vsp` 서버를 통한 MCP 연동을 포함합니다.

> **하네스 엔지니어링이란?**
> 전문화된 AI 에이전트들이 구조화된 환경 안에서 협업하는 방법론으로, AI 기반 SAP 개발을 예측 가능하고 거버넌스가 적용된 방식으로 수행할 수 있게 합니다. PM 주도의 거버넌스 모델은 실제 소프트웨어 엔지니어링 팀을 모방합니다. 비즈니스 애널리스트가 요구사항을 정의하고, 아키텍트가 설계하며, 개발자가 구현하고, QA가 검증합니다. [참조 구현체 참조](https://github.com/5throck/abap_vibe_coding).

---

## 주요 기능

- **20개 에이전트**: 글로벌 PM, 기술 아키텍트, 코드 작성자, DBA, 인터페이스 전문가, DevOps/Admin, Fiori 개발자, 폼 전문가, GUI 스크립터, 보안 모니터, 비즈니스 애널리스트(SD/MM/FI/CO/PP/LE), QA 실행자, 스키마 검사자, SAP 조사자, 읽기 전용 애널리스트
- **9개 스킬**: ABAP 개발 워크플로우, Post-Write 품질 게이트, Desktop App 폴백, SAP ERP 모듈 지식 베이스 6종(SD, MM, FI, CO, PP, LE)
- **7개 커맨드**: `/triage`, `/transport`, `/post-write`, `/sync`, `/new-task`, `/memlog`, `/celebrate`
- **MCP 연동**: `vsp` 서버를 통한 하이퍼포커스 모드의 SAP ADT 전체 접근
- **Bun 스크립트**: 교차 플랫폼 TypeScript 스크립트 (시작 시간 ~50ms, 단일 소스 유지보수)

---

## 사전 요구사항

- Claude Code CLI 또는 Desktop App
- ADT(ABAP Development Tools) 접근이 가능한 SAP 시스템
- `vsp` 바이너리 (아래 설치 방법 참고)

---

## 설치

플러그인 설치, 연동 훅 등록, 그리고 첫 소비자 프로젝트 연결에 대한 상세한 가이드는 다음 문서를 참고하세요:

* **[docs/plugin-setup.md](./docs/plugin-setup.md)**

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

**[config/README.md](./config/README.md)**를 참고하여 상세한 설정 방법을 확인하세요.

빠른 설정:
```bash
cp config/env.sample .env
cp config/mcp.json.sample .mcp.json
```

`.env`를 편집하여 SAP 연결 정보를 입력합니다:
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
# 로컬에서 플러그인을 테스트하려면 CLAUDE_PLUGIN_ROOT 환경 변수를 설정합니다
export CLAUDE_PLUGIN_ROOT=/path/to/abap-harness-engineering
# 그런 다음 소비자 프로젝트 디렉토리에서 Claude Code CLI를 실행합니다
```

**마켓플레이스에서 설치:**
1. Claude Code를 열고 **설정(Settings) → 플러그인(Plugins) → 찾아보기(Browse)**로 이동
2. **"abap-harness-engineering"**을 검색
3. **설치(Install) → 활성화(Enable)** 클릭
4. 프롬프트가 표시되면 SAP 자격증명 입력

### 플러그인 모드 vs 독립형 모드

| 기능 | 플러그인 모드 | 독립형 모드 |
|---------|-------------|:---------------:|
| SAP 자격증명 | UI 프롬프트 (userConfig) | .env 파일 |
| 문서 | 내장됨 | 외부 docs/ |
| 훅 | 자동 등록됨 | 수동 설정 필요 |
| 업데이트 | 마켓플레이스 통해 | 수동 git pull |

---

## 사용법

### 빠른 시작 - 태스크 트리아지

```
/triage Fix the SD billing report for customer 1000
```

실행 결과:
1. SD 모듈 자동 감지
2. `scratch/tasks/`에 태스크 파일 생성
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
        |
Phase 2 (직렬):   architect -> code-writer
        |
Phase 3 (직렬):   test-runner
        |
Phase 4:            /post-write -> /transport release -> /sync
```

### 에이전트 역할

| 에이전트 | 단계 | 병렬 실행 |
|---------|------|:---------:|
| pm | 1 | 직렬 |
| sap-investigator | 1 | 병렬 |
| read-only-analyst | 1 | 병렬 |
| schema-inspector | 1 | 병렬 |
| security-monitor | 1 | 병렬 |
| sd/mm/fi/co/pp/le-analyst | 1 | 병렬 |
| architect | 2 | 직렬 |
| dba | 2 | 병렬 |
| interface-expert | 2 | 병렬 |
| code-writer | 2 | 직렬 |
| fiori-developer | 2 | 디자인 병렬 / 쓰기 직렬 |
| form-expert | 2 | 디자인 병렬 / 쓰기 직렬 |
| gui-scripter | 2 | 직렬 |
| test-runner | 3 | 쓰기 후 직렬 |
| devops-admin | 4 | 직렬 |

---

## MCP 설정

플러그인은 MCP 구성 자산과 연동을 제공합니다. 소비자 프로젝트는 연결을 초기화하기 위해 루트 디렉토리에 `.mcp.json` 또는 대상 환경 변수가 구성되어 있어야 합니다. 서버는 `hyperfocused` 모드로 실행되며 `Z*`, `$TMP`, `$ZADT_VSP`, `$VSP_ADT` 패키지에 접근할 수 있습니다.

지원 기능:
- `SAP_FEATURE_ABAPGIT=on` - abapGit 연동
- `SAP_FEATURE_TRANSPORT=on` - CTS 트랜스포트 관리
- `SAP_FEATURE_UI5=on` - Fiori/UI5 지원
- `SAP_FEATURE_RAP=on` - ABAP RESTful Application Programming

`vsp` 서버 외에 제공되는 MCP 구성 샘플에는 두 개의 문서 MCP 서버가 포함됩니다:
- `abap-docs` - [mcp-abap.marianzeis.de](https://mcp-abap.marianzeis.de)를 통한 ABAP 언어 레퍼런스 및 오브젝트 검색
- `sap-docs` - [mcp-sap-docs.marianzeis.de](https://mcp-sap-docs.marianzeis.de)를 통한 SAP Help Portal 검색

---

## 훅(Hooks)

Write/Edit 툴 호출 이후 `PostToolUse` 훅이 실행되어 `scripts/sync-md.ts`로 문서 감사를 수행합니다.

> **참고**: Claude Code Desktop App에서는 훅이 실행되지 않습니다. Desktop 세션에서 ABAP 쓰기 작업 후에는 `/post-write`를 수동으로 실행하세요. 또한 자동 훅은 플러그인 런타임에서 로드하는 `CLAUDE_PLUGIN_ROOT` 환경 변수에 의존하므로, 훅 라이프사이클 외부에서 직접 수동 테스트하려면 `bun scripts/sync-md.ts`를 직접 실행하십시오.

---

## TypeScript 스크립트 (Bun)

이 프로젝트는 모든 유틸리티 및 오케스트레이션 스크립트에 **Bun을 통한 TypeScript**를 Single Source of Truth로 사용합니다:

1. **유틸리티 스크립트**: `sync-md.ts`, `audit.ts`, `dev-sync.ts`, `setup.ts`, `vsp-task.ts`, `vsp-publish.ts` — Bun 런타임을 통한 크로스 플랫폼 지원.
2. **에이전트 오케스트레이션**: 다중 에이전트 워크플로우 조정 (`dispatch.ts`, `dispatch-parallel.ts`, `dispatch-serial.ts`).
3. **부트스트랩 스크립트**: `install-bun.sh/.ps1`과 `install-vsp.sh/.ps1`은 Bun 설치 전에 실행되어야 하므로 셸 스크립트로 유지됩니다.

자세한 내용은 `scripts/README.md`를 참조하세요.

### 에이전트 오케스트레이션을 위한 사전 요구사항

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1"
```

**macOS / Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

### 사용법

```bash
# 유틸리티 스크립트 (TypeScript via Bun)
bun scripts/dev-sync.ts "feat: description"
bun scripts/audit.ts
bun scripts/sync-md.ts

# 에이전트 오케스트레이션 스크립트 (Bun 필요)
bun scripts/dispatch.ts parallel
bun scripts/verify-skills.ts
```

---

## 문제 해결

| 문제 | 해결 방법 |
|-------|----------|
| **vsp 명령어를 찾을 수 없음** | `bash scripts/install-vsp.sh` 실행 (Windows에서는 `.ps1`) |
| **훅이 실행되지 않음** | Desktop App 제한 - `/post-write`를 수동으로 사용하세요 |
| **SAP 연결 실패** | `.env` 파일 또는 MCP 서버 구성 확인 |
| **플러그인이 로드되지 않음** | `.claude/settings.local.json`에 `"enableAllProjectMcpServers": true`가 있는지 확인 |
| **에이전트가 응답하지 않음** | 트리거 키워드는 [AGENTS.md](AGENTS.md) 참조 |

---

## 업데이트

Claude Code에서 플러그인 업데이트 확인:
```
설정(Settings) → 플러그인(Plugins) → abap-harness-engineering → 업데이트 확인
```

버전 기록: [CHANGELOG.md](CHANGELOG.md)

---

## 독립형 플러그인 아키텍처

이 플러그인은 **[5throck/abap_vibe_coding](https://github.com/5throck/abap_vibe_coding)** 프로젝트를 패키징하여 배포 가능한 형태로 만든 것입니다.

일반적인 경량 플러그인과 달리, 이 레포지토리는 사용자 환경에서 완벽히 작동하기 위해 **독립형(Standalone)** 아키텍처로 설계되었습니다. 플러그인이 소비자 레포지토리에 설치되면, AI 에이전트(Claude Code, Gemini CLI, Antigravity)는 플러그인 내부의 `docs/`, `agents/`, `skills/` 디렉토리를 참조하여 동일한 성능을 발휘합니다.

플러그인은 다음과 같은 전체 Harness Engineering 문서와 템플릿을 내장하고 있습니다:
- 전체 아키텍처를 정의한 `docs/context.md`
- 모듈별 `task-template.md`, `prd-template.md`
- 코드 테스트 및 보안 가이드라인
- `AGENTS.md` 및 `GEMINI.md` 전체 구성 파일

> 상위 참조 프로젝트(`abap_vibe_coding`)에는 실제 개발 작업에서 발생한 스크래치 파일, 메모리 로그, 세션 기록이 포함되어 있습니다. 본 플러그인은 해당 워크플로우를 어느 SAP 프로젝트에서나 복제할 수 있도록 정제된 거버넌스 구조와 지능만을 패키징한 것입니다.

---

## 커뮤니티

- 🐛 [이슈 신고](https://github.com/5throck/abap_vibe_coding_plugin/issues)
- 💡 [기능 요청](https://github.com/5throck/abap_vibe_coding_plugin/discussions)
- 📖 [기여 가이드](CONTRIBUTING.md)

---

## 관련 문서

- [참조 구현체](https://github.com/5throck/abap_vibe_coding) - 실제 예제가 포함된 상위 프로젝트
- [플러그인 설정 가이드](docs/plugin-setup.md) - 단계별 설치 방법
- [에이전트 역할](AGENTS.md) - 전체 에이전트 카탈로그
- [변경 로그](CHANGELOG.md) - 버전 기록

---

## 라이선스

AGPL v3 - 자세한 내용은 [LICENSE](./LICENSE)를 참조하세요.

---

*최종 업데이트: 2026-07-08*
