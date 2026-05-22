# scripts/audit.ps1
# Documentation audit — called by sync-md.ps1 after every Write/Edit.

param()
$failed = $false
Write-Host "--- Documentation Audit ---" -ForegroundColor Cyan

# Paths excluded from all audit checks (temporary/generated files)
$auditExclude = "node_modules|\.git|\.claude|\.gemini|scratch|\\memory\\|docs.superpowers"

# 1. Absolute Path Check
$abs = Get-ChildItem -Path . -Filter *.md -Recurse |
    Where-Object { $_.FullName -notmatch "$auditExclude|setup-guide.md|antigravity-setup.md|plugin-setup.md" } |
    Select-String -Pattern "[A-Z]:\\", "/Users/", "/home/"
if ($abs) {
    Write-Host "  [!] Absolute paths detected!" -ForegroundColor Red
    $failed = $true
}

# 2. Link Integrity & Path Style Check
$docFiles = Get-ChildItem -Path . -Filter *.md -Recurse |
    Where-Object { $_.FullName -notmatch $auditExclude }
foreach ($f in $docFiles) {
    $txt = Get-Content $f.FullName -Raw
    if ($null -eq $txt) { continue }

    if ($txt -match "\[.*?\]\(.*?\\.*?\)") {
        Write-Host "  [!] Cross-Platform: Backslash found in link in $($f.Name). Use forward slashes (/) for compatibility." -ForegroundColor Yellow
        $failed = $true
    }

    $ms = [regex]::Matches($txt, "\[.*?\]\(([^#\)\s]+)\)")
    foreach ($m in $ms) {
        $l = $m.Groups[1].Value
        if ($l -match "^http" -or $l -match "^mailto:" -or $l -match "^#" -or $l -match "YYYY-MM-DD" -or $l -match "^\.\./\.\.") { continue }
        $dl = $l.Replace("%20", " ")
        $tp = Join-Path -Path (Split-Path -Path $f.FullName) -ChildPath $dl
        if (-not (Test-Path $tp)) {
            Write-Host "  [!] Broken link in $($f.Name): $l" -ForegroundColor Red
            $failed = $true
        }
    }
}

# 3. Script Pairing Check
$scripts = Get-ChildItem -Path "scripts\*" -Include *.ps1, *.sh
$scriptBasenames = $scripts | ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_.Name) } | Select-Object -Unique
foreach ($base in $scriptBasenames) {
    $ps1 = Join-Path "scripts" "$base.ps1"
    $sh  = Join-Path "scripts" "$base.sh"
    if (-not (Test-Path $ps1) -or -not (Test-Path $sh)) {
        Write-Host "  [!] Cross-Platform: Missing script pair for '$base' (Need both .ps1 and .sh)" -ForegroundColor Red
        $failed = $true
    }
}

# 4. Redundancy Check
if ((Test-Path "CLAUDE.md") -and (Test-Path "GEMINI.md")) {
    $c = Get-Content "CLAUDE.md" -Raw
    $g = Get-Content "GEMINI.md" -Raw
    if ($c -eq $g) {
        Write-Host "  [!] Redundancy: CLAUDE.md and GEMINI.md are identical." -ForegroundColor Yellow
    }
}

# 5. MCP Config Prefix Consistency Check
foreach ($cfg in @(".mcp.json")) {
    if (Test-Path $cfg) {
        $content = Get-Content $cfg -Raw
        if ($content -match "VSP_MODE|VSP_ALLOWED_PACKAGES|VSP_FEATURE_") {
            Write-Host "  [!] Prefix inconsistency in ${cfg}: found VSP_* env vars — use SAP_* prefix instead." -ForegroundColor Red
            $failed = $true
        }
    }
}

if ($failed) {
    Write-Host "`nAudit FAILED." -ForegroundColor Red
    exit 1
}

Write-Host "`nAudit PASSED." -ForegroundColor Green
exit 0
