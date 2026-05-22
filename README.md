# 🛠️ SKILLS-AHAGUILERA: Stack Offline-First para OpenCode

> **Desarrollo freelance profesional • 100% offline • Sin servidores • Sin CDNs • Sin builds**
> 
> Colección de SKILLs optimizadas para crear aplicaciones web que funcionan abriendo `index.html` con doble clic. Diseñadas para OpenCode.ai, con validación automática de compliance, flujo interactivo y entrega profesional lista para clientes.

---

## 📦 SKILLs Incluidas

| SKILL | Directorio | Trigger Principal | Propósito |
|-------|------------|-------------------|-----------|
| 🛠️ **setup-init** | [`/setup-init/SKILL.md`](./setup-init/SKILL.md) | `iniciar setup` | Valida entorno, crea estructura, descarga librerías locales |
| 🎯 **spec-creator** | [`/spec-creator/SKILL.md`](./spec-creator/SKILL.md) | `definir spec app` | Transforma historias de usuario en specs técnicas validadas |
| 🎨 **design-ux-intelligence** | [`/design-ux-intelligence/SKILL.md`](./design-ux-intelligence/SKILL.md) | `tono visual` / `UX profesional` | Aplica principios de diseño distintivo y checklist UX crítico |
| 🛡️ **stack-compliance-guard** | [`/stack-compliance-guard/SKILL.md`](./stack-compliance-guard/SKILL.md) | *(Auto-activada)* | Bloquea imports, CDNs, fetch y omisión de cifrado automáticamente |
| 💻 **code-generator** | [`/code-generator/SKILL.md`](./code-generator/SKILL.md) | `generar codigo` | Genera código modular por fases con validación de compliance |
| ✅ **validation-offline** | [`/validation-offline/SKILL.md`](./validation-offline/SKILL.md) | `validar app` | Análisis estático + pruebas DevTools + reporte técnico en `docs/` |
| 🚀 **prompt-inicial** | [`/prompt-inicial/SKILL.md`](./prompt-inicial/SKILL.md) | `nuevo proyecto` | Orquestador maestro del pipeline completo (setup → spec → code → validate) |

---

## 🚀 Instalación Rápida

### 1. Clona o descarga el repositorio
```bash
git clone https://github.com/angelhdz84/SKILLS-AHAGUILERA.git
cd SKILLS-AHAGUILERA
```

### 2. Copia las SKILLs a la carpeta global de OpenCode
```bash
# Windows
mkdir "%USERPROFILE%\.opencode\skills"
xcopy *.md "%USERPROFILE%\.opencode\skills\" /E /I /Y

# macOS / Linux
mkdir -p ~/.opencode/skills
cp -r setup-init spec-creator design-ux-intelligence stack-compliance-guard code-generator validation-offline prompt-inicial ~/.opencode/skills/
```

### 3. Reinicia OpenCode
```bash
opencode
```
Las SKILLs se cargarán automáticamente. Usa el trigger `nuevo proyecto` para iniciar el pipeline.

---

## 🔄 Flujo de Trabajo (Pipeline)

```
nuevo proyecto 
   ↓
iniciar setup → estructura + librerías locales
   ↓
definir spec app → asunciones + preguntas 4+1 + specs/[app].md
   ↓
generar codigo → core/ + modules/ por fases (con pausas)
   ↓
validar app → análisis estático + DevTools + docs/validacion-[app].md
   ↓
📦 Entrega profesional (ZIP / .exe / manual)
```

---

## ⚠️ Reglas No Negociables del Stack

| Categoría | Regla | Motivo |
|-----------|-------|--------|
| 🚫 Módulos | ❌ `import` / `export` / `type="module"` | CORS en `file://` bloquea ES6 modules |
| 🌐 Red | ❌ `fetch` / `axios` / CDNs en runtime | 100% offline, sin dependencias externas |
| 🔐 Seguridad | ✅ `cryptoHelpers.encrypt()` en campos sensibles | Protección local de datos personales |
| 🧩 Reactividad | ✅ Variables globales (`Alpine`, `Dexie`, `CryptoJS`) | Compatibilidad con doble clic en HTML |
| 🎨 UI/UX | ✅ DaisyUI + Bootstrap Icons + Animate.css | Componentes accesibles, iconografía consistente, microinteracciones |
| 🌍 Idioma | ✅ Español en UI, comentarios y documentación | Mercado objetivo hispanohablante |

---

## 📁 Estructura del Repositorio
```
SKILLS-AHAGUILERA/
├── setup-init/                  — Valida entorno, crea estructura, descarga librerías
├── spec-creator/                — Transforma historias en specs técnicas
├── design-ux-intelligence/      — Diseño distintivo y UX profesional
├── stack-compliance-guard/      — Guarda de cumplimiento automático
├── code-generator/              — Generación de código por fases
├── validation-offline/          — Validación integral + tests E2E
├── prompt-inicial/              — Orquestador maestro del pipeline
├── components/                  — 35 componentes Pines + galería
├── tests/                       — Scripts Playwright E2E
├── mcp-servers/                 — MCP servers locales (refero-styles)
├── docs/                        — Reportes de validación (generados)
├── specs/                       — Specs técnicas (generadas)
├── project.config.js            — Configuración white-label
├── AGENTS.md                    — Instrucciones para OpenCode
├── manual-referencia.html       — Manual offline de skills
├── manual-tecnico.html          — Guía técnica offline
├── PLANTILLA DE CONTRATO FREELANCE.txt
├── PLANTILLA DE CORREO DE ENTREGA PROFESIONAL.txt
└── README.md
```

Cada carpeta contiene un único archivo `SKILL.md` con metadata YAML compatible con OpenCode, flujo interactivo, triggers, y notas para la IA.

---

## 🛠️ Uso en OpenCode

1. Abre la terminal en la carpeta de tu proyecto: `cd mi-nueva-app`
2. Ejecuta: `opencode`
3. Escribe el trigger: `nuevo proyecto`
4. Rellena la configuración rápida (nombre, tipo, descripción, tono visual, módulos)
5. Sigue el flujo guiado con pausas explícitas entre fases
6. Entrega la app validada y documentada al cliente

---

## 📝 Changelog

| Versión | Fecha | Cambios |
|---------|-------|---------|
| `1.0.0` | 2026 | Lanzamiento inicial con 7 SKILLs + orquestador |
| `1.1.0` | 2026 | Metadata corregida, triggers estandarizados, eliminación de refs rotas |
| `2.0.0` | 2026 | Integración completa con `design-ux-intelligence` y `stack-compliance-guard` |

---

## 🤝 Contribuir

¿Encontraste un error o tienes una mejora? 
1. Abre un **Issue** describiendo el problema
2. Haz un **Pull Request** con la corrección
3. Mantén el formato YAML, los triggers y el idioma español

---

## 📜 Licencia

MIT License © [Angel Hernandez](https://ahaguilera.dev)  
Uso comercial permitido. Atribución recomendada. Sin garantía expresa.

> 💡 *"Desarrollo web offline-first, seguro y listo para usar."* 🌐🔒⚡
```

---

✅ **ARCHIVO #8/8 COMPLETADO**: `README.md`

**Instrucciones**:
1. Copia todo el bloque de código de arriba
2. Pégalo en la raíz de tu repositorio y guarda como `README.md`
3. Haz commit y push para actualizar tu GitHub



---