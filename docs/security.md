# security.md

Security policy and sanitization rules for the ABAP Harness Engineering plugin.

---

## Committed Files — Never Include

Never commit `.env`, `cookies.txt`, `.mcp.json`, or local agent/MCP config files.

---

## Sanitize Policy for Tracked Docs, Tests, and Examples

The repository must not contain concrete identifiers that tie code or docs to a
live SAP system, a real user, or a customer's ABAP namespace.

**Never in tracked files:**
- Real SAP usernames — use `TESTUSER`
- Real hostnames or IPs — use `dev.example.local`, `prodsys-a.example`
- System aliases that name a live box — use `devsys`, `devsys-adt`, `prodsys-a`
- Live transport numbers (`DEVK[0-9]+`, `R[0-9]{2}K[0-9]+`, `D[0-9]{2}K[0-9]+`) — use `TR-EXAMPLE`
- Live change request IDs — use `CR-EXAMPLE`
- Customer ABAP namespaces from real projects — use synthetic `ZDEMO_*`, `ZCL_DEMO_*`, `ZIF_DEMO_*`
- Customer transport attribute names — use `Z_CR_ATTR`
- Real passwords, API keys, bearer tokens
- Real person names tied to private systems

**Always OK in tracked files:**
- `$ZHIRTEST*`, `ZCL_HIRT*`, `ZCUSTOM_DEVELOPMENT` — pre-agreed synthetic fixtures
- Public GitHub handles already in the Go module path
- Upstream OSS attribution for library authors

**Operational scratch goes under `.local/`** — session notes, live CR dumps, bug
repros with real identifiers. The `.local/` dir must be gitignored.

---

## Pre-Commit Scan

Before every commit that touches docs or test fixtures, scan the staged diff:

```bash
git diff --cached | grep -nE \
  '\b[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\b|' \
  '\b[A-Z][0-9]{2}K[0-9]{6}\b|' \
  '\bDEVK[0-9]{6,}\b'
```

That catches IPv4 literals and SAP transport IDs.

Rule of thumb: "would a stranger reading this file be able to identify the
customer, the system, or a live account?" If yes, redact and move under `.local/`.

---
*Last Updated: 2026-05-19*
