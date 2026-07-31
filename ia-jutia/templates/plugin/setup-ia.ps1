# modules/ia-jutia/setup-ia.ps1 - IA Jutia Plugin Setup v2.0-full
# Descarga dependencias offline-first (FlexSearch + Full+ DLC) para el plugin
# Uso: cd modules/ia-jutia; .\setup-ia.ps1 [-Force]
#
# Perfiles:
#   Lite  (~40KB) - FlexSearch + patrones DB. Siempre activo.
#   Full+ (~33MB) - Embeddings ONNX + OCR + parsers + SQLite FTS5. Auto-detectado por module.js.
#                    SIN modelo QA NLP (decision de producto: retrieval por keyword).

param(
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$pluginDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$assetsDir = Join-Path $pluginDir "assets"

Write-Output "========================================"
Write-Output "  IA Jutia Plugin - Setup"
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
        Write-Output "[OK]  FlexSearch $( [math]::Round($size/1024) )KB - listo"
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
            Write-Output "[OK]  FlexSearch $( [math]::Round($size/1024) )KB - descargado"
        } else {
            Write-Output "[WARN] Archivo pequeno ($size bytes). Podria estar incompleto."
        }
    } catch {
        Write-Output "[ERR]  No se pudo descargar FlexSearch: $_"
        Write-Output "[...] El plugin usara CDN fallback en tiempo de ejecucion."
    }
}

# --- Full+ Assets (opcional, solo si existe ia-full.js) ---
$iaFullPath = Join-Path $pluginDir "ia-full.js"

