---
name: design-engine
description: Aplica diseño visual y UX profesional a apps offline-first. Absorbe design-ux-intelligence + daisyui-patterns + alpine-ui-patterns + omd:apply + omd:sync + omd:remember + omd:learn. Lee DESIGN.md como autoridad de marca, aplica tokens a componentes DaisyUI o alpine-ui-patterns (Pines/Penguin/Pinemix) según preferencia, captura correcciones como preferencias persistentes.
license: MIT
compatibility: Requiere specs/[app].md con DESIGN.md (secciones 10-15). Funciona con Alpine.js + DaisyUI 5 + Tailwind CSS + alpine-ui-patterns (Pines/Penguin/Pinemix alternativa).
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, professional, business]
  triggers: ["generar codigo", "/build", "disenar", "aplicar diseno", "ui", "interfaz", "modulo", "componente", "make it warmer", "make it cooler", "mas formal", "mas moderno"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "daisyui", "alpine-ui-patterns", "bootstrap-icons", "animate.css"]
  language: es
  requires: [spec-engine]
---

# design-engine — Brand Context Injection + Design Tokens

> **Propósito**: Asegurar que toda UI generada respete la identidad de marca definida en DESIGN.md, aplicando tokens visuales a componentes DaisyUI 5 reales. Captura correcciones del usuario como preferencias persistentes.
> **Idioma**: ES | **Contexto**: Requiere `specs/[app].md` (secciones 10-15 opcionales)

---

## Fases

### Phase 0 — Dispatch (primero)

Antes de cualquier acción, determinar el modo:

| Patrón de solicitud | Modo | Acción |
|--------------------|------|--------|
| "módulo [X]", "pantalla de [Y]", "componente [Z]" | **Inline** | Aplicar DESIGN.md directamente al output de code-generator |
| "landing", "home", "primera pantalla", "full diseño" | **Harness** | Sugerir `/pro` (pipeline-engine modo Design 10 fases) |
| "más formal", "más cálido", "make it warmer" | **Tweak** | Ajustar tokens existentes sin cambiar DESIGN.md |
| "recuerda que...", "siempre haz...", "nunca uses..." | **Capture** | Guardar preferencia vía Phase 4 |
| "preference", "mis preferencias", "taste" | **Dashboard** | Leer y mostrar `.omd/preferences.md` |

### Phase 1 — Cargar contexto de marca

1. Leer `specs/[app].md` completo. Si tiene secciones 10-15 (DESIGN.md), esas son la autoridad.
2. Si no existe spec pero hay `DESIGN.md` en la raíz del proyecto, leer ese.
3. Si existe `.omd/preferences.md`, leerlo — las entradas `status: pending` tienen PRIORIDAD sobre DESIGN.md (son correcciones del usuario aún no integradas).
   - **`component_library`**: Leer preferencia de librería de componentes: `auto` | `daisyui` | `pines` | `penguin` | `pinemix`. Default: `auto`.
   - Este valor determina la **selección de librería** en Phase 2.
4. Si existe `assets/_reference/<id>/` (captura live de omd:reference-capture):
   - `tokens.json` → `live_overrides` tienen prioridad sobre DESIGN.md para tokens visuales
   - `fonts.json` → fuentes observadas en vivo
   - `structure.json` → patrones de composición

**Prioridad de resolución**:
```
.omd/preferences.md (pending)
  > assets/_reference/<id>/tokens.json#live_overrides  (tokens visuales)
  > DESIGN.md / specs/[app].md secciones 10-15           (esencia: voz, principios)
  > defaults de DaisyUI 5                                (fallback)
```

### Phase 1.5 — Design Token Extraction via OpenPencil (opcional, Business)

Si OpenPencil CLI está instalado y existe `assets/brand/` con archivos `.fig`, extraer tokens automáticamente:

