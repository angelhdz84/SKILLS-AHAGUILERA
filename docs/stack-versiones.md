# Reporte de Versiones — Stack Ateje

> **Auditoría:** `scripts/update-libs.ps1` | **Manifiesto:** `stack-versions.json`
> **Actualizado:** 2026-07-29

---

## 1. Sistema Centralizado de Versiones

Desde julio 2026, todas las versiones de librerías se gestionan desde **un único archivo**:

**`stack-versions.json`** — contiene:
- Versión `pinned` (congelada) y `latest` (disponible) para cada librería
- URLs de CDN con template `{version}`
- Perfiles que incluyen cada librería (Lite / Professional / Business)
- Estado de mantenimiento (`active` / `legacy` / `deprecated`)
- Alternativas para librerías discontinuadas

### Flujo de actualización

```
/update-libs        →  scripts/update-libs.ps1  →  Consulta npm registry
                         →  Compara pinned vs latest
                         →  Muestra diff con colores
                         →  Si -Apply: actualiza stack-versions.json
                         →  Sugiere /setup para regenerar downloads
```

---

## 2. Librerías Core — Estado Actual

| Librería | Pinned | Latest | Diferencia | Estado | Alternativa |
|----------|--------|--------|:----------:|--------|-------------|
| **Alpine.js** | `3.14.1` | `3.15.12` | minor | active | — |
| **Tailwind CSS** | `4.0.14` | `4.0.14` | — | **active** | `@tailwindcss/browser` v4 (JS runtime) |
| **DaisyUI** | `5.6.14` | `5.6.14` | — | **active** | Temas via daisyui-themes.css |
| **Dexie.js** | `4.0.8` | `4.4.4` | minor | active | — |
| **CryptoJS** | `4.2.0` | `4.2.0` | — | **legacy** 💤 | Web Crypto API (alto) |
| **Chart.js** | `4.4.6` | `4.5.1` | patch | active | — |
| **Bootstrap Icons** | `1.11.3` | `1.13.1` | minor | active | — |
| **animate.css** | `4.1.1` | `4.1.1` | — | **legacy** 💤 | CSS nativo (bajo) |
| **pako** | `3.0.1` | `3.0.1` | **major** ✅ | **active** | v3 migrada (toText, CDN jsDelivr) |
| **jsPDF** | `4.2.1` | `4.2.1` | **major** ✅ | **active** | v4 migrada, CVE corregido |
| **SheetJS** | `0.20.2` | `0.20.3` | patch | active | — |
| **QRCode (npm)** | `1.5.4` | `1.5.4` | — | **active** ✅ | QRCode.js reemplazado |
| **sql.js** | `1.10` | `1.14.1` | minor | active | — |
| **FlexSearch** | `0.7.31` | `0.8.212` | major 🟡 | active | Persistent Indexes |

---

## 3. Alternativas para Librerías Discontinuadas

### CryptoJS `4.2.0` (legacy)

**Situación:** Proyecto oficialmente discontinuado desde 2023. La última versión `4.2.0` corrigió CVE-2023-46233. No habrá más actualizaciones.

**Opciones:**

| Opción | Esfuerzo | Pros | Contras |
|--------|:--------:|------|---------|
| 🔀 **Seguir con 4.2.0** | Ninguno | Sigue funcionando, AES offline sin cambios | Sin fixes futuros |
| 🏗️ **Web Crypto API** | Alto | Cero dependencias, nativa del browser, más rápida | API diferente, refactor completo del cipher |
| 📦 **crypto-es** | Bajo | Misma API que CryptoJS, TypeScript, mantenido | Dependencia externa, mismo peso |

**Recomendación:** Mantener `4.2.0` por ahora. Evaluar migración a Web Crypto API cuando se refactorice el módulo de cifrado.

### QRCode (npm) `1.5.4` ✅

**Situación:** Migrado desde QRCode.js (davidshimjs, abandonado 2015). Ahora usa `qrcode` npm v1.5.4 (soldair/node-qrcode, activo).

**API:** `QRCode.toDataURL(text, options)` → devuelve Promise\<string\>. `QRCode.toCanvas(canvas, text, options)`. Ambas compatibles con UMD browser.

### animate.css `4.1.1` (legacy)

**Situación:** Último release 2020. CSS de animaciones raramente necesita cambios.

**Recomendación:** Mantener. Si se necesita algo nuevo, usar `@keyframes` CSS nativo.

---

## 4. Herramientas Globales

| Herramienta | Versión | Estado |
|-------------|---------|--------|
| **Node.js** | `v24.14.0` | ✅ Actual |
| **OpenCode** | `1.17.13` | ✅ Actual |
| **Bun** | `1.3.14` | ✅ Actual |
| **Neutralino CLI** | `11.7.2` | ✅ Actual |
| **Neutralino Framework** | `6.0.0` | ⚠️ `6.8.0` disponible |
| **OpenPencil** | `0.13.2` | ✅ Actual |

---

## 5. Comandos

```powershell
# Verificar versiones (read-only)
.\scripts\update-libs.ps1

# Verificar y aplicar actualizaciones
.\scripts\update-libs.ps1 -Apply

# Verificar una librería específica
.\scripts\update-libs.ps1 -Lib alpinejs

# Output JSON para procesamiento
.\scripts\update-libs.ps1 -Json
```

```powershell
# Verificar que las URLs de CDN funcionan
curl -I "https://cdn.jsdelivr.net/npm/alpinejs@3.15.12/dist/cdn.min.js"
curl -I "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.0.14/dist/index.global.js"
curl -I "https://cdn.jsdelivr.net/npm/daisyui@5.6.14/daisyui.css"
curl -I "https://cdn.jsdelivr.net/npm/daisyui@5.6.14/themes.css"
```
