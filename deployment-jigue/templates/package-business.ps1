# deployment-jigue/templates/package-business.ps1
# Empaqueta app perfil Business: .exe + .apk + branding + docs
# Uso: .\deployment-jigue\templates\package-business.ps1 -AppName "MiApp" -Cliente "Acme Corp"

param(
    [Parameter(Mandatory)]
    [string]$AppName,

    [Parameter(Mandatory)]
    [string]$Cliente,

    [string]$Version = "1.0.0",
    [string]$AppId = "com.$Cliente.$AppName",
    [string]$PrimaryColor = "#1e3a5f",
    [string]$SecondaryColor = "#3b82f6",
    [string]$LogoPath = "",

    [switch]$SkipDocs = $false,
    [switch]$Ofuscar = $true
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path "$scriptDir\..\.."
$distDir = "$rootDir\dist"
$outputDir = "$distDir\$AppName-Business"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Package BUSINESS - $AppName v$Version" -ForegroundColor Cyan
Write-Host "  Cliente: $Cliente" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Paso 1: Empaquetar Professional (.exe + Fixed WV2 + .apk)
Write-Host ""
Write-Host "[1/6] Generando base Professional (.exe + .apk)..." -ForegroundColor Yellow
& "$scriptDir\package-professional.ps1" -AppName $AppName -Version $Version -Ofuscar:$Ofuscar
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Package Professional fallo" -ForegroundColor Red
    exit 1
}

# Mover la carpeta Professional a la carpeta Business
$profDir = "$distDir\$AppName"
if (Test-Path $outputDir) {
    Remove-Item $outputDir -Recurse -Force
}
Rename-Item $profDir -NewName "$AppName-Business"

# Paso 2: Branding (brand.ps1)
Write-Host ""
Write-Host "[2/6] Aplicando branding..." -ForegroundColor Yellow
$brandScript = "$scriptDir\brand.ps1"
if (Test-Path $brandScript) {
    $brandArgs = @(
        "-AppName", $AppName,
        "-AppId", $AppId,
        "-PrimaryColor", $PrimaryColor,
        "-SecondaryColor", $SecondaryColor,
        "-OutputDir", $outputDir,
        "-DryRun"
    )
    if ($LogoPath) {
        $brandArgs += "-LogoPath"
        $brandArgs += $LogoPath
    }
    & $brandScript @brandArgs
    Write-Host "  [+] Branding aplicado" -ForegroundColor Green
} else {
    Write-Host "  [-] brand.ps1 no encontrado" -ForegroundColor Yellow
}

# Paso 3: Generar brand.config.json (white-label)
Write-Host ""
Write-Host "[3/6] Generando brand.config.json..." -ForegroundColor Yellow
$brandConfig = @"
{
  "client": "$Cliente",
  "appName": "$AppName",
  "appId": "$AppId",
  "colors": {
    "primary": "$PrimaryColor",
    "secondary": "$SecondaryColor",
    "accent": "#0ea5e9",
    "neutral": "#1c1917",
    "base-100": "#ffffff",
    "base-200": "#f1f5f9",
    "base-300": "#e2e8f0",
    "info": "#3b82f6",
    "success": "#22c55e",
    "warning": "#f59e0b",
    "error": "#ef4444"
  },
  "fonts": {
    "heading": "system-ui, sans-serif",
    "body": "system-ui, sans-serif",
    "mono": "monospace"
  },
  "logo": {
    "light": "",
    "dark": "",
    "favicon": "",
    "splash": ""
  },
  "features": {},
  "support": {
    "email": "",
    "docsUrl": "",
    "phone": ""
  },
  "customCss": "",
  "version": "$Version"
}
"@
Set-Content "$outputDir\brand.config.json" -Value $brandConfig -Encoding UTF8
Write-Host "  [+] brand.config.json generado con marca de $Cliente" -ForegroundColor Green

