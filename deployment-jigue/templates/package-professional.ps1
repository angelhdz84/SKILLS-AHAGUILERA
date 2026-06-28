# deployment-jigue/templates/package-professional.ps1
# Empaqueta app perfil Professional: Neutralino .exe + Fixed WebView2 stripped
# Uso: .\deployment-jigue\templates\package-professional.ps1 -AppName "MiApp"
# Requiere: neu CLI, tools/WebView2-Fixed/

param(
    [Parameter(Mandatory)]
    [string]$AppName,

    [string]$Version = "1.0.0",

    [switch]$Ofuscar = $true
)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path "$scriptDir\..\.."
$distDir = "$rootDir\dist"
$stagingDir = "$distDir\_staging"
$outputDir = "$distDir\$AppName"
$wvSource = "$rootDir\tools\WebView2-Fixed"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Package Professional - $AppName v$Version" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Paso 1: Compilar con Neutralino
Write-Host ""
Write-Host "[1/6] Compilando Neutralino..." -ForegroundColor Yellow
if (-not (Get-Command "neu" -ErrorAction SilentlyContinue)) {
    Write-Host "  ERROR: neu CLI no instalado. Ejecuta: npm install -g @neutralinojs/neu" -ForegroundColor Red
    exit 1
}
Set-Location $rootDir
neu build --release
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Compilacion fallida" -ForegroundColor Red
    exit 1
}
Write-Host "  [+] Compilado exitoso" -ForegroundColor Green

# Paso 2: Extraer ZIP generado por Neutralino
Write-Host ""
Write-Host "[2/6] Extrayendo binarios..." -ForegroundColor Yellow
$neuZip = Get-ChildItem "$distDir\*-win_x64.zip" | Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $neuZip) {
    Write-Host "  ERROR: No se encontro ZIP de Neutralino en $distDir" -ForegroundColor Red
    exit 1
}
if (Test-Path $stagingDir) {
    Remove-Item $stagingDir -Recurse -Force
}
Expand-Archive $neuZip.FullName -DestinationPath $stagingDir -Force
Write-Host "  [+] Extraido: $($neuZip.Name)" -ForegroundColor Green

# Paso 3: Ofuscar JS (opcional)
Write-Host ""
Write-Host "[3/6] Ofuscando JavaScript..." -ForegroundColor Yellow
$resourcesNeural = "$stagingDir\$AppName\resources.neu"
if ($Ofuscar -and (Test-Path $resourcesNeural)) {
    $tempDir = "$env:TEMP\_neu_extract_$([System.IO.Path]::GetRandomFileName())"
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

    # resources.neu es un ZIP con los archivos de la app
    Expand-Archive $resourcesNeural -DestinationPath $tempDir -Force

    # Ofuscar con terser (requiere Node.js)
    $hasTerser = Get-Command "terser" -ErrorAction SilentlyContinue
    if (-not $hasTerser) {
        Write-Host "  terser no instalado. Instalando..." -ForegroundColor Yellow
        npm install -g terser 2>$null
    }

    Get-ChildItem $tempDir -Recurse -Filter "*.js" | ForEach-Object {
        $outFile = $_.FullName -replace '\.js$', '.min.js'
        & terser $_.FullName --mangle --compress -o $outFile 2>$null
        if ($?) { Move-Item $outFile $_.FullName -Force }
    }

    # Re-empaquetar resources.neu
    Compress-Archive -Path "$tempDir\*" -DestinationPath $resourcesNeural -Force
    Remove-Item $tempDir -Recurse -Force
    Write-Host "  [+] JS ofuscado con terser --mangle" -ForegroundColor Green
} else {
    Write-Host "  [-] Ofuscacion saltada" -ForegroundColor Gray
}

# Paso 4: Copiar Fixed WebView2
Write-Host ""
Write-Host "[4/6] Copiando Fixed WebView2..." -ForegroundColor Yellow
$wvDest = "$stagingDir\$AppName\WebView2"
if (Test-Path $wvSource) {
    if (Test-Path $wvDest) {
        Remove-Item $wvDest -Recurse -Force
    }
    Copy-Item $wvSource -Destination $wvDest -Recurse -Force
    Write-Host "  [+] Copiado desde $wvSource" -ForegroundColor Green
} else {
    Write-Host "  [-] No se encontro Fixed WebView2 en $wvSource" -ForegroundColor Yellow
    Write-Host "  [-] Ejecuta primero: .\scripts\download-fixed-wv2.ps1" -ForegroundColor Yellow
}

# Paso 5: Limpiar WebView2
Write-Host ""
Write-Host "[5/6] Limpiando WebView2 (stripping)..." -ForegroundColor Yellow
if (Test-Path $wvDest) {
    & "$scriptDir\clean-webview2.ps1" -WebView2Path $wvDest
    Write-Host "  [+] WebView2 stripped" -ForegroundColor Green
} else {
    Write-Host "  [-] No hay WebView2 que limpiar" -ForegroundColor Gray
}

# Paso 6: Armar carpeta final y comprimir
Write-Host ""
Write-Host "[6/6] Generando entregable..." -ForegroundColor Yellow
if (Test-Path $outputDir) {
    Remove-Item $outputDir -Recurse -Force
}
Move-Item "$stagingDir\$AppName" -Destination $outputDir -Force

$zipFile = "$distDir\$AppName-Professional-v$Version.zip"
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}
Compress-Archive -Path "$outputDir\*" -DestinationPath $zipFile -Force

$zipSize = (Get-Item $zipFile).Length / 1MB
$appSize = (Get-ChildItem $outputDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Package Professional COMPLETADO" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  App: $AppName v$Version" -ForegroundColor White
Write-Host "  Carpeta: $outputDir ($([math]::Round($appSize, 0)) MB)" -ForegroundColor White
Write-Host "  ZIP: $zipFile ($([math]::Round($zipSize, 0)) MB)" -ForegroundColor White
Write-Host ""
Write-Host "  Estructura:" -ForegroundColor Gray
Write-Host "  $AppName/" -ForegroundColor Gray
Write-Host "    +-- $AppName.exe" -ForegroundColor Gray
Write-Host "    +-- resources.neu" -ForegroundColor Gray
Write-Host "    +-- WebView2/ (stripped)" -ForegroundColor Gray
Write-Host "    +-- favicon.ico" -ForegroundColor Gray
Write-Host "    +-- LEEME.txt" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan
