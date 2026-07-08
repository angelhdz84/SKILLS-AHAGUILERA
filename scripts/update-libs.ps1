#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Verifica y actualiza las versiones de librerias del Stack Ateje.
.DESCRIPTION
    Lee stack-versions.json, consulta npm registry para cada libreria,
    compara pinned vs latest, y opcionalmente actualiza las versiones.
    Tambien muestra alternativas para librerias discontinuadas.
.EXAMPLE
    .\scripts\update-libs.ps1              # Solo check (modo readonly)
    .\scripts\update-libs.ps1 -Apply        # Actualiza las versiones en stack-versions.json
    .\scripts\update-libs.ps1 -Lib alpinejs # Check solo una libreria
#>

# Nota: NO usar param() - bug en PowerShell 5.1 con PSCustomObject y variable property access
$Apply = $false; $Lib = ""; $Json = $false
foreach ($a in $args) {
    if ($a -eq "-Apply" -or $a -eq "-apply") { $Apply = $true }
    elseif ($a -eq "-Json" -or $a -eq "-json") { $Json = $true }
    elseif ($a -ne "" -and !$a.StartsWith("-")) { $Lib = $a }
}

$ErrorActionPreference = "Stop"
$rootDir = Resolve-Path "$PSScriptRoot/.."
$versionsFile = "$rootDir/stack-versions.json"

if (!(Test-Path $versionsFile)) {
    Write-Error "No se encuentra stack-versions.json en $rootDir"
    exit 1
}

$versions = Get-Content $versionsFile -Encoding UTF8 | ConvertFrom-Json

# --- Funciones ---

function Get-NpmLatestVersion {
    param([string]$PackageName)
    try {
        $url = "https://registry.npmjs.org/$PackageName/latest"
        $resp = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($resp -and $resp.version) {
            return $resp.version
        }
    } catch {}
    return $null
}

function Compare-Versions {
    param([string]$Pinned, [string]$Latest)
    if ([string]::IsNullOrEmpty($Latest)) { return "unknown" }
    if ($Pinned -eq $Latest) { return "current" }
    $pParts = $Pinned.Split('.')
    $lParts = $Latest.Split('.')
    for ($i = 0; $i -lt [Math]::Max($pParts.Length, $lParts.Length); $i++) {
        $pVal = if ($i -lt $pParts.Length) { [int]$pParts[$i] } else { 0 }
        $lVal = if ($i -lt $lParts.Length) { [int]$lParts[$i] } else { 0 }
        if ($lVal -gt $pVal) {
            if ($i -eq 0) { return "major" }
            elseif ($i -eq 1) { return "minor" }
            else { return "patch" }
        }
        elseif ($lVal -lt $pVal) { return "unknown" }
    }
    return "current"
}

# --- Main ---

$results = @()

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   STACK ATEJE - VERIFICADOR DE VERSIONES" -ForegroundColor Cyan
Write-Host "   $(Get-Date -Format 'yyyy-MM-dd HH:mm')" -ForegroundColor Cyan
if ($Apply) {
    Write-Host "   MODO APLICAR - Se actualizaran las versiones" -ForegroundColor Yellow
} else {
    Write-Host "   MODO LECTURA - Solo verificacion (usa -Apply)" -ForegroundColor Green
}
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$libKeys = if ($Lib) { @($Lib) } else { $versions.libraries.PSObject.Properties.Name | Sort-Object }

foreach ($__lk__ in $libKeys) {
    $lib = $versions.libraries.$__lk__
    if ($null -eq $lib) {
        Write-Warning "Libreria '$__lk__' no encontrada en stack-versions.json"
        continue
    }

    $pinned = $lib.pinned
    $status = $lib.status
    $npmName = $lib.npm
    $breaking = $lib.breaking
    $alt = $lib.alternative

    # Consultar npm
    $latestFromNpm = if ($npmName) { Get-NpmLatestVersion $npmName } else { $null }
    $latestKnown = if ($latestFromNpm) { $latestFromNpm } else { $lib.latest }

    $diff = Compare-Versions $pinned $latestKnown
    $outdated = $diff -ne "current" -and $diff -ne "unknown"

    $result = @{
        key = $__lk__
        name = $lib.name
        pinned = $pinned
        latest = $latestKnown
        diff = $diff
        status = $status
        outdated = $outdated
        breaking = $breaking
        npmName = $npmName
        alternative = $alt
    }
    $results += $result
}

# --- Mostrar resultados ---

$currentCount = 0
$patchCount = 0
$minorCount = 0
$majorCount = 0
$legacyCount = 0
$deprecatedCount = 0

