---
# @deprecated — Reemplazado por spec-engine
# Motivo: Fusión spec-creator + omd:init + omd:taste en spec-engine con DESIGN.md brand layer
# Migración: Usar `/spec` que activa spec-engine
name: spec-creator
description: [DEPRECATED] Reemplazado por spec-engine. Transforma ideas de apps completas en especificaciones técnicas validadas para stack offline-first. Incluye fase de descubrimiento (brainstorming con preguntas, enfoques y trade-offs), refinamiento interactivo 4+1, auto-revisión, y generación de spec en specs/[app].md.
license: MIT
compatibility: Requiere @AGENTS.md y @project.config.js presentes. Funciona con file://, sin imports ES6, sin CDNs en runtime.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "4.0"
  perfiles: [lite, full]
  generatedBy: "spec-creator skill"
  triggers: ["definir spec app", "nueva app completa", "crear especificación", "historia de app", "spec creator", "brainstorming app", "descubrir app", "diseñar app"]
  stack: ["offline-first", "alpine.js", "dexie.js", "cryptojs", "tailwind-css-local", "daisyui", "bootstrap-icons", "animate.css"]
  language: es
  outputPath: "specs/"
  autoSave: true
---

# 🎯 SKILL: spec-creator v3 (Descubrimiento + Definición de Apps Offline-First)

> **Propósito**: Transformar una idea de app completa en una especificación técnica validada, paso a paso. Incluye fase de descubrimiento estructurado (brainstorming) antes del refinamiento, para validar enfoques, descubrir supuestos ocultos y evitar comprometerse con la primera idea.
> **Modo**: Descubrimiento + Interactivo | **Idioma**: ES | **Contexto**: Requiere @AGENTS.md y @project.config.js
> **Output**: Guarda spec validada en `specs/[nombre-app-lowercase].md`

---

## 🔄 FLUJO OBLIGATORIO (NO OMITIR FASES)

> ⚠️ **Anti-patrón: "Es muy simple, no necesita diseño"** — Todo proyecto pasa por este proceso. Los proyectos "simples" son donde los supuestos no examinados causan más trabajo perdido. El diseño puede ser corto (pocas frases para proyectos realmente simples), pero DEBES presentarlo y obtener aprobación.

### 🟣 FASE 0: Brainstorming & Descubrimiento Estructurado

```
[▓▓░░░░░░░░░░░░░░] 0% • Fase 0: Descubrimiento
💡 Validando idea antes de diseñar...
```

**Regla cardinal:** No code, no scaffolding, no implementación — solo diseño hasta que el usuario apruebe.

#### Paso 0.1 — Explorar contexto del proyecto
Antes de cualquier pregunta, revisa: `project.config.js`, `specs/` (proyectos previos), estructura de carpetas. Si el proyecto ya existe, revisa commits recientes para entender estado actual.

#### Paso 0.2 — Detectar descomposición necesaria
Si la petición describe múltiples subsistemas independientes (ej: "un CRM con chat, facturación, analytics y almacenamiento"), **detén el flujo y advierte**:

```
⚠️ Esta petición describe múltiples subsistemas independientes.
¿Quieres dividir esto en sub-proyectos más pequeños?

[1] Sí, dividir en sub-proyectos
[2] No, abordarlo como un solo proyecto grande
[3] Empezar con un sub-proyecto y luego los demás
```

Si aplica, define el orden y prioridad, luego itera: cada sub-proyecto pasa por su propio ciclo Fase 0 → Fase 1 → Fase 2 → Fase 3.

#### Paso 0.3 — Preguntas clarificadoras (una a la vez)
Haz preguntas **una por mensaje**. Prioriza opción múltiple cuando sea posible. Enfócate en:

| Dimensión | Pregunta ejemplo |
|---|---|
| Propósito | ¿Cuál es el problema principal que resuelve esta app? |
| Usuarios | ¿Quién la usará? ¿Un solo usuario o múltiples perfiles? |
| Datos | ¿Qué información manejará? ¿Muchos registros o pocos? |
| Éxito | ¿Cómo sabrás que la app cumple su objetivo? |

Máximo 3-4 preguntas en total. Si el usuario ya dio toda la info, salta este paso.