```bash
# Extraer paleta de colores
openpencil analyze colors assets/brand/brand.fig --json > assets/brand/tokens-colors.json

# Extraer tipografía
openpencil analyze typography assets/brand/brand.fig --json > assets/brand/tokens-typography.json

# Extraer espaciado y radios
openpencil analyze spacing assets/brand/brand.fig --json > assets/brand/tokens-spacing.json

# Extraer variables de diseño
openpencil variables assets/brand/brand.fig --json > assets/brand/tokens-variables.json
```

Los tokens extraídos se inyectan en la prioridad de resolución:

```
.tokens/*.json (extraídos por OpenPencil)
  > assets/brand/*.fig                        (raw design file)
  > .omd/preferences.md                       (correcciones del usuario)
  > DESIGN.md / specs/[app].md secciones 10-15 (esencia: voz, principios)
  > defaults de DaisyUI 5                     (fallback)
```

**Nota importante**: OpenPencil exporta a Tailwind v4 puro (no DaisyUI). Los tokens extraídos (colores HEX, tipografías, espaciados) se aplican a DaisyUI 5 vía `@theme`. El resultado visual es el mismo porque DaisyUI usa los mismos tokens.

**Si OpenPencil no está instalado o no hay .fig disponible**, esta fase se omite y DESIGN.md se escribe a mano como hasta ahora.

---

### Phase 2 — Seleccionar librería de componentes + aplicar tokens

Para cada módulo que code-generator produzca:

#### Step 2.0 — Decision tree de librería de componentes

Leer `component_library` de `.omd/preferences.md`. Si no existe, usar `auto`.

| Valor | Estrategia | Descripción |
|-------|-----------|-------------|
| `auto` | DaisyUI → fallback | Usar DaisyUI 5 para todo. Si el componente no existe en DaisyUI, mirar `alpine-ui-patterns` categoría A → B → C |
| `daisyui` | DaisyUI → fallback a alpine-ui-patterns | Igual que `auto` (DaisyUI es default) |
| `pines` | Pines → fallback | Usar Pines UI primero (vía `alpine-ui-patterns/SKILL.md`). Fallback Penguin → Pinemix → DaisyUI |
| `penguin` | Penguin → fallback | Usar Penguin UI primero. Fallback Pines → Pinemix → DaisyUI |
| `pinemix` | Pinemix → fallback | Usar Pinemix primero. Fallback Pines → Penguin → DaisyUI |

**Regla**: Si la librería preferida tiene el componente en categoría A o B de `alpine-ui-patterns`, usarla. Si no, cascada según la fila.

**Excepción**: Componentes de sistema (layout, sidebar, navbar, drawer) siempre DaisyUI por compatibilidad con Alpine + `x-show` + `$persist`.

#### Step 2.1 — Mapa de tokens

Traducir DESIGN.md → clases/atributos de la librería seleccionada:

| Design token | DaisyUI 5 | Pines/Penguin/Pinemix |
|-------------|-----------|----------------------|
| `primary` | `btn-primary`, `bg-primary`, `text-primary` | `bg-blue-600`, `text-blue-600` (mapear al color brand) |
| `border-radius` | `rounded-box`, `rounded-btn` | `rounded-lg` |
| `spacing` | `gap-*`, `p-*`, `m-*` DaisyUI scale | `gap-*`, `p-*`, `m-*` Tailwind estándar |
| `font-family` | `font-sans` (theme) | `font-sans` (Tailwind) |
| `shadow` | `shadow-sm`, `shadow-xl` | Mismos valores Tailwind |
| `motion` | Transiciones DaisyUI | `transition ease-out duration-*` de Alpine |

#### Step 2.2 — Componentes

Usar componentes de la librería seleccionada en Step 2.0.

- Si `daisyui` o `auto`: btn, card, input, modal, drawer, dropdown, tab, badge, table, etc.
- Si `pines`: patrones de `alpine-ui-patterns/SKILL.md` categoría Pines (categoría A para dropdown, modal, toast, command, tooltip, etc.)
- Si `penguin`: patrones Penguin UI (para avatar, steps, carousel, chat-bubble, spinner, etc.)
- Si `pinemix`: patrones Pinemix (para accordion, tabs, range-slider, tag-input, etc.)

**Compatibilidad**: Las clases DaisyUI (`btn`, `card`, `alert`, `badge`, `kbd`, `table`, `input`) son compatibles con los 3 Alpine libs. No es necesario reemplazarlas. Mezclar libremente.

#### Step 2.3 — Microcopy

Aplicar la voz de marca (sección 10) a textos de UI — independiente de la librería.

#### Step 2.4 — Estados

Cada componente interactivo debe tener: default, hover, focus, active, disabled. Verificar que los patrones de `alpine-ui-patterns` incluyan estos estados.

#### Step 2.5 — Responsive

Verificar en 768px y 375px. Mínimo hit area 44x44.

### Phase 3 — Aplicar checklist UX crítico

- ❌ No más de 2 colores saturados por viewport (principio Toss).
- ✅ Jerarquía tipográfica correcta: h1, h2, h3 sin saltos de nivel.
- ✅ Estados vacío/error/loading visibles en cada lista o tabla.
- ✅ Animaciones con `prefers-reduced-motion` guard.
- ✅ Iconos Bootstrap Icons (no emojis para funciones).
- ✅ Tooltips para iconos sin label.
- ✅ Contraste AA (4.5:1 texto normal, 3:1 texto grande).

### Phase 4 — Captura de correcciones (omd:remember)

Si el usuario corrige un diseño ("no, usa azul más oscuro", "esto no va aquí", "siempre haz X"):

1. Generar ID único: `pref_<timestamp base36>_<8 hex>`
2. Detectar scope según keywords (color, typography, spacing, components.button, etc.)
3. Guardar en `.omd/preferences.md` con `status: pending`
4. Confirmar: "Preferencia guardada. Puedes pedir 'integra preferencias' para aplicarla permanentemente."

**No preguntar "¿lo guardo?"** — guardar siempre automático con confirmación de una línea.

### Phase 5 — Sync (opcional)

Si se modificó DESIGN.md o preferencias, actualizar shims necesarios para que otros agentes (futuras sesiones) lean el mismo contexto. Esto replica la función de omd:sync.

---

## Conocimiento interno

### Patrones DaisyUI 5 para Alpine.js offline-first

- `x-data` para estado local, `Alpine.store()` para estado global.
- `$persist` para preferencias del usuario (tema, idioma).
- Modales con `x-show` + `@click.away`.
- Drawer lateral con checkbox + `@click`.
- Dropdowns con `x-data="{ open: false }"` + `@click.outside`.
- Tabs con `x-data="{ tab: '1' }"`.
- Tablas responsivas con overflow-x-auto.

### alpine-ui-patterns — Catálogo unificado Pines/Penguin/Pinemix

Skill en `alpine-ui-patterns/SKILL.md`. Catálogo de ~100 componentes de 3 librerías Alpine.js + Tailwind.

- **Pines UI** (devdojo.com/pines): 40+ componentes avanzados (command palette, context menu, date picker, text animation)
- **Penguin UI** (penguinui.com): 30+ componentes con 6 temas (Arctic, Modern, Minimal, Neo Brutalism, etc.)
- **Pinemix** (pinemix.com): 30 componentes (accordion, tabs, range-slider, tag input, tree view)

**Prioridad por categoría** en `alpine-ui-patterns/SKILL.md`:
- **A** — Mejor implementación (referencia de calidad)
- **B** — Alternativa sólida
- **C** — Exclusivo de una fuente (sin fallback)

**Fallback chain**: `preferida → siguiente → ... → DaisyUI`

### Referencias de marca (286 catálogo OmD)

Disponibles en `~/.opencode/data/reference-fingerprints.json` (si está instalado). Usar como inspiración para paletas, tipografías y tono.

---

## Reglas

- No generar código que viole `stack-compliance-guard` (sin CDNs, sin imports, sin fetch).
- Los tokens de DESIGN.md son autoridad — no inventar hex codes ni valores de spacing.
- Si falta un token en DESIGN.md, usar default de DaisyUI y preguntar al usuario.
- Las correcciones del usuario son ley — `status: pending` sobreescribe DESIGN.md.
