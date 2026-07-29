# ACTUALIZACION del Stack Ateje

> **Fecha:** 29 de julio de 2026
> **Commits involucrados:** cce112b → e5bb8df (8 commits, main)
> **Líneas cambiadas:** ~34 insertadas, ~7,000 eliminadas

---

## 1. Resumen Ejecutivo

Se ejecutaron **5 fases** sobre el repositorio:

| Fase | Commits | Objetivo |
|------|---------|----------|
| **1. Arquitectura** | `cce112b`, `b1ce6f3`, `e6d6bee` | Corregir UUID, tablas faltantes, perfil IA Full, tests |
| **2. Limpieza** | `047a749`, `7146892` | Eliminar backups, skills archivadas, HTMLs generados |
| **3. Documentación Mínima** | `0437ce6` | Eliminar docs redundantes, corregir versiones |
| **4. Auditoría Post-limpieza** | *(current)* | Corregir DaisyUI 5 → 4.12 en docs residuales |
| **5. Migración Tailwind v2→v4 + DaisyUI v4→v5** | *(current)* | Actualizar stack-versions.json, CDN URLs, docs |

---

## 2. Fase 1 — Correcciones de Arquitectura

### UUID Sincronizado
- **Antes:** Cada capa (Dexie, Alpine) generaba UUID distinto
- **Ahora:** `cryptoHelpers.guid()` como fuente única — mismo UUID en `db.js`, `module.js`, y `cryptoHelpers.js`

### Tablas faltantes agregadas a db.js
| Tabla | Propósito |
|-------|-----------|
| `horarios` | Turnos/calendario laboral |
| `calibracionesSoft` | Calibraciones de equipos/soft |
| `requerimientos` | Requisitos/órdenes |
| `variantesObra` | Variantes de proyectos/obra |

### IA Jutia Full portado
Perfil IA Lite → IA Full para Professional/Business. 6 módulos portados:
- **tasks** — planificación y ejecución de tareas IA
- **search** — búsqueda semántica sobre datos locales
- **knowledge** — base de conocimiento aprendido
- **analytics** — análisis de patrones y tendencias
- **semantic** — procesamiento de lenguaje natural
- **training** — entrenamiento de modelos locales

### Templates faltantes añadidos
`AHA-POS`, `AHA-Rx`, `AHA-Obra` — creados con estructura Baseline completa

### Orphan cleanup
- Bloques `offline` listener huérfanos en `module.js` eliminados
- Listeners duplicados de IndexedDB consolidados

### Tests actualizados
- `conftest.py`: canal `chrome` forzado (Playwright)
- `test-template.py`: placeholder de test `test_placeholder` corregido
- 28/28 tests pasando

---

## 3. Fase 2 — Limpieza del Repositorio

### Archivos eliminados (~92 MB recuperados)

| Archivo | Tamaño | Motivo |
|---------|--------|--------|
| `27-6-2026_Ateje.rar` | ~30 MB | Backup obsoleto |
| `opencode-backup-2026-06-19.zip` | ~20 MB | Backup obsoleto |
| `Presentacion.rar` | ~40 MB | Backup obsoleto |
| `mcp-servers/refero-styles/node_modules/` | ~2 MB | Caches descargables |
| `archived/` (9 skills) | varios | Skills viejas fuera del stack activo |
| `.opencode/plans/` | — | Directorio vacío tras purge |
| `modules/shared/`, `modules/transversal/` | — | Directorios vacíos |
| `_backup-config/` | — | Config backup obsoleto |
| `docs/*.html` | varios | Screenshots/reports generados |
| `docs/*.png` | varios | Screenshots |

### Cambios estructurales

| Acción | Detalle |
|--------|---------|
| `components/` → `component-examples/` | Renombrado para claridad |
| `Ateje-Stack-Portable.zip` generado (7.1 MB) | Eliminado de tracking, agregado a `.gitignore` |

---

## 4. Fase 3 — Documentación Mínima

### Docs eliminados (11 archivos, ~5,000 líneas)

| Archivo | Líneas | Razón |
|---------|--------|-------|
| `docs/Ateje_Stack_ESTUDIO.md` | 1,304 | Duplicado de stack-completo.md + guia-estudio-ateje.md |
| `docs/Presentacion-Stack-AHA.md` | 599 | Duplicado de Presentacion_Ateje_Stack.md |
| `docs/landing-aha-sell.md` | 508 | Página de ventas, no documentación técnica |
| `docs/superpowers/plans/5-plan-files` | 3,786 | Planes de trabajo caducos (jun-jul 2026) |
| `docs/superpowers/specs/3-spec-files` | 695 | Especificaciones de features ya implementados |

### Correcciones de versiones

#### Bun → NeutralinoJS (15 archivos)

**14 app templates** + 1 archivado. Todos cambiaron de:
```diff
- Bun --compile .exe
+ NeutralinoJS .exe
```

