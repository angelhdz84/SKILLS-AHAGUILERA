# deployment-jigue/templates/clean-webview2.ps1
# Reduce Fixed Version WebView2 a minimo funcional
# Conserva swiftshader/ para WebGPU (IA Jutia Full)
# Conserva es-419.pak, es.pak, en-US.pak

param(
    [Parameter(Mandatory)]
    [string]$WebView2Path
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path $WebView2Path)) {
    Write-Host "ERROR: No existe $WebView2Path" -ForegroundColor Red
    exit 1
}

$eb = "$WebView2Path\EBWebView"
$inicio = (Get-ChildItem $WebView2Path -Recurse | Measure-Object -Property Length -Sum).Sum

Write-Host "  Limpiando WebView2 Fixed Version..." -ForegroundColor Cyan

# 1. Quitar arquitectura 32-bit (~50MB)
$x86 = "$eb\x86"
if (Test-Path $x86) {
    Remove-Item $x86 -Recurse -Force
    Write-Host "  [+] x86 eliminado" -ForegroundColor Green
}

# 2. Quitar debug symbols .pdb (~15MB)
$pdbs = Get-ChildItem $WebView2Path -Recurse -Filter "*.pdb"
if ($pdbs) {
    $pdbs | Remove-Item -Force
    Write-Host "  [+] $($pdbs.Count) archivos .pdb eliminados" -ForegroundColor Green
}

# 3. Quitar idiomas, dejar solo es-419, es, en-US (~32MB)
$locales = "$eb\x64\locales"
if (Test-Path $locales) {
    $keep = @("es-419.pak", "es.pak", "en-US.pak")
    $removed = Get-ChildItem $locales -Filter "*.pak" | Where-Object { $_.Name -notin $keep }
    if ($removed) {
        $removed | Remove-Item -Force
        Write-Host "  [+] $($removed.Count) idiomas eliminados (solo es-419, es, en-US)" -ForegroundColor Green
    }
}

# 4. Mantener swiftshader/ para WebGPU (IA Jutia Full)
Write-Host "  [+] swiftshader conservado (WebGPU)" -ForegroundColor Yellow

$final = (Get-ChildItem $WebView2Path -Recurse | Measure-Object -Property Length -Sum).Sum
$ahorro = $inicio - $final
Write-Host ""
Write-Host "  WebView2 stripped:" -ForegroundColor Cyan
Write-Host "    Antes: $([math]::Round($inicio / 1MB, 0)) MB" -ForegroundColor Gray
Write-Host "    Despues: $([math]::Round($final / 1MB, 0)) MB" -ForegroundColor Green
Write-Host "    Ahorro: $([math]::Round($ahorro / 1MB, 0)) MB" -ForegroundColor Yellow
