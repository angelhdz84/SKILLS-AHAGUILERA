# ia-jutia/scripts/build-ia-zips.ps1
# Construye los 2 ZIPs distribuibles de IA Jutia (Lite + Full+)
# Requiere: PowerShell 5.1+, Invoke-WebRequest, 7zip (opcional, usa Compress-Archive si no)
#
# Decision de producto: NO se incluye modelo QA NLP (distilbert). QA usa keyword retrieval.
# Uso: .\build-ia-zips.ps1 [-Force] [-SkipModels]

param(
    [switch]$Force,
    [switch]$SkipModels
)

$ErrorActionPreference = "Stop"
$version = "1.0.0"

# Rutas relativas a este script (ia-jutia/scripts/)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$iaJutiaDir = Split-Path -Parent $scriptDir
$templateDir = Join-Path $iaJutiaDir "templates\plugin"
$outputDir = Join-Path $iaJutiaDir "dist"
$liteDir = Join-Path $outputDir "ia-jutia-lite"
$fullDir = Join-Path $outputDir "ia-jutia-full"

function Download-IfMissing {
    param([string]$Path, [string]$Url)
    $parent = Split-Path $Path -Parent
    if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    if ((Test-Path $Path) -and -not $Force) {
        Write-Output "  [OK]  $Path"
        return
    }
    Write-Output "  [..]  Descargando: $Path"
    try {
        Invoke-WebRequest -Uri $Url -OutFile $Path -UseBasicParsing
        Write-Output "  [OK]  $Path"
    } catch {
        Write-Output "  [ERR]  No se pudo descargar $Path : $_"
    }
}

# --- 1. Crear directorios ---
New-Item -ItemType Directory -Path $liteDir -Force | Out-Null
New-Item -ItemType Directory -Path $fullDir -Force | Out-Null

# --- 2. Copiar archivos comunes (Lite = Full sin assets/models) ---
Write-Output "[Build] Copiando archivos Lite..."
Copy-Item "$templateDir\module.js" "$liteDir\"
Copy-Item "$templateDir\ia-core.js" "$liteDir\"
Copy-Item "$templateDir\ia-chat.js" "$liteDir\"
Copy-Item "$templateDir\setup-ia.ps1" "$liteDir\"
Copy-Item "$templateDir\setup-ia.ps1" "$fullDir\"   # Full tambien necesita setup

# Tools (Lite: solo registry + extraer-factura)
$liteTools = @("_registry.js", "extraer-factura.js")
New-Item -ItemType Directory -Path "$liteDir\tools" -Force | Out-Null
foreach ($t in $liteTools) {
    if (Test-Path "$templateDir\tools\$t") {
        Copy-Item "$templateDir\tools\$t" "$liteDir\tools\"
    }
}

# Assets Lite = solo flexsearch (el template no los versiona; se descargan)
New-Item -ItemType Directory -Path "$liteDir\assets" -Force | Out-Null
Download-IfMissing -Path "$liteDir\assets\flexsearch.min.js" -Url "https://cdn.jsdelivr.net/npm/flexsearch@0.8.212/dist/flexsearch.bundle.min.js"

# --- 3. Full+ = Lite + todos los extras ---
Write-Output "[Build] Copiando archivos Full+..."
# module.js es el mismo en ambos (auto-detecta perfil Full+)
Copy-Item "$templateDir\module.js" "$fullDir\"
Copy-Item "$templateDir\ia-core.js" "$fullDir\"
Copy-Item "$templateDir\ia-chat.js" "$fullDir\"

# Modulos especificos Full+
Copy-Item "$templateDir\ia-full.js" "$fullDir\"
Copy-Item "$templateDir\ia-worker.js" "$fullDir\"
Copy-Item "$templateDir\ia-sqlite.js" "$fullDir\"

# Tools (todos)
New-Item -ItemType Directory -Path "$fullDir\tools" -Force | Out-Null
Get-ChildItem "$templateDir\tools\*.js" | ForEach-Object {
    Copy-Item $_.FullName "$fullDir\tools\"
}

# Assets Full+ (se descargan al ZIP, no desde template)
New-Item -ItemType Directory -Path "$fullDir\assets" -Force | Out-Null
New-Item -ItemType Directory -Path "$fullDir\assets\wasm" -Force | Out-Null

