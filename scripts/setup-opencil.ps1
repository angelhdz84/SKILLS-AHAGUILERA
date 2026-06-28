# scripts/setup-opencil.ps1
# Configura OpenPencil CLI + detecta Desktop App para extracción de tokens
# Opcional — sin OpenPencil, design-engine usa DESIGN.md manual
#
# Uso: ./scripts/setup-opencil.ps1 [-ProjectDir "."] [-Force]

param(
    [string]$ProjectDir = ".",
    [switch]$Force
)

Write-Output "🔍 Detectando OpenPencil..."

# 1. Detectar CLI
$cliPath = (Get-Command openpencil -ErrorAction SilentlyContinue).Source

if ($cliPath) {
    Write-Output "✅ OpenPencil CLI detectado: $cliPath"
    $version = & openpencil --version 2>$null
    if ($version) { Write-Output "   Versión: $version" }
} else {
    Write-Output ""
    Write-Output "ℹ️  OpenPencil CLI no instalado."
    Write-Output ""
    Write-Output "   Para instalar:"
    Write-Output "     npm install -g @open-pencil/cli"
    Write-Output "     O: bun add -g @open-pencil/cli"
    Write-Output ""
    Write-Output "   Sin el CLI no podrás extraer tokens automáticos de archivos .fig,"
    Write-Output "   pero design-engine usará DESIGN.md manual (como hasta ahora)."
}

# 2. Detectar Desktop App (editor visual + MCP server)
$desktopPaths = @(
    "$env:LOCALAPPDATA\Programs\open-pencil\open-pencil.exe",
    "$env:ProgramFiles\OpenPencil\open-pencil.exe",
    "$env:USERPROFILE\AppData\Local\open-pencil\open-pencil.exe"
)

$desktopFound = $false
foreach ($path in $desktopPaths) {
    if (Test-Path $path) {
        Write-Output "✅ OpenPencil Desktop detectado: $path"
        $desktopFound = $true
        break
    }
}

if (-not $desktopFound) {
    Write-Output ""
    Write-Output "ℹ️  OpenPencil Desktop no detectado."
    Write-Output "   Descárgalo desde: https://github.com/open-pencil/open-pencil/releases"
    Write-Output ""
    Write-Output "   El Desktop App te permite:"
    Write-Output "     • Diseñar UI desde cero (editor visual Figma-compatible)"
    Write-Output "     • Ver preview en vivo del diseño"
    Write-Output "     • Exponer MCP server para que OpenCode lea/modifique el diseño"
}

# 3. Crear directorio assets/brand/ si no existe
$brandDir = Join-Path (Resolve-Path $ProjectDir) "assets/brand"
if (-not (Test-Path $brandDir)) {
    New-Item -ItemType Directory -Path $brandDir -Force | Out-Null
    Write-Output "📁 Creado $brandDir (coloca aquí tus archivos .fig)"
}

Write-Output ""
Write-Output "📋 Resumen:"
if ($cliPath) {
    Write-Output "   ✅ CLI instalado → openpencil analyze colors/typography/spacing disponible"
} else {
    Write-Output "   ⬜ CLI no instalado → extracción manual de tokens"
}
if ($desktopFound) {
    Write-Output "   ✅ Desktop App instalado → diseño visual + MCP server disponible"
} else {
    Write-Output "   ⬜ Desktop App no instalado → diseño manual"
}
Write-Output ""
Write-Output "💡 Flujo recomendado:"
Write-Output "   1. Abre OpenPencil Desktop + OpenCode"
Write-Output "   2. Diseña la UI en OpenPencil (o importa .fig)"
Write-Output "   3. OpenCode se conecta al MCP server para leer el diseño"
Write-Output "   4. Extrae tokens con 'openpencil analyze' → alimentan DESIGN.md"
Write-Output "   5. code-generator produce Alpine + DaisyUI con los mismos tokens"
