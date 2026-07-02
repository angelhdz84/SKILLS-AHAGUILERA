// modules/ia-jutia/module.js — IA Jutia Plugin Entry Point v1.0
// Depende: Alpine.js, Dexie, FlexSearch (carga lazy)
// Uso: <script src='modules/ia-jutia/module.js'></script> (DESPUES de core/app.js)

(function () {
  'use strict';

  var MODULE_ID = 'ia-jutia';
  var MODULE_TITLE = 'IA Jutia';
  var MODULE_ICON = 'bi bi-robot';

  // ─── 1. FlexSearch lazy loading ──────────────────────────────────────

  function loadFlexSearch () {
    if (window.FlexSearch) return Promise.resolve(window.FlexSearch);
    return new Promise(function (resolve, reject) {
      var local = 'modules/ia-jutia/assets/flexsearch.min.js';
      var fallback = 'https://cdn.jsdelivr.net/npm/flexsearch@0.7.31/dist/flexsearch.min.js';
      var script = document.createElement('script');
      script.src = local;
      script.onload = function () {
        if (window.FlexSearch) { resolve(window.FlexSearch); return; }
        // local failed, try CDN fallback
        var s2 = document.createElement('script');
        s2.src = fallback;
        s2.onload = function () { resolve(window.FlexSearch); };
        s2.onerror = function () { reject(new Error('FlexSearch no pudo cargarse')); };
        document.head.appendChild(s2);
      };
      script.onerror = function () {
        // local file not found, try CDN
        var s2 = document.createElement('script');
        s2.src = fallback;
        s2.onload = function () { resolve(window.FlexSearch); };
        s2.onerror = function () { reject(new Error('FlexSearch no pudo cargarse')); };
        document.head.appendChild(s2);
      };
      document.head.appendChild(script);
    });
  }

  // ─── 2. Hybrid DB init ───────────────────────────────────────────────

  function ensureDBTables () {
    if (window.db && window.db.tables) {
      var hasChats = window.db.tables.some(function (t) { return t.name === '_ia_chats'; });
      if (!hasChats) {
        var curVer = window.db.verno || 1;
        window.db.version(curVer + 1).stores({
          _ia_chats: 'id, titulo, createdAt, updatedAt, messageCount',
          _ia_messages: 'id, chatId, rol, contenido, fuente, score, createdAt'
        });
        console.log('[ia-jutia] Tablas _ia_chats + _ia_messages agregadas a db principal');
      }
    }

    // iaDB secundario si no existe
    if (!window.iaDB) {
      try {
        window.iaDB = new Dexie('AHA_Jutia');
        window.iaDB.version(1).stores({
          _ia_docs: 'id, nombre, tipo, createdBy, createdAt, updatedAt',
          _ia_chunks: 'id, docId, texto, createdAt',
          _ia_index: '&consulta',
          modelos_cache: '&ruta',
          _ia_sqlite: 'id'
        });
        console.log('[ia-jutia] iaDB (AHA_Jutia) inicializada');
      } catch (e) {
        console.warn('[ia-jutia] No se pudo crear iaDB:', e.message);
      }
    }
  }

  // ─── 3. Alpine store ─────────────────────────────────────────────────

  function registerAlpineStore () {
    if (!window.Alpine) {
      console.warn('[ia-jutia] Alpine no disponible, store IA no registrado');
      return;
    }
    try {
      if (Alpine.store('ia')) {
        console.log('[ia-jutia] Alpine.store(ia) ya registrado, omitiendo');
        return;
      }
      Alpine.store('ia', {
        chatOpen: false,
        drawerView: 'chat',
        perfil: (window.APP_CONFIG && window.APP_CONFIG.iaJutia && window.APP_CONFIG.iaJutia.perfil) || 'lite',
        perfilReal: 'lite',
        modeloListo: false,
        progresoModelo: 0,
        mensajes: [],
        documentos: [],
        threads: [],
        tools: [],
        inputText: '',
        isLoading: false,

        toggleChat: function () { Alpine.store('ia').chatOpen = !Alpine.store('ia').chatOpen; },

        enviarMensaje: function () {
          var store = Alpine.store('ia');
          var text = store.inputText;
          if (!text || !text.trim()) return;
          if (!window.ia || !window.ia.chat) {
            console.warn('[ia-jutia] chat no disponible');
            return;
          }
          store.isLoading = true;
          store.mensajes.push({ id: 'msg_' + Date.now(), rol: 'user', contenido: text, createdAt: new Date() });
          store.inputText = '';
          window.ia.chat.ask(null, text).then(function (result) {
            store.mensajes.push({
              id: 'msg_' + (Date.now() + 1),
              rol: 'ia',
              contenido: result.respuesta || 'Sin respuesta',
              fuente: result.fuente || null,
              score: result.score || null,
              createdAt: new Date()
            });
            store.isLoading = false;
          }).catch(function (err) {
            store.mensajes.push({ id: 'msg_err_' + Date.now(), rol: 'ia', contenido: 'Error: ' + err.message, createdAt: new Date() });
            store.isLoading = false;
          });
        },

        cargarFull: function () {
          if (window.ia && window.ia.initFull) {
            window.ia.initFull().then(function () {
              var store = Alpine.store('ia');
              store.modeloListo = true;
              store.perfilReal = 'full';
            });
          }
        }
      });
      console.log('[ia-jutia] Alpine.store(ia) registrado');
    } catch (e) {
      console.warn('[ia-jutia] Error registrando Alpine.store(ia):', e.message);
    }
  }

  // ─── 4. FAB + Drawer injection ───────────────────────────────────────

  function injectFabDrawer () {
    // Evitar duplicados
    if (document.getElementById('ia-jutia-fab')) return;

    var fab = document.createElement('button');
    fab.id = 'ia-jutia-fab';
    fab.className = 'btn btn-circle btn-primary fixed bottom-6 right-6 z-50 shadow-lg transition-all duration-300 hover:scale-110';
    fab.setAttribute('x-data', '');
    fab.setAttribute('x-show', '!$store.ia.chatOpen');
    fab.setAttribute('x-cloak', '');
    fab.setAttribute('@click', '$store.ia.chatOpen = true');
    fab.innerHTML = '<i class="bi bi-robot text-xl"></i>';
    document.body.appendChild(fab);

    var drawer = document.createElement('div');
    drawer.id = 'ia-jutia-drawer';
    drawer.setAttribute('x-data', '');
    drawer.setAttribute('x-show', '$store.ia.chatOpen');
    drawer.setAttribute('x-cloak', '');
    drawer.setAttribute('x-transition:enter', 'transition-all duration-300 ease-out');
    drawer.setAttribute('x-transition:enter-start', 'translate-x-full opacity-0');
    drawer.setAttribute('x-transition:enter-end', 'translate-x-0 opacity-100');
    drawer.setAttribute('x-transition:leave', 'transition-all duration-200 ease-in');
    drawer.setAttribute('x-transition:leave-start', 'translate-x-0 opacity-100');
    drawer.setAttribute('x-transition:leave-end', 'translate-x-full opacity-0');
    drawer.setAttribute('@keydown.window.escape.window', '$store.ia.chatOpen = false');
    drawer.innerHTML = DRAWER_HTML;
    document.body.appendChild(drawer);

    // Inicializar Alpine en los elementos inyectados
    if (window.Alpine && typeof Alpine.initTree === 'function') {
      Alpine.initTree(fab);
      Alpine.initTree(drawer);
    }
  }

  // ─── 5. DRAWER_HTML ──────────────────────────────────────────────────

  var DRAWER_HTML = [
    '<div class="fixed inset-y-0 right-0 z-[60] w-96 max-w-[calc(100vw-1rem)] bg-base-100 shadow-2xl border-l border-base-300 flex flex-col" style="min-height: 100dvh;">',
    '  <!-- Drawer header -->',
    '  <div class="flex items-center justify-between p-4 border-b border-base-200">',
    '    <h3 class="font-semibold flex items-center gap-2">',
    '      <i class="bi bi-robot text-primary"></i> IA Jutia',
    '    </h3>',
    '    <div class="flex items-center gap-1">',
    '      <span class="badge badge-sm badge-ghost" x-text="$store.ia.perfil.toUpperCase()"></span>',
    '      <button class="btn btn-ghost btn-sm btn-square" @click="$store.ia.chatOpen = false">',
    '        <i class="bi bi-x-lg"></i>',
    '      </button>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Drawer body -->',
    '  <div class="flex-1 overflow-y-auto p-4">',
    '    <template x-if="$store.ia.mensajes.length === 0">',
    '      <div class="flex flex-col items-center justify-center h-full text-center text-base-content/40">',
    '        <i class="bi bi-chat-dots text-5xl mb-3"></i>',
    '        <p class="text-sm font-medium">Pregunta sobre tus datos</p>',
    '        <p class="text-xs mt-1">Ej: &quot;Cuantos registros hay?&quot;</p>',
    '      </div>',
    '    </template>',
    '    <template x-for="msg in $store.ia.mensajes" :key="msg.id">',
    '      <div>',
    '        <div class="chat chat-end" x-show="msg.rol === \'user\'">',
    '          <div class="chat-bubble chat-bubble-primary text-sm" x-text="msg.contenido"></div>',
    '        </div>',
    '        <div class="chat chat-start" x-show="msg.rol === \'ia\'">',
    '          <div class="chat-bubble chat-bubble-info text-sm">',
    '            <p class="whitespace-pre-wrap" x-text="msg.contenido"></p>',
    '            <template x-if="msg.fuente">',
    '              <p class="text-xs text-base-content/50 mt-1 border-t border-base-content/20 pt-1">',
    '                <i class="bi bi-link-45deg"></i> <span x-text="msg.fuente"></span>',
    '              </p>',
    '            </template>',
    '          </div>',
    '        </div>',
    '      </div>',
    '    </template>',
    '    <template x-if="$store.ia.isLoading">',
    '      <div class="chat chat-start">',
    '        <div class="chat-bubble chat-bubble-ghost">',
    '          <span class="loading loading-dots loading-sm"></span>',
    '        </div>',
    '      </div>',
    '    </template>',
    '  </div>',
    '',
    '  <!-- Drawer footer (input) -->',
    '  <div class="p-4 border-t border-base-200">',
    '    <form @submit.prevent="$store.ia.enviarMensaje()" class="flex gap-2">',
    '      <input type="text" x-model="$store.ia.inputText"',
    '             placeholder="Escribe tu pregunta..."',
    '             class="input input-bordered flex-1 input-sm"',
    '             :disabled="$store.ia.isLoading" />',
    '      <button type="submit" class="btn btn-primary btn-sm"',
    '              :disabled="!$store.ia.inputText || $store.ia.isLoading">',
    '        <i class="bi bi-send"></i>',
    '      </button>',
    '    </form>',
    '    <p class="text-[10px] text-base-content/30 mt-1 text-center">',
    '      <i class="bi bi-robot me-1"></i> IA Jutia v1.0 &mdash; respuestas offline',
    '    </p>',
    '  </div>',
    '</div>'
  ].join('\n');

  // ─── 6. MODULE_HTML (placeholder) ────────────────────────────────────

  var MODULE_HTML = [
    '<div class="animate__animated animate__fadeIn">',
    '  <h2 class="text-2xl font-bold flex items-center gap-2 mb-4">',
    '    <i class="bi bi-robot text-primary"></i> IA Jutia',
    '  </h2>',
    '  <div class="card bg-base-100 shadow-xl p-6 text-center">',
    '    <i class="bi bi-robot text-6xl text-base-content/20 mb-3"></i>',
    '    <p class="text-base-content/60">Plugin IA Jutia activo</p>',
    '    <p class="text-sm text-base-content/40 mt-1">Usa el bot&oacute;n flotante para abrir el chat</p>',
    '  </div>',
    '</div>'
  ].join('\n');

  // ─── 7. MODULES registration ─────────────────────────────────────────

  var ModuloIA = {
    id: MODULE_ID,
    titulo: MODULE_TITLE,
    icono: MODULE_ICON,

    async init () {
      console.log('[ia-jutia] Plugin IA Jutia listo');
      // FlexSearch lazy load
      try {
        var FS = await loadFlexSearch();
        console.log('[ia-jutia] FlexSearch cargado:', FS ? 'ok' : 'no disponible');
      } catch (e) {
        console.warn('[ia-jutia] FlexSearch no disponible:', e.message);
      }
      // asegurar tablas DB
      ensureDBTables();
      // registrar store Alpine
      registerAlpineStore();
      // inyectar FAB + Drawer
      injectFabDrawer();
      // dispatchear ready
      var evt = new CustomEvent('jutia:ready', { detail: { id: MODULE_ID } });
      window.dispatchEvent(evt);
    },

    async render (params) {
      params = params || {};
      return MODULE_HTML;
    },

    destroy: function () {
      console.log('[ia-jutia] Plugin destruido');
    }
  };

  window.MODULES = window.MODULES || {};
  window.MODULES[MODULE_ID] = ModuloIA;

  // ─── 8. Events (jutia:trigger listener) ──────────────────────────────

  window.addEventListener('jutia:trigger', function (e) {
    console.log('[ia-jutia] trigger recibido', e.detail);
    if (window.Alpine) {
      try {
        Alpine.store('ia').chatOpen = true;
      } catch (err) {
        console.warn('[ia-jutia] No se pudo abrir drawer:', err.message);
      }
    }
  });

})();
