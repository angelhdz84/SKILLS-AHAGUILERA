# install-global.ps1 — Instala Ateje Stack globalmente en OpenCode
# Crea directory junctions en ~/.opencode/skills/ apuntando al repo
# Agrega skills.paths al config global de OpenCode
# Requiere: PowerShell 5.1+, OpenCode instalado
# Ejecutar: .\install-global.ps1 (sin administrador)

$ErrorActionPreference = "Stop"

$REPO = "D:\REPOSITORIOS GitHUB\Ateje"
$SKILLS_DIR = "$env:USERPROFILE\.opencode\skills"
$GLOBAL_CONFIG = "$env:USERPROFILE\.config\opencode\opencode.json"

$ATEJE_SKILLS = @(
    "pipeline-engine", "spec-engine", "design-engine", "validation-engine", "wiki-engine",
    "setup-init", "code-generator", "stack-compliance-guard", "deployment-jigue",
    "ia-jutia", "alpine-ui-patterns", "capacitor", "upgrade-engine"
)

Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Ateje Stack — Instalacion Global" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan

# 1. Crear ~/.opencode/skills/ si no existe
if (-not (Test-Path $SKILLS_DIR)) {
    New-Item -ItemType Directory -Path $SKILLS_DIR -Force | Out-Null
    Write-Host "  ✅ Creado: $SKILLS_DIR" -ForegroundColor Green
}

# 2. Crear junctions para cada skill
Write-Host "`n  Creando junctions para 13 skills..." -ForegroundColor Yellow
foreach ($skill in $ATEJE_SKILLS) {
    $target = Join-Path $REPO $skill
    $link = Join-Path $SKILLS_DIR $skill

    if (-not (Test-Path $target)) {
        Write-Host "  ❌ No encontrado en repo: $skill" -ForegroundColor Red
        continue
    }

    # Remover si ya existe (junction o directorio previo)
    if (Test-Path $link) {
        Remove-Item -LiteralPath $link -Force -Recurse -ErrorAction SilentlyContinue
    }

    New-Item -ItemType Junction -Path $link -Target $target -Force | Out-Null
    Write-Host "  ✅ Junction: $skill" -ForegroundColor Green
}

# 3. Agregar skills.paths al config global
Write-Host "`n  Actualizando config global..." -ForegroundColor Yellow
$config = Get-Content -Raw $GLOBAL_CONFIG | ConvertFrom-Json

# Verificar si ya existe skills.paths
$alreadyConfigured = $false
if ($config.PSObject.Properties.Name -contains "skills") {
    if ($config.skills.PSObject.Properties.Name -contains "paths") {
        foreach ($p in $config.skills.paths) {
            if ($p -eq "~/.opencode/skills/") {
                $alreadyConfigured = $true
                break
            }
        }
    }
}

if (-not $alreadyConfigured) {
    if (-not ($config.PSObject.Properties.Name -contains "skills")) {
        $config | Add-Member -Name "skills" -Value @{ paths = @() } -MemberType NoteProperty
    }
    $config.skills.paths += "~/.opencode/skills/"
    $config | ConvertTo-Json -Depth 10 | Set-Content -Path $GLOBAL_CONFIG -Encoding UTF8
    Write-Host "  ✅ skills.paths agregado al config global" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  skills.paths ya configurado" -ForegroundColor Yellow
}

Write-Host "`n═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Instalacion completada" -ForegroundColor Green
Write-Host "  13 skills Ateje disponibles globalmente" -ForegroundColor Green
Write-Host "  Usa /new desde cualquier proyecto" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