if ((Test-Path $iaFullPath)) {
    Write-Output ""
    Write-Output "[Full+] Detectado perfil Full+"

    # Transformers.js UMD (mismo global window.Transformers que espera ia-full.js/ia-worker.js)
    $tfPath = Join-Path $assetsDir "transformers.min.js"
    if (-not (Test-Path $tfPath) -or $Force) {
        Write-Output "[Full+] Descargando Transformers.js..."
        try {
            Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/dist/transformers.min.js" -OutFile $tfPath -UseBasicParsing
        } catch {
            Write-Output "[ERR]  No se pudo descargar Transformers.js: $_"
        }
    } else {
        Write-Output "[OK]  Transformers.js presente"
    }

    # WASM files (ONNX Runtime + sql.js)
    $wasmDir = Join-Path $assetsDir "wasm"
    if (-not (Test-Path $wasmDir)) { New-Item -ItemType Directory -Path $wasmDir -Force | Out-Null }

    $wasmFiles = @(
        @("ort-wasm-simd-threaded.wasm", "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort-wasm-simd-threaded.wasm"),
        @("sql-wasm.wasm", "https://cdn.jsdelivr.net/npm/sql.js@1.10/dist/sql-wasm.wasm"),
        @("sql-wasm.js", "https://cdn.jsdelivr.net/npm/sql.js@1.10/dist/sql-wasm.js")
    )

    foreach ($file in $wasmFiles) {
        $path = Join-Path $wasmDir $file[0]
        if (-not (Test-Path $path) -or $Force) {
            Write-Output "[Full+] Descargando WASM: $($file[0])..."
            try {
                Invoke-WebRequest -Uri $file[1] -OutFile $path -UseBasicParsing
            } catch {
                Write-Output "[ERR]  No se pudo descargar $($file[0]): $_"
            }
        } else {
            Write-Output "[OK]  WASM $($file[0]) presente"
        }
    }

    # PDF.js UMD + worker
    $pdfPath = Join-Path $assetsDir "pdf.min.js"
    if (-not (Test-Path $pdfPath) -or $Force) {
        Write-Output "[Full+] Descargando PDF.js..."
        try {
            Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js" -OutFile $pdfPath -UseBasicParsing
            $pdfWorker = Join-Path $assetsDir "pdf.worker.min.js"
            Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js" -OutFile $pdfWorker -UseBasicParsing
        } catch {
            Write-Output "[ERR]  No se pudo descargar PDF.js: $_"
        }
    } else {
        Write-Output "[OK]  PDF.js presente"
    }

    # Mammoth.js UMD
    $mamPath = Join-Path $assetsDir "mammoth.min.js"
    if (-not (Test-Path $mamPath) -or $Force) {
        Write-Output "[Full+] Descargando Mammoth.js..."
        try {
            Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js" -OutFile $mamPath -UseBasicParsing
        } catch {
            Write-Output "[ERR]  No se pudo descargar Mammoth.js: $_"
        }
    } else {
        Write-Output "[OK]  Mammoth.js presente"
    }

    # SheetJS UMD (XLSX)
    $xlsPath = Join-Path $assetsDir "xlsx.full.min.js"
    if (-not (Test-Path $xlsPath) -or $Force) {
        Write-Output "[Full+] Descargando SheetJS..."
        try {
            Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" -OutFile $xlsPath -UseBasicParsing
        } catch {
            Write-Output "[ERR]  No se pudo descargar SheetJS: $_"
        }
    } else {
        Write-Output "[OK]  SheetJS presente"
    }

    # Tesseract.js UMD (OCR) + assets offline (worker, core WASM, datos spa)
    $tesAssets = @(
        @("tesseract.min.js", "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"),
        @("worker.min.js", "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js"),
        @("tesseract-core-simd.wasm.js", "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.0/tesseract-core-simd.wasm.js")
    )
    foreach ($tes in $tesAssets) {
        $tesPath = Join-Path $assetsDir $tes[0]
        if (-not (Test-Path $tesPath) -or $Force) {
            Write-Output "[Full+] Descargando $($tes[0])..."
            try {
                Invoke-WebRequest -Uri $tes[1] -OutFile $tesPath -UseBasicParsing
            } catch {
                Write-Output "[ERR]  No se pudo descargar $($tes[0]): $_"
            }
        } else {
            Write-Output "[OK]  $($tes[0]) presente"
        }
    }

    # Datos de lenguaje OCR (espanol, integer build - 2.1MB)
    $tessDir = Join-Path $assetsDir "tessdata"
    if (-not (Test-Path $tessDir)) { New-Item -ItemType Directory -Path $tessDir -Force | Out-Null }
    $spaPath = Join-Path $tessDir "spa.traineddata.gz"
    if (-not (Test-Path $spaPath) -or $Force) {
        Write-Output "[Full+] Descargando spa.traineddata.gz..."
        try {
            Invoke-WebRequest -Uri "https://cdn.jsdelivr.net/npm/@tesseract.js-data/spa/4.0.0_best_int/spa.traineddata.gz" -OutFile $spaPath -UseBasicParsing
        } catch {
            Write-Output "[ERR]  No se pudo descargar spa.traineddata.gz: $_"
        }
    } else {
        Write-Output "[OK]  spa.traineddata.gz presente"
    }

    # Modelo ONNX de embeddings (all-MiniLM-L6-v2 quantized)
    # Decision de producto: NO se descarga distilbert-squad-qa (~43MB). QA usa keyword retrieval.
    $modelsDir = Join-Path $pluginDir "models\Xenova"
    if (-not (Test-Path $modelsDir)) { New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null }

    $hfBase = "https://huggingface.co/Xenova"

    $models = @(
        @("all-MiniLM-L6-v2\onnx\model_quantized.onnx", "$hfBase/all-MiniLM-L6-v2/resolve/main/onnx/model_quantized.onnx"),
        @("all-MiniLM-L6-v2\config.json", "$hfBase/all-MiniLM-L6-v2/resolve/main/config.json"),
        @("all-MiniLM-L6-v2\tokenizer.json", "$hfBase/all-MiniLM-L6-v2/resolve/main/tokenizer.json"),
        @("all-MiniLM-L6-v2\tokenizer_config.json", "$hfBase/all-MiniLM-L6-v2/resolve/main/tokenizer_config.json")
    )

    foreach ($model in $models) {
        $path = Join-Path $modelsDir $model[0]
        $parentDir = Split-Path $path -Parent
        if (-not (Test-Path $parentDir)) { New-Item -ItemType Directory -Path $parentDir -Force | Out-Null }
        if (-not (Test-Path $path) -or $Force) {
            Write-Output "[Full+] Descargando modelo: $($model[0])..."
            try {
                Invoke-WebRequest -Uri $model[1] -OutFile $path -UseBasicParsing
            } catch {
                Write-Output "[ERR]  No se pudo descargar $($model[0]): $_"
            }
        } else {
            Write-Output "[OK]  Modelo $($model[0]) presente"
        }
    }

    Write-Output "[Full+] Descarga completa"
}

# --- Info de perfiles ---
Write-Output ""
Write-Output "--- Perfiles ---"
Write-Output ""
Write-Output "  Lite   (~40KB) - FlexSearch + chat + patrones DB"
Write-Output "          Listo. No requiere descarga adicional."
Write-Output ""
Write-Output "  Full+  (~40MB) - Embeddings ONNX + OCR + parsers + SQLite FTS5"
Write-Output "          Descarga manual (DLC) si no se ejecuto este script:"
Write-Output "            https://ia-jutia.ateje.app/models/full-v1.zip"
Write-Output "          Descomprimir en:"
Write-Output "            C:\ProgramData\IA-Jutia\models\"
Write-Output "          (Ruta compartida entre apps del mismo equipo)"
Write-Output "          QA usa retrieval por keyword (sin modelo NLP, decision de producto)."
Write-Output ""
Write-Output "========================================"
Write-Output "  Setup completado. Plugin listo para usar."
Write-Output "========================================"
