param([switch]$Force)

$root = Split-Path $PSScriptRoot -Parent
$vendorDir = Join-Path (Join-Path $root "modules") "vendor"
$fontsDir  = Join-Path $vendorDir "fonts"

if (!(Test-Path $vendorDir)) { New-Item -ItemType Directory -Path $vendorDir -Force | Out-Null }
if (!(Test-Path $fontsDir))  { New-Item -ItemType Directory -Path $fontsDir -Force  | Out-Null }

$files = @(
  @{ Url = "https://cdn.tailwindcss.com/3.4.17";                File = "tailwind-play.js" }
  @{ Url = "https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js";       File = "alpine.min.js" }
  @{ Url = "https://cdn.jsdelivr.net/npm/alpinejs@3.14.8/dist/cdn.min.js.map";   File = "alpine.min.js.map" }
  @{ Url = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"; File = "bootstrap-icons.css" }
  @{ Url = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff2"; File = "fonts/bootstrap-icons.woff2" }
  @{ Url = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/fonts/bootstrap-icons.woff";  File = "fonts/bootstrap-icons.woff" }
  @{ Url = "https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js";   File = "chart.umd.min.js" }
  @{ Url = "https://cdn.jsdelivr.net/npm/dexie@4.0.11/dist/dexie.min.js";        File = "dexie.min.js" }
)

Write-Host "Descargando librerias offline a modules/vendor/..." -ForegroundColor Cyan
$ok = $true

foreach ($f in $files) {
  $dest = Join-Path $vendorDir $f.File
  if (!(Test-Path $dest) -or $Force) {
    Write-Host "  -> $($f.File)..." -NoNewline
    try {
      Invoke-WebRequest -Uri $f.Url -OutFile $dest -UseBasicParsing -ErrorAction Stop
      Write-Host " OK" -ForegroundColor Green
    } catch {
      Write-Host " ERROR: $_" -ForegroundColor Red
      $ok = $false
    }
  } else {
    Write-Host "  -> $($f.File) [EXISTE]" -ForegroundColor Gray
  }
}

if ($ok) {
  Write-Host "Descarga completada. Librerias listas en modules/vendor/" -ForegroundColor Green
} else {
  Write-Host "Algunas descargas fallaron. Revisa los errores arriba." -ForegroundColor Yellow
}
