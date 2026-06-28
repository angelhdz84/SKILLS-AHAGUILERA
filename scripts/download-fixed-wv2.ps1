# scripts/download-fixed-wv2.ps1
# Descarga la Fixed Version de WebView2 desde Microsoft
# para empaquetar con apps del perfil Professional/Business
# Uso: .\scripts\download-fixed-wv2.ps1
# Output: tools\WebView2-Fixed\

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Resolve-Path "$scriptDir\.."
$toolsDir = "$rootDir\tools"
$wvDir = "$toolsDir\WebView2-Fixed"
$wvZip = "$toolsDir\WebView2-Fixed.zip"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Descarga de Fixed Version WebView2" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

if (Test-Path $wvDir) {
    Write-Host "  Ya existe en: $wvDir" -ForegroundColor Yellow
    $resp = Read-Host "  Descargar de nuevo? (s/N)"
    if ($resp -ne 's' -and $resp -ne 'S') {
        Write-Host "  Usando version existente" -ForegroundColor Green
        exit 0
    }
}

if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
}

Write-Host "  Descargando Fixed Version WebView2 (aprox 150MB)..." -ForegroundColor Yellow
Write-Host "  URL: https://msedge.sf.dl.delivery.mp.microsoft.com/filestreamingservice/files/..." -ForegroundColor Gray
Write-Host ""
Write-Host "  La URL directa de Microsoft cambia con cada version." -ForegroundColor White
Write-Host "  Obten la ultima desde:" -ForegroundColor White
Write-Host "  https://developer.microsoft.com/en-us/microsoft-edge/webview2/?form=MA13LH#download" -ForegroundColor Blue
Write-Host "  Seccion 'Fixed Version' -> 'Download the WebView2 Runtime'" -ForegroundColor Blue
Write-Host ""
$url = Read-Host "  Pega la URL directa (o Enter para saltar)"

if ([string]::IsNullOrWhiteSpace($url)) {
    Write-Host "  Descarga saltada. Coloca manualmente los archivos en:" -ForegroundColor Yellow
    Write-Host "  $wvDir" -ForegroundColor Yellow
    exit 1
}

Write-Host "  Descargando..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $url -OutFile $wvZip -TimeoutSec 600
    Write-Host "  Descargado: $( [math]::Round((Get-Item $wvZip).Length / 1MB, 1) ) MB" -ForegroundColor Green

    if (Test-Path $wvDir) {
        Remove-Item $wvDir -Recurse -Force
    }
    Expand-Archive $wvZip -DestinationPath $wvDir -Force
    Remove-Item $wvZip -Force

    $size = (Get-ChildItem $wvDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "  Extraido: $([math]::Round($size, 0)) MB en $wvDir" -ForegroundColor Green
    Write-Host "  Listo para usar con package-professional.ps1" -ForegroundColor Green
} catch {
    Write-Host "  Error: $_" -ForegroundColor Red
    Write-Host "  Descarga manual: coloca los archivos en $wvDir" -ForegroundColor Yellow
    exit 1
}