# Paso 4: Generar docs (si aplica)
if (-not $SkipDocs) {
    Write-Host ""
    Write-Host "[4/6] Generando documentacion..." -ForegroundColor Yellow
    $docsDir = "$outputDir\docs"
    New-Item -ItemType Directory -Path $docsDir -Force | Out-Null

    # GUIA_USUARIO.md
@"
# $AppName — Guia de Usuario

**Cliente:** $Cliente
**Version:** $Version

## Que es $AppName

Aplicacion offline-first para gestion de negocios.
Funciona sin internet, sin mensualidades, sin instalacion.

## Como usar

1. Ejecute $AppName.exe (doble clic)
2. La aplicacion se abre como ventana nativa
3. Use los modulos del menu lateral
4. Los datos se guardan automaticamente en el equipo
5. Para respaldar: use la opcion Exportar en Configuracion

## Archivos incluidos

- `$AppName.exe` — Aplicacion principal
- `WebView2/` — Componente Microsoft para ventanas nativas
- `$AppName.apk` — Version Android (solo Business)

## Soporte

Para soporte tecnico, contacte a su proveedor.
"@ | Set-Content "$docsDir\GUIA_USUARIO.md" -Encoding UTF8

    # GUIA_INSTALACION.md
@"
# $AppName — Guia de Instalacion

**Cliente:** $Cliente
**Version:** $Version

## Windows (.exe)

1. Extraiga el ZIP en cualquier carpeta
2. Ejecute $AppName.exe (doble clic)
3. La aplicacion se abre al instante
4. No requiere instalacion ni permisos de administrador

**Requisitos:** Windows 10/11 de 64 bits

## Android (.apk)

1. Copie $AppName.apk a su dispositivo
2. Habilite "Instalar apps de fuentes desconocidas"
3. Abra el archivo .apk
4. Toque "Instalar"

**Requisitos:** Android 8.0+ (API 26)
"@ | Set-Content "$docsDir\GUIA_INSTALACION.md" -Encoding UTF8

    Write-Host "  [+] Documentacion generada en $docsDir" -ForegroundColor Green
}

# Paso 5: Generar LEEME.txt
Write-Host ""
Write-Host "[5/6] Generando LEEME.txt..." -ForegroundColor Yellow
@"
====================================================
  $AppName v$Version — Business Edition
  Cliente: $Cliente
====================================================

  CONTENIDO:
    $AppName.exe     — Aplicacion de escritorio
    WebView2/        — Componente de visualizacion
    $AppName.apk     — App Android (si aplica)
    brand.config.json — White-label: colores, logo, fuentes (editable desde Ajustes)
    docs/            — Documentacion
    favicon.ico      — Icono de la aplicacion

  USO:
    Ejecute $AppName.exe para iniciar la aplicacion.
    No requiere instalacion ni internet.

  SOPORTE:
    Contacte a su proveedor para asistencia.

====================================================
"@ | Set-Content "$outputDir\LEEME.txt" -Encoding UTF8

# Paso 6: Comprimir
Write-Host ""
Write-Host "[6/6] Comprimiendo entregable..." -ForegroundColor Yellow
$zipFile = "$distDir\$AppName-Business-v$Version.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}
Compress-Archive -Path "$outputDir\*" -DestinationPath $zipFile -Force

$zipSize = (Get-Item $zipFile).Length / 1MB

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Package BUSINESS COMPLETADO" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  App: $AppName v$Version" -ForegroundColor White
Write-Host "  Cliente: $Cliente" -ForegroundColor White
Write-Host "  ZIP: $zipFile ($([math]::Round($zipSize, 0)) MB)" -ForegroundColor White
Write-Host ""
Write-Host "  Contenido:" -ForegroundColor Gray
Write-Host "    $AppName.exe + resources.neu" -ForegroundColor Gray
Write-Host "    WebView2/ (stripped, con swiftshader)" -ForegroundColor Gray
Write-Host "    $AppName.apk" -ForegroundColor Gray
Write-Host "    docs/ (GUIA_USUARIO, GUIA_INSTALACION)" -ForegroundColor Gray
Write-Host "    brand.config.json (white-label: colores, logo, fuentes)" -ForegroundColor Gray
Write-Host "    favicon.ico, LEEME.txt" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan
