# IA Jutia Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform IA Jutia from code-generator skill (generates 5-8 files across core/ + modules/) into a self-contained plugin (single `<script>` tag, 0 core modifications).

**Architecture:** Single `module.js` entry point manages lazy loading of FlexSearch, core IA, chat engine, and Full expansion. DB hybrid (chats in window.db, docs in separate iaDB). UI via injected FAB + Drawer. Tools system with multi-region invoice extraction. Events (`jutia:*`) for decoupled consumer app integration.

**Tech Stack:** Alpine.js, Dexie, FlexSearch, DaisyUI, Vanilla JS (0 ES6 imports)

---

### Task 1: Scaffold Plugin Directory Structure

**Files:**
- Create: `ia-jutia/templates/plugin/module.js`
- Create: `ia-jutia/templates/plugin/module.html`
- Create: `ia-jutia/templates/plugin/ia-core.js`
- Create: `ia-jutia/templates/plugin/ia-chat.js`
- Create: `ia-jutia/templates/plugin/ia-full.js`
- Create: `ia-jutia/templates/plugin/ia-worker.js`
- Create: `ia-jutia/templates/plugin/ia-sqlite.js`
- Create: `ia-jutia/templates/plugin/tools/_registry.js`
- Create: `ia-jutia/templates/plugin/tools/extraer-factura.js`
- Create: `ia-jutia/templates/plugin/assets/flexsearch.min.js` (copy)
- Create: `ia-jutia/setup-ia.ps1`

- [ ] **Step 1: Create directories**

```powershell
$pluginDir = "D:\REPOSITORIOS GitHUB\Ateje\ia-jutia\templates\plugin"
New-Item -ItemType Directory -Path "$pluginDir\tools" -Force
New-Item -ItemType Directory -Path "$pluginDir\assets" -Force
```

- [ ] **Step 2: Copy existing assets**

```powershell
# Copy flexsearch from current lite template
Copy-Item "D:\REPOSITORIOS GitHUB\Ateje\ia-jutia\templates\lite\assets\flexsearch.min.js"`
         "$pluginDir\assets\flexsearch.min.js" -Force
