---
name: upgrade-engine
description: Migra una app Ateje entre perfiles Lite/Full e IA Lite/Full. No modifica modulos ni datos, solo agrega/remueve archivos de infraestructura.
license: MIT
author: Angel Hernandez - ahaguilera.dev
version: "1.0"
triggers:
  - "/upgrade"
  - "upgrade"
  - "subir perfil"
  - "lite a full"
  - "full a lite"
  - "migrar perfil"
  - "cambiar perfil"
  - "actualizar perfil"
stack: ["ateje", "upgrade", "perfil", "lite", "full"]
perfiles: [lite, full]
language: es
---

# SKILL: upgrade-engine (Migracion de Perfil)

> **Proposito**: Migrar una app Ateje existente entre perfiles Lite/Full e IA Lite/Full.
> Sin modificar modulos ni datos del usuario.
> **Pre-requisito**: project.config.js existente en la raiz del proyecto.

---

## REGLAS FUNDAMENTALES

1. **NO modificar modulos** (modules/*) — el frontend es ~95% identico entre perfiles
2. **NO tocar datos** (IndexedDB) — los datos estan en el navegador, no en archivos
3. **SI preservar** DESIGN.md, .omd/preferences.md, docs/ y personalizaciones existentes
4. **SI validar** con stack-compliance-guard post-upgrade
5. **NO soportar** Full→Lite (ilogico degradar una app)
6. **IA Jutia es independiente** — su perfil no cambia con el perfil tecnico a menos que se explicite

---

## FASE 0: DIAGNOSTICO

`
/usar upgrade-engine
`

1. Buscar project.config.js en el directorio actual
2. Si no existe → error: "No se encuentra project.config.js. Ejecuta este comando en la raiz de tu app Ateje."
3. Leer window.APP_CONFIG:
   - perfil (lite/full) — perfil tecnico actual
   - iaJutia (lite/full/no) — perfil de IA actual
   - 
ombreApp — nombre de la app
4. Mostrar diagnostico:

`
═══════════════════════════════════════════
  DIAGNOSTICO DE PERFIL
═══════════════════════════════════════════
  App:        [nombreApp]
  Perfil:     [lite/full]
  IA Jutia:   [lite/full/no]
═══════════════════════════════════════════
`

5. Preguntar destinos:

`
┌──────────────────────────────────────────┐
│  Selecciona los upgrades a aplicar:      │
├──────────────────────────────────────────┤
│  APP (perfil tecnico)                    │
│  [1] Lite → Full  (agrega .exe + .apk)  │
│  [0] No cambiar                          │
├──────────────────────────────────────────┤
│  IA Jutia (independiente del perfil)     │
│  [2] No → Lite  (FlexSearch + stats)     │
│  [3] Lite → Full (QA + ingesta docs)     │
│  [0] No cambiar                          │
├──────────────────────────────────────────┤
│  Android .apk                            │
│  [4] Si (requiere JDK 17+ y Android SDK) │
│  [5] No                                  │
└──────────────────────────────────────────┘
`

6. Segun las opciones elegidas, mostrar resumen de cambios:

`
═══════════════════════════════════════════
  RESUMEN DE UPGRADE
═══════════════════════════════════════════
  APP:  Lite → Full     ✅ (6 archivos nuevos)
  IA:   Lite → Full     ✅ (+ modelos ONNX)
  Android: Si           ✅ (requiere JDK 17+)
═══════════════════════════════════════════
  ¿Proceder? (S/N)
`

---

## FASE 1: LITE → FULL (Infraestructura)

Ejecutar SOLO si se eligio upgrade de APP perfil.

### 1.1 Crear package.json

Si no existe, crear desde template:

`json
{
  "name": "[nombreApp]",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "neu run",
    "build": "neu build --release"
  },
  "dependencies": {
    "alpinejs": "^3.14.0",
    "dexie": "^4.0.0",
    "cryptojs": "^4.2.0",
    "chart.js": "^4.4.0",
    "jspdf": "^2.5.0",
    "sheetjs": "^0.20.0",
    "pako": "^2.1.0"
  }
}
`

### 1.2 Crear neutralino.config.json

Copiar desde deployment-jigue/templates/neutralino.config.json y adaptar:
- pplicationId: "com.[nombreApp]"
- 
ativeWindow.title: nombreApp
- cli.binaryName: nombreApp en kebab-case

### 1.3 Crear capacitor.config.json (si Android)

Copiar desde capacitor/templates/capacitor.config.json y adaptar:
- ppId: "com.[nombreApp]"
- ppName: nombreApp

### 1.4 Descargar neutralino.js

`ash
curl -o core/neutralino.js https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js
`

### 1.5 Instalar dependencias npm

`ash
npm install
`

### 1.6 Inicializar Capacitor (si Android)

`ash
npm install -g @capacitor/core @capacitor/cli @capacitor/android
npx cap init "[nombreApp]" "com.[nombreApp]" --web-dir "."
npx cap add android
`

### 1.7 Inyectar capacitor-detect.js en core/app.js

Si no existe, copiar desde capacitor/templates/capacitor-detect.js a core/capacitor-detect.js
y agregar <script src="core/capacitor-detect.js"> en index.html antes de core/app.js.

---

## FASE 2: UPGRADE IA JUTIA

Ejecutar SOLO si se eligio upgrade de IA.

### 2.1 No → Lite (FlexSearch + estadisticas)

`ash
npm install flexsearch
`

1. Crear modules/ia-lite.js con el template de busqueda FlexSearch
2. Agregar <script src="modules/ia-lite.js"> en index.html antes de core/app.js
3. Inyectar atajo global Cmd+K para busqueda en core/app.js

### 2.2 Lite → Full (QA + ingesta documentos)

`ash
npm install @xenova/transformers pdfjs-dist mammoth marked
`

1. Copiar templates desde ia-jutia/templates/full/:
   - core/ia-worker.js — Web Worker para Transformers.js
   - core/ia-sqlite.js — SQLite FTS5 para busqueda en documentos
2. Descargar modelos ONNX a ssets/models/:
`ash
mkdir -p assets/models
curl -f -L -# -o assets/models/bert-qa.onnx "https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/model.onnx"
curl -f -L -# -o assets/models/bert-qa-tokenizer.json "https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/tokenizer.json"
`
3. Agregar scripts en index.html:
   - <script src="core/ia-worker.js"> antes de core/app.js
   - <script src="core/ia-sqlite.js"> antes de core/app.js
4. Inyectar atajo global Cmd+K en core/app.js

---

## FASE 3: ACTUALIZAR CONFIGURACION

Modificar project.config.js:

`javascript
// Antes del upgrade
window.APP_CONFIG = {
  perfil: 'lite',
  iaJutia: 'lite',
  // ...
}

// Despues del upgrade
window.APP_CONFIG = {
  perfil: 'full',
  iaJutia: 'full',
  android: true,
  // ...
}
`

Campos a actualizar:
- perfil → "full" (si se upgradeo APP)
- iaJutia → nuevo valor (si se upgradeo IA)
- ndroid → true/false (si se eligio Android)

---

## FASE 4: VALIDACION POST-UPGRADE

Ejecutar stack-compliance-guard con el nuevo perfil.

### Checks especificos de upgrade

| Check | Perfil | Que verificar |
|-------|--------|--------------|
| 
eutralino.config.json existe | Full | Necesario para compilar .exe |
| capacitor.config.json existe | Full+Android | Necesario para generar .apk |
| core/neutralino.js existe | Full | Cliente Neutralino para frontend |
| package.json con deps | Full | alpinejs, dexie, cryptojs presentes |
| ssets/models/ con ONNX | IA Full | Modelos Transformers.js descargados |
| Sin import/export/	ype=module | Ambos | CORS bloquea ES6 en file:// |
| Sin etch/CDN en runtime | Ambos | 100% offline sin dependencias externas |
| cryptoHelpers.encrypt() en datos sensibles | Ambos | Proteccion local |

### Reporte final

`
═══════════════════════════════════════════
  ✅ UPGRADE COMPLETADO
═══════════════════════════════════════════
  APP:  [lite/full] → [lite/full]   ✅
  IA:   [lite/full/no] → [lite/full/no] ✅
  Android: [si/no]                   ✅
═══════════════════════════════════════════
  Archivos agregados:   [n]
  Dependencias npm:     [n]
  Modulos tocados:      0
  Datos preservados:   ✅
═══════════════════════════════════════════
  Siguiente paso: /deploy para empaquetar
═══════════════════════════════════════════
`

---

## 🛡️ AUTO-VALIDACION

- [ ] ¿project.config.js existe y tiene perfil correcto? → Leer antes de empezar
- [ ] ¿Se eligio Android pero no hay JDK 17+? → Informar requisito, no bloquear
- [ ] ¿perfil=Full pero 
eutralino.config.json no se genero? → RECHAZAR
- [ ] ¿perfil=Full pero core/neutralino.js no existe? → DESCARGAR
- [ ] ¿IA Full pero modelos ONNX no descargados? → INFORMAR, no bloquear
- [ ] ¿Import/export en modulos tras upgrade? → ❌ RECHAZAR
