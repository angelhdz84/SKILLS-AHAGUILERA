# install-global.ps1 — Instala Ateje Stack globalmente en OpenCode
$ErrorActionPreference = "Stop"
$REPO = "D:\REPOSITORIOS GitHUB\Ateje"
$SKILLS_DIR = "$env:USERPROFILE\.opencode\skills"
$GLOBAL_CONFIG = "$env:USERPROFILE\.config\opencode\opencode.json"
$ATEJE_SKILLS = @(
    "pipeline-engine", "spec-engine", "design-engine", "validation-engine", "wiki-engine",
    "setup-init", "code-generator", "stack-compliance-guard", "deployment-jigue",
    "ia-jutia", "alpine-ui-patterns", "capacitor", "upgrade-engine"
)

Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "  Ateje Stack - Instalacion Global" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

if (-not (Test-Path $SKILLS_DIR)) {
    New-Item -ItemType Directory -Path $SKILLS_DIR -Force | Out-Null
    Write-Host "  Creado: $SKILLS_DIR" -ForegroundColor Green
}

Write-Host "`n  Creando junctions..." -ForegroundColor Yellow
foreach ($skill in $ATEJE_SKILLS) {
    $target = Join-Path $REPO $skill
    $link = Join-Path $SKILLS_DIR $skill
    if (-not (Test-Path $target)) {
        Write-Host "  NO encontrado: $skill" -ForegroundColor Red
        continue
    }
    if (Test-Path $link) {
        Remove-Item -LiteralPath $link -Force -Recurse -ErrorAction SilentlyContinue
    }
    New-Item -ItemType Junction -Path $link -Target $target -Force | Out-Null
    Write-Host "  Junction: $skill" -ForegroundColor Green
}

Write-Host "`n  Actualizando config global..." -ForegroundColor Yellow
$json = Get-Content -Raw $GLOBAL_CONFIG
if ($json -notmatch [regex]::Escape('~/.opencode/skills/')) {
    $insertAt = $json.IndexOf('"default_agent"')
    $insertAt = $json.IndexOf(',', $insertAt) + 1
    $section = "`n  `"skills`": {`n    `"paths`": [`"~/.opencode/skills/`"]`n  },"
    $json = $json.Substring(0, $insertAt) + $section + $json.Substring($insertAt)
    $json | Set-Content -Path $GLOBAL_CONFIG -Encoding UTF8
    Write-Host "  skills.paths agregado" -ForegroundColor Green
} else {
    Write-Host "  skills.paths ya configurado" -ForegroundColor Yellow
}

Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "  Instalacion completada" -ForegroundColor Green
Write-Host "  13 skills Ateje disponibles globalmente" -ForegroundColor Green
Write-Host "  Usa /new desde cualquier proyecto" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan
