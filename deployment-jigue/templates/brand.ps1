<#
.SYNOPSIS
  White-label branding script para apps Ateje.
  Reemplaza nombre, colores, logo y metadatos del cliente en toda la app.

.DESCRIPTION
  Busca project.config.js, extrae APP_CONFIG, y aplica branding
  a todos los archivos del proyecto. Genera docs personalizados.

.PARAMETER AppName
  Nuevo nombre de la app (ej: "MiApp Corporativa")

.PARAMETER AppId
  Nuevo ID de dominio reverso (ej: "com.cliente.miapp")

.PARAMETER PrimaryColor
  Color primario hex (ej: "#ff6600")

.PARAMETER SecondaryColor
  Color secundario hex (ej: "#003366")

.PARAMETER LogoPath
  Ruta a logo PNG/SVG (se copia a assets/)

.PARAMETER OutputDir
  Directorio de salida para el proyecto branded (default: ./dist/branded)

.PARAMETER DryRun
  Muestra que cambiaria sin modificar archivos

.EXAMPLE
  .\brand.ps1 -AppName "GestorPro" -AppId "com.acme.gestorpro" -PrimaryColor "#ff6600" -SecondaryColor "#003366"

.EXAMPLE
  .\brand.ps1 -AppName "MiApp" -LogoPath "C:\logos\logo.svg" -DryRun
#>

param(
  [string]$AppName = "",
  [string]$AppId = "",
  [string]$PrimaryColor = "",
  [string]$SecondaryColor = "",
  [string]$LogoPath = "",
  [string]$OutputDir = "./dist/branded",
  [switch]$DryRun = $false
)

$ErrorActionPreference = "Stop"

# ---------- Helper ----------
function Write-Brand($msg) { Write-Host "🏷️  $msg" }
function Write-OK($msg) { Write-Host " ✅ $msg" }
function Write-Skip($msg) { Write-Host " ⏭️  $msg" }
function Write-Warn($msg) { Write-Host " ⚠️  $msg" }

# ---------- 1. Leer project.config.js ----------
$configPath = "project.config.js"
if (-not (Test-Path $configPath)) {
  Write-Warn "No se encuentra project.config.js. Usando defaults."
  $config = @{
    nombreApp = "AtejeApp"
    defaultColor = "#1e3a5f"
    colores = @{ primario = "#1e3a5f"; secundario = "#64748b"; acento = "#f59e0b" }
  }
} else {
  $raw = Get-Content $configPath -Raw
  # Extraer APP_CONFIG aproximado (regex simple)
  if ($raw -match 'nombreApp\s*:\s*["'']([^"''\n]+)') { $nombreActual = $Matches[1] } else { $nombreActual = "AtejeApp" }
  if ($raw -match 'primario["'']?\s*:\s*["'']([^"''\n]+)') { $colorActual = $Matches[1] } else { $colorActual = "#1e3a5f" }
  $config = @{ nombreApp = $nombreActual; defaultColor = $colorActual }
}

# ---------- 2. Prompt interactivo si no hay params ----------
if (-not $AppName) {
  $AppName = Read-Host "🏷️  Nombre de la app (actual: $($config.nombreApp))"
  if (-not $AppName) { $AppName = $config.nombreApp; Write-Skip "Usando nombre actual: $AppName" }
}
if (-not $AppId) {
  $defaultId = "com.cliente." + ($AppName -replace '\s+', '').ToLower()
  $AppId = Read-Host "📱 App ID (ej: $defaultId)"
  if (-not $AppId) { $AppId = $defaultId; Write-Skip "Usando ID: $AppId" }
}
if (-not $PrimaryColor) {
  $PrimaryColor = Read-Host "🎨 Color primario hex (actual: $($config.defaultColor))"
  if (-not $PrimaryColor) { $PrimaryColor = $config.defaultColor; Write-Skip "Usando color: $PrimaryColor" }
}
if (-not $SecondaryColor) {
  $SecondaryColor = Read-Host "🎨 Color secundario hex"
  if (-not $SecondaryColor) { $SecondaryColor = "#64748b"; Write-Skip "Usando color secundario default: $SecondaryColor" }
}

$AppId = $AppId.ToLower() -replace '\s+', ''
$AppNameSafe = $AppName -replace '\s+', '-' -replace '[^a-zA-Z0-9\-]', ''

Write-Brand "Aplicando branding: $AppName ($AppId)"
Write-Host "  Colores: $PrimaryColor / $SecondaryColor"

# ---------- 3. Archivos a modificar (mapeo) ----------
$files = @(
  @{ Path = "project.config.js"; Label = "Config" }
  @{ Path = "index.html"; Label = "Index HTML" }
  @{ Path = "neutralino.config.json"; Label = "Neutralino config" }
  @{ Path = "capacitor.config.json"; Label = "Capacitor config" }
  @{ Path = "package.json"; Label = "Package.json" }
  @{ Path = "manifest.json"; Label = "PWA manifest" }
  @{ Path = "core/theme.js"; Label = "Theme JS" }
  @{ Path = "core/app.js"; Label = "App JS" }
)

# ---------- 4. Aplicar reemplazos ----------
$replacedCount = 0