$assets = @(
    @("assets\flexsearch.min.js", "https://cdn.jsdelivr.net/npm/flexsearch@0.8.212/dist/flexsearch.bundle.min.js"),
    @("assets\transformers.min.js", "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/dist/transformers.min.js"),
    @("assets\pdf.min.js", "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js"),
    @("assets\pdf.worker.min.js", "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js"),
    @("assets\mammoth.min.js", "https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js"),
    @("assets\tesseract.min.js", "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js"),
    @("assets\worker.min.js", "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js"),
    @("assets\tesseract-core-simd.wasm.js", "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.0/tesseract-core-simd.wasm.js"),
    @("assets\tessdata\spa.traineddata.gz", "https://cdn.jsdelivr.net/npm/@tesseract.js-data/spa/4.0.0_best_int/spa.traineddata.gz"),
    @("assets\wasm\ort-wasm-simd-threaded.wasm", "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.0/dist/ort-wasm-simd-threaded.wasm"),
    @("assets\wasm\sql-wasm.wasm", "https://cdn.jsdelivr.net/npm/sql.js@1.10/dist/sql-wasm.wasm"),
    @("assets\wasm\sql-wasm.js", "https://cdn.jsdelivr.net/npm/sql.js@1.10/dist/sql-wasm.js")
)

foreach ($asset in $assets) {
    Download-IfMissing -Path "$fullDir\$($asset[0])" -Url $asset[1]
}

# Modelos ONNX de embeddings (saltar con -SkipModels)
# Decision de producto: solo all-MiniLM-L6-v2, SIN distilbert-squad-qa (~43MB).
if (-not $SkipModels) {
    $models = @(
        @("models\Xenova\all-MiniLM-L6-v2\onnx\model_quantized.onnx", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model_quantized.onnx"),
        @("models\Xenova\all-MiniLM-L6-v2\config.json", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/config.json"),
        @("models\Xenova\all-MiniLM-L6-v2\tokenizer.json", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer.json"),
        @("models\Xenova\all-MiniLM-L6-v2\tokenizer_config.json", "https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/tokenizer_config.json")
    )

    foreach ($model in $models) {
        Download-IfMissing -Path "$fullDir\$($model[0])" -Url $model[1]
    }
} else {
    Write-Output "[Build] SkipModels activado - los modelos ONNX no se descargaron"
}

# --- 4. Crear ZIPs ---
Write-Output "[Build] Creando ZIPs..."

if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    # 7zip produce mejor compresion
    Push-Location $outputDir
    & 7z a -tzip "ia-jutia-lite-v$version.zip" "ia-jutia-lite\*" -mx=9 | Out-Null
    & 7z a -tzip "ia-jutia-full-v$version.zip" "ia-jutia-full\*" -mx=9 | Out-Null
    Pop-Location
} else {
    Compress-Archive -Path "$liteDir\*" -DestinationPath "$outputDir\ia-jutia-lite-v$version.zip" -Force
    Compress-Archive -Path "$fullDir\*" -DestinationPath "$outputDir\ia-jutia-full-v$version.zip" -Force
}

# --- 5. Limpiar directorios temporales ---
Remove-Item -Path $liteDir -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path $fullDir -Recurse -Force -ErrorAction SilentlyContinue

Write-Output ""
Write-Output "=============================="
Write-Output "Build completado!"
Write-Output "=============================="
Write-Output "Lite:  $outputDir\ia-jutia-lite-v$version.zip"
Write-Output "Full+: $outputDir\ia-jutia-full-v$version.zip"
Write-Output ""
Write-Output "Tamano estimado:"
if (Test-Path "$outputDir\ia-jutia-lite-v$version.zip") {
    $liteSize = (Get-Item "$outputDir\ia-jutia-lite-v$version.zip").Length / 1KB
    Write-Output "  Lite:  $([math]::Round($liteSize)) KB"
}
if (Test-Path "$outputDir\ia-jutia-full-v$version.zip") {
    $fullSize = (Get-Item "$outputDir\ia-jutia-full-v$version.zip").Length / 1MB
    Write-Output "  Full+: $([math]::Round($fullSize)) MB"
}
