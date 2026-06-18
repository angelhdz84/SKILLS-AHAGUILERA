---
name: design-engine
description: Aplica diseño visual y UX profesional a apps offline-first. Absorbe design-ux-intelligence + daisyui-patterns + omd:apply + omd:sync + omd:remember + omd:learn. Lee DESIGN.md como autoridad de marca, aplica tokens a componentes DaisyUI, captura correcciones como preferencias persistentes.
license: MIT
compatibility: Requiere specs/[app].md con DESIGN.md (secciones 10-15). Funciona con Alpine.js + DaisyUI 5 + Tailwind CSS.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, full]
  triggers: ["generar codigo", "/build", "disenar", "aplicar diseno", "ui", "interfaz", "modulo", "componente", "make it warmer", "make it cooler", "mas formal", "mas moderno"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "daisyui", "bootstrap-icons", "animate.css"]
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

### Phase 2 — Aplicar tokens a componentes DaisyUI

Para cada módulo que code-generator produzca:

1. **Mapa de tokens**: Traducir DESIGN.md → clases/atributos DaisyUI 5:
   - `primary` / `secondary` / `accent` → data-theme + clases semánticas
   - `border-radius` → rounded-[token]
   - `spacing` → gap/padding/margin según escala
   - `font-family` → tipografía del tema
   - `motion` → duraciones y easings de Animate.css

2. **Componentes**: Usar componentes DaisyUI 5 reales (btn, card, input, modal, drawer, dropdown, tab, badge, table, etc.) — no HTML genérico.

3. **Microcopy**: Aplicar la voz de marca (sección 10) a textos de UI.

4. **Estados**: Cada componente interactivo debe tener: default, hover, focus, active, disabled.

5. **Responsive**: Verificar en 768px y 375px. Mínimo hit area 44x44.

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

### Referencias de marca (286 catálogo OmD)

Disponibles en `~/.opencode/data/reference-fingerprints.json` (si está instalado). Usar como inspiración para paletas, tipografías y tono.

---

## Reglas

- No generar código que viole `stack-compliance-guard` (sin CDNs, sin imports, sin fetch).
- Los tokens de DESIGN.md son autoridad — no inventar hex codes ni valores de spacing.
- Si falta un token en DESIGN.md, usar default de DaisyUI y preguntar al usuario.
- Las correcciones del usuario son ley — `status: pending` sobreescribe DESIGN.md.
