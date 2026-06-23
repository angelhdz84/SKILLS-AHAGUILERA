# uninstall-global.ps1 — Remueve Ateje Stack del config global de OpenCode
# Elimina junctions + skills.paths del config global
# Reversible: vuelve a ejecutar install-global.ps1 para reinstalar
# Ejecutar: .\uninstall-global.ps1 (sin administrador)

$ErrorActionPreference = "Stop"

$SKILLS_DIR = "$env:USERPROFILE\.opencode\skills"
$GLOBAL_CONFIG = "$env:USERPROFILE\.config\opencode\opencode.json"

$ATEJE_SKILLS = @(
    "pipeline-engine", "spec-engine", "design-engine", "validation-engine", "wiki-engine",
    "setup-init", "code-generator", "stack-compliance-guard", "deployment-jigue",
    "ia-jutia", "alpine-ui-patterns", "capacitor", "upgrade-engine"
)

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Ateje Stack — Desinstalacion Global" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan

# 1. Eliminar junctions
Write-Host "`n  Eliminando junctions..." -ForegroundColor Yellow
$removed = 0
foreach ($skill in $ATEJE_SKILLS) {
    $link = Join-Path $SKILLS_DIR $skill
    if (Test-Path $link) {
        Remove-Item -LiteralPath $link -Force -Recurse -ErrorAction SilentlyContinue
        Write-Host "  ✅ Eliminado: $skill" -ForegroundColor Green
        $removed++
    }
}
if ($removed -eq 0) { Write-Host "  ℹ️  No se encontraron junctions" -ForegroundColor Yellow }

# 2. Remover skills.paths del config global
Write-Host "`n  Limpiando config global..." -ForegroundColor Yellow
if (Test-Path $GLOBAL_CONFIG) {
    $config = Get-Content -Raw $GLOBAL_CONFIG | ConvertFrom-Json

    if ($config.PSObject.Properties.Name -contains "skills") {
        if ($config.skills.PSObject.Properties.Name -contains "paths") {
            $config.skills.paths = @($config.skills.paths | Where-Object { $_ -ne "~/.opencode/skills/" })
            Write-Host "  ✅ skills.paths limpiado" -ForegroundColor Green
        }

        # Si paths quedo vacio, remover toda la seccion skills
        if ($config.skills.paths.Count -eq 0) {
            $config.PSObject.Properties.Remove("skills")
            Write-Host "  ✅ Seccion skills eliminada del config" -ForegroundColor Green
        }

        $config | ConvertTo-Json -Depth 10 | Set-Content -Path $GLOBAL_CONFIG -Encoding UTF8
    } else {
        Write-Host "  ℹ️  No hay seccion skills en el config" -ForegroundColor Yellow
    }
}

Write-Host "`n═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Desinstalacion completada" -ForegroundColor Green
Write-Host "  Para reinstalar: .\install-global.ps1" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
