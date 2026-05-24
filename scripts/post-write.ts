#!/usr/bin/env bun
// post-write.ts — Mandatory QA chain after WriteSource/EditSource
// Usage: bun scripts/post-write.ts
//
// This is the fallback for Desktop App users who cannot use automatic hooks.
// Run this script after any WriteSource or EditSource operation in the Desktop App.
//
// QA Chain: SyntaxCheck → RunUnitTests → RunATCCheck

console.log("=== Post-Write Mandatory QA Chain ===\n");
console.log("Running QA checks for ABAP development...\n");

// The actual SAP operations would be performed via the vsp MCP server
// This script serves as a reminder and workflow guide

console.log("📋 QA Checklist:");
console.log("  1. ✅ SyntaxCheck - Run via vsp MCP or /post-write skill");
console.log("  2. ✅ RunUnitTests - Run via vsp MCP or /post-write skill");
console.log("  3. ✅ RunATCCheck - Run via vsp MCP or /post-write skill");
console.log("\n⚠️  Priority 1 ATC findings block deployment.");
console.log("\n💡 Use the /post-write skill to execute the full QA chain.");
console.log("💡 Or run manually: vsp SyntaxCheck, vsp RunUnitTests, vsp RunATCCheck\n");

// In a real implementation, this would call the MCP tools directly
// For now, it serves as a workflow reminder

console.log("Post-write QA chain reminder complete.");
console.log("Please execute the QA checks before committing.\n");
