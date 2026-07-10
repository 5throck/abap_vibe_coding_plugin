# Parent Sync Design — 2026-07-11

**Type**: Content sync / backport (not a new feature). Pulls forward content that
the parent workspace (`C:\git\ai_workspace\Projects\abap_vibe_coding`) has moved
ahead on, into this plugin project, adapted to plugin structure.

## Scope Summary

The parent workspace is the actively-developed source; this plugin project
periodically distills a subset of it for distribution. This sync closes the
content gap for skills, agent role docs, shared docs, governance files, and
deliverable templates — **not** for plugin packaging files, infra config, or
project-specific journals (see Exclude list).

All INCLUDE items below were verified by diff against the parent repo on
2026-07-11; every file listed differs (or is missing) as described. One
scope correction was found during verification — see "Verification findings"
at the end.

Rule for all content merges: **do not blind-overwrite**. Where the plugin
file has plugin-specific framing (e.g. "plugin" vs "workspace" terminology,
different install/path references), preserve that framing and merge in the
parent's *new* guidance/content only.

## Include Table

| Source path (parent) | Dest path(s) (plugin) | Adaptation note |
|---|---|---|
| `skills/dump-monitor/`, `skills/performance-tuning/` | same relative path in plugin's `skills/`, `.claude/skills/`, `.agents/skills/`, `.gemini/skills/` (2 skills × 4 mirrors = 8 new dirs) | New dirs, not present in plugin at all. Copy `SKILL.md` (single-file skills, no subresources) from each parent mirror to the matching plugin mirror. Adapt any workspace-only tool/path references (e.g. parent-repo-relative paths) to plugin conventions. |
| `skills/meeting-facilitation/SKILL.md`, `skills/project-review/SKILL.md`, `skills/sync/SKILL.md` | same path in plugin | Content differs — merge parent's new guidance forward, preserve plugin-specific wording. |
| `.claude/skills/meeting/SKILL.md`, `.claude/skills/sync/SKILL.md` | same path in plugin | Content differs — merge. |
| `.claude/skills/meeting-facilitation/`, `.claude/skills/project-review/` | same path in plugin | **Directory does not exist in plugin** (plugin's `.claude/skills/` only has `meeting` and `sync`). Treat as a copy+adapt, not a diff-merge — there is no existing plugin content to preserve. |
| `.agents/skills/meeting/SKILL.md`, `.agents/skills/meeting-facilitation/SKILL.md`, `.agents/skills/project-review/SKILL.md`, `.agents/skills/sync/SKILL.md` | same path in plugin | All 4 dirs exist in plugin already — content differs, merge. |
| `.gemini/skills/meeting/SKILL.md`, `.gemini/skills/sync/SKILL.md` | same path in plugin | Content differs — merge. |
| `.gemini/skills/meeting-facilitation/`, `.gemini/skills/project-review/` | same path in plugin | **Directory does not exist in plugin** (plugin's `.gemini/skills/` only has `meeting` and `sync`, same gap as `.claude/skills/`). Copy+adapt, not diff-merge. |
| `agents/dba.md`, `agents/devops-admin.md`, `agents/pm.md`, `agents/security-monitor.md`, `agents/test-runner.md` | same path in plugin | Content differs — merge, preserve any plugin-specific role framing. |
| `docs/abap-dev-rules.md`, `docs/antigravity-setup.md`, `docs/co-abap.context.md`, `docs/context.md`, `docs/dispatch-parallel.md`, `docs/dispatch-serial.md`, `docs/setup-guide.md`, `docs/task-template.md`, `docs/testing-guidelines.md`, `docs/tooling-matrix.md` | same path in plugin | Content differs — merge, preserve plugin-installation framing where the doc mixes shared + plugin-specific content. |
| `AGENTS.md`, `SECURITY.md` (root) | same path in plugin | Content differs — merge governance/security content. |
| `deliverables/templates/01_srs.md`, `02_technical_design.md`, `03_implementation_report.md`, `04_qa_report.md`, `api_implementation_report.md`, `api_technical_design.md`, `fiori_implementation_report.md`, `fiori_technical_design.md`, `forms_implementation_report.md`, `forms_technical_design.md` | same path in plugin | Content differs — merge. |
| `deliverables/templates/abap_technical_design.md` | same path in plugin | **Missing in plugin.** Copy as new file (132 lines in parent, no adaptation expected beyond a scan for parent-only references). |
| `.claude/commands/abap-dev.md`, `celebrate.md`, `meeting.md`, `memlog.md`, `new-task.md`, `post-write.md`, `project-review.md`, `security-check.md`, `sync.md`, `transport.md`, `triage.md` | same path in plugin | Content differs — merge. This is the workspace's own dev-session command set; do **not** confuse with the plugin-packaged top-level `commands/` dir (excluded, untouched). |
| `.gemini/commands/meeting.md`, `project-review.md`, `sync.md` | same path in plugin | Content differs — merge. |
| `.gemini/commands/security-check.md` | same path in plugin | **Missing in plugin.** Copy as new file. |

## Exclude List

| Path | Reason |
|---|---|
| `memory/` | Per-project session history/journal — not shared content. |
| `.zcode/plans`, `scratch/qa-reports`, `scratch/stable` | Working/scratch artifacts, not durable content. |
| `docs/superpowers/plans/*`, `docs/superpowers/specs/2026-07-09-project-review-remediation-design.md` | Parent's own in-flight design docs for its own feature work. |
| `CHANGELOG.md` | Each project maintains its own release history. |
| `CLAUDE.md`, `README.md`, `README_ko.md`, `GEMINI.md`, `PR_BODY.md` | Intentionally different install/usage framing (plugin vs. workspace). |
| `package.json`, `bun.lock` | Plugin has a deliberately smaller dependency set. |
| `.mcp.json`, `.claude-plugin/plugin.json`, `commands/` (top-level), `config/` | These ARE the plugin packaging; parent has no equivalent. |
| `.env.sample`, `.gitignore`, `.gitleaks.toml`, `.githooks/*`, `.github/workflows/*`, `.codex/*`, `.gemini/settings.json`, `.claude/settings.json`, `.claude/settings.local.json` | Infra config tuned per-repo; do not blind-copy. |
| `docs/plugin-setup.md` | Plugin-only doc, no parent equivalent. |

## Execution Order

Downstream agents should pick up rows in this order (each row is an independent
task except where noted):

1. **skills-new** — Add `dump-monitor` and `performance-tuning` to all 4 skill
   mirrors (`skills/`, `.claude/skills/`, `.agents/skills/`, `.gemini/skills/`).
   8 new directories total.
2. **skills-content** — Merge content for `meeting`, `meeting-facilitation`,
   `project-review`, `sync` across all applicable mirrors per the Include
   table above. Note the two directory-creation exceptions (`.claude/skills/`
   and `.gemini/skills/` lack `meeting-facilitation` and `project-review`
   entirely).
3. **agents** — Merge the 5 listed `agents/*.md` files, plus root `AGENTS.md`
   and `SECURITY.md`.
4. **docs** — Merge the 10 listed `docs/*.md` files.
5. **templates** — Merge the 10 differing `deliverables/templates/*.md` files
   and add the missing `abap_technical_design.md`.
6. **commands** — Merge `.claude/commands/*.md` (11 files) and
   `.gemini/commands/*.md` (3 differing + 1 missing file). Do not touch the
   top-level `commands/` directory.

Each task should conclude with a diff review against the Include table
entries it covers, confirming no plugin-specific framing was clobbered.

## Verification Findings (scope corrections)

- All files/dirs listed under INCLUDE were confirmed to differ or be missing
  exactly as described — no listed item turned out to be identical.
- **Scope correction**: the original scope assumed `meeting-facilitation` and
  `project-review` have "existing dirs in both projects" across all 4 skill
  mirrors. This holds for `skills/` and `.agents/skills/`, but **not** for
  `.claude/skills/` and `.gemini/skills/`, where the plugin currently only
  mirrors `meeting` and `sync` — `meeting-facilitation` and `project-review`
  are entirely absent there. These two are effectively "new directory" copies
  in those two mirrors, not diff-merges. Reflected in the Include table above.
- **Broader observation (not added to scope)**: the plugin's `.claude/skills/`
  and `.gemini/skills/` mirrors are missing several other skills the parent
  mirrors have (`abap-dev`, `desktop-app-fallback`, `post-write-chain`,
  `sap-co/fi/le/mm/pp/sd`, `source-command-celebrate`, plus `dump-monitor`/
  `performance-tuning` already in scope). This sync does not address that
  broader mirror-parity gap since it wasn't part of the requested scope;
  flagging for a possible follow-up mirror-parity audit.
