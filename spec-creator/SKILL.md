---
name: spec-creator
description: Genera especificaciones funcionales a partir de historias de usuario. Usa esta skill cuando el usuario quiera definir requisitos, crear specs, o transformar historias de usuario en documentos técnicos. Gestiona asunciones de forma interactiva (no asumas nada sin confirmar).
license: MIT
compatibility: OpenCode
metadata:
  author: User
  version: "2.1"
---

# 🎯 SKILL: spec-creator (Especificaciones Funcionales)

> **Propósito**: Transformar una historia de usuario en una especificación funcional validada, paso a paso.
> **Modo**: Interactivo | **Idioma**: ES | **Contexto requerido**: `@AGENTS.md`

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Recepción + Generación de Asunciones
1. Recibe la historia de usuario.
2. Pregunta: "¿Cuántas asunciones prefieres?" (por defecto: 6, rango: 4-8).
3. Genera **lista numerada de asunciones NO técnicas/NO funcionales** según la cantidad acordada.
4. No escribas la spec completa aún, solo el listado.
5. Pregunta: "¿Qué números de asunciones te gustaría modificar?"

🎨 CONFIGURACIÓN DE DISEÑO (Opcional pero recomendado)
¿Prefieres un tono visual específico para esta app?
[1] Profesional limpio  [2] Moderno vibrante  [3] Minimalista premium
[4] Editorial  [5] Retro-futurista  [6] Usar defaults de project.config.js

🎯 Diferenciador clave (máx 10 palabras): ____________________

♿ Prioridad UX principal: [accesibilidad / táctil / responsive / forms / animación]

### 🟡 FASE 2: Refinamiento Iterativo (Máx 8 preguntas)
1. Espera que el usuario indique qué números cambiar (ej: `2, 4, 7`).
2. Para CADA número marcado:
   - Muestra progreso: `[▓▓▓░░░░░░░░░░░] 25% • Pregunta 1/4`
   - Presenta la asunción + 4 opciones predefinidas + `[5] Otra`
   - Espera respuesta. Si `5`, pide especificación libre.
   - Actualiza spec interna.
   - Avanza.
3. Si el usuario dice `Todas correctas` o no hay cambios, pasa a Fase 3.

### 🔴 FASE 3: Generación de Spec + Archivo
1. Lee el template en `references/template.md` para la estructura exacta.
2. Compila la spec final siguiendo las 7 secciones del template.
3. Guarda en: `specs/[nombre-app].md`
4. Crea el directorio `specs/` si no existe.
5. Mensaje final:
    ```
    ✅ Especificación generada en specs/[nombre].md
    ¿Procedo a implementar o prefieres ajustar algo más?
    ```

---

## 🛡️ AUTOVALIDACIÓN CONTRA @AGENTS.md
Antes de cualquier output, lee `references/checklist.md` y verifica cada punto.
Usa la checklist completa para asegurar que la spec cumple con los estándares offline-first.

---

## 💬 FORMATO DE PREGUNTAS (Fase 2)
```
[▓▓▓░░░░░░░░░░░] {porcentaje}% • Pregunta {actual}/{total}

Asunción #{n}: "{texto}"

Opciones:
[1] {Opción conservativa}
[2] {Opción alternativa}
[3] {Opción mínima/viable}
[4] {Opción avanzada}
[5] Otra → (especifica)

Tu respuesta: 
```

---

## 📋 LISTA DE ASUNCIONES BASE
1. **Arquitectura**: SPA hash-based, router simple en `core/app.js`.
2. **Datos**: IndexedDB vía Dexie, sin JOINs complejos.
3. **Seguridad**: Clave cifrado en localStorage.
4. **UI/UX**: Mobile-first, modo oscuro/claro persistente, animaciones `fadeInUp`.
5. **Módulos**: Todos activables/desactivables en `project.config.js`.
6. **Backup**: Manual a JSON/PDF, comprimido con pako si >1MB.
7. **Validación**: Formularios con feedback inmediato, español.
8. **Entrega**: Web (ZIP) + `GUIA_USUARIO.md`.

---

## 🚀 TRIGGERS RECONOCIDOS
- `definir spec`
- `nueva especificación`
- `crear especificación`
- `crear specs`
- `generar especificación`
- `definir requisitos`
- `especificación funcional`
- `historia de usuario`
- `spec-creator`

---

## 📂 RECURSOS

Cuando necesites los templates o checklists, lee estos archivos:
- `references/template.md` — Plantilla de spec final
- `references/checklist.md` — Autovalidación contra @AGENTS.md

Tras generar cada módulo, ejecutar mentalmente stack-compliance-guard antes de mostrar output.
Si hay correcciones, aplicarlas silenciosamente y añadir nota al final: 🛡️ Ajustado a reglas offline-first.