# scripts/sync-md.ps1
# PostToolUse hook wrapper for Windows PowerShell.
# Delegates to audit.ps1 for documentation audit.

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# --- Temporary file skip logic ---
$writtenFile = $env:CLAUDE_FILE_PATHS
if ($writtenFile) {
    $skipPatterns = @("scratch/", "scratch\", "memory/", "memory\",
                      "docs/superpowers/", "docs\superpowers\")
    foreach ($pattern in $skipPatterns) {
        if ($writtenFile -like "*$pattern*") {
            Write-Host "  [skip] Temporary/generated file — audit skipped: $writtenFile"
            exit 0
        }
    }
}

Write-Host "--- Post-Edit Audit Hook ---"

& "$ScriptDir\audit.ps1"
exit $LASTEXITCODE
