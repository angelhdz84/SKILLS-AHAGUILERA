# 🚀 Guía de Integración: Stack Ateje Mejorado

> Cómo Engram + OpenPencil transforman el pipeline para entregar apps impecables con OpenCode.
> Versión: 1.0 | Perfiles: Lite, Professional, Business

---

## 🎯 Filosofía

Cada integración responde a una pregunta clave para la calidad:

| Herramienta | Pregunta que responde | Cómo mejora la calidad |
|-------------|----------------------|------------------------|
| **Engram** | "¿Cómo recuerdo lo que aprendí en proyectos anteriores?" | Memoria persistente entre sesiones — el agente no olvida tus preferencias |
| **OpenPencil** | "¿Cómo sé que la UI se verá bien ANTES de escribir código?" | Prototipado visual → extracción de tokens → código coherente desde el día 1 |

---

## 📋 Requisitos

| Herramienta | Instalación | Tamaño | Perfil | Obligatorio |
|-------------|------------|:------:|:------:|:-----------:|
| Engram | `winget install Gentleman.Programming.Engram` | ~10MB | Professional / Business | ❌ Opcional |
| OpenPencil CLI | `npm install -g @open-pencil/cli` | ~7MB | Business | ❌ Opcional (beta) |
| OpenPencil Desktop | `winget install OpenPencil.OpenPencil` | ~7MB (Tauri) | Business | ❌ Opcional (beta) |

Todas son opt-in. Sin ellas el pipeline funciona exactamente como hoy.

---

## 📋 Fase 1: Engram → Memoria Persistente del Agente

### Problema que resuelve

Hoy `wiki-engine` tiene un "MCP memory graph" **conceptual pero no implementado**. No hay persistencia real entre sesiones. Cada vez que trabajas en un proyecto, el agente empieza casi desde cero.

### Solución

Reemplazar el MCP memory graph conceptual con **Engram como backend opcional**:

```
Estado actual:
  wiki-engine → MCP memory server (conceptual, sin schema real)

Estado futuro:
  wiki-engine → Engram (SQLite + FTS5 + 20 tools MCP)
                ↓
           Si Engram no está instalado → wiki/ markdown + .omd/preferences.md
```

### Mapeo wiki-engine → Engram

| wiki-engine acción | Engram tool | Efecto en calidad |
|-------------------|-------------|-------------------|
| Guardar página wiki | `mem_save` | Las decisiones de diseño NO se pierden entre sesiones |
| Guardar preferencia | `mem_save` | "No uses mayúsculas en CTAs" se recuerda para siempre |
| Buscar conocimiento | `mem_search` | El agente encuentra specs anteriores como referencia |
| Contexto de sesión | `mem_context` | "¿Qué estábamos haciendo?" responde al instante |
| Detectar conflictos | `mem_compare` | Si dices algo contradictorio, el agente te lo advierte |
| Timeline de decisiones | `mem_timeline` | Trazabilidad completa del proyecto |
| Dashboard visual | `engram tui` | Puedes ver el grafo de conocimiento de todo el proyecto |

### Cómo mejora la calidad

1. **Consistencia cross-sesión**: Lo que aprendió el agente en la sesión de ayer está disponible hoy
2. **Detección de conflictos**: Si dices "usa azul" hoy y "rojo" mañana, Engram lo detecta
3. **Referencia rápida**: El agente puede buscar specs anteriores como inspiración
4. **Zero breaking change**: Sin Engram, todo funciona exactamente como hoy

### Setup

```powershell
# scripts/setup-engram.ps1 — Opcional, se ejecuta durante /setup
# Si Engram está instalado → se activa automáticamente
# Si no → todo funciona con markdown

if (Get-Command engram -ErrorAction SilentlyContinue) {
    engram setup opencode
    Write-Output "✅ Engram configurado como memoria persistente"
} else {
    Write-Output "ℹ️ Engram no instalado. wiki-engine usará solo markdown."
    Write-Output "   Para instalar: winget install Gentleman.Programming.Engram"
}
```

### Recomendaciones

- **✅ Hacerlo primero** — Es la integración de menor riesgo y mayor retorno
- **✅ Mapear `ENGRAM_DATA_DIR` a `.omd/` del proyecto** — Para que la memoria viaje con el proyecto
- **❌ NO usar Engram en el runtime de la app** — Es solo para el agente de desarrollo
- **💡 Probar con un proyecto real** — Crea una app, cierra la sesión, vuelve al día siguiente y pregunta "¿qué estábamos haciendo?"

---

## 🎨 Fase 2: OpenPencil → Diseño ANTES del Código

### Problema que resuelve

Hoy el flujo es: `spec → code-generator → ver resultado`. No sabes cómo se verá la UI hasta que el código está generado. Si no te gusta, toca iterar sobre código ya escrito.

### Solución

Añadir OpenPencil como **fase de prototipado visual** en design-engine (Business, opcional):

```
NUEVO FLUJO:

  spec-engine → DESIGN.md
       ↓
  OpenPencil CLI → extrae tokens de brand.fig (si existe)
       ↓
  OpenPencil genera preview.html → VES el diseño ANTES
       ↓
  ¿Te gusta? → SÍ → design-engine aplica tokens → code-generator
  ¿No? → ajustas el .fig → repites
       ↓
  RESULTADO: El código generado YA tiene el diseño correcto
```

### Flujo detallado

```
PASO 1: Cliente entrega brand.fig o tú diseñas en Figma
PASO 2: openpencil analyze colors/typography/spacing brand.fig
PASO 3: Se genera DESIGN.md con tokens reales (no inventados)
PASO 4: OpenPencil genera preview.html con el diseño aplicado
PASO 5: Ves el diseño, ajustas si es necesario
PASO 6: design-engine aplica tokens a DaisyUI
PASO 7: code-generator genera código CON EL DISEÑO CORRECTO desde la primera iteración
```

### OpenPencil como "vistazo antes de codificar"

El uso más potente de OpenPencil no es la extracción de tokens, sino **validar visualmente el diseño antes de escribir código**:

```bash
# 1. Extraer tokens del diseño
openpencil analyze colors brand.fig --json > tokens-colors.json
openpencil analyze typography brand.fig --json > tokens-typography.json

# 2. Generar preview visual del diseño
openpencil preview brand.fig --output preview.html

# 3. ABRIR preview.html en el navegador — ves colores, tipografías, espaciado
# 4. Si algo no te gusta, ajustas el .fig y repites
# 5. SOLO CUANDO el preview esté aprobado → pasas a code-generator
```

### Ejemplo concreto: App de inventario

```bash
# Tienes el .fig con el diseño de la app de inventario
# Quieres ver cómo se verá antes de escribir una línea de código

# 1. Extraer paleta
openpencil analyze colors inventario.fig --json

# Output:
# {
#   "primary": {"name": "Verde Bosque", "hex": "#2D6A4F", "usage": "30%"},
#   "secondary": {"name": "Verde Claro", "hex": "#40916C", "usage": "15%"},
#   "surface": {"name": "Blanco Hueso", "hex": "#F8F9FA", "usage": "40%"},
#   "accent": {"name": "Ámbar", "hex": "#FFB703", "usage": "10%"}
# }

# 2. Generar preview
openpencil preview inventario.fig --output docs/preview-inventario.html

# 3. Lo abres en el navegador y ves que el verde es muy oscuro
#    Ajustas el .fig → repites preview → ahora sí
#    ¿El ámbar no contrasta bien sobre blanco? Lo ves AHORA, no después

# 4. Solo ahora generas código
openpencil analyze colors typography spacing inventario.fig --json | \
  design-engine apply --output DESIGN.md
```

### Cómo mejora la calidad

1. **Errores de diseño se ven ANTES** — Contraste insuficiente, espaciado incorrecto, colores que no pegan
2. **Cero iteraciones sobre código** — Ajustas el diseño, no el HTML/JS
3. **Tokens reales, no inventados** — El código usa los hex codes exactos del diseño
4. **El cliente aprueba el diseño visual**, no el código — Menos revisiones

### Setup

```powershell
# scripts/setup-opencil.ps1 — Opcional, solo en Business
# Si falla, el pipeline continúa normalmente

if ((Get-Command openpencil -ErrorAction SilentlyContinue) -eq $null) {
    Write-Output "ℹ️ OpenPencil CLI no encontrado."
    Write-Output "   Para instalar: npm install -g @open-pencil/cli"
    Write-Output ""
    Write-Output "Sin OpenPencil: design-engine usará DESIGN.md manual."
}
```

### Recomendaciones