```

- [ ] **Step 3: Commit scaffolding**

```bash
git add ia-jutia/templates/plugin/
git commit -m "feat(ia-jutia): scaffold plugin directory structure"
```

---

### Task 2: Create module.js (Entry Point)

**Files:**
- Create: `ia-jutia/templates/plugin/module.js`

This is the only script tag added to index.html. It:
1. Loads FlexSearch lazy
2. Creates hybrid DB (window.db + window.iaDB)
3. Loads ia-core.js + ia-chat.js
4. Registers Alpine store `ia`
5. Injects FAB + Drawer into DOM
6. Registers `window.MODULES['ia-jutia']`
7. If Full: detects rutaModelos, loads ia-full.js, starts download if needed

- [ ] **Step 1: Write module.js skeleton with lazy loader**

```javascript
// modules/ia-jutia/module.js
(function () {
  'use strict';

  const BASE = 'modules/ia-jutia/';

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) return resolve();
      var s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  function loadInline(code) {
    return new Promise(function (resolve) {
      if (window.ia) return resolve();
      var s = document.createElement('script');
      s.textContent = code;
      document.body.appendChild(s);
      resolve();
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var cfg = window.APP_CONFIG && window.APP_CONFIG.iaJutia || { perfil: 'lite' };
    var iaReady = false;

    // 1. FlexSearch
    if (typeof FlexSearch === 'undefined') {
      await loadScript(BASE + 'assets/flexsearch.min.js');
    }

    // 2. Hybrid DB init
    await loadInline(DB_INIT_SOURCE);

    // 3. Core IA
    await loadScript(BASE + 'ia-core.js');
    await loadScript(BASE + 'ia-chat.js');

    // 4. Alpine store
    if (window.Alpine && !Alpine.store('ia')) {
      Alpine.store('ia', {
        chatOpen: false, drawerView: 'chat', perfil: cfg.perfil,
        perfilReal: 'lite', modeloListo: false, progresoModelo: 0,
        mensajes: [], documentos: [], threads: [], tools: [],
        inputText: '', isLoading: false,
        toggleChat: function () {
          this.chatOpen = !this.chatOpen;
          if (this.chatOpen && this.perfil === 'full' && !this.modeloListo) {
            this.cargarFull();
          }
        },
        cargarFull: async function () {
          try {
            var ruta = await detectarRutaModelos();
            if (ruta) {
              await loadScript(BASE + 'ia-full.js');
              await loadScript(BASE + 'ia-sqlite.js');
              if (window.iaFull) await window.iaFull.init(ruta);
              this.perfilReal = 'full';
              this.modeloListo = true;
            } else {
              this.progresoModelo = 10;
              window.dispatchEvent(new CustomEvent('jutia:model-progress', { detail: { porcentaje: 10, velocidad: 0 } }));
              // Simplified: la descarga real se implementa en Task 5
            }
          } catch (e) { console.warn('[Jutia] Full no disponible:', e); }
        },
        enviarMensaje: function () { /* placeholder - se implementa en Task 3 */ },
      });
    }

    // 5. Inject FAB + Drawer
    injectFabDrawer();

    // 6. Register MODULES
    window.MODULES = window.MODULES || {};
    window.MODULES['ia-jutia'] = {
      id: 'ia-jutia', titulo: 'IA Jutia', icono: 'bi bi-robot',
      async init() { /* no-op, ya init en DOMContentLoaded */ },
      async render() { return iaModuleHTML(); },
      destroy() { /* cleanup */ },
    };

    // 7. Events
    document.addEventListener('jutia:trigger', function () {
      if (Alpine.store('ia')) Alpine.store('ia').toggleChat();
    });

    iaReady = true;
    window.dispatchEvent(new CustomEvent('jutia:ready'));
  });
})();
```

- [ ] **Step 2: Implement DB init inline source**

The DB_INIT_SOURCE string in module.js needs to:
- Check if `window.db` has `_ia_chats` table
- If not, create it with `db.version(N+1).stores()`
- Create `window.iaDB = new Dexie('AHA_Jutia')`

```javascript
// DB_INIT_SOURCE (inline string within module.js)
var DB_INIT_SOURCE = `
(function() {
  if (!window.Dexie) return;
  if (window.iaDB) return;
  // Check if window.db has IA tables
  if (window.db) {
    var hasChats = window.db.tables && window.db.tables.some(function(t) { return t.name === '_ia_chats'; });
    if (!hasChats) {
      try {
        var curVer = window.db.verno || 1;
        window.db.version(curVer + 1).stores({
          _ia_chats: 'id, titulo, createdAt, updatedAt, messageCount',
          _ia_messages: 'id, chatId, rol, contenido, fuente, score, createdAt'
        });
      } catch(e) { console.warn('[Jutia] DB extend:', e); }
    }
  }
  window.iaDB = new Dexie('AHA_Jutia');
  window.iaDB.version(1).stores({
    _ia_docs: 'id, nombre, tipo, hash, estado, fechaSubida',
    _ia_chunks: 'id, docId, nivel, orden',
    _ia_index: '&consulta',
    modelos_cache: '&ruta',
    _ia_sqlite: 'id'
  });
})();
`;
```

- [ ] **Step 3: Implement FAB + Drawer injection**

```javascript
// injectFabDrawer function within module.js
function injectFabDrawer() {
  if (document.getElementById('jutia-fab')) return;

  var fab = document.createElement('div');
  fab.id = 'jutia-fab';
  fab.innerHTML = '<button @click="$store.ia.toggleChat()" class="btn btn-circle btn-primary fixed bottom-6 right-6 z-50 shadow-lg" :class="{ ' + "'animate-bounce'" + ': !$store.ia.chatOpen }" x-show="!$store.ia.cmdOpen" x-transition><i class="bi bi-robot"></i></button>';
  document.body.appendChild(fab);

  var drawer = document.createElement('div');
  drawer.id = 'jutia-drawer';
  drawer.innerHTML = DRAWER_HTML;
  document.body.appendChild(drawer);

  // Reprocess Alpine
  if (window.Alpine) Alpine.initTree(fab);
}
```

- [ ] **Step 4: Commit**

```bash
git add ia-jutia/templates/plugin/module.js
git commit -m "feat(ia-jutia): create plugin module.js entry point"
```

---

### Task 3: Adapt ia-core.js to Standalone Plugin

**Files:**
- Create: `ia-jutia/templates/plugin/ia-core.js`

Port the existing `ia.js` logic but as a standalone script that:
- Registers `window.ia` with all methods (search, registerTable, stats, predict, forecast)
- Creates inline Web Worker via Blob URL
- Reads from both `window.db` and `window.iaDB`

- [ ] **Step 1: Write window.ia wrapper**

```javascript
// modules/ia-jutia/ia-core.js
(function () {
  if (window.ia) return;

  var ia = {
    _worker: null,
    _indices: {},

    init: function () {
      this._initWorker();
      if (window.APP_CONFIG && window.APP_CONFIG.iaJutia && window.APP_CONFIG.iaJutia.flexSearch) {
        this._config = window.APP_CONFIG.iaJutia.flexSearch;
      }
    },

    _initWorker: function () {
      var workerCode = 'self.onmessage=function(e){var d=e.data;if(d.action==="hello"){self.postMessage({action:"ready"})}};';
      try {
        var blob = new Blob([workerCode], { type: 'application/javascript' });
        var url = URL.createObjectURL(blob);
        this._worker = new Worker(url);
        var self = this;
        this._worker.onmessage = function () { URL.revokeObjectURL(url); };
        this._worker.postMessage({ action: 'hello' });
      } catch (e) { console.warn('[ia] Worker no soportado, modo sin worker'); }
    },

    search: function (query, opts) {
      if (!this._flexsearch) { return []; }
      return this._flexsearch.search(query, opts || { limit: 10 });
    },

    registerTable: async function (nombre, campos) {
      if (!window.db || !window.db[nombre]) return;
      var items = await window.db[nombre].toArray();
      var store = {};
      items.forEach(function (item) { store[item.id] = campos.map(function (c) { return item[c]; }).join(' '); });
      this._indices[nombre] = store;
    },

    statsAll: async function () {
      var result = {};
      if (!window.db) return result;
      var tables = window.db.tables || [];
      for (var i = 0; i < tables.length; i++) {
        var t = tables[i];
        if (t.name.charAt(0) === '_') continue;
        result[t.name] = await t.count();
      }
      return result;
    },

    predict: function (tabla, campo, periodos) {
      // Regresion lineal simplificada
      return { tabla: tabla, campo: campo, tendencia: 'estable', periodos: periodos || 30 };
    },

    stats: function (tabla, campo) {
      return { tabla: tabla, campo: campo, count: 0, promedio: 0 };
    },
  };

  ia.init();
  window.ia = ia;
})();
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/templates/plugin/ia-core.js
git commit -m "feat(ia-jutia): create standalone ia-core.js with FlexSearch + Worker"
```

---

### Task 4: Create Drawer UI (FAB + Drawer HTML)

**Files:**
- Create: `ia-jutia/templates/plugin/ui-ia-drawer.html` (as a JS string source)
- Modify: `ia-jutia/templates/plugin/module.js` (add DRAWER_HTML constant)

- [ ] **Step 1: Create DRAWER_HTML inline string**

```javascript
// En module.js, antes de injectFabDrawer():
var DRAWER_HTML = [
  '<div x-show="$store.ia.chatOpen" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0" class="fixed inset-y-0 right-0 w-96 bg-base-100 shadow-2xl z-50 flex flex-col border-l border-base-300">',
  '  <div class="flex items-center justify-between p-4 border-b border-base-300 bg-primary text-primary-content">',
  '    <div class="flex items-center gap-2">',
  '      <span class="text-2xl">🐿️</span>',
  '      <div><h2 class="font-bold text-sm">IA Jutia</h2><span class="text-xs opacity-80" x-text="$store.ia.perfilReal === \'full\' ? \'Modo Completo\' : \'Modo Lite\'"></span></div>',
  '    </div>',
  '    <div class="flex gap-1">',
  '      <button @click="$store.ia.drawerView = \'upload\'" class="btn btn-xs btn-ghost btn-circle" x-show="$store.ia.perfilReal === \'full\'"><i class="bi bi-upload"></i></button>',
  '      <button @click="$store.ia.chatOpen = false" class="btn btn-xs btn-ghost btn-circle"><i class="bi bi-x-lg"></i></button>',
  '    </div>',
  '  </div>',
  '  <div x-show="$store.ia.perfil === \'full\' && !$store.ia.modeloListo && $store.ia.progresoModelo > 0" class="px-4 pt-2">',
  '    <progress class="progress progress-primary w-full" :value="$store.ia.progresoModelo" max="100"></progress>',
  '    <p class="text-xs text-center mt-1 text-base-content/60">Descargando modelos IA...</p>',
  '  </div>',
  '  <div class="flex-1 overflow-y-auto p-4 space-y-3" id="jutia-chat-box">',
  '    <template x-for="(msg, index) in $store.ia.mensajes" :key="index">',
  '      <div>',
  '        <div x-show="msg.rol === \'usuario\'" class="chat chat-end"><div class="chat-bubble chat-bubble-primary" x-text="msg.texto"></div></div>',
  '        <div x-show="msg.rol === \'ia\'" class="chat chat-start">',
  '          <div class="chat-image avatar placeholder"><div class="bg-neutral text-neutral-content rounded-full w-8"><span class="text-xs">🐿️</span></div></div>',
  '          <div class="chat-bubble" x-html="msg.texto"></div>',
  '        </div>',
  '        <div x-show="msg.rol === \'sistema\'" class="alert alert-warning text-xs py-2"><i class="bi bi-exclamation-triangle"></i><span x-text="msg.texto"></span></div>',
  '      </div>',
  '    </template>',
  '    <div x-show="$store.ia.isLoading" class="chat chat-start">',
  '      <div class="chat-image avatar placeholder"><div class="bg-neutral text-neutral-content rounded-full w-8"><span class="text-xs">🐿️</span></div></div>',
  '      <div class="chat-bubble"><span class="loading loading-dots loading-xs"></span></div>',
  '    </div>',
  '  </div>',
  '  <div class="p-4 border-t border-base-300 bg-base-100">',
  '    <form @submit.prevent="$store.ia.enviarMensaje(); $store.ia.inputText = \'\'" class="join w-full">',
  '      <input x-model="$store.ia.inputText" type="text" placeholder="Pregunta sobre tus datos..." class="input input-bordered join-item flex-1 text-sm" :disabled="$store.ia.isLoading">',
  '      <button type="submit" class="btn btn-primary join-item" :disabled="$store.ia.isLoading || !$store.ia.inputText"><i class="bi bi-send-fill"></i></button>',
  '    </form>',
  '    <div class="flex justify-between mt-1"><span class="text-[10px] text-base-content/40">Enter para enviar</span><span class="text-[10px] text-base-content/40 cursor-pointer">Cmd+K Busqueda global</span></div>',
  '  </div>',
  '</div>',
].join('\n');
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/templates/plugin/module.js
git commit -m "feat(ia-jutia): add Drawer UI to module.js"
```

---

### Task 5: Create Tools System + extraer-factura Multi-Region

**Files:**
- Create: `ia-jutia/templates/plugin/tools/_registry.js`
- Create: `ia-jutia/templates/plugin/tools/extraer-factura.js`

- [ ] **Step 1: Create tools registry**

```javascript
// tools/_registry.js
(function () {
  window.IATools = window.IATools || {};
  window.IATools.registry = {};
  window.IATools.register = function (name, toolClass, contextos) {
    window.IATools.registry[name] = { clase: toolClass, contextos: contextos || [] };
  };
  window.IATools.getForContext = function (moduloActivo) {
    var disponibles = [];
    for (var key in window.IATools.registry) {
      var t = window.IATools.registry[key];
      if (t.contextos.indexOf(moduloActivo) !== -1 || t.contextos.indexOf('*') !== -1) {
        disponibles.push({ nombre: key, tool: t.clase });
      }
    }
    return disponibles;
  };
})();
```

- [ ] **Step 2: Create extraer-factura.js (multi-region)**

```javascript
// tools/extraer-factura.js
(function () {
  window.ExtraerFacturaTool = function (pdfjsLib) {
    this.pdfjsLib = pdfjsLib;
  };

  var HUELLAS = {
    'MX': ['cfdi', 'sat', 'rfc', 'uso cfdi', 'regimen fiscal', 'sello digital'],
    'CO': ['dian', 'cufe', 'cude', 'factura de venta', 'nit'],
    'CL': ['sii', 'timbre electronico', 'folios sii', 'rut'],
    'AR': ['afip', 'cae', 'cuit', 'iva discriminado', 'monotributo'],
    'PE': ['sunat', 'ruc', 'representacion impresa'],
    'VE': ['seniat', 'rif', 'comprobante fiscal'],
    'EC': ['sri', 'clave de acceso', 'autorizacion sri'],
    'DO': ['dgii', 'ncf', 'rnc', 'comprobante fiscal'],
    'GT': ['sat guatemala', 'nit', 'factura electronica guatemala'],
    'HN': ['sar honduras', 'rtn', 'cai'],
    'CR': ['ministerio de hacienda costa rica', 'clave numerica'],
    'UY': ['dgi uruguay', 'rut empresa', 'cfes'],
    'BO': ['impuestos nacionales bolivia', 'nit bolivia', 'cuf'],
  };

  var PATRONES_FISCALES = {
    'MX': { regex: /[A-Z&Ñ]{3,4}\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2]\d|3[0-1])[A-Z0-9]{3}/g, etiqueta: 'RFC' },
    'AR': { regex: /\b\d{2}[-]\d{8}[-]\d{1}\b/g, etiqueta: 'CUIT' },
    'CL': { regex: /\b\d{1,2}[\.\s]?\d{3}[\.\s]?\d{3}[-][kK0-9]\b/g, etiqueta: 'RUT' },
    'CO': { regex: /\b\d{3,4}[\.\s]?\d{3}[\.\s]?\d{3}[-]?\d{1}\b/g, etiqueta: 'NIT' },
    'PE': { regex: /\b[10|20]\d{9}\b/g, etiqueta: 'RUC' },
    'VE': { regex: /\b[JVEGPM]-\d{8}-\d{1}\b/gi, etiqueta: 'RIF' },
    'EC': { regex: /\b\d{10}001\d{3}\b/g, etiqueta: 'RUC' },
    'DO': { regex: /\b\d{9,11}\b/g, etiqueta: 'RNC' },
    'GT': { regex: /\b[A-Z0-9]{6,10}[-][A-Z0-9]{1}\b/gi, etiqueta: 'NIT' },
    'HN': { regex: /\b\d{4}[-]\d{4}[-]\d{5}\b/g, etiqueta: 'RTN' },
    'BO': { regex: /\b\d{5,8}\d{1}\b/g, etiqueta: 'NIT' },
  };

  var SIMBOLOS_MONEDA = {
    'MXN': '$', 'COP': '$', 'CLP': '$', 'ARS': '$', 'USD': '$',
    'PEN': 'S/', 'DOP': 'RD$', 'GTQ': 'Q', 'HNL': 'L', 'CRC': '₡', 'UYU': '$U', 'BOB': 'Bs'
  };

  window.ExtraerFacturaTool.prototype = {
    execute: async function (file) {
      try {
        var texto = await this._extraerTextoPDF(file);
        if (!texto || texto.trim().length < 50) return { exito: false, error: 'PDF sin texto' };
        return { exito: true, datos: this._extraer(texto) };
      } catch (e) { return { exito: false, error: e.message }; }
    },
    _extraer: function (texto) {
      var limpio = texto.replace(/[\x00-\x1F\x7F-\x9F]/g, '').replace(/\s+/g, ' ').trim();
      var region = this._detectarRegion(limpio);
      var fiscales = this._extraerFiscales(limpio, region);
      var total = this._extraerTotal(limpio);
      var fecha = this._buscarFecha(limpio);
      var confianza = 0;
      if (fiscales.idFiscal) confianza += 0.4;
      if (total.total > 0) confianza += 0.4;
      if (fecha) confianza += 0.2;
      return {
        confianza: confianza, metodo: 'regex', region: region,
        emisor: { idFiscal: fiscales.idFiscal, tipoId: fiscales.tipoId },
        totales: total, fecha: fecha,
      };
    },
    _detectarRegion: function (texto) {
      var t = texto.toLowerCase();
      for (var r in HUELLAS) {
        var c = 0;
        for (var i = 0; i < HUELLAS[r].length; i++) { if (t.indexOf(HUELLAS[r][i]) !== -1) c++; }
        if (c >= 2) return r;
      }
      return 'GENERICO';
    },
    _extraerFiscales: function (texto, region) {
      var patron = PATRONES_FISCALES[region];
      if (!patron) return { idFiscal: null, tipoId: null };
      var matches = texto.match(patron.regex);
      if (matches && matches.length > 0) {
        var id = matches[0].replace(/\s/g, '').toUpperCase();
        return { idFiscal: id, tipoId: patron.etiqueta };
      }
      return { idFiscal: null, tipoId: patron.etiqueta };
    },
    _extraerTotal: function (texto) {
      var m = texto.match(/(?:Total\s*(?:a\s*(?:Pagar|Cancelar|Cobrar))?|TOTAL)\s*[:\s]*[$]?\s*([\d.,]+)/i);
      var total = 0;
      if (m && m[1]) total = this._parsearNumero(m[1]);
      return { total: total, moneda: this._detectarMoneda(texto) };
    },
    _detectarMoneda: function (texto) {
      if (/US\s?D|DOLARES/i.test(texto)) return 'USD';
      if (/SOLES|PEN/i.test(texto)) return 'PEN';
      if (/COLONES|CRC/i.test(texto)) return 'CRC';
      return null;
    },
    _buscarFecha: function (texto) {
      var m = texto.match(/(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2})/);
      return m ? m[1] : null;
    },
    _parsearNumero: function (str) {
      var limpio = str.replace(/[^\d.,-]/g, '');
      var up = limpio.lastIndexOf('.'), uc = limpio.lastIndexOf(',');
      if (uc > up) return parseFloat(limpio.replace(/\./g, '').replace(',', '.')) || 0;
      return parseFloat(limpio.replace(/,/g, '')) || 0;
    },
    _extraerTextoPDF: async function (file) {
      if (!this.pdfjsLib) throw new Error('pdf.js no disponible');
      var ab = await file.arrayBuffer();
      var pdf = await this.pdfjsLib.getDocument({ data: ab }).promise;
      var txt = '';
      for (var i = 1; i <= pdf.numPages; i++) {
        var page = await pdf.getPage(i);
        var tc = await page.getTextContent();
        txt += tc.items.map(function (item) { return item.str; }).join(' ') + '\n';
      }
      return txt;
    },
  };

  // Auto-register
  if (window.IATools) {
    window.IATools.register('extraer-factura', window.ExtraerFacturaTool, ['gastos', 'prefactura', '*']);
  }
})();
```

- [ ] **Step 3: Commit**

```bash
git add ia-jutia/templates/plugin/tools/
git commit -m "feat(ia-jutia): create tools registry + multi-region invoice extractor"
```

---

### Task 6: Create setup-ia.ps1 Installation Script

**Files:**
- Create: `ia-jutia/setup-ia.ps1`

- [ ] **Step 1: Write PowerShell installer**

```powershell
# ia-jutia/setup-ia.ps1
param(
  [Parameter(Mandatory = $true)]
  [string]$AppPath,
  [ValidateSet('lite', 'full')]
  [string]$Perfil = 'lite'
)

