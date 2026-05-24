#!/usr/bin/env bun
// vsp-audit.ts — Wrapper for audit.ts (for compatibility with existing workflows)
// Usage: bun scripts/vsp-audit.ts

// Forward to audit.ts
const scriptDir = import.meta.dir;
await import(`${scriptDir}/audit.ts`);
