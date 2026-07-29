# modules/ia-jutia/setup-ia.ps1 — IA Jutia Plugin Setup v1.0
# Descarga dependencias offline-first (FlexSearch) para el plugin
# Uso: cd modules/ia-jutia; .\setup-ia.ps1 [-Force]
#
# Perfiles:
#   Lite  (~40KB) — FlexSearch + patrones DB. Siempre activo.
#   Full  (~233MB) — Modelos NLP locales. Requiere descarga externa (DLC).

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$pluginDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$assetsDir = Join-Path $pluginDir "assets"

Write-Output "========================================"
Write-Output "  IA Jutia Plugin — Setup"
Write-Output "========================================"
Write-Output ""

# Asegurar directorios
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force | Out-Null
    Write-Output "[DIR] Creado: $assetsDir"
}

# --- FlexSearch ---
$flexPath = Join-Path $assetsDir "flexsearch.min.js"
$flexUrl = "https://cdn.jsdelivr.net/npm/flexsearch@0.8.212/dist/flexsearch.bundle.min.js"
$flexMinSize = 10000  # 10KB min esperado

if ((Test-Path $flexPath) -and -not $Force) {
    $size = (Get-Item $flexPath).Length
    if ($size -gt $flexMinSize) {
        Write-Output "[OK]  FlexSearch $( [math]::Round($size/1024) )KB — listo"
    } else {
        Write-Output "[WARN] FlexSearch parece corrupto ($size bytes). Re-descargando..."
        $Force = $true
    }
}

if (-not (Test-Path $flexPath) -or $Force) {
    Write-Output "[...] Descargando FlexSearch..."
    try {
        Invoke-WebRequest -Uri $flexUrl -OutFile $flexPath -UseBasicParsing
        $size = (Get-Item $flexPath).Length
        if ($size -gt $flexMinSize) {
            Write-Output "[OK]  FlexSearch $( [math]::Round($size/1024) )KB — descargado"
        } else {
            Write-Output "[WARN] Archivo pequeno ($size bytes). Podria estar incompleto."
        }
    } catch {
        Write-Output "[ERR]  No se pudo descargar FlexSearch: $_"
        Write-Output "[...] El plugin usara CDN fallback en tiempo de ejecucion."
    }
}

# --- Info de perfiles ---
Write-Output ""
Write-Output "--- Perfiles ---"
Write-Output ""
Write-Output "  Lite   (~40KB) — FlexSearch + chat + patrones DB"
Write-Output "          Listo. No requiere descarga adicional."
Write-Output ""
Write-Output "  Full   (~233MB) — Modelos NLP + OCR + embeddings"
Write-Output "          Descarga manual (DLC):"
Write-Output "            https://ia-jutia.ateje.app/models/full-v1.zip"
Write-Output "          Descomprimir en:"
Write-Output "            C:\ProgramData\IA-Jutia\models\"
Write-Output "          (Ruta compartida entre apps del mismo equipo)"
Write-Output ""
Write-Output "========================================"
Write-Output "  Setup completado. Plugin listo para usar."
Write-Output "========================================"