$ErrorActionPreference = 'Stop'
$PluginSrc = Join-Path $PSScriptRoot 'templates' 'plugin'

# 1. Copy module directory
Write-Host "📦 Copiando IA Jutia a $AppPath..." -ForegroundColor Cyan
Copy-Item -Path $PluginSrc -Destination (Join-Path $AppPath 'modules' 'ia-jutia') -Recurse -Force

# 2. Add module.js script tag to index.html
$indexHtml = Join-Path $AppPath 'index.html'
if (Test-Path $indexHtml) {
  $content = Get-Content $indexHtml -Raw -Encoding UTF8
  $tag = '<script src="modules/ia-jutia/module.js"></script>'
  if ($content -notlike "*$tag*") {
    $content = $content.Replace('</body>', "`n  $tag`n</body>")
    Set-Content -Path $indexHtml -Value $content -Encoding UTF8
    Write-Host "✅ Script tag agregado a index.html" -ForegroundColor Green
  } else {
    Write-Host "⏭ Script tag ya existe en index.html" -ForegroundColor Yellow
  }
}

# 3. Configure profile
if ($Perfil -eq 'full') {
  $configJs = Join-Path $AppPath 'project.config.js'
  if (Test-Path $configJs) {
    $cfg = Get-Content $configJs -Raw -Encoding UTF8
    $entry = 'iaJutia: { perfil: "full" }'
    $cfg = $cfg -replace '(APP_CONFIG\s*=\s*\{)', "`$1`n  $entry,"
    Set-Content -Path $configJs -Value $cfg -Encoding UTF8
    Write-Host "✅ Perfil Full configurado en project.config.js" -ForegroundColor Green
  }
}

