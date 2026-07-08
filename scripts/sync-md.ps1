param(
    [string]$Date    = (Get-Date -Format "yyyy-MM-dd"),
    [string]$Summary = "update"
)

# UTF-8 encoding enforcement
$OutputEncoding = [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
$ErrorActionPreference = 'Stop'

$MemFile = "memory\MEMORY.md"
if (-not (Test-Path $MemFile)) {
    @"
# Memory Index

| Date | Summary |
|------|---------|
"@ | Set-Content $MemFile -Encoding UTF8
}
# If date already exists, update the summary (idempotent — safe for hook + dev-sync)
$IndexContent = Get-Content $MemFile -Raw -Encoding UTF8
if ($IndexContent -match [regex]::Escape("[$Date]")) {
    $EscapedSummary = [regex]::Escape($Summary)
    $IndexContent = $IndexContent -replace "\| \[$Date\]\($Date\.md\) \|[^|]*\|", "| [$Date]($Date.md) | $Summary |"
    Set-Content $MemFile $IndexContent -Encoding UTF8
} else {
    Add-Content $MemFile "| [$Date]($Date.md) | $Summary |" -Encoding UTF8
}
