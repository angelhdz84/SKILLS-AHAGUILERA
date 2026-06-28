# scripts/setup-engram.ps1
# Configura Engram como backend de memoria persistente para wiki-engine
# Opcional — si Engram no está instalado, wiki-engine usa solo markdown
#
# Uso: ./scripts/setup-engram.ps1 [-ProjectDir "."] [-Force]

param(
    [string]$ProjectDir = ".",
    [switch]$Force
)

Write-Output "🔍 Detectando Engram..."

$engramPath = (Get-Command engram -ErrorAction SilentlyContinue).Source

if (-not $engramPath) {
    Write-Output ""
    Write-Output "ℹ️  Engram no instalado. wiki-engine usará solo markdown + preferencias."
    Write-Output ""
    Write-Output "   Para instalar:"
    Write-Output "     winget install Gentleman.Programming.Engram"
    Write-Output "     O desde: https://github.com/Gentleman-Programming/engram"
    Write-Output ""
    Write-Output "   Sin Engram el pipeline funciona exactamente igual —"
    Write-Output "   solo que el agente no tendrá memoria persistente entre sesiones."
    exit 0
}

Write-Output "✅ Engram detectado: $engramPath"

# Verificar versión
$version = & engram version 2>$null
if ($version) {
    Write-Output "   Versión: $version"
}

# Configurar ENGRAM_DATA_DIR para que apunte a .omd/ del proyecto
$projectRoot = Resolve-Path $ProjectDir
$omdDir = Join-Path $projectRoot ".omd"

if (-not (Test-Path $omdDir)) {
    New-Item -ItemType Directory -Path $omdDir -Force | Out-Null
    Write-Output "📁 Creado $omdDir"
}

$env:ENGRAM_DATA_DIR = $omdDir
Write-Output "📂 ENGRAM_DATA_DIR → $omdDir"

# Inicializar Engram para el proyecto
Write-Output "🔧 Configurando Engram..."
& engram setup opencode 2>&1 | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-Output "✅ Engram configurado como memoria persistente"
    Write-Output ""
    Write-Output "📋 Próximos pasos:"
    Write-Output "   - El agente guardará automáticamente decisiones y preferencias"
    Write-Output "   - Comandos útiles:"
    Write-Output "     • 'engram tui'        → Dashboard visual de memoria"
    Write-Output "     • 'engram search [q]' → Buscar en memoria"
    Write-Output "     • 'engram status'     → Estado de la memoria"
    Write-Output ""
    Write-Output "💡 Consejo: Cierra la sesión, vuelve a abrir OpenCode y"
    Write-Output "   pregunta '¿qué estábamos haciendo?' — Engram lo recordará."
} else {
    Write-Output "⚠️  Error al configurar Engram. Revisa la instalación."
    exit 1
}
