---
# @deprecated — Absorbido por validation-engine
# Motivo: Unificación con validation-offline + omd:designer-review + omd:final-qa en validation-engine
# Migración: validation-engine tiene modo "refactor" que auto-corrige desviaciones de DESIGN.md
name: ux-refactor
description: [DEPRECATED] Absorbido por validation-engine (modo refactor). Audita, recomienda y aplica mejoras de UX/UI a apps offline-first existentes. 4 fases: audit → recommend → implement → validate. Lee codigo existente y lo modifica in-place sin regenerar la app. Orquesta design-ux-intelligence, interaction-patterns, page-structure-patterns y demas skills/patrones.
license: MIT
compatibility: Requiere @AGENTS.md y project.config.js. Funciona sobre apps offline-first existentes (Alpine.js, Tailwind CSS local, DaisyUI, Bootstrap Icons, Animate.css). No usa spec-creator ni code-generator.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  generatedBy: "ux-refactor skill"
  triggers: ["mejorar UI", "mejorar diseño", "cambiar diseño", "refactor UX", "refactorizar interfaz", "cambiar apariencia", "mejorar la interfaz", "hacer mas bonito", "aplicar diseño profesional", "ux audit", "auditoria UX"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  references:
    - "references/audit-checklist.md"
    - "references/pattern-matrix.md"
  orchestrates:
    - "design-ux-intelligence"
    - "visual-design-system"
    - "page-structure-patterns"
    - "form-patterns"
    - "list-page-patterns"
    - "detail-page-patterns"
    - "modal-patterns"
    - "interaction-patterns"
    - "toast-notification-patterns"
    - "navigation-patterns"
    - "info-card-patterns"
    - "data-density-patterns"
    - "status-visualization-patterns"
    - "mobile-responsive-ux"
    - "wcag-accessibility"
    - "keyboard-shortcuts-patterns"
    - "split-panel-patterns"
    - "editor-workspace-patterns"
    - "canvas-grid-patterns"
    - "turn-based-ui-patterns"
    - "event-timeline-patterns"
    - "drag-drop-patterns"
    - "comparison-patterns"
    - "playback-replay-patterns"
    - "stack-compliance-guard"
  mcp:
    - "a11y"
    - "refero-styles"
  noTouch:
    - "Dexie transactions y esquemas de DB"
    - "CryptoJS encrypt/decrypt"
    - "Alpine stores con logica de negocio"
    - "logica CRUD en modulos"
---

# SKILL: ux-refactor (Refactorizacion UX/UI de Apps Offline-First)

> **Proposito**: Mejorar la experiencia de usuario y apariencia visual de apps offline-first existentes, sin regenerarlas desde cero. Auditoria sistematica + plan de accion + implementacion directa sobre el codigo actual.
> **Modo**: 4 fases secuenciales | **Idioma**: ES | **Contexto**: Requiere app offline-first existente + @AGENTS.md
> **Input**: Codigo fuente existente (index.html, core/, modules/, assets/)
> **Output**: Archivos modificados in-place + reporte de cambios en `docs/refactor-[app].md`

---

## REGLAS FUNDAMENTALES

1. **NO regenerar la app** — trabajas sobre el codigo existente, editandolo in-place
2. **NO tocar logica de negocio** — solo HTML/CSS/UX: clases Tailwind, estructura DOM, Alpine x-data/x-show/x-transition,aria attributes, layout, colores, tipografia
3. **NO usar spec-creator, code-generator, setup-init** — esta skill es independiente
4. **SI orquestar** skills de patrones (design-ux-intelligence, form-patterns, etc.) y MCPs (a11y, refero-styles) como oraculos de consulta
5. **Validar con stack-compliance-guard** al final — asegurar que no se introdujeron CDNs, imports, ni violaciones del stack

## CUANDO ACTIVARSE

El usuario dice frases como:
- "mejorar la UI de [app]"
- "cambiar el diseño de [app]"
- "hacer mas bonito [app]"
- "refactorizar la interfaz de [app]"
- "aplicar diseño profesional a [app]"
- "auditar UX de [app]"
- "mejorar aspecto visual de [app]"

---

## FASE 1: AUDITORIA

```
[▓▓▓▓░░░░░░░░░░░░] 25% • Auditando UX/UI actual...
(design-ux-intelligence + audit-checklist + a11y MCP + refero-styles)
```

### Paso 1.1 — Cargar contexto del proyecto
Lee `project.config.js` para entender nombre, tipo, tema, modulos.
Si existe `specs/[app].md`, revisa especificaciones originales para entender que debia hacer la UI.

### Paso 1.2 — Explorar estructura de archivos
Identifica los archivos de la app:
- `index.html` — shell principal
- `core/ui.js`, `core/app.js`, etc. — utilidades existentes
- `modules/*.html` o `modules/*.js` — modulos de la app
- `assets/` — librerias locales

### Paso 1.3 — Ejecutar auditoria sistematica
Usa `references/audit-checklist.md` para revisar cada aspecto. Para cada item:

1. **Inspeccion visual** — Abre la app en navegador (si disponible) o revisa el HTML
2. **Inspeccion de codigo** — Busca clases, atributos, estructura en los archivos
3. **A11y check** — Usa MCP de accesibilidad para verificar contraste, roles, ARIA
4. **Stack check** — Verifica que no haya CDNs, imports, ni violaciones
5. **Refero match** — Si aplica, usa refero-styles para encontrar paletas de marca reales

### Paso 1.4 — Compilar reporte de auditoria
Genera un resumen estructurado:

```
📋 REPORTE DE AUDITORIA UX/UI — [app]

CRITICOS (debe corregirse):
- [ ] [item] — [archivo:linea]
- [ ] [item] — [archivo:linea]

ALTOS (debe corregirse si posible):
- [ ] [item] — [archivo:linea]

MEDIOS (mejora notable):
- [ ] [item] — [archivo:linea]

BAJOS (nice-to-have):
- [ ] [item] — [archivo:linea]

ESTILO RECOMENDADO (de refero-styles):
- [nombre estilo] — [razon]
```

### Paso 1.5 — Pedir confirmacion
Muestra el resumen y pregunta:
```
📊 Auditoria completa. Encontrados [N] items (X criticos, Y altos).
¿Procedo con FASE 2: Recomendacion detallada?
[1] Si, continuar
[2] Mostrar solo criticos/altos
[3] Cancelar
```

---

## FASE 2: RECOMENDACION

```
[▓▓▓▓▓▓▓▓░░░░░░░░] 50% • Generando plan de accion...
(design-ux-intelligence + pattern-matrix + refero-styles)
```

### Paso 2.1 — Seleccionar patrones aplicables
Para cada item de la auditoria, consulta `references/pattern-matrix.md` para determinar que patron/es aplicar. Por cada problema debe haber al menos un patron de remedio.

### Paso 2.2 — Consultar oraculos (si aplica)
Para items especificos, carga la skill de patron correspondiente:
- **Layout**: page-structure-patterns
- **Navegacion**: navigation-patterns
- **Formularios**: form-patterns
- **Modales**: modal-patterns
- **Listas**: list-page-patterns
- **Detalle**: detail-page-patterns
- **Micro-interacciones**: interaction-patterns, toast-notification-patterns
- **Datos densos**: data-density-patterns, status-visualization-patterns
- **Responsive**: mobile-responsive-ux
- **Accesibilidad**: wcag-accessibility + a11y MCP
- **Diseno visual**: design-ux-intelligence, visual-design-system

No duplices el contenido de la skill — usala como referencia y adapta sus recomendaciones al contexto especifico de la app.

### Paso 2.3 — Construir plan de accion detallado
Para cada item a corregir, especifica:

```
### [N] — [titulo del cambio]
**Archivo**: `ruta/al/archivo`
**Lineas**: ~[lineas a modificar]
**Skill/patron**: [nombre del patron]
**Cambio concreto**:
- [ ] Reemplazar `[codigo actual]` por `[codigo nuevo]`
- [ ] Agregar `[nuevo codigo]`
- [ ] Eliminar `[codigo a eliminar]`
**Impacto**: [bajo/medio/alto] — [explicacion]
```

### Paso 2.4 — Mostrar plan y esperar confirmacion
```
📋 PLAN DE ACCION — [app]

Prioridad 1 - Criticos (N items):
  [1.1] [titulo] — [archivo]
  [1.2] [titulo] — [archivo]

Prioridad 2 - Altos (N items):
  [2.1] [titulo] — [archivo]

Prioridad 3 - Medios (N items):
  [3.1] [titulo] — [archivo]

Prioridad 4 - Bajos (N items):
  [4.1] [titulo] — [archivo]

Diseño referente: [nombre] de refero.design

✅ ¿Procedo con FASE 3: Implementacion?
[1] Si, todos
[2] Solo criticos y altos
[3] Seleccionar manualmente
[4] Cancelar / modificar plan
```

---

## FASE 3: IMPLEMENTACION

```
[▓▓▓▓▓▓▓▓▓▓▓▓░░░░] 75% • Aplicando cambios UX/UI...
(patrones aplicados + edits directos al codigo)
```

### Paso 3.1 — Aplicar cambios por archivo
Procesa las modificaciones en orden de prioridad (critico → alto → medio → bajo). Para cada cambio:

1. **Lee el archivo** actual (estado mas reciente)
2. **Aplica la edicion** con `edit` o `write`
3. **Verifica** que el cambio sea correcto sintacticamente
4. **Pasa al siguiente** sin esperar confirmacion (a menos que el cambio sea ambiguo)

**Reglas de implementacion:**
- Cambios de clases Tailwind: solo modifica strings de clase (`class="..."`)
- Cambios de estructura: modifica el HTML (agregar/quitar elementos, atributos)
- Cambios de Alpine: modifica x-data, x-show, x-transition, x-cloak
- No toques: funciones Dexie, CryptoJS, logica de modulos, nombres de variables JS

### Paso 3.2 — Aplicar refero-styles (opcional)
Si en FASE 2 se selecciono un estilo de refero-styles:
1. Carga `refero_get_design_md` para el estilo seleccionado
2. Extrae paleta de colores y aplica variables CSS en `core/theme.js` o en `<style>` del index
3. Ajusta clases DaisyUI si el tema lo requiere

### Paso 3.3 — Reporte de cambios aplicados
Tras cada ronda de cambios, muestra progreso:

```
✅ [3/15] • [titulo del cambio] — [archivo] — OK
✅ [4/15] • [titulo del cambio] — [archivo] — OK
⚠️ [5/15] • [titulo] — requiere decision manual
```

### Paso 3.4 — Confirmar fin de implementacion
```
📦 Implementacion completada: [N] cambios aplicados, [M] pendientes.
¿Procedo con FASE 4: Validacion?
[1] Si, validar todo
[2] Validar solo cambios criticos
[3] Revisar manualmente antes
```

---

## FASE 4: VALIDACION

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓] 100% • Validando cambios...
(stack-compliance-guard + lighthouse + checklist)
```

### Paso 4.1 — Stack compliance check
Ejecuta `stack-compliance-guard` sobre los archivos modificados:
- ¿Hay CDNs introducidas? ❌
- ¿Hay imports ES6? ❌
- ¿Hay type="module"? ❌
- ¿Hay fetch a URLs externas? ❌
- ¿Hay cifrado omitido donde se requiere? ❌
- Librerias adicionales en assets/? ✅

### Paso 4.2 — Verificacion de checklist
Re-corre los items criticos de `audit-checklist.md` que se marcaron como corregidos para confirmar:

```
✅ [x-cloak] — CSS rule presente en index.html
✅ [loading states] — botones tienen btn loading en operaciones async
✅ [responsive] — grid usa col-1 sm:col-2 lg:col-3
...
```

### Paso 4.3 — Lighthouse / a11y check (opcional)
Si el usuario tiene la app abierta en navegador:
- Ejecuta auditoria Lighthouse (accesibilidad, SEO, best practices)
- Verifica contraste con a11y MCP
- Toma screenshot de antes/despues

### Paso 4.4 — Generar reporte final
Guarda el reporte completo en `docs/refactor-[app].md`:

```
# Reporte de Refactorizacion UX/UI — [app]

Fecha: [fecha]
Skill: ux-refactor v1.0
App: [nombre]
Archivos modificados: [N]

## Cambios realizados

### Criticos (N)
- [x] [item] — resuelto
- [ ] [item] — pendiente (razon)

### Altos (N)
- [x] [item] — resuelto

### Medios (N)
- [x] [item] — resuelto

### Bajos (N)
- [x] [item] — resuelto

## Diseno referente
[estilo] de refero.design

## Resultados validacion
- Stack compliance: ✅
- Lighthouse accessibility: [score]
- Lighthouse best practices: [score]
- Items checklist verificados: [N/M]

## Screenshots
[antes.png] [despues.png] (si se tomaron)
```

### Paso 4.5 — Resumen final

```
✅ REFACTORIZACION COMPLETADA — [app]

Resumen:
- Archivos modificados: [N]
- Items corregidos: [N] (Criticos: [N], Altos: [N], Medios: [N])
- Stack compliance: ✅
- Lighthouse a11y: [antes → despues]
- Reporte: docs/refactor-[app].md

💡 Tip: Revisa la app en el navegador para confirmar los cambios.
Si algo no se ve bien, puedo ajustarlo.
```