- **✅ OpenPencil v0.13 es temprano** — Úsalo como herramienta exploratoria, no como dependencia crítica
- **✅ El .fig es el source of truth visual** — No edites DESIGN.md a mano si puedes editar el .fig y re-extraer
- **❌ No intentes que OpenPencil genere el HTML final** — Solo tokens y preview. El HTML lo genera code-generator
- **💡 Workflow ideal**: Figma → OpenPencil preview → aprobación → re-extraer tokens → DESIGN.md → code-generator
- **💡 Para interfaces críticas** (login, dashboard, reportes): haz un preview de cada una antes de codificar
- **⚠️ OpenPencil analyze NO es perfecto** — Siempre revisa los tokens extraídos antes de aplicarlos
- **🚫 No integrar OpenPencil MCP server** (90+ tools) — Demasiado temprano, v0.13. El CLI `analyze` basta

### Alternativa si OpenPencil no está listo

Si OpenPencil no funciona bien en tu entorno, mantén el flujo actual pero añade un paso manual:

```
1. Abres el .fig en Figma
2. Anotas colores, tipografías, spacings
3. Los escribes en DESIGN.md
4. code-generator produce código
5. Verificas visualmente
```

OpenPencil solo automatiza el paso 2. No es crítico, pero ahorra tiempo y errores.

---

## 🧠 Nota: Per-Phase Model Routing (NO implementar)

### Por qué lo descartamos

OpenCode usa modelos gratuitos que **cambian constantemente** y **no puedes elegir** cuál se usa en cada fase. Esto hace que el per-phase routing (inspirado en Gentle AI) no tenga sentido aquí:

| Problema | Impacto |
|----------|---------|
| Los modelos gratuitos van y vienen | Un perfil que funcionaba ayer puede estar roto hoy |
| No controlas qué modelo se usa | `pipelineProfiles` sería humo — el modelo real no depende de ti |
| Overhead de mantenimiento | Cada cambio de modelo gratuito requeriría actualizar la config |

### Estrategia alternativa

En lugar de depender de elegir modelos, la calidad se logra con:

1. **Engram (Fase 1)** — Memoria persistente. El modelo puede cambiar entre sesiones, pero el conocimiento guardado no se pierde. El agente recuerda specs, decisiones y preferencias sin importar qué modelo lo ejecute.

2. **OpenPencil (Fase 2)** — Preview visual independiente del LLM. Detectas errores de diseño antes de codificar, sin depender de la calidad del modelo de turno.

3. **Prompt engineering riguroso** — Cada fase del pipeline tiene prompts lo suficientemente detallados para que **cualquier** modelo gratuito produzca un resultado correcto. Esto ya está en pipeline-engine, code-generator, design-engine.

4. **Validación automática** — `stack-compliance-guard` + `validation-engine` corrigen errores después de generar, independientemente del modelo usado.

**Conclusión**: No necesitas elegir el modelo. Necesitas que el pipeline sea lo suficientemente robusto para funcionar bien con **cualquier** modelo. Engram + OpenPencil + validación automática cubren eso.

## 🔄 El Pipeline Completo (visión integrada)

```
                    ┌──────────────────────────────────────┐
                    │         pipeline-engine               │
                    │  (Classic 5 fases / Design 10 fases)  │
                    └──────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
       ┌──────────────────────┐            ┌──────────────────────┐
       │     Engram MCP       │            │   OpenPencil CLI      │
       │    (wiki-engine)     │            │  (design-engine)       │
       ├──────────────────────┤            ├──────────────────────┤
       │ Memoria entre        │            │ Extrae tokens de .fig │
       │ sesiones             │            │ Genera preview visual  │
       │ Búsqueda semántica   │            │ Valida diseño ANTES   │
       │ Detección de         │            │ de codificar          │
       │ conflictos           │            │ Business tier opcional│
       └──────────────────────┘            └──────────────────────┘
                    │                                   │
                    └───────────────┬───────────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │   CALIDAD GARANTIZADA │
                        │                      │
                        │ • Diseño validado     │
                        │   ANTES del código    │
                        │ • Memoria persistente │
                        │ • Sin breaking changes│
                        └──────────────────────┘
```

---

## 🛡️ Estrategia de Calidad: Cómo prevenir errores

### En cada fase del pipeline