foreach ($r in $results) {
    $icon = ""
    $color = "White"

    if ($r.status -eq "legacy") {
        $icon = "[LEGACY]"
        $color = "DarkGray"
        $legacyCount++
    } elseif ($r.status -eq "deprecated") {
        $icon = "[DEPR]"
        $color = "Yellow"
        $deprecatedCount++
    }

    if (!$r.outdated) {
        if ($r.status -eq "active") {
            if ($icon -eq "") { $icon = "[OK]"; $color = "Green" }
            $currentCount++
        }
    } else {
        switch ($r.diff) {
            "major" { $icon = "[MAJOR]"; $color = "Red"; $majorCount++ }
            "minor" { $icon = "[MINOR]"; $color = "Yellow"; $minorCount++ }
            "patch" { $icon = "[PATCH]"; $color = "DarkYellow"; $patchCount++ }
        }
    }

    if ($r.breaking -and $r.outdated) {
        $breakLabel = " [BREAKING]"
    } else { $breakLabel = "" }

    Write-Host "$icon $($r.name)" -ForegroundColor $color -NoNewline
    Write-Host "  $($r.pinned) -> " -ForegroundColor $color -NoNewline
    Write-Host "$($r.latest)" -ForegroundColor $color -NoNewline
    Write-Host "$breakLabel" -ForegroundColor Red -NoNewline
    if ($r.diff -ne "current") {
        Write-Host "  ($($r.diff))" -ForegroundColor $color
    } else {
        Write-Host ""
    }
}

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  OK Actuales: $currentCount  | PATCH: $patchCount  | MINOR: $minorCount  | MAJOR: $majorCount" -ForegroundColor White
Write-Host "  LEGACY: $legacyCount  | DEPRECATED: $deprecatedCount" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# --- Alternativas para discontinuadas ---
$hasAlternatives = $results | Where-Object { $_.alternative }
if ($hasAlternatives) {
    Write-Host "LIBRERIAS CON ALTERNATIVAS DISPONIBLES:" -ForegroundColor Magenta
    Write-Host "----------------------------------------" -ForegroundColor Magenta
    foreach ($r in $results | Where-Object { $_.alternative }) {
        $alt = $r.alternative
        Write-Host "  * $($r.name) ($($r.pinned))" -ForegroundColor Yellow
        Write-Host "    -> Alternativa: $($alt.name)" -ForegroundColor White
        Write-Host "    Motivo: $($alt.reason)" -ForegroundColor DarkGray
        Write-Host "    Esfuerzo: $($alt.effort)" -ForegroundColor DarkGray
        Write-Host "    $($alt.url)" -ForegroundColor Blue
        Write-Host ""
    }
}

# --- Aplicar cambios ---
if ($Apply) {
    $confirm = Read-Host "Actualizar las versiones en stack-versions.json? (s/N)"
    if ($confirm -ne "s" -and $confirm -ne "S") {
        Write-Host "Operacion cancelada." -ForegroundColor Yellow
        exit 0
    }

    $changes = @()
    foreach ($r in $results | Where-Object { $_.outdated }) {
        if ($r.latest -and $r.latest -ne $r.pinned) {
            $versions.libraries.$($r.key).latest = $r.latest
            $versions.libraries.$($r.key).pinned = $r.latest
            $changes += $r
        }
    }

    if ($changes.Count -eq 0) {
        Write-Host "Todas las librerias estan en su ultima version." -ForegroundColor Green
    } else {
        $versions.updated = (Get-Date -Format "yyyy-MM-dd")
        $versions | ConvertTo-Json -Depth 10 | Set-Content $versionsFile -Encoding UTF8
        Write-Host "$($changes.Count) librerias actualizadas en stack-versions.json" -ForegroundColor Green
        Write-Host "Fecha de actualizacion: $($versions.updated)" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "IMPORTANTE: Las versiones actualizadas tambien deben reflejarse en:" -ForegroundColor Yellow
        Write-Host "   - setup-init/SKILL.md (descargar-libs.bat)" -ForegroundColor Yellow
        Write-Host "   - code-generator/SKILL.md (templates core)" -ForegroundColor Yellow
        Write-Host "   Ejecuta '/setup' para regenerar los archivos con las nuevas versiones." -ForegroundColor Yellow
    }
} else {
    if ($results | Where-Object { $_.outdated }) {
        Write-Host "Usa -Apply para actualizar las versiones en stack-versions.json" -ForegroundColor Cyan
        Write-Host "  Ej: .\scripts\update-libs.ps1 -Apply" -ForegroundColor Cyan
    }
}

# --- Output JSON si se solicita ---
if ($Json) {
    $results | ConvertTo-Json -Depth 5
}
