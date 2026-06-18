---
name: spec-engine
description: Genera especificaciones funcionales + DESIGN.md brand layer para apps offline-first. Reemplaza spec-creator + omd:init + omd:taste. Fase de discovery con referencias de marca reales (286 brands del catálogo oh-my-design). Output en specs/[app].md con 15 secciones.
license: MIT
compatibility: Requiere @AGENTS.md. Invoca omd:init para selección de referencias de marca.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  perfiles: [lite, full]
  triggers: ["definir spec app", "especificacion", "historia de usuario", "definir app", "/spec", "design system", "set up our design system"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  requires: [omd:init]
---

# spec-engine — Especificación Técnica + Brand Layer

> **Propósito**: Transformar una idea de app en una especificación técnica validada, que incluye tanto el modelo funcional (secciones 1-9) como la identidad de marca (secciones 10-15, formato DESIGN.md v0.1).
> **Idioma**: ES | **Output**: `specs/[app].md` (15 secciones)

---

## Fases

### Phase 1 — Discovery con referencias de marca

Preguntar al usuario (máximo 2 preguntas):

1. **Tipo de proyecto**: SaaS / landing / dashboard / e-commerce / comunidad / herramienta interna / movilidad / salud / fintech / productividad
2. **Tono / keywords**: warm, minimal, premium, playful, formal, clinical, editorial, dense, airy, etc.

Si el usuario menciona una marca existente ("como Linear", "estilo Stripe", "tipo Toss"), usar esa referencia directamente. Si no, proponer:

```
Para tu [tipo de proyecto] recomiendo inspiración en [referencia] — [estilo visual + keywords].
Otras opciones: [ref2], [ref3], [ref4], [ref5].
¿Te parece bien o prefieres otra?
```

Usar el catálogo de 286 referencias oh-my-design (en `~/.opencode/skills/omd-init/` o `node_modules/oh-my-design-cli/data/`).

### Phase 2 — Configuración rápida

Recolectar:

```text
📦 Nombre del proyecto: [Ej: ClinicaDentalPro]
🎯 Tipo de app: [Ej: Gestión de citas y pacientes]
💡 Descripción breve (1-2 líneas): [Ej: App para recepcionistas. Todo offline.]
🎨 Referencia de marca: [id o "ninguna"]
🔑 Módulos requeridos: [Ej: dashboard, pacientes, citas, reportes, settings]
📦 Perfil: [lite/full]
🧠 IA Jutia: [lite/full/no]
```

### Phase 3 — Functional spec (secciones 1-9)

1. **Descripción general** — Propósito, audiencia, problema que resuelve.
2. **Stack técnico** — Alpine.js, Dexie, CryptoJS, Tailwind + DaisyUI, Bootstrap Icons, Animate.css.
3. **Modelo de datos** — Tablas Dexie con campos, índices, cifrado. Si Full: schema SQL adicional.
4. **Módulos** — Lista de módulos con sus responsabilidades y relaciones.
5. **Flujos de usuario** — Journeys principales por módulo.
6. **Reglas de negocio** — Validaciones, cálculos, constraints.
7. **Perfiles** — Lite vs Full: diferencias concretas.
8. **Pruebas** — Estrategia: Playwright E2E + pytest.
9. **Librerías adicionales** — Detectadas de la descripción (setup-init las inyecta).

### Phase 4 — Brand spec / DESIGN.md (secciones 10-15)

Solo si se seleccionó una referencia de marca. Generar siguiendo el estándar OmD v0.1:

10. **Brand Voice** — Tono, registro, longitud de frases, reglas de microcopy.
11. **Brand Narrative** — Historia de la marca, tesis central, tagline.
12. **Design Principles** — 3-5 principios rectores.
13. **Personas** — 2-4 segmentos de usuario target.
14. **States** — Loading, empty, error, edge cases para cada componente clave.
15. **Motion Design** — Duraciones, easings, patrones de transición.

Si no se seleccionó referencia, esta sección se omite (la UI usará el theme por defecto de DaisyUI).

### Phase 5 — Taste Dashboard (post-spec)

Después de generar la spec, si existe `.omd/preferences.md`:

- Leer preferencias guardadas
- Mostrar resumen: "Tengo N preferencias registradas de sesiones anteriores. ¿Quieres que las revise e integre en esta spec?"

---

## Asunciones 4+1

Para cada asunción rechazada, usar barra de progreso: `[🟩🟩🟨⬜⬜]`
Ofrecer 4 opciones + "Otra", esperar respuesta una por una.

---

## Output

```markdown
# spec: [app]
## 1. Descripción
## 2. Stack técnico
## 3. Modelo de datos
## 4. Módulos
## 5. Flujos de usuario
## 6. Reglas de negocio
## 7. Perfiles (Lite/Full)
## 8. Pruebas
## 9. Librerías Adicionales
## 10. Brand Voice          ← solo si hay referencia
## 11. Brand Narrative      ← solo si hay referencia
## 12. Design Principles    ← solo si hay referencia
## 13. Personas             ← solo si hay referencia
## 14. States               ← solo si hay referencia
## 15. Motion Design        ← solo si hay referencia
```

## Reglas

- No generar asunciones técnicas (solo funcionales/de negocio).
- Las referencias de marca son inspiración, no dogma — adaptar al stack offline-first.
- Las referencias OmD pueden asumir Google Fonts CDN → adaptar a `assets/fonts/`.
- Si no hay catálogo OmD instalado, preguntar manualmente por preferencias de estilo.