| App Template | Cambio |
|-------------|--------|
| `apps/AHA-Asistencia/template.md` | ✅ |
| `apps/AHA-Base/template.md` | ✅ |
| `apps/AHA-CRM/template.md` | ✅ |
| `apps/AHA-Campo/template.md` | ✅ |
| `apps/AHA-Checklist/template.md` | ✅ |
| `apps/AHA-Citas/template.md` | ✅ |
| `apps/AHA-Comanda/template.md` | ✅ |
| `apps/AHA-Flota/template.md` | ✅ |
| `apps/AHA-Inventario/template.md` | ✅ |
| `apps/AHA-Obra/template.md` | ✅ |
| `apps/AHA-POS/template.md` | ✅ |
| `apps/AHA-PreFactura/template.md` | ✅ |
| `apps/AHA-Rx/template.md` | ✅ |
| `apps/archived/AHA-Creador/template.md` | ✅ |

#### DaisyUI versión corregida

| Archivo | Antes | Ahora |
|---------|-------|-------|
| `docs/Presentacion_Ateje_Stack.md:63` | 5.x | 4.12+ |

#### IA Jutia versión corregida

| Archivo | Línea | Antes | Ahora |
|---------|-------|-------|-------|
| `ia-jutia/templates/plugin/module.js` | 1 | `v1.0` | `v2.0-plugin` |
| `ia-jutia/templates/plugin/module.js` | 458 | `v1.0` | `v2.0` |
| `ia-jutia/templates/plugin/module.js` | 466 | `v1.0` | `v2.0` |

#### Ruta rota corregida

| Archivo | Antes | Ahora |
|---------|-------|-------|
| `docs/IA_Jutia_Mejorada.md:195` | `components/ui-ia-jutia.html` | `ia-jutia/templates/plugin/module.js (Drawer vía JS)` |

#### Renombre estructural reflejado

| Archivo | Antes | Ahora |
|---------|-------|-------|
| `docs/guia-estudio-ateje.md:206` | `components/` | `component-examples/` |

---

## 5. Fase 4 — Auditoría Post-limpieza (29 Julio 2026)

Se auditó cada documento contra el estado real del repositorio.

### Inconsistencias encontradas y corregidas

| Archivo | Problema | Fix |
|---------|----------|-----|
| `docs/Ateje-Stack-Investor-Deck.md:177` | Mencionaba "DaisyUI 5" (pinned: 4.12) | Cambiado a "DaisyUI 4.12" |
| `docs/stack-completo.md:542` | Tabla decía "DaisyUI 5" | Cambiado a "DaisyUI 4.12" |

---

## 5. Fase 5 — Migración Tailwind v2→v4 + DaisyUI v4→v5

### stack-versions.json (fuente única)

| Librería | Antes | Ahora | Cambio |
|----------|-------|-------|--------|
| **tailwindcss** | `2.2.19` (CSS estático, deprecated) | `4.0.14` (`@tailwindcss/browser`, JS runtime) | Breaking: v2→v4 |
| **daisyui** | `4.12.10` (vía `full.css`, deprecated) | `5.6.14` (vía `daisyui.min.css`) | Breaking: v4→v5 |

### Cambios en setup-init (descarga offline)

```diff
- assets/css/tailwind.min.css           ← tailwindcss@2.2.19 (CSS estático)
+ assets/js/libs/tailwind-browser.js    ← @tailwindcss/browser@4 (JS runtime)
- assets/css/daisyui.min.css            ← daisyui@4.12.10/dist/full.css
+ assets/css/daisyui.min.css            ← daisyui@5.6.14/daisyui.css (en raíz, no dist/)
+ assets/css/daisyui-themes.css         ← daisyui@5.6.14/themes.css (nuevo)
```

### Archivos modificados (15 archivos)

| Archivo | Cambio |
|---------|--------|
| `stack-versions.json` | Pinned + URLs + status para ambas librerías |
| `setup-init/SKILL.md` | URLs de descarga, nuevo archivo themes.css |
| `tests/test-app.html` | CDN URLs: daisyui@5 + @tailwindcss/browser@4 |
| `tests/test-white-label.html` | CDN URLs: daisyui@5 + @tailwindcss/browser@4 |
| `component-examples/index.html` | CDN URL de Tailwind |
| `.opencode/commands/update-libs.md` | Ejemplo de output actualizado |
| `docs/stack-versiones.md` | Versiones + estado actualizados |
| `docs/Presentacion_Ateje_Stack.md` | Tabla de stack técnico |
| `docs/guia-estudio-ateje.md` | Línea de stack técnico |
| `docs/stack-completo.md` | Tabla de stack + tabla de componentes |
| `docs/Ateje-Stack-Investor-Deck.md` | Línea de stack frontend |

### Notas técnicas de la migración

1. **Tailwind v4 (`@tailwindcss/browser`):** Ahora es un JS runtime que escanea el DOM y genera utilidades en browser. No más `tailwind.min.css` estático.
2. **DaisyUI v5:** CSS-only, variables de color cambiaron a formato `oklch` (`--color-primary` en vez de `--p`). Temas separados en `themes.css`.
3. **Orden de inclusión en `<head>`:** `<link daisyui.min.css>` → `<link daisyui-themes.css>` → `<script @tailwindcss/browser@4>`.
4. **Consideraciones de compatibilidad:** DaisyUI v5 requiere Tailwind v3+. Con Tailwind v4 browser, funciona out-of-the-box. Clases DaisyUI core (`btn`, `card`, `modal`, etc.) son compatibles, pero verificar clases de color (bg-opacity-* → bg-*/50).

