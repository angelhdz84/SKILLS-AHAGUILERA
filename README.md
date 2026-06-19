# 🏗️ Ateje Stack — Offline-First App Factory para OpenCode

> **Desarrollo freelance profesional • 100% offline • Sin servidores • Sin CDNs • Sin builds**
>
> Skill-Layer Architecture: 5 engines + 6 standalone + 16 OmD skills que generan apps completas desde una spec. Creado por [Angel Hernandez](https://ahaguilera.dev).

---

## 📦 Skills

| Capa | Skills | Propósito |
|------|--------|-----------|
| **Engines** (5) | `pipeline-engine` `spec-engine` `design-engine` `validation-engine` `wiki-engine` | Orquestación y coordinación |
| **Standalone** (6) | `setup-init` `code-generator` `stack-compliance-guard` `alpine-ui-patterns` `deployment-jigue` `ia-jutia` | Ejecución pura |
| **OmD** (16) | `omd-init` `omd-apply` `omd-taste` `omd-sync` `omd-remember` `omd-learn` ... | 286 referencias de diseño reales |

---

## ⚡ Pipeline

```
nuevo proyecto
  └─ /new (Classic) → setup → spec → build → validate → deploy
  └─ /pro (Design)  → 10 fases con brand layer OmD
```

---

## 📁 Estructura

```
Ateje/
├── pipeline-engine/         — Orquestador maestro dual (/new, /pro)
├── spec-engine/             — Spec funcional + DESIGN.md brand layer
├── design-engine/           — Brand context injection + tokens DaisyUI
├── validation-engine/       — Compliance + brand audit + QA rubric
├── wiki-engine/             — Wiki persistente + preferencias
├── setup-init/              — Valida entorno, crea estructura
├── code-generator/          — Genera código por fases desde specs
├── stack-compliance-guard/  — Guarda automática offline-first
├── alpine-ui-patterns/      — Catálogo ~100 comps Pines/Penguin/Pinemix
├── deployment-jigue/        — Commit + push + Pages + ZIP/.exe
├── ia-jutia/                — Mini IA offline-first
├── mcp-servers/             — MCP servers (stocky, refero-styles)
└── tests/                   — Playwright E2E
```

---

## 🚀 Instalación

```bash
git clone https://github.com/angelhdz84/Ateje.git
```

Copia las skills activas a `~/.opencode/skills/` si usas OpenCode local.

---

## ⚠️ Reglas del Stack

| Regla | Motivo |
|-------|--------|
| ❌ `import`/`export`/`type="module"` | CORS bloquea ES6 en `file://` |
| ❌ `fetch`/CDNs en runtime | 100% offline sin dependencias externas |
| ✅ `cryptoHelpers.encrypt()` en datos sensibles | Protección local |
| ✅ DaisyUI + Bootstrap Icons + Alpine.js | Componentes accesibles offline |
| ✅ Español en UI, comentarios y docs | Mercado hispanohablante |

---

## 📜 Licencia

MIT © [Angel Hernandez](https://ahaguilera.dev)