#### Paso 0.4 — ADR: Documentar decisión arquitectónica clave
Antes de proponer enfoques, si la app requiere sync offline o manejo de datos complejo, documenta la decisión con formato ADR:

```
📐 ADR-001: Estrategia de Sync Offline

Contexto:
  La app [nombre] necesita funcionar sin conexión y sincronizar
  datos cuando vuelva la red. Los usuarios pueden modificar los
  mismos registros desde diferentes dispositivos.

Decisión:
  [1] Sync manual con export/import JSON (Máxima simplicidad, sin conflictos)
  [2] Last-write-wins con timestamp (Simplicidad moderada, pérdida de datos posible)
  [3] CRDT/operational transform (Sin pérdida, complejidad alta)

Consecuencias:
  [elegir] implicará [trade-off específico].
  La spec incluirá esta decisión bajo ## 🧱 Arquitectura.

Alternativas consideradas:
  - Sin sync: no cumple requisito offline-multi-dispositivo
  - Sync automático con WebRTC: requiere servidor de señalización
```

**Regla**: Si el usuario ya decidió enfoque en la historia, salta este paso.

#### Paso 0.5 — Proponer 2-3 enfoques con trade-offs
Una vez que entiendes qué construir, presenta 2-3 enfoques arquitectónicos con sus trade-offs:

```
💡 Propuesta de enfoques:

[1] SPA modular completa (Recomendado)
    • Router hash-based + módulos intercambiables
    • Escalable, fácil de extender, testable
    • Más archivos, ligeramente más setup inicial

[2] SPA simple todo-en-uno
    • Todo en un solo HTML con Alpine
    • Rápido de implementar, mínimo setup
    • Difícil de mantener al crecer

[3] Multi-página sin SPA
    • Cada vista en su propio HTML
    • Simplicidad máxima, recarga completa en cada navegación
    • Sin estado compartido entre páginas

¿Cuál prefieres?
```

Marca cuál recomiendas y por qué. Si el usuario tiene preferencias claras de su historia, ajusta los enfoques a su caso.

#### Paso 0.5 — Validar enfoque elegido
Confirma la selección y pregunta si hay ajustes:

```
✅ Enfoque seleccionado: [opción elegida]
¿Quieres ajustar algo antes de pasar a detallar la spec?
```

Si hay ajustes, intégralos. Si no → avanza a Fase 0.6.

#### Paso 0.6 — Detección y propuesta de librerías externas
Analiza si la app descrita necesita librerías **adicionales** al stack base. Usa la spec en construcción para detectar necesidades.

**Stack base (ya incluido por setup-init):**
| Librería | Propósito |
|---|---|
| Alpine.js, Dexie.js, CryptoJS | Core funcional |
| Tailwind CSS + DaisyUI | UI framework |
| Bootstrap Icons | Iconografía |
| Animate.css | Animaciones |
| Pako.js | Compresión ZIP |
| ApexCharts | Gráficos |
| jsPDF | PDF |
| SheetJS (XLSX) | Excel |

**Catálogo de librerías externas detectables:**

```
📦 CATÁLOGO DE LIBRERÍAS OFFLINE-COMPATIBLES

  QR / Códigos de barras:
    qrcode.min.js        → `qrcode` (generación QR vía canvas)
    quagga.min.js        → `quagga2` (lector códigos barras cámara)

  Mapas (sin API key):
    leaflet.js           → `leaflet` (mapas OpenStreetMap, offline tiles opcional)

  Multimedia:
    html2canvas.js       → `html2canvas` (capturar DOM como imagen)
    dompurify.js         → `DOMPurify` (sanitizar HTML)

  Utilidades:
    lodash.js            → `lodash` (utilidades JS, tree-shakeable manual)
    dayjs.js             → `Day.js` (fechas ligeras, 2kB)
    uuid.js              → `uuid` (generación UUID para IDs offline)
    marked.js            → `marked` (renderizar Markdown a HTML)

  Formularios / Validación:
    cleave.js            → `cleave` (máscaras input)
    validator.js         → `validator` (validación datos)

  Notificaciones / Sonido:
    howler.min.js        → `howler` (sonidos offline, Web Audio API)
```

**Detección automática basada en descripción de la app:**