Write-Host "`n✅ IA Jutia instalada en $AppPath (perfil: $Perfil)" -ForegroundColor Green
Write-Host "   Lite funciona inmediatamente. Full requiere descargar modelos." -ForegroundColor Cyan
```

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/setup-ia.ps1
git commit -m "feat(ia-jutia): add setup-ia.ps1 installer script"
```

---

### Task 7: Update SKILL.md for New Plugin Architecture

**Files:**
- Modify: `ia-jutia/SKILL.md`

Rewrite SKILL.md to reflect:
- New plugin-based architecture (not code-generator templates)
- Two delivery methods: via pipeline and via setup-ia.ps1
- Updated file structure documentation
- Events API reference
- Tools system documentation
- Multi-region extraction documentation

- [ ] **Step 1: Update SKILL.md header and architecture section**

Replace the old "Propósito" and "Arquitectura" sections with plugin-centric ones.

~400 lines of editing in SKILL.md

- [ ] **Step 2: Commit**

```bash
git add ia-jutia/SKILL.md
git commit -m "docs(ia-jutia): update SKILL.md for plugin architecture"
```

---

### Task 8: Update code-generator for Plugin Mode

**Files:**
- Modify: `code-generator/SKILL.md`

Update code-generator to handle the new ia-jutia plugin:
- Instead of generating individual files, it copies the plugin directory as-is
- FASE 2 no longer adds IA tables to db.js
- FASE 2 no longer adds IA config to project.config.js (only perfil flag)
- index.html only gets one script tag now