| Fase | Sin integraciones | Con integraciones | Diferencia |
|------|------------------|-------------------|------------|
| **Setup** | Estructura genérica | Estructura + Engram configurado | Memoria lista desde el inicio |
| **Spec** | Spec genérica | Spec con referencias de proyectos anteriores (Engram) | Más consistente |
| **Diseño** | Tokens inventados | Tokens reales desde .fig (OpenPencil) | Diseño fiel al original |
| **Code** | Puede haber errores de diseño | Diseño ya validado → menos iteraciones | Código correcto a la primera |
| **Validate** | Validación genérica | QA con contexto de decisiones previas (Engram) | Más precisa |
| **Deploy** | Entrega estándar | Entrega con trazabilidad de decisiones | Mayor confianza |

### Anti-patrones que evitar

| ❌ Anti-patrón | ✅ Alternativa |
|---------------|---------------|
| "Primero código, luego vemos el diseño" | "Primero preview con OpenPencil, luego código" |
| "Confiar en que el agente recuerde lo de ayer" | Engram guarda todo automáticamente |
| "OpenPencil como dependencia crítica" | OpenPencil es opcional, siempre hay fallback |
| "Editar DESIGN.md a mano cuando cambia el .fig" | Re-extraer tokens con OpenPencil |

### Checklist de calidad pre-entrega

Con las integraciones activas, antes de entregar al cliente:

```markdown
## ✅ Checklist de Calidad Stack Ateje

### Visual (OpenPencil)
- [ ] Preview generado y aprobado para cada pantalla principal
- [ ] Colores extraídos del .fig coinciden con la UI generada
- [ ] Tipografía del .fig aplicada correctamente
- [ ] Contraste AA verificado (4.5:1 mínimo)

### Memoria (Engram)
- [ ] Decisiones de diseño guardadas en Engram
- [ ] Preferencias del cliente aplicadas
- [ ] Sin conflictos con decisiones anteriores

### Pipeline
- [ ] Spec generada (spec-engine)
- [ ] Diseño aplicado (design-engine)
- [ ] Código generado (code-generator)
- [ ] Compliance validado (stack-compliance-guard)
- [ ] Audit de marca pasado (validation-engine)
- [ ] QA rubric aprobado (validation-engine)

### Entrega
- [ ] ZIP/.exe/.apk generado según perfil
- [ ] Documentación actualizada
- [ ] Memoria Engram exportada (si aplica)
```

---

## ⚡ Consejos Rápidos

### Para implementar ahora (sin riesgo)

1. **Probar Engram por separado** — Instálalo, úsalo con `engram tui`, familiarízate
2. **Probar OpenPencil por separado** — `openpencil analyze colors algun-diseno.fig`
3. **Añadir esta guía como referencia** en AGENTS.md con `{file:docs/guia-integracion-engram-openpencil.md}`

### Para implementar cuando estés listo

1. **Engram → wiki-engine**: Reemplazar el MCP memory graph conceptual
2. **OpenPencil → design-engine**: Añadir Phase 1.5 de extracción de tokens

### Para NO hacer

- ❌ No hacer que Engram sea requisito — siempre debe ser opcional
- ❌ No depender de OpenPencil MCP server (v0.13, 90+ tools)
- ❌ No versionar tokens extraídos ni DB de Engram en git
- ❌ No mezclar OpenPencil con el runtime de la app — solo para tooling
- ❌ No intentar per-phase routing con modelos gratuitos — cambian constantemente y no los controlas

---

## 📐 Orden de implementación sugerido

```
Fase 1 (Semana 1-2):  Engram → wiki-engine
  └── SKILL.md actualizado
  └── scripts/setup-engram.ps1
  └── STACK.md actualizado
  └── Test: sin Engram = 100% funcional

Fase 2 (Semana 3-4):  OpenPencil → design-engine
  └── SKILL.md actualizado (Phase 1.5)
  └── scripts/setup-opencil.ps1
  └── Test: sin OpenPencil = DESIGN.md manual como hoy
```

---

## 📊 Matriz de Decisión

| Herramienta | ¿Integrar? | Prioridad | Riesgo | Dependencia externa |
|-------------|:----------:|:---------:|:------:|:-------------------:|
| **Engram** | ✅ Sí — wiki-engine backend opcional | P0 | Bajo | ✅ Opcional (Go binary ~10MB) |
| **OpenPencil CLI** | ✅ Sí — design-engine fase opcional | P1 | Bajo | ✅ Opcional (npm/brew, ~7MB) |
| **OpenPencil MCP** | ❌ No — muy temprano (v0.13) | — | Alto | ❌ No aplica |

**Las apps generadas NO tienen ninguna dependencia nueva.** Todo es para el tooling de desarrollo.

