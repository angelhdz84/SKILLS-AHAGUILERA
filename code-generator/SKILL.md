---
name: code-generator
description: Genera código estructurado y funcional siguiendo estrictamente specs/[app].md y @AGENTS.md. Flujo por fases, validación automática de compliance, y output listo para file:// sin imports ES6.
license: MIT
compatibility: Requiere @AGENTS.md, specs/[app].md, project.config.js presentes. Funciona offline-first, sin builds, sin CDNs, sin imports.
metadata:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  generatedBy: "code-generator skill"
  triggers: ["generar codigo", "crear módulos", "implementar spec", "build app", "escribir código", "code-generator"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  inputSpec: "specs/[app].md"
  autoValidate: true
---

# 🛠️ SKILL: code-generator (Generación de Código Offline-First)

> **Propósito**: Transformar `specs/[app].md` en código funcional, modular y 100% compatible con `file://`. Entrega por fases para evitar pérdida de contexto, aplica `stack-compliance-guard` automáticamente y respeta `design-ux-intelligence`.
> **Modo**: Iterativo por fases | **Idioma**: ES | **Contexto**: Requiere spec validada + @AGENTS.md
> **Output**: Archivos `.js` y `.html` listos para copiar/pegar o escribir directamente en el proyecto.

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

### 🟢 FASE 1: Carga de Spec y Plan de Ejecución
1. Lee `specs/[app].md` y extrae:
   - Módulos requeridos (`modulosActivos`)
   - Campos sensibles a cifrar
   - Reglas de UI/UX y animaciones
   - Configuración de `project.config.js`
2. Genera un **plan de ejecución breve**:
📋 PLAN DE GENERACIÓN
• Core: app.js, db.js, crypto.js, ui.js, theme.js, main.js, index.html
• Módulos: [lista de módulos desde spec]
• Validación: stack-compliance-guard auto-aplicado
• Entregable: Código por bloques con ruta exacta
✅ ¿Procedo con FASE 2: Core y Shell? (Responde: SÍ)
3. **ESPERA confirmación** antes de continuar.

### 🟡 FASE 2: Core, Shell y Configuración
Genera los archivos base **en un solo bloque bien estructurado** con rutas exactas:
```markdown
📁 CORE / INDEX
### `index.html`
[Contenido completo con orden: CSS → Libs → Core → Main, x-cloak, sin type="module"]

### `core/db.js`
[Iniciación Dexie según spec. Variables globales. window.db expuesto]

### `core/crypto.js`
[encrypt/decrypt + gestión de clave localStorage. window.cryptoHelpers expuesto]

### `core/ui.js`
[toast, confirm, loading, format.currency/date. window.UI expuesto]

### `core/theme.js`
[Inyección de CSS variables desde APP_CONFIG.tema.colores. window.themeStore]

### `core/app.js`
[Router hash-based, carga de módulos, init global. window.appRouter]

### `main.js`
[Punto de entrada. Expone globals, llama a init(), maneja errores]

### `project.config.js`
[Config white-label completa según spec]

⏸️ PAUSA. Revisa estructura. Responde "✅ FASE 2 OK" para continuar.

NO GENERA MÓDULOS AÚN. Espera confirmación.
🔵 FASE 3: Generación de Módulos (Iterativa)
Para cada módulo en la spec:
Genera SOLO UN MÓDULO por turno.
📦 MÓDULO: [nombre-id]
### `modules/[nombre-id]/module.js`
[Lógica CRUD, cifrado automático en campos sensibles, registro en window.MODULES, validación UI, feedback con UI.toast()]

### `modules/[nombre-id]/module.html`
[HTML puro + Alpine x-data/x-init, DaisyUI componentes, Bootstrap Icons en botones, Animate.css en entradas, responsive mobile-first]

🛡️ Stack Compliance: ✅ Validado automáticamente (sin imports, rutas relativas, cifrado aplicado, UI consistente)
⏸️ PAUSA. Responde "✅ [nombre-id] OK" para el siguiente módulo.

Repite hasta completar todos los módulos de la spec.

🟣 FASE 4: Ensamblaje Final y Handoff
Confirma que todos los módulos están generados.
Entrega snippet final de project.config.js con modulosActivos actualizado.
Mensaje de cierre:
✅ GENERACIÓN COMPLETADA
📂 Estructura: lista
🛡️ Compliance: 100% validado
📄 Especificación: specs/[app].md
🚀 Siguiente paso: validar app (ejecuta: validar app)

🛡️ AUTO-COMPLIANCE (EJECUTAR SIEMPRE ANTES DE MOSTRAR CÓDIGO)
Internamente, ejecuta stack-compliance-guard sobre cada bloque:
¿import/export/type="module"? → ELIMINAR + usar variables globales
¿fetch/CDN/URLs absolutas? → REEMPLAZAR por Dexie/assets/
¿Campo sensible sin cryptoHelpers.encrypt()? → AÑADIR CIFRADO
¿UI sin DaisyUI/Bootstrap Icons/Animate.css? → APLICAR COMPONENTES
¿Módulo no sigue contrato (id, init, render, destroy)? → REESCRIBIR
Si falla: corrige silenciosamente y añade 🛡️ Ajustado a reglas offline-first. al output.
📐 PATRONES DE CÓDIGO OBLIGATORIOS
module.js (Estructura Base)
const [NombreModulo] = {
  id: '[id-lowercase]',
  titulo: '[Título Visible]',
  icono: 'bi bi-[icon-name]',

  async init() {
    console.log(`💡 [${this.id}] Inicializado`);
    // Carga única de datos o listeners
  },

  async render(params = {}) {
    // Retorna HTML o manipula #app-content
    // Usa Alpine x-data, DaisyUI, Icons, Animate.css
    return `...`;
  },

  destroy() {
    // Limpieza de intervals/listeners
  },

  // Métodos privados
  async guardar(datos) {
    const registro = {
      // Campos sensibles → cifrar
      nombre: cryptoHelpers.encrypt(datos.nombre),
      email: cryptoHelpers.encrypt(datos.email),
      // No sensibles → directos
      telefono: datos.telefono,
      createdAt: new Date()
    };
    await db.[tabla].put(registro);
    UI.toast('Guardado correctamente', 'success');
  }
};

window.MODULES = window.MODULES || {};
window.MODULES[[NombreModulo].id] = [NombreModulo];

module.html (Reglas UI)
<div x-data="[id]Data()" x-init="init()" class="animate__animated animate__fadeInUp">
  <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
    <i class="bi bi-[icon-name]"></i> [Título]
  </h2>
  
  <!-- Formulario/Tabla con DaisyUI -->
  <div class="card bg-base-100 shadow-xl p-4">
    <label class="form-control w-full">
      <span class="label-text">Nombre</span>
      <input type="text" x-model="form.nombre" class="input input-bordered focus:ring-2 focus:ring-primary" />
    </label>
    <button class="btn btn-primary mt-4" @click="guardar()">
      <i class="bi bi-check-lg"></i> Guardar
    </button>
  </div>
</div>

🔗 INTEGRACIÓN CON OTRAS SKILLs

spec-creator.md
Provee specs/[app].md con estructura, campos sensibles y reglas UI
stack-compliance-guard.md
Se ejecuta automáticamente tras generar cada bloque. Corrige o rechaza si viola reglas
design-ux-intelligence.md
Aplica tono visual, contrastes, espaciado y animaciones según spec
validation-offline.md
Consume el output de esta SKILL. Ejecuta validar app tras completar FASE 4

📝 NOTAS PARA LA IA
NUNCA generes todo de una vez. Respeta las pausas entre fases. OpenCode pierde contexto >15k tokens.
Usa rutas relativas estrictas. Ej: assets/js/libs/alpine.js, NUNCA https://... o ../core/... fuera de index.html.
Comentarios en español. Explica lógica compleja con // 💡 ....
Si la spec es ambigua, pregunta: ❓ La spec no define [campo/regla]. ¿Uso default del stack o prefieres especificar?
Idioma: Todo el output, nombres de variables y comentarios en español.
✨ SKILL ready. Trigger: generar codigo para iniciar.


