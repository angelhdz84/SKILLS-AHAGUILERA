# Reporte de Versiones — Stack Ateje

> **Auditoría:** `scripts/update-libs.ps1` | **Manifiesto:** `stack-versions.json`
> **Actualizado:** 2026-07-08

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
| **Tailwind CSS** | `2.2.19` | `4.3.2` | **major** 🔴 | **deprecated** | Migrar a v3 (con DaisyUI) |
| **DaisyUI** | `4.12.10` | `5.6.14` | **major** 🟡 | **deprecated** | v5 con Tailwind v3 |
| **Dexie.js** | `4.0.8` | `4.4.4` | minor | active | — |
| **CryptoJS** | `4.2.0` | `4.2.0` | — | **legacy** 💤 | Web Crypto API (alto) |
| **Chart.js** | `4.4.6` | `4.5.1` | patch | active | — |
| **Bootstrap Icons** | `1.11.3` | `1.13.1` | minor | active | — |
| **animate.css** | `4.1.1` | `4.1.1` | — | **legacy** 💤 | CSS nativo (bajo) |
| **pako** | `2.1.0` | `3.0.0` | **major** 🔴 | active | v3 breaking (TypeScript) |
| **jsPDF** | `2.5.1` | `4.2.1` | **major** 🔴 | active | v3/v4 breaking + fix CVE |
| **SheetJS** | `0.20.2` | `0.20.3` | patch | active | — |
| **QRCode.js** | `1.0.0` | `1.0.0` | — | **legacy** 💤 | qrcode npm (bajo) |
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

### QRCode.js `1.0.0` (legacy)

**Situación:** Proyecto original de davidshimjs abandonado desde 2015. npm `qrcodejs` no recibe actualizaciones.

**Opciones:**

| Opción | Esfuerzo | Pros | Contras |
|--------|:--------:|------|---------|
| 🔀 **Seguir con 1.0.0** | Ninguno | Funciona, 0 dependencias | Sin mantenimiento |
| ✅ **qrcode npm `^1.5.4`** | Bajo | Activo, canvas/SVG/table, 10M semanales | API similar, cambiar nombre de función |
| 🎨 **qr-code-styling** | Medio | QR con estilo (logo, colores, forma) | Más peso, API diferente |

**Recomendación:** Migrar a `qrcode` npm cuando se trabaje en el módulo que lo use. Cambio sencillo.

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
curl -I "https://cdn.jsdelivr.net/npm/tailwindcss@3.4.17/dist/tailwind.min.css"
```