---

## Resumen

El Stack Ateje mejorado con estas integraciones te permite:

1. **Nunca perder el contexto entre sesiones** (Engram memory)
2. **Ver el diseño antes de codificar** (OpenPencil preview)
3. **Entregar con calidad impecable** (checklist + validación continua)

Todo es opt-in. Todo tiene fallback. Sin breaking changes.

> **Sobre los modelos gratuitos de OpenCode**: No necesitas elegir el modelo. Engram + OpenPencil + validación automática hacen que el pipeline funcione bien con **cualquier** modelo que OpenCode asigne.

---

## 🔌 OpenPencil MCP Server — Controlar el diseño desde OpenCode

El Desktop App de OpenPencil expone un **MCP server** que permite a OpenCode leer y modificar el diseño en vivo.

### Configuración en `opencode.json`

```json
{
  "mcp": {
    "open-pencil": {
      "type": "local",
      "command": "openpencil-mcp"
    }
  }
}
```

### Qué puedes hacer

Con el Desktop App abierto, OpenCode puede:

| Comando OpenCode | Efecto en OpenPencil |
|-----------------|---------------------|
| "Inspecciona el diseño actual" | `openpencil tree` → ve la estructura |
| "¿Qué colores usa?" | `openpencil analyze colors` → extrae paleta en vivo |
| "Cambia el botón primario a azul" | `openpencil eval` → modifica el diseño |
| "Exporta screenshot" | `openpencil export -f png` → captura el canvas |

### Flujo diario

```
1. Abres OpenPencil Desktop + OpenCode
2. Diseñas la UI visualmente en OpenPencil
3. OpenCode se conecta al MCP server
4. "OpenCode, cambia el header a azul marino"
5. OpenCode envía comando vía MCP → OpenPencil se actualiza al instante
6. Ves el cambio en pantalla ANTES de escribir código
7. Cuando el diseño está listo → extraes tokens → code-generator
8. El código generado usa DaisyUI + los mismos tokens
```

---

## 🧠 IA Jutía en el producto final

IA Jutía es el módulo de IA que va **dentro de la app generada** — no es una herramienta de desarrollo, es una feature para el usuario final.

### Perfil Lite (~7KB, sin descargas)

Dentro de la app, el usuario ve:

- Un módulo "IA" en el sidebar, igual que Inventario, Clientes, etc.
- **Cmd+K** abre una command palette para buscar en todos los registros
- **Estadísticas** descriptivas: media, mediana, tendencias sobre los datos
- **Predicciones**: "próximo mes probablemente X" con regresión lineal

```html
<!-- Así se ve en la UI generada -->
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      <i class="bi bi-graph-up-arrow"></i> Pronóstico de Ventas
    </h2>
    <p class="text-sm opacity-70">Basado en datos históricos</p>
    <!-- Gráfico de predicción -->
    <canvas id="forecastChart"></canvas>
    <p>Próximo mes estimado: <strong>$12,450</strong></p>
  </div>
</div>
```

### Perfil Full (+233MB descarga única)

Todo lo de Lite, más:

- **Zona drag & drop** para subir PDF, DOCX, XLSX, CSV, MD
- **Chat Q&A**: "¿cuál fue el total de ventas en junio?" → responde citando la fuente
- **Web Worker** con Transformers.js para no congelar la UI
- **WebGPU** acelerado (si el navegador lo soporta)
- **Modelos q4 quantization**: 230MB → 58MB

```
Pantalla del módulo IA (Full):
┌──────────────────────────────┐
│  📁 Subir documento         │ ← drag & drop
├──────────────────────────────┤
│  📄 balance-2026.pdf        │
│  📄 informe-ventas.docx     │
├──────────────────────────────┤
│  💬 Pregunta: "total ventas"│
│  ├─ Respuesta: $45,230      │
│  └─ Fuente: balance-2026.pdf│
└──────────────────────────────┘
```

### Cómo se activa

Durante `/setup` se pregunta:

```
¿Qué perfil de IA deseas?
[1] Lite — FlexSearch + stats + predicciones (~7KB)
[2] Full — +ingesta docs + chat Q&A (+233MB descarga única)
[3] No incluir IA
```

La IA aparece como un módulo más en `modules/ia-jutia/`, con su propio `.js` y `.html`, cargado como cualquier otro módulo del stack. No requiere servidor, no requiere internet.