```
🔍 ANALIZANDO NECESIDADES DE LIBRERÍAS...

  Basado en la descripción de la app, detecté:
  ✓ Stack base cubre funcionalidad principal
  ? ¿Mencionaste códigos QR? → qrcode.min.js
  ? ¿Mencionaste mapas? → leaflet.js
  ? ¿Mencionaste capturas de pantalla? → html2canvas.js
  ? ¿Mencionaste UUIDs/IDs únicos? → uuid.js
  ? ¿Mencionaste fechas complejas? → dayjs.js

¿Quieres agregar alguna de estas o alguna otra librería?

[1] Sí, agregar las detectadas
[2] No, solo stack base
[3] Revisar y elegir manualmente del catálogo
[4] Proponer otra librería no listada
```

Si elige `[1]` o `[3]`, actualiza la spec interna con `libreriasAdicionales` y genera las URLs de descarga usando Context7 MCP para resolver la URL correcta de cada librería. Si no hay forma segura de obtener la URL, genera el comando de búsqueda para que el usuario la obtenga.

**Formato en la spec:**

```yaml
libreriasAdicionales:
  - nombre: qrcode.min.js
    ruta: assets/js/libs/qrcode.min.js
    descarga: curl -f -L -# -o assets/js/libs/qrcode.min.js https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js
    tipo: script
  - nombre: dayjs.min.js
    ruta: assets/js/libs/dayjs.min.js
    descarga: curl -f -L -# -o assets/js/libs/dayjs.min.js https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js
    tipo: script
```

