// modules/ia-jutia/module.js — IA Jutia Plugin Entry Point v2.0-plugin
// Depende: Alpine.js, Dexie, FlexSearch (carga lazy)
// Uso: <script src='modules/ia-jutia/module.js'></script> (DESPUES de core/app.js)

;(function () {
  'use strict';

  var MODULE_ID = 'ia-jutia';
  var MODULE_TITLE = 'IA Jutia';
  var MODULE_ICON = 'bi bi-robot';

  // Lista de tools a cargar (ordenados: registry primero)
  var TOOL_FILES = [
    'tools/_registry.js',
    'tools/extraer-factura.js'
  ];

  // ─── 1. Loaders ───────────────────────────────────────────────────────

  function loadScript (src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('No se pudo cargar: ' + src)); };
      document.head.appendChild(s);
    });
  }

  function loadFlexSearch () {
    if (window.FlexSearch) return Promise.resolve(window.FlexSearch);
    return new Promise(function (resolve, reject) {
      var local = 'modules/ia-jutia/assets/flexsearch.min.js';
      var script = document.createElement('script');
      script.src = local;
      script.onload = function () {
        if (window.FlexSearch) { resolve(window.FlexSearch); return; }
        reject(new Error('FlexSearch local no disponible'));
      };
      script.onerror = function () {
        reject(new Error('FlexSearch no pudo cargarse desde ruta local'));
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
        currentChatId: null,
        nuevoTitulo: '',
        modeloPath: '',
        mostrarFooter: true,

        toggleChat: function () { Alpine.store('ia').chatOpen = !Alpine.store('ia').chatOpen; },

        cambiarVista: function (vista) {
          Alpine.store('ia').drawerView = vista;
        },

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
          window.ia.chat.ask(store.currentChatId, text).then(function (result) {
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

        refreshThreads: async function () {
          if (!window.ia || !window.ia.chat) return;
          var store = Alpine.store('ia');
          store.threads = await window.ia.chat.list();
        },

        crearThread: async function () {
          if (!window.ia || !window.ia.chat) return;
          var store = Alpine.store('ia');
          var titulo = store.nuevoTitulo.trim() || 'Nueva conversacion';
          var chat = await window.ia.chat.create(titulo);
          if (chat) {
            store.nuevoTitulo = '';
            store.currentChatId = chat.id;
            store.mensajes = [];
            await store.refreshThreads();
            store.drawerView = 'chat';
          }
        },

        cargarThread: async function (chatId) {
          if (!window.ia || !window.ia.chat) return;
          var store = Alpine.store('ia');
          var data = await window.ia.chat.load(chatId);
          if (data) {
            store.currentChatId = chatId;
            store.mensajes = data.messages || [];
            store.drawerView = 'chat';
          }
        },

        eliminarThread: async function (chatId) {
          if (!window.ia || !window.ia.chat) return;
          var store = Alpine.store('ia');
          await window.ia.chat.delete(chatId);
          if (store.currentChatId === chatId) {
            store.currentChatId = null;
            store.mensajes = [];
          }
          await store.refreshThreads();
        },

        cargarFull: function () {
          var store = Alpine.store('ia');
          store.isLoading = true;
          // Load Full files dynamically
          var self = this;
          function loadNext(files, idx) {
            if (idx >= files.length) {
              // All loaded, init Full
              if (window.iaFull && typeof window.iaFull.initFull === 'function') {
                window.iaFull.initFull().then(function () {
                  store.perfilReal = 'full';
                  store.modeloListo = true;
                  store.isLoading = false;
                }).catch(function (err) {
                  console.warn('[ia-jutia] Error initFull:', err.message);
                  store.isLoading = false;
                });
              } else {
                store.isLoading = false;
              }
              return;
            }
            var s = document.createElement('script');
            s.src = 'modules/ia-jutia/' + files[idx];
            s.onload = function () { loadNext(files, idx + 1); };
            s.onerror = function () {
              console.warn('[ia-jutia] Error cargando ' + files[idx]);
              loadNext(files, idx + 1); // continue despite error
            };
            document.head.appendChild(s);
          }
          loadNext(['ia-full.js', 'ia-sqlite.js', 'ia-worker.js'], 0);
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

  var TAB_CHAT = 'chat';
  var TAB_THREADS = 'threads';
  var TAB_SETTINGS = 'settings';

  var DRAWER_HTML = [
    '<div class="fixed inset-y-0 right-0 z-[60] w-96 max-w-[calc(100vw-1rem)] bg-base-100 shadow-2xl border-l border-base-300 flex flex-col" style="min-height: 100dvh;">',
    '  <!-- Header -->',
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
    '  <!-- Tabs de navegacion dentro del Drawer -->',
    '  <div class="flex border-b border-base-200" role="tablist">',
    '    <button class="flex-1 py-2 text-xs font-medium text-center transition-colors",
    '            :class="$store.ia.drawerView === \'' + TAB_CHAT + '\' ? \'text-primary border-b-2 border-primary\' : \'text-base-content/50 hover:text-base-content\'"',
    '            @click="$store.ia.cambiarVista(\'' + TAB_CHAT + '\')">',
    '      <i class="bi bi-chat-dots block text-sm mb-0.5"></i> Chat',
    '    </button>',
    '    <button class="flex-1 py-2 text-xs font-medium text-center transition-colors",
    '            :class="$store.ia.drawerView === \'' + TAB_THREADS + '\' ? \'text-primary border-b-2 border-primary\' : \'text-base-content/50 hover:text-base-content\'"',
    '            @click="$store.ia.cambiarVista(\'' + TAB_THREADS + '\'); $store.ia.refreshThreads()">',
    '      <i class="bi bi-list-ul block text-sm mb-0.5"></i> Hilos',
    '    </button>',
    '    <button class="flex-1 py-2 text-xs font-medium text-center transition-colors",
    '            :class="$store.ia.drawerView === \'' + TAB_SETTINGS + '\' ? \'text-primary border-b-2 border-primary\' : \'text-base-content/50 hover:text-base-content\'"',
    '            @click="$store.ia.cambiarVista(\'' + TAB_SETTINGS + '\')">',
    '      <i class="bi bi-gear block text-sm mb-0.5"></i> Ajustes',
    '    </button>',
    '  </div>',
    '',
    '  <!-- ====== VIEW: Chat ====== -->',
    '  <div class="flex-1 flex flex-col min-h-0" x-show="$store.ia.drawerView === \'' + TAB_CHAT + '\'">',
    '    <div class="flex-1 overflow-y-auto p-4 space-y-2">',
    '      <template x-if="$store.ia.mensajes.length === 0">',
    '        <div class="flex flex-col items-center justify-center h-full text-center text-base-content/40">',
    '          <i class="bi bi-chat-dots text-5xl mb-3"></i>',
    '          <p class="text-sm font-medium">Pregunta sobre tus datos</p>',
    '          <p class="text-xs mt-1">Ej: &quot;Cuantos registros hay?&quot;</p>',
    '        </div>',
    '      </template>',
    '      <template x-for="msg in $store.ia.mensajes" :key="msg.id">',
    '        <div>',
    '          <div class="chat chat-end" x-show="msg.rol === \'user\'">',
    '            <div class="chat-bubble chat-bubble-primary text-sm" x-text="msg.contenido"></div>',
    '          </div>',
    '          <div class="chat chat-start" x-show="msg.rol === \'ia\'">',
    '            <div class="chat-bubble chat-bubble-info text-sm">',
    '              <p class="whitespace-pre-wrap" x-text="msg.contenido"></p>',
    '              <template x-if="msg.fuente">',
    '                <p class="text-xs text-base-content/50 mt-1 border-t border-base-content/20 pt-1">',
    '                  <i class="bi bi-link-45deg"></i> <span x-text="msg.fuente"></span>',
    '                </p>',
    '              </template>',
    '            </div>',
    '          </div>',
    '        </div>',
    '      </template>',
    '      <template x-if="$store.ia.isLoading">',
    '        <div class="chat chat-start">',
    '          <div class="chat-bubble chat-bubble-ghost">',
    '            <span class="loading loading-dots loading-sm"></span>',
    '          </div>',
    '        </div>',
    '      </template>',
    '    </div>',
    '    <!-- Input -->',
    '    <div class="p-4 border-t border-base-200" x-show="$store.ia.mostrarFooter">',
    '      <form @submit.prevent="$store.ia.enviarMensaje()" class="flex gap-2">',
    '        <input type="text" x-model="$store.ia.inputText"',
    '               placeholder="Escribe tu pregunta..."',
    '               class="input input-bordered flex-1 input-sm"',
    '               :disabled="$store.ia.isLoading" />',
    '        <button type="submit" class="btn btn-primary btn-sm"',
    '                :disabled="!$store.ia.inputText || $store.ia.isLoading">',
    '          <i class="bi bi-send"></i>',
    '        </button>',
    '      </form>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- ====== VIEW: Threads ====== -->',
    '  <div class="flex-1 overflow-y-auto p-4" x-show="$store.ia.drawerView === \'' + TAB_THREADS + '\'" x-cloak>',
    '    <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">',
    '      <i class="bi bi-list-ul text-primary"></i> Tus conversaciones',
    '    </h4>',
    '    <!-- Crear nuevo -->',
    '    <form @submit.prevent="$store.ia.crearThread()" class="flex gap-2 mb-4">',
    '      <input type="text" x-model="$store.ia.nuevoTitulo"',
    '             placeholder="Titulo del nuevo hilo..."',
    '             class="input input-bordered input-xs flex-1" />',
    '      <button type="submit" class="btn btn-primary btn-xs">',
    '        <i class="bi bi-plus-lg"></i> Crear',
    '      </button>',
    '    </form>',
    '    <!-- Lista de hilos -->',
    '    <template x-if="$store.ia.threads.length === 0">',
    '      <p class="text-xs text-base-content/40 text-center py-8">',
    '        <i class="bi bi-inbox block text-2xl mb-2"></i>',
    '        Aun no hay conversaciones',
    '      </p>',
    '    </template>',
    '    <template x-for="t in $store.ia.threads" :key="t.id">',
    '      <div class="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 cursor-pointer transition-colors mb-1"',
    '           @click="$store.ia.cargarThread(t.id)">',
    '        <div class="min-w-0 flex-1">',
    '          <p class="text-sm font-medium truncate" x-text="t.titulo"></p>',
    '          <p class="text-[10px] text-base-content/40"',
    '             x-text="new Date(t.updatedAt).toLocaleDateString(\'es\', { day: \'numeric\', month: \'short\', hour: \'2-digit\', minute: \'2-digit\' })"></p>',
    '        </div>',
    '        <div class="flex items-center gap-1">',
    '          <span class="badge badge-ghost badge-xs" x-text="t.messageCount || 0"></span>',
    '          <button class="btn btn-ghost btn-xs btn-square text-error/60 hover:text-error"',
    '                  @click.stop="$store.ia.eliminarThread(t.id)"',
    '                  title="Eliminar">',
    '            <i class="bi bi-trash3"></i>',
    '          </button>',
    '        </div>',
    '      </div>',
    '    </template>',
    '  </div>',
    '',
    '  <!-- ====== VIEW: Settings ====== -->',
    '  <div class="flex-1 overflow-y-auto p-4" x-show="$store.ia.drawerView === \'' + TAB_SETTINGS + '\'" x-cloak>',
    '    <!-- Perfil info -->',
    '    <div class="card bg-base-200 rounded-box p-3 mb-3">',
    '      <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">Perfil</p>',
    '      <div class="flex items-center justify-between">',
    '        <span class="text-sm">Version activa</span>',
    '        <span class="badge badge-sm" :class="$store.ia.perfilReal === \'full\' ? \'badge-success\' : \'badge-ghost\'"',
    '              x-text="$store.ia.perfilReal.toUpperCase()"></span>',
    '      </div>',
    '      <div class="flex items-center justify-between mt-2">',
    '        <span class="text-sm">Modelos</span>',
    '        <span class="text-xs text-base-content/40" x-text="$store.ia.modeloListo ? \'Cargados\' : \'No instalados\'"></span>',
    '      </div>',
    '      <template x-if="$store.ia.perfilReal !== \'full\'">',
    '        <button class="btn btn-outline btn-xs w-full mt-3" @click="$store.ia.cargarFull()">',
    '          <i class="bi bi-cloud-download"></i> Activar IA Full',
    '        </button>',
    '      </template>',
    '    </div>',
    '',
    '    <!-- Ruta de modelos Full -->',
    '    <div class="card bg-base-200 rounded-box p-3 mb-3">',
    '      <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">Ruta de modelos</p>',
    '      <p class="text-[10px] text-base-content/40 mb-2">Directorio donde se almacenan los modelos Full (233MB)</p>',
    '      <div class="flex gap-2">',
    '        <input type="text" x-model="$store.ia.modeloPath"',
    '               placeholder="ej: D:\\modelos\\IA-Jutia"',
    '               class="input input-bordered input-xs flex-1 font-mono text-[10px]" />',
    '      </div>',
    '      <p class="text-[10px] text-base-content/30 mt-1">Ruta compartida entre apps del mismo equipo</p>',
    '    </div>',
    '',
    '    <!-- Herramientas -->',
    '    <div class="card bg-base-200 rounded-box p-3 mb-3">',
    '      <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">Herramientas IA</p>',
    '      <template x-if="$store.ia.tools.length === 0">',
    '        <p class="text-[10px] text-base-content/40">No hay herramientas instaladas</p>',
    '      </template>',
    '      <template x-for="tool in $store.ia.tools" :key="tool.nombre">',
    '        <div class="flex items-center justify-between py-1">',
    '          <span class="text-xs" x-text="tool.nombre"></span>',
    '          <span class="text-[10px] text-base-content/40" x-text="tool.estado"></span>',
    '        </div>',
    '      </template>',
    '    </div>',
    '',
    '    <!-- Documentos -->',
    '    <div class="card bg-base-200 rounded-box p-3 mb-3">',
    '      <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">Documentos indexados</p>',
    '      <template x-if="$store.ia.documentos.length === 0">',
    '        <p class="text-[10px] text-base-content/40">Sin documentos</p>',
    '      </template>',
    '      <template x-for="doc in $store.ia.documentos" :key="doc.id">',
    '        <div class="flex items-center justify-between py-1">',
    '          <span class="text-xs truncate" x-text="doc.nombre"></span>',
    '          <span class="text-[10px] text-base-content/40" x-text="doc.tipo"></span>',
    '        </div>',
    '      </template>',
    '    </div>',
    '',
    '    <!-- Acerca de -->',
    '    <div class="card bg-base-200 rounded-box p-3">',
    '      <p class="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2">Acerca de</p>',
    '      <p class="text-[10px] text-base-content/40">IA Jutia Plugin v2.0</p>',
    '      <p class="text-[10px] text-base-content/40">Motor FlexSearch + patrones offline</p>',
    '    </div>',
    '  </div>',
    '',
    '  <!-- Footer minimo (visible en todas las vistas) -->',
    '  <div class="p-2 border-t border-base-200 text-center">',
    '    <p class="text-[10px] text-base-content/30">',
    '      <i class="bi bi-robot me-1"></i> IA Jutia v2.0 &mdash; respuestas offline',
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
      // Cargar ia-core.js y ia-chat.js dinamicamente
      try {
        await loadScript('modules/ia-jutia/ia-core.js');
        console.log('[ia-jutia] ia-core.js cargado');
      } catch (e) {
        console.warn('[ia-jutia] Error cargando ia-core.js:', e.message);
      }
      try {
        await loadScript('modules/ia-jutia/ia-chat.js');
        console.log('[ia-jutia] ia-chat.js cargado');
      } catch (e) {
        console.warn('[ia-jutia] Error cargando ia-chat.js:', e.message);
      }
      // Cargar tools (en orden)
      for (var ti = 0; ti < TOOL_FILES.length; ti++) {
        try {
          await loadScript('modules/ia-jutia/' + TOOL_FILES[ti]);
          console.log('[ia-jutia] Tool cargado: ' + TOOL_FILES[ti]);
        } catch (e) {
          console.warn('[ia-jutia] Error cargando tool ' + TOOL_FILES[ti] + ':', e.message);
        }
      }
      // Inicializar IA core + chat
      if (window.ia && typeof window.ia.init === 'function') {
        window.ia.init();
        if (typeof window.ia.chat !== 'undefined' && typeof window.ia.chat.init === 'function') {
          window.ia.chat.init();
        }
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