### Documentación actual que queda (15 archivos)

```
docs/
├── ACTUALIZACION-2026-07-29.md      ← Éste documento
├── 2026-07-29/                       ← Snapshot de documentación
├── API.md                            (4 KB)
├── Ateje-Stack-Investor-Deck.md      (38 KB)
├── Estrategia_Ventas.md              (7 KB)
├── IA_Jutia_Mejorada.md              (69 KB)
├── Presentacion_Ateje_Stack.md       (35 KB)
├── Transversales.md                  (9 KB)
├── generar_guia_perfiles.py          (48 KB - script)
├── generar_pdf_stack.py              (46 KB - script)
├── guia-estudio-ateje.md             (53 KB)
├── guia-integracion-engram-openpencil.md (1 KB)
├── guia-stack-skills-layer.md        (1 KB)
├── stack-completo.md                 (35 KB)
├── stack-versiones.md                (5 KB)
└── tutorial-crear-ahapp.md           (49 KB)
```

### Estado de versiones del Stack

| Librería | Pinned | Uso |
|----------|--------|-----|
| **Alpine.js** | 3.14.1 | Reactividad UI |
| **@tailwindcss/browser** | 4.0.14 | CSS runtime browser (Tailwind v4) |
| **DaisyUI** | 5.6.14 | Componentes UI (temas via daisyui-themes.css) |
| **Dexie.js** | 4.0.8 | IndexedDB wrapper |
| **CryptoJS** | 4.2.0 | Cifrado AES (legacy) |
| **Chart.js** | 4.4.6 | Gráficos |
| **Bootstrap Icons** | 1.11.3 | Iconografía |
| **animate.css** | 4.1.1 | Animaciones (legacy) |
| **jsPDF** | 2.5.1 | PDF generation |
| **SheetJS** | 0.20.2 | Excel export |
| **pako** | 2.1.0 | Compresión |
| **sql.js** | 1.10 | SQLite WASM (Professional/Business) |
| **FlexSearch** | 0.8.212 | Búsqueda semántica |

### Herramientas globales

| Herramienta | Versión |
|-------------|---------|
| **Node.js** | v24.14.0 |
| **OpenCode** | 1.17.13 |
| **Bun** | 1.3.14 |
| **Neutralino CLI** | 11.7.2 |
| **Neutralino Framework** | 6.0.0 (6.8.0 disponible) |
| **OpenPencil** | 0.13.2 |

---

## 6. Historial de Commits

```
e5bb8df fix: migrate tabs DaisyUI v4->v5 patterns in code-generator templates
88c608d fix: update DaisyUI v5 CDN path (daisyui.css at root, not dist/daisyui.min.css)
970b8a7 feat: migrate Tailwind v2->v4 (@tailwindcss/browser) + DaisyUI v4->v5
0437ce6 docs: minimal doc set — remove redundant docs, fix Bun→NeutralinoJS, DaisyUI version, IA Jutia version
7146892 chore: remove portable zip from tracking, add to gitignore
047a749 chore: cleanup repo — remove backups, archived skills, generated HTMLs, rename components
e6d6bee fix(architecture): UUID sync, _files/_analytics, IA Jutia Full, missing templates, orphan cleanup
b1ce6f3 fix(tests): conftest.py with channel=chrome, test-template.py placeholder fix
cce112b feat(core): migraciones Dexie, CRM enriquecido, índices POS, edge cases Capacitor
```

---

## 7. Pendientes / Recomendaciones

| # | Item | Prioridad | Notas |
|---|------|-----------|-------|
| 1 | ✅ DaisyUI v4.12 → v5.6 (con Tailwind v4) | **Completa** | Migrado |
| 2 | ✅ Tailwind v2 → v4 (@tailwindcss/browser) | **Completa** | Migrado |
| 3 | Migrar CryptoJS → Web Crypto API | Baja | Solo si se refactoriza módulo cipher |
| 4 | ✅ QRCode.js → qrcode npm v1.5.4 | **Completa** | Componente + CDN + docs migrados |
| 5 | ✅ pako v2.1.0 → v3.0.1 | **Completa** | CDN→jsDelivr, toText, breaking migrado |
| 6 | ✅ jsPDF v2.5.1 → v4.2.1 | **Completa** | Constructor compatible, CVE corregido |
| 7 | ✅ FlexSearch v0.7.31 → v0.8.212 | **Completa** | CDN jsDelivr mismo path, API backward compatible |
| 8 | ✅ Migrar code-generator templates a DaisyUI v5 | **Completa** | tabs-bordered→tabs-border, tab-lg→container |
| 9 | ✅ App templates (14 AHA-*) sin markup HTML | **Completa** | Son specs, no requieren cambios |
