# Diseño: IA Jutia como Plugin Autocontenido para AHApps

**Fecha:** 2026-07-01
**Estado:** Borrador

---

## 1. Resumen

IA Jutia pasa de ser un skill que genera código (5-8 archivos repartidos entre `core/` y `modules/`, modificando `index.html`, `db.js`, `project.config.js`) a un **plugin autocontenido** que se integra en cualquier AHApp copiando una carpeta y agregando un solo `<script>` tag.

Dos perfiles:
- **Lite (siempre):** FlexSearch + chat conversacional + stats + predicciones. Funciona inmediatamente, ~40KB.
- **Full (expansión opcional):** RAG, ingesta de documentos, OCR, SQLite FTS5, extracción de facturas multi-región. Descarga única de modelos ~233MB (compartible entre N apps en misma PC).

---

## 2. Arquitectura General

### Dos Caras de UI

1. **Drawer flotante + FAB** — Acceso rápido a chat y herramientas desde cualquier módulo de la app
2. **Módulo `modules/ia-jutia/`** — Stats, predicciones, configuración avanzada

### Capas

```
App AHA (Inventario, CRM, Gastos...)
│
├── FAB botón flotante 🐿️ → abre Drawer
│   └── Drawer lateral
│       ├── Chat (threads múltiples + búsqueda historial)
│       ├── Upload documentos (Full)
│       └── Tools contextuales (extraer-factura, según app activa)
│
├── window.MODULES['ia-jutia']
│   └── Página módulo
│       ├── Stats (statsAll, predict, forecast)
│       ├── Predicciones
│       └── Settings (toggle Lite/Full, ruta modelos, descarga Full)
│
└── Eventos jutia:* (comunicación desacoplada)
    └── Apps consumidoras escuchan y reaccionan
```

---

## 3. Estructura de Archivos

```
modules/ia-jutia/
├── module.js                   ← Entry point único (~400 líneas)
│   ├── Carga scripts lazy (FlexSearch, Full libs)
│   ├── Crea Alpine store + FAB + Drawer en DOM
│   ├── Detecta perfil (Lite/Full) desde APP_CONFIG
│   ├── Registra window.MODULES['ia-jutia']
│   ├── Inicializa DB híbrida
│   └── Escucha eventos jutia:*
│
├── module.html                 ← Template del módulo (Stats, Pred, Settings)
│
├── ia-core.js                  ← window.ia (~400 líneas)
│   ├── FlexSearch wrapper con Worker Blob
│   ├── registerTable(), indexRecord(), removeRecord()
│   ├── stats(), statsAll()
│   ├── predict(), forecast(), movingAverage()
│   └── exportResumen()
│
├── ia-chat.js                  ← window.ia.chat (~250 líneas)
│   ├── CRUD threads: create, list, load, delete
│   ├── ask() → 9 patrones DB + FlexSearch fallback
│   ├── searchHistory() → FTS5 sobre historial
│   └── [Full] askFull() → BD + documentos fusionados
│
├── ia-full.js                  ← [Full] window.iaFull (~400 líneas)
│   ├── searchHybrid() (FlexSearch 0.6 + semántica 0.4)
│   ├── ingestFile() → detecta tipo, parsea, chunk, indexa
│   ├── getDocumentos(), deleteDocumento()
│   ├── Cache API download de modelos
│   └── Importa tools/ según app activa
│
├── ia-worker.js                ← [Full] Web Worker Transformers.js
│
├── ia-sqlite.js                ← [Full] window.sqliteDB (FTS5)
│
├── tools/
│   ├── _registry.js            ← window.IATools: registro de tools disponibles
│   └── extraer-factura.js      ← window.ExtraerFacturaTool
│       ├── Detecta región (13 países)
│       ├── Regex regional por país
│       ├── _parsearNumeroLatam() (1,234.56 y 1.234,56)
│       └── Modo Cachucha Genérico
│
└── assets/
    ├── flexsearch.min.js       ← ~7KB, siempre incluido
    ├── ui-ia-drawer.html       ← Template HTML del Drawer (inline en module.js)
    └── ui-ia-fab.html          ← Template HTML del FAB (inline en module.js)
```

**Principios:**
- `module.js` es el único script tag agregado a `index.html`
- Todo lo demás carga lazy
- **0 `import`/`export`** — todo via `window.*`
- Tools se auto-descubren desde `tools/_registry.js`
- Carpeta `tools/` es extensible

---

## 4. Estrategia DB (Híbrida — Opción C)

```
window.db (Dexie de la app anfitriona)
├── _ia_chats        ← CRUD de threads — respaldados por sync engine
├── _ia_messages     ← Mensajes de chat — respaldados por sync engine
└── tablas negocio   ← productos, clientes, etc. (registerTable las indexa)

window.iaDB (Dexie separada 'AHA_Jutia')
├── _ia_docs         ← Documentos subidos
├── _ia_chunks       ← Chunks de texto para RAG
├── _ia_index        ← Caché consultas Lite
├── modelos_cache    ← Modelos descargados
└── _ia_sqlite       ← Snapshot FTS5 (solo Full)
```

**Justificación:**
- `_ia_chats`/`_ia_messages` en `window.db`: sync engine los respalda en `.ateje-backup`
- `_ia_docs`/`_ia_chunks` en `iaDB`: datos grandes no contaminan backup de negocio
- `registerTable()` sigue leyendo de `window.db` para indexar datos de negocio

