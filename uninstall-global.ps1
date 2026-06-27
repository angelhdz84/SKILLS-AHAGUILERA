# uninstall-global.ps1 — Remueve Ateje Stack del config global de OpenCode
$ErrorActionPreference = "Stop"
$SKILLS_DIR = "$env:USERPROFILE\.opencode\skills"
$GLOBAL_CONFIG = "$env:USERPROFILE\.config\opencode\opencode.json"
$ATEJE_SKILLS = @(
    "pipeline-engine", "spec-engine", "design-engine", "validation-engine", "wiki-engine",
    "setup-init", "code-generator", "stack-compliance-guard", "deployment-jigue",
    "ia-jutia", "alpine-ui-patterns", "capacitor", "upgrade-engine"
)

Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "  Ateje Stack - Desinstalacion Global" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

$removed = 0
foreach ($skill in $ATEJE_SKILLS) {
    $link = Join-Path $SKILLS_DIR $skill
    if (Test-Path $link) {
        Remove-Item -LiteralPath $link -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "  Eliminado: $skill" -ForegroundColor Green
        $removed++
    }
}
if ($removed -eq 0) { Write-Host "  No se encontraron junctions" -ForegroundColor Yellow }

Write-Host "`n  Limpiando config global..." -ForegroundColor Yellow
$config = Get-Content -Raw $GLOBAL_CONFIG | ConvertFrom-Json
$hadSkills = ($null -ne $config.skills) -and ($null -ne $config.skills.paths)
if ($hadSkills) {
    $config.skills.paths = @($config.skills.paths) | Where-Object { $_ -ne "~/.opencode/skills/" }
    if ($config.skills.paths.Count -eq 0) {
        $config.PSObject.Properties.Remove('skills')
    }
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $GLOBAL_CONFIG -Encoding UTF8
    Write-Host "  skills.paths eliminado del config" -ForegroundColor Green
} else {
    Write-Host "  No hay skills.paths en el config" -ForegroundColor Yellow
}

Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "  Desinstalacion completada" -ForegroundColor Green
Write-Host "  Para reinstalar: .\install-global.ps1" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Cyan