Si elige `[4]`, usa Context7 MCP para investigar la librería solicitada, verificar que:
- Funciona sin servidor (file:// compatible)
- No requiere API key externa (o si la requiere, documentarlo)
- Tiene una URL CDN estable para descargar a `assets/js/libs/`

Luego genera el comando curl exacto para descargarla en local.

> **Nota**: Estas librerías se descargan en **setup**, no en runtime. No violan la regla offline-first. El script `descargar-libs.bat` se actualizará con estas URLs adicionales.

Si hay ajustes, intégralos. Si no → avanza a Fase 1.

---
1. Toma la idea refinada de la Fase 0 + descripción original.
2. Ejecuta **AUTO-VALIDACIÓN** contra `@AGENTS.md` antes de responder:
   ```
   🔍 VALIDACIÓN DE STACK
   - ❌ Imports/ES6/Modules: [x] Prohibidos
   - ❌ Servidor/CDN/Fetch: [x] Prohibidos (file://)
   - 🔐 Cifrado campos sensibles: [x] Obligatorio (CryptoJS)
   - 📐 UI: [x] DaisyUI + Bootstrap Icons + Animate.css
   - ⚙️ Config: [x] Todo registrable en project.config.js
   ✅ Stack validado. Procedo.
   ```
3. Si la historia sugiere violar una regla, corrige automáticamente y advierte: `⚠️ Ajustado a reglas del stack offline-first.`
4. Genera **lista numerada (6-8) de asunciones NO técnicas/NO funcionales** basadas en la historia refinada.

### 🟡 FASE 2: Refinamiento Iterativo (Máx 8 preguntas)
1. Espera que el usuario indique qué números cambiar (ej: `2, 4, 7` o `Todas correctas`).
2. Para CADA número marcado:
   - Muestra progreso exacto: `[▓▓▓░░░░░░░░░░░] 25% • Pregunta 1/4`
   - Presenta la asunción + 4 opciones predefinidas + `[5] Otra`
   - Espera respuesta. Si `5`, pide especificación libre.
   - Actualiza spec interna.
   - Avanza.
3. Si no hay cambios o se completan las preguntas, pasa a **Auto-Revisión** (Fase 2.5).

### 🟠 FASE 2.5: Auto-Revisión de Spec (Spec Self-Review)
Antes de generar el archivo final, revisa la spec con ojos frescos:

1. **Escaneo de placeholders**: ¿Hay "TBD", "TODO", secciones incompletas o requisitos vagos? Corrígelos inline.
2. **Consistencia interna**: ¿Alguna sección contradice a otra? ¿La arquitectura coincide con las descripciones de funcionalidad?
3. **Alcance**: ¿Está suficientemente enfocado para un solo plan de implementación? Si no, sugiere descomposición.
4. **Ambigüedad**: ¿Algún requisito podría interpretarse de dos formas distintas? Si es así, elige una y hazla explícita.
5. **Modelado DDD** (si aplica sync/offline):
   - ¿Los agregados (entidades que se sincronizan juntas) están claramente definidos?
   - ¿El "bounded context" offline está separado del online?
   - ¿Los eventos de dominio identificados (ej: "paciente-creado", "cita-cancelada") son los que activan sync?
6. **Sync-friendly API design** (si aplica):
   - ¿Los endpoints de sync son idempotentes? (mismo request repetido = mismo resultado)
   - ¿Hay un endpoint `POST /sync` batch que acepte múltiples operaciones?
   - ¿Se incluye `lastModified` timestamp en cada registro para conflict resolution?

Arregla lo que encuentres inline y avanza.

### 🔴 FASE 3: Generación de Spec + Archivo
1. Compila la spec final siguiendo esta estructura exacta:
   ```markdown
   # 📄 Especificación Técnica: [Nombre App]
   ## 🎯 Descripción
   ## ✅ Criterios de Aceptación (Gherkin)
   ## 🧱 Arquitectura y Módulos
   ## 📐 Modelo de Datos Detallado
   ### Tablas (Dexie schema)
   | Campo | Tipo | Cifrado | Índice | Descripción |
   ### Relaciones
   ### Perfil Lite: schema Dexie
   ### Perfil Full: schema SQL adicional
   ## 🔐 Seguridad y Datos
   ## 🎨 UI/UX y Animaciones
   ## 🧭 User Journeys
   ### Journey 1: [nombre]
   ### Journey 2: [nombre]
   ## ✅ Testing Criteria
   ### Unitarios
   ### Integración
   ### E2E (Playwright)
   ## 📚 Librerías Adicionales
   ## 🧠 IA Jutia (opcional)
   ## ⚙️ Configuración (project.config.js)
   ## 📦 Pre-requisitos y Checklist
   ```
2. **Guarda automáticamente** en: `specs/[nombre-app-lowercase].md`
3. Pide al usuario revisar el archivo antes de continuar:
   ```
   📄 Spec escrita y guardada en specs/[nombre].md
   Revísala y dime si quieres cambios antes de pasar a implementación.
   ```
4. Si el usuario pide cambios, hazlos y repite el self-review. Solo cuando apruebe, avanza.
5. Muestra mensaje final:
   ```
   ✅ Especificación generada y guardada en specs/[nombre].md
   📝 Snippets para project.config.js incluidos.
   ¿Procedo a generar el código base o prefieres ajustar algo más?
   ```

---

## 🛡️ AUTO-VALIDACIÓN CONTRA @AGENTS.md (EJECUTAR SIEMPRE)
Antes de cualquier output, verifica mentalmente:
- [ ] ¿Usa `import`/`export` o `type="module"`? → RECHAZAR y corregir
- [ ] ¿Asume servidor, API externa o CDN en runtime? → RECHAZAR y corregir
- [ ] ¿Omite cifrado en campos sensibles detectados? → AGREGAR regla de cifrado
- [ ] ¿UI sin DaisyUI/Icons/Animate.css? → CORREGIR componentes
- [ ] ¿Módulo no registrable en config? → AGREGAR snippet a `modulosActivos`
- [ ] **YAGNI**: ¿Hay funcionalidades innecesarias en la spec? → ELIMINAR (menos es más)
- [ ] **Librerías externas**: Si se detectaron, ¿tienen URL de descarga válida y son offline-compatibles? → VERIFICAR con Context7 MCP
- [ ] **Librerías externas**: ¿Están documentadas en la spec bajo `## 📚 Librerías Adicionales` con ruta y comando de descarga exactos? → AGREGAR si faltan
- [ ] **Sync strategy**: Si la app requiere multi-dispositivo, ¿hay ADR documentando la estrategia de sync? → AGREGAR ADR
- [ ] **Agregados DDD**: ¿Los bounded contexts offline/online están separados? → REVISAR si afecta arquitectura
- [ ] **Privacidad**: ¿Se especifica qué datos son mínimos necesarios y cuáles se cifran? → AGREGAR sección de privacidad
- [ ] **API sync**: Si hay sync, ¿los endpoints son idempotentes y batch? → DOCUMENTAR en sección de API
Si falla cualquier punto, corrige silenciosamente antes de mostrar la respuesta.

---

## 💬 FORMATO DE PREGUNTAS (Fase 2)
```
[▓▓▓░░░░░░░░░░░] {porcentaje}% • Pregunta {actual}/{total}

Asunción #{n}: "{texto}"

Opciones:
[1] {Opción técnica/UX validada por stack}
[2] {Opción alternativa segura}
[3] {Opción mínima/viable}
[4] {Opción avanzada/compleja}
[5] Otra → (especifica)

Tu respuesta: 
```

---

## 📋 LISTA DE ASUNCIONES (Refocus Business/UX — Adaptar según historia)
1. **Usuarios**: [perfil usuario] usará la app [frecuencia], en [dispositivo].
2. **Datos**: Volumen estimado [N] registros/mes, [crece/no crece].
3. **UX**: La interfaz debe priorizar [rapidez/simplicidad/detalle].
4. **Distribución**: La app se entregará como [ZIP / .exe / ambos].
5. **Privacidad**: Los datos [incluyen/no incluyen] información sensible.
6. **Módulos**: Activables/desactivables en `project.config.js`.
7. **Backup/Export**: Manual a JSON/PDF/Excel.
8. **Validación**: Formularios con feedback inmediato, mensajes en español.
9. **Sync (si aplica)**: Estrategia definida en ADR.
10. **IA Jutia (si aplica)**: Perfil [lite/full/no] según necesidades de búsqueda y análisis.

---

## 🎨 INTEGRACIÓN CON design-ux-intelligence
Si el usuario menciona "tono visual", "diseño distintivo" o "UX profesional":
1. Activar automáticamente `design-ux-intelligence`
2. Preguntar:
   ```
   🎨 Tono visual preferido:
   [1] Profesional limpio  [2] Moderno vibrante  [3] Minimalista premium
   [4] Editorial  [5] Retro-futurista  [6] Usar defaults de project.config.js

   🎯 Diferenciador clave (máx 10 palabras): ____________________
   ```
3. Incluir respuestas en la spec final bajo sección "## 🎨 UI/UX y Animaciones"

---

## 📝 NOTAS PARA LA IA
- **Auto-guardado**: Siempre guarda la spec en `specs/[nombre].md` usando el formato markdown exacto.
- **Nombres de archivo**: Usa lowercase con guiones: `clinica-dental.md`, no `ClinicaDental.md`.
- **Snippets de config**: Incluye exactamente qué añadir a `project.config.js` → `modulosActivos`.
- **Idioma**: Todo en español, incluyendo comentarios de código en la spec.
- **Contexto limitado**: Si la respuesta se corta, añade `/context clear` y repite el último paso.
- **Fase 0 (Brainstorming)**: Siempre ejecútala. No la saltes aunque la idea parezca simple — los supuestos no examinados causan más retrabajo.
- **Anti-pattern recordatorio**: "Es muy simple" no es excusa para saltar el descubrimiento. Para proyectos simples, la Fase 0 puede ser breve (3 preguntas + 2 enfoques), pero existe.
- **Descomposición**: Si detectas múltiples subsistemas independientes, fuerza la división. Cada sub-proyecto obtiene su propio ciclo F0→F1→F2→F3.
- **Handoff a implementación**: Al finalizar, pregunta si quiere pasar a `code-generator` para generar el código base desde la spec.
- **Fase 0.6 (Librerías externas)**: Usa el catálogo predefinido + Context7 MCP para resolver URLs de descarga. Siempre prefiere URLs CDN estables (jsDelivr, cdnjs, unpkg). Si la librería no tiene URL pública, sugiere al usuario descargarla manualmente y colocarla en `assets/js/libs/`.
- **Registro en spec**: Las librerías adicionales se guardan en la spec bajo `## 📚 Librerías Adicionales` con nombre, ruta y comando de descarga exacto. Esto permite a `setup-init` y `code-generator` consumir esta información.

✨ **SKILL ready v3. Trigger: `definir spec app` para iniciar el flujo completo.**
```

---