---

## 5. Flujo de Inicialización

```
1. module.js se ejecuta (script tag en index.html)
2. Carga FlexSearch (lazy si no existe window.FlexSearch)
3. Init DB híbrida:
   ├── Detecta si window.db ya tiene _ia_chats
   ├── Si no → crea con db.version(N+1)
   └── Crea window.iaDB = new Dexie('AHA_Jutia')
4. Carga ia-core.js → window.ia
5. Carga ia-chat.js → window.ia.chat
6. [Full] Si APP_CONFIG.iaJutia.perfil === 'full':
   ├── Detecta ruta de modelos (compartida/local/Cache API)
   ├── Si existe → carga ia-full.js, ia-worker.js, ia-sqlite.js
   └── Si no → inicia descarga Cache API con progreso
7. Registra Alpine.store('ia') si no existe
8. Inyecta FAB + Drawer en DOM
9. Registra window.MODULES['ia-jutia']
10. Escucha eventos jutia:*
```

---

## 6. Perfiles: Lite Siempre + Full como Expansión

### Lite (siempre incluido, ~40KB total)

FlexSearch, chat 9 patrones, stats, predicciones. Sin descargas. Sin internet.

### Full (expansión opcional, ~233MB)

RAG, OCR, SQLite FTS5, extracción facturas multi-región, búsqueda híbrida.

### Formas de Obtener Full

| Opción | Método | Perfil app |
|--------|--------|:----------:|
| A | Cache API (download con barra de progreso) | Essential/Lite |
| B | Carpeta `jutia-models/` junto al .exe | Professional/Business |
| C | Ruta personalizada desde Settings | Cualquiera |
| D | ZIP descargable extraído manualmente | Cualquiera |

### Modelos Compartidos entre Apps (Misma PC)

Todas las apps del mismo cliente apuntan a la misma carpeta:
```json
{ "iaJutia": { "perfil": "full", "rutaModelos": "C:/AHA/jutia-models/" } }
```
233MB totales (no N × 233MB). Actualización centralizada.

---

## 7. UI: FAB + Drawer + Módulo

| Componente | Descripción |
|-----------|-------------|
| **FAB** | Botón flotante `fixed bottom-6 right-6`, `btn-circle btn-primary`, icono 🐿️ |
| **Drawer** | `w-96`, slide desde derecha, tabs: Chat / Upload / Tools |
| **Chat** | Threads múltiples, burbujas con badges de fuente (BD primary / Docs accent) |
| **Upload** | Drag & drop, progreso, tools contextuales |
| **Módulo** | Stats, Predicciones, Settings |

**Responsive:**
- ≥ 1024px: Drawer 400px lateral + módulo completo
- < 1024px: Drawer full screen overlay, módulo oculto

---

## 8. Sistema de Eventos `jutia:*`

| Evento | Dirección | Payload |
|--------|:---------:|---------|
| `jutia:factura-extraida` | → App | FacturaSchema completo |
| `jutia:search-result` | → App | `{ tabla, id, nombre }` |
| `jutia:chat-response` | → App | `{ mensaje, fuentes[] }` |
| `jutia:model-progress` | → App | `{ porcentaje, velocidad }` |
| `jutia:model-ready` | → App | `{ perfil: 'full' }` |
| `jutia:trigger` | ← App | Abre Drawer |
| `jutia:query` | ← App | Ejecuta búsqueda contextual |
| `jutia:register-context` | ← App | Registra tabla/campo para search |

---

## 9. Motor de Extracción Multi-Región

**13 países:** MX, CO, CL, AR, PE, VE, EC, DO, GT, HN, CR, UY, BO + Genérico

**Detección por huellas de texto** (2+ keywords encontradas → región identificada).
**Regex regional** para RFC, CUIT, RUT, NIT, RUC, RIF, RNC, RTN según país.
**`_parsearNumeroLatam()`** maneja `1,234.56` (MX/PE) y `1.234,56` (AR/CL/CO).
**Modo Cachucha:** si no se identifica país, extrae Total + Fecha por contexto genérico.

**Salida:** `FacturaSchema` estándar → evento `jutia:factura-extraida` → apps consumidoras mapean.

---

## 10. Integración con Pipeline

| Cambio | Efecto |
|--------|--------|
| `code-generator` ya no modifica `db.js` | Plugin maneja sus tablas |
| `code-generator` ya no modifica `project.config.js` | Defaults en module.js |
| `setup-ia.ps1` | Instala plugin en app existente |
| `ia-jutia/SKILL.md` | Se actualiza con nueva arquitectura |
| `ia-jutia/templates/` | Cambia de `lite/`/`full/` a `plugin/` |

---

## 11. Casos Borde

| Escenario | Comportamiento |
|-----------|---------------|
| Sin Alpine.store('loading') | Se crea |
| FlexSearch ya cargado | No recarga |
| Full sin modelos descargados | Progreso + descarga, app usable |
| Sin internet | Modelos cacheados ok. Lite siempre funciona |
| Neutralino .exe | Blob Worker. Sin CDN |
| file:// | Todo funciona, sin CORS |
| Factura sin formato oficial | Modo Cachucha: Total + Fecha |
