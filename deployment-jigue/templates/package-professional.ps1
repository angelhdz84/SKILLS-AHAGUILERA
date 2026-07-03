# deployment-jigue/templates/package-professional.ps1
# Empaqueta app perfil Professional: Neutralino .exe + Fixed WebView2 stripped + .apk (Capacitor)
# Uso: .\deployment-jigue\templates\package-professional.ps1 -AppName "MiApp"
# Requiere: neu CLI, tools/WebView2-Fixed/, (opcional) JDK 17+ y Android SDK para .apk

param(
    [Parameter(Mandatory)]
    [string]$AppName,

    [string]$Version = "1.0.0",

    [switch]$Ofuscar = $true,

    [switch]$SkipApk = $false
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
Write-Host "[5/7] Limpiando WebView2 (stripping)..." -ForegroundColor Yellow
if (Test-Path $wvDest) {
    & "$scriptDir\clean-webview2.ps1" -WebView2Path $wvDest
    Write-Host "  [+] WebView2 stripped" -ForegroundColor Green
} else {
    Write-Host "  [-] No hay WebView2 que limpiar" -ForegroundColor Gray
}

# Paso 6: Compilar .apk (Capacitor) si aplica
if (-not $SkipApk) {
    Write-Host ""
    Write-Host "[6/7] Compilando .apk con Capacitor..." -ForegroundColor Yellow

    if (-not (Get-Command "npx" -ErrorAction SilentlyContinue)) {
        Write-Host "  [-] npx no disponible, saltando .apk" -ForegroundColor Yellow
    } else {
        Set-Location $rootDir

        if (-not (Test-Path "capacitor.config.json")) {
            Write-Host "  Generando capacitor.config.json..." -ForegroundColor Yellow
            @"
{
  "appId": "com.$AppName.app",
  "appName": "$AppName",
  "webDir": ".",
  "plugins": {
    "CapacitorSQLite": { "androidIsEncrypted": false },
    "LocalNotifications": { "smallIcon": "ic_stat_icon_config_sample", "iconColor": "#1e3a5f" }
  },
  "android": {
    "minSdkVersion": 26,
    "targetSdkVersion": 34,
    "compileSdkVersion": 34
  }
}
"@ | Set-Content "capacitor.config.json" -Encoding UTF8
        }

        npx cap sync android
        if ($LASTEXITCODE -ne 0) {
            Write-Host "  [-] cap sync fallo, saltando .apk" -ForegroundColor Yellow
        } else {
            if (Test-Path "$rootDir\android") {
                Set-Location "$rootDir\android"
                .\gradlew assembleRelease
                if ($LASTEXITCODE -ne 0) {
                    Write-Host "  [-] gradlew assembleRelease fallo" -ForegroundColor Yellow
                } else {
                    $apkSource = "$rootDir\android\app\build\outputs\apk\release\app-release.apk"
                    if (Test-Path $apkSource) {
                        Copy-Item $apkSource -Destination "$stagingDir\$AppName\$AppName.apk" -Force
                        Write-Host "  [+] .apk generado: $([math]::Round((Get-Item $apkSource).Length / 1MB, 1)) MB" -ForegroundColor Green
                    }
                }
                Set-Location $rootDir
            } else {
                Write-Host "  [-] android/ no existe, ejecuta 'npx cap add android' primero" -ForegroundColor Yellow
            }
        }
    }
}

# Paso 7: Armar carpeta final y comprimir
Write-Host ""
Write-Host "[7/7] Generando entregable..." -ForegroundColor Yellow
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
if (-not $SkipApk) {
    Write-Host "    +-- $AppName.apk" -ForegroundColor Gray
}
Write-Host "    +-- favicon.ico" -ForegroundColor Gray
Write-Host "    +-- LEEME.txt" -ForegroundColor Gray
Write-Host "====================================================" -ForegroundColor Cyan