foreach ($f in $files) {
  $path = $f.Path
  if (-not (Test-Path $path)) { continue }

  $content = Get-Content $path -Raw
  $original = $content

  # Reemplazar nombre de app
  $content = $content -replace $config.nombreApp, $AppName
  $content = $content -replace ($config.nombreApp -replace '\s', '-'), $AppNameSafe

  # Reemplazar colores
  if ($f.Label -eq "Theme JS" -or $f.Label -eq "Theme JS (root)") {
    if ($config.defaultColor) {
      $content = $content -replace $config.defaultColor, $PrimaryColor
    }
  }

  # Reemplazar AppId en configs
  if ($f.Label -eq "Neutralino config" -or $f.Label -eq "Capacitor config") {
    # Reemplazar cualquier com.xxx.yyy con el nuevo AppId
    $content = $content -replace 'com\.\w[\w.]*\w', $AppId
  }

  if ($content -ne $original) {
    if (-not $DryRun) {
      $utf8NoBom = New-Object System.Text.UTF8Encoding $false
      [System.IO.File]::WriteAllText((Resolve-Path $path).Path, $content, $utf8NoBom)
    }
    Write-OK "$($f.Label): $($f.Path)"
    $replacedCount++
  } else {
    Write-Skip "$($f.Label): sin cambios"
  }
}

# ---------- 5. Copiar logo ----------
if ($LogoPath -and (Test-Path $LogoPath)) {
  $ext = [System.IO.Path]::GetExtension($LogoPath)
  $destinations = @(
    "assets/logo$ext",
    "favicon.ico"
  )
  $extNoIco = $ext -ne '.ico'
  foreach ($dest in $destinations) {
    $destDir = Split-Path $dest -Parent
    if ($destDir) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
    if (-not $DryRun) {
      if (-not ($dest -like '*favicon*' -and $extNoIco)) {
        Copy-Item $LogoPath $dest -Force
        Write-OK "Logo copiado a $dest"
      }
    }
  }
} else {
  Write-Skip "Logo: no se proporciono o no existe"
}

# ---------- 6. Generar docs personalizados ----------
$docsDir = "docs"
New-Item -ItemType Directory -Path $docsDir -Force | Out-Null

$guiaContenido = @"
# $AppName — Guia de Usuario

## Introduccion
**$AppName** es una aplicacion offline-first generada con el stack Ateje.
Toda la informacion se almacena localmente en el dispositivo.

## Instalacion
- **Web**: Abrir index.html en cualquier navegador moderno
- **Escritorio**: Ejecutar el .exe (NeutralinoJS, ~2MB)
- **Movil**: Instalar el .apk (Android 8+)

## Primeros pasos
1. Abre la aplicacion
2. Configura tu perfil en Ajustes
3. Comienza a usar los modulos disponibles

## Soporte
Para soporte tecnico, contacta al administrador del sistema.

## Respaldo de datos
Usa la funcion de exportacion en Ajustes para generar un archivo .ateje-backup.
Este archivo contiene todos tus datos cifrados y comprimidos.

---
*Generado automaticamente por Ateje Stack — deployment-jigue brand.ps1*
"@

$guiaPath = "$docsDir/GUIA_USUARIO.md"
if (-not $DryRun) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText((Resolve-Path $docsDir).Path + "\GUIA_USUARIO.md", $guiaContenido, $utf8NoBom)
  Write-OK "Guia de usuario generada: $guiaPath"
}

# ---------- 7. Empaquetar salida branded ----------
if (-not $DryRun) {
  New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

  $brandedZip = "$OutputDir/$AppNameSafe-branded-v1.0.zip"
  $compressItems = @(
    @{ Path = "index.html"; Package = $brandedZip }
  )

  # Recolectar archivos relevantes
  $include = @("index.html", "core", "modules", "assets", "docs", "project.config.js")
  if (Test-Path "neutralino.config.json") { $include += "neutralino.config.json" }
  if (Test-Path "capacitor.config.json") { $include += "capacitor.config.json" }
  if (Test-Path "manifest.json") { $include += "manifest.json" }
  if (Test-Path "sw.js") { $include += "sw.js" }
  # Neutralino: incluir dist/ neutralino.js
  if (Test-Path "core/neutralino.js") { $include += "core" }
  if (Test-Path "package.json") { $include += "package.json" }

  $compressItems = $include | Where-Object { Test-Path $_ } | ForEach-Object {
    @{ Path = $_; Package = $brandedZip }
  }

  Compress-Archive -Path ($include | Where-Object { Test-Path $_ }) -DestinationPath $brandedZip -Force
  Write-OK "Paquete branded generado: $brandedZip"
}

# ---------- 8. Resumen ----------
Write-Host ""
Write-Host "═══════════════════════════════════════════"
Write-Host "  ✅ BRANDING COMPLETADO"
Write-Host "═══════════════════════════════════════════"
Write-Host "  App:        $AppName"
Write-Host "  App ID:     $AppId"
Write-Host "  Colores:    $PrimaryColor / $SecondaryColor"
Write-Host "  Archivos:   $replacedCount modificados"
if ($DryRun) { Write-Host "  (Dry Run: no se modifico ningun archivo)" }
Write-Host "═══════════════════════════════════════════"
Write-Host ""
Write-Host "📦 Para empaquetar: ./brand.ps1 -AppName 'ClienteX' -LogoPath 'ruta/logo.png'"
Write-Host "📖 Guia: $docsDir/GUIA_USUARIO.md"
Write-Host ""