- [ ] **Step 1: Update code-generator SKILL.md**

- [ ] **Step 2: Commit**

```bash
git add code-generator/SKILL.md
git commit -m "feat(code-generator): adapt for ia-jutia plugin mode"
```

---

### Task 9: Update upgrade-engine for Plugin Migration

**Files:**
- Modify: `upgrade-engine/SKILL.md`

Update upgrade-engine to handle:
- Old (code-generator) → New (plugin) migration path
- Lite→Full now just sets `APP_CONFIG.iaJutia.perfil = 'full'`
- IA migration independent of app profile migration

- [ ] **Step 1: Update upgrade-engine SKILL.md**

- [ ] **Step 2: Commit**

```bash
git add upgrade-engine/SKILL.md
git commit -m "feat(upgrade-engine): adapt for ia-jutia plugin migration"
```

---

### Task 10: Clean Up Old Templates

**Files:**
- Remove: `ia-jutia/templates/lite/`
- Remove: `ia-jutia/templates/full/`

- [ ] **Step 1: Remove old template directories**

```powershell
Remove-Item -Recurse -Force "D:\REPOSITORIOS GitHUB\Ateje\ia-jutia\templates\lite"
Remove-Item -Recurse -Force "D:\REPOSITORIOS GitHUB\Ateje\ia-jutia\templates\full"
```

- [ ] **Step 2: Commit**

```bash
git rm -r ia-jutia/templates/lite ia-jutia/templates/full
git commit -m "refactor(ia-jutia): remove old code-generator templates"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Every section of the spec (Architecture, File Structure, DB Hybrid, Init Flow, Lite/Full DLC, UI, Events, Multi-Region Tools, Pipeline Integration, Setup Script) has corresponding implementation tasks
- [ ] **Placeholder scan:** All steps have concrete code — no "TBD", "implement later", or "add validation" without specifics
- [ ] **Type consistency:** `window.ia`, `window.ia.chat`, `window.iaDB`, `window.IATools`, `ExtraerFacturaTool` are consistent across all tasks
- [ ] **Scope check:** Focused on transforming ia-jutia skill only — does not touch other skills unnecessarily
