// modules/ia-jutia/module.js — IA Jutia (Lite) v0.3
// Busqueda inteligente + Chat conversacional + estadisticas + predicciones
// Depende de: core/ia.js (window.ia), core/ia-chat.js (window.ia.chat)

const TABS = [
  { id: 'buscar', icono: 'bi-search', label: 'Buscar' },
  { id: 'chat', icono: 'bi-chat-dots', label: 'Chat' },
  { id: 'stats', icono: 'bi-bar-chart', label: 'Stats' },
  { id: 'pred', icono: 'bi-graph-up-arrow', label: 'Pred' }
];

const ModuloIA = {
  id: 'ia-jutia',
  titulo: 'IA / Busqueda Inteligente',
  icono: 'bi bi-robot',

  async init() {
    console.log('🧠 [ia-jutia] Modulo IA Lite + Chat v0.3 listo');
    if (window.ia && !window.ia._flex) {
      window.ia.initLite();
    }
  },

  async render(params = {}) {
    const q = params.query || '';
    const tab = params.tab || 'buscar';
    return `
    <style>
      .ia-highlight {
        background-color: hsl(var(--p) / 0.2);
        padding: 0 2px;
        border-radius: 2px;
        font-weight: 600;
      }
    </style>
    <div x-data="iaData()" x-init="init('${q}', '${tab}')" class="animate__animated animate__fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <i class="bi bi-robot text-primary"></i> IA / Busqueda Inteligente
        </h2>
        <span class="badge badge-outline badge-sm">Lite</span>
      </div>

      <!-- Tabs -->
      <div class="tabs tabs-bordered mb-6" role="tablist">
        <template x-for="t in tabs" :key="t.id">
          <button class="tab tab-lg gap-2" :class="{ 'tab-active': tab === t.id }"
                  @click="setTab(t.id)" role="tab">
            <i :class="'bi ' + t.icono"></i>
            <span class="hidden sm:inline" x-text="t.label"></span>
          </button>
        </template>
      </div>

      <!-- ===== TAB: BUSCAR ===== -->
      <template x-if="tab === 'buscar'">
        <div>
          <div class="card bg-base-100 shadow-xl p-4 mb-6">
            <div class="relative" x-data="{ focused: false }">
              <label class="input input-bordered flex items-center gap-2">
                <i class="bi bi-search text-base-content/40"></i>
                <input type="text" x-model="query" @input.debounce.200ms="getAutocomplete(query)"
                       @focus="focused = true; if(query.length >= 2) getAutocomplete(query)"
                       @blur="setTimeout(() => { autocompleteVisible = false; focused = false }, 200)"
                       @keydown="if (['ArrowDown','ArrowUp','Enter','Escape'].includes($event.key)) { _handleAutocompleteKeydown($event); }"
                       @keydown.enter.prevent="if (autocompleteIndex < 0) { _saveQuery(query); buscar(); }"
                       placeholder="Buscar en todos los datos..."
                       class="grow bg-transparent border-0 outline-none" />
                <kbd class="kbd kbd-sm text-base-content/40 hidden sm:inline">Ctrl+K</kbd>
              </label>
              <div x-show="autocompleteVisible && focused" x-cloak
                   class="absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-xl z-50 overflow-hidden">
                <template x-for="(item, idx) in autocompleteResults" :key="idx">
                  <div class="px-3 py-2 flex items-center gap-2 cursor-pointer text-sm transition-colors"
                       :class="idx === autocompleteIndex ? 'bg-primary/10 text-primary' : 'hover:bg-base-200'"
                       @mousedown.prevent="selectAutocomplete(item.text)"
                       @mouseenter="autocompleteIndex = idx">
                    <i class="bi text-base-content/40" :class="'bi-' + (item.icon || 'search')"></i>
                    <span x-text="item.text"></span>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <template x-if="query.length > 0">
            <div class="mb-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-base-content/60">
                  <template x-if="searching">Buscando...</template>
                  <template x-if="!searching"><span x-text="resultados.length + ' resultados'"></span></template>
                </span>
              </div>
              <template x-if="!searching && resultados.length === 0">
                <div class="text-center py-8 text-base-content/40">
                  <i class="bi bi-inbox text-4xl"></i>
                  <p class="mt-2">Sin resultados para "<span x-text="query"></span>"</p>
                </div>
              </template>
              <template x-if="!searching && resultados.length > 0">
                <div class="space-y-4">
                  <template x-for="(group, table) in groupedResults" :key="table">
                    <div>
                      <div class="flex items-center gap-2 mb-2">
                        <span class="text-xs font-semibold uppercase tracking-wider text-base-content/60" x-text="table"></span>
                        <span class="badge badge-sm badge-ghost" x-text="group.count"></span>
                      </div>
                      <div class="space-y-1">
                        <template x-for="item in group.items" :key="item.id">
                          <div class="p-3 bg-base-200 rounded-lg hover:bg-base-300 cursor-pointer transition-colors"
                               @click="selectItem(item)">
                            <div class="font-medium text-sm" x-html="item._highlighted || highlightText(item.nombre || item.descripcion, query)"></div>
                            <div class="text-xs text-base-content/50 mt-0.5" x-text="item.descripcion || item.tipo || ''"></div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </div>
          </template>

          <template x-if="!query">
            <div class="text-center py-16 text-base-content/30">
              <i class="bi bi-search text-5xl"></i>
              <p class="text-sm mt-3">Escribe arriba para buscar en todos los datos</p>
              <p class="text-xs mt-1">Ej: nombre, descripcion, palabras clave...</p>
            </div>
          </template>
        </div>
      </template>

      <!-- ===== TAB: CHAT ===== -->
      <template x-if="tab === 'chat'">
        <div class="card bg-base-100 shadow-xl p-4 flex flex-col" style="min-height: 460px;">
          <div class="drawer lg:drawer-open flex-1 min-h-0">
            <input id="chat-drawer" type="checkbox" class="drawer-toggle" x-model="chatSidebarOpen" />
            <div class="drawer-content flex flex-col min-h-0">
              <div class="flex items-center gap-2 pb-3 border-b border-base-300 mb-3">
                <label for="chat-drawer" class="btn btn-ghost btn-sm btn-square lg:hidden">
                  <i class="bi bi-list"></i>
                </label>
                <template x-if="currentChat">
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm truncate" x-text="currentChat.titulo"></div>
                    <div class="text-xs text-base-content/50" x-text="currentChat.messageCount + ' mensajes'"></div>
                  </div>
                </template>
                <template x-if="!currentChat">
                  <div class="flex-1 font-semibold text-sm">Chat con tus datos</div>
                </template>
                <button class="btn btn-ghost btn-sm btn-square" @click="showNewChatModal = true" title="Nueva conversacion">
                  <i class="bi bi-plus-lg"></i>
                </button>
              </div>
              <div class="flex-1 overflow-y-auto mb-3 space-y-3 min-h-[220px]" x-ref="chatBox">
                <template x-if="messages.length === 0">
                  <div class="text-center py-12 text-base-content/30">
                    <i class="bi bi-chat-dots text-4xl"></i>
                    <p class="text-sm mt-2">Haz una pregunta sobre tus datos</p>
                    <p class="text-xs mt-1">Ej: "¿Cuantos clientes hay?" o "Stock menor a 10"</p>
                  </div>
                </template>
                <template x-for="msg in messages" :key="msg.id">
                  <div>
                    <div class="chat chat-end" x-show="msg.rol === 'user'">
                      <div class="chat-bubble chat-bubble-primary text-sm" x-text="msg.contenido"></div>
                    </div>
                    <div class="chat chat-start" x-show="msg.rol === 'ia'">
                      <div class="chat-bubble chat-bubble-info text-sm">
                        <p class="whitespace-pre-wrap" x-text="msg.contenido"></p>
                        <template x-if="msg.fuente">
                          <p class="text-xs text-base-content/50 mt-1 border-t border-base-content/20 pt-1">
                            <i class="bi bi-link-45deg"></i> Fuente: <span x-text="msg.fuente"></span>
                          </p>
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
                <template x-if="chatting">
                  <div class="chat chat-start">
                    <div class="chat-bubble chat-bubble-ghost">
                      <span class="loading loading-dots loading-sm"></span>
                    </div>
                  </div>
                </template>
              </div>
              <div class="border-t border-base-300 pt-3">
                <form @submit.prevent="preguntar()" class="flex gap-2">
                  <input type="text" x-model="pregunta" placeholder="Pregunta sobre tus datos..."
                         class="input input-bordered flex-1 input-sm" :disabled="chatting" />
                  <button type="submit" class="btn btn-primary btn-sm" :disabled="!pregunta || chatting">
                    <i class="bi bi-send"></i>
                  </button>
                </form>
              </div>
            </div>
            <div class="drawer-side z-30">
              <label for="chat-drawer" class="drawer-overlay"></label>
              <div class="bg-base-200 min-h-full w-72 p-3 flex flex-col">
                <div class="mb-3">
                  <div class="relative">
                    <input type="text" x-model="historyQuery" @input.debounce.300ms="searchHistory()"
                           placeholder="Buscar en historial..."
                           class="input input-bordered input-xs w-full pl-7" />
                    <i class="bi bi-search absolute left-2 top-1/2 -translate-y-1/2 text-xs text-base-content/40"></i>
                  </div>
                  <template x-if="historyResults.length > 0">
                    <div class="mt-1 space-y-1 max-h-32 overflow-y-auto">
                      <template x-for="r in historyResults" :key="r.id">
                        <div class="px-2 py-1 rounded cursor-pointer text-xs hover:bg-base-300 transition-colors truncate"
                             @click="selectHistoryResult(r)">
                          <span class="text-base-content/60" x-text="r.contenido.slice(0, 60)"></span>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold text-sm">Conversaciones</h3>
                  <button class="btn btn-ghost btn-xs" @click="showNewChatModal = true">
                    <i class="bi bi-plus-lg"></i> Nueva
                  </button>
                </div>
                <div class="space-y-1 flex-1 overflow-y-auto">
                  <template x-for="chat in chats" :key="chat.id">
                    <div class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm group"
                         :class="currentChat?.id === chat.id ? 'bg-primary/10 text-primary' : 'hover:bg-base-300'"
                         @click="selectChat(chat.id)">
                      <i class="bi bi-chat-text text-base-content/40"></i>
                      <div class="flex-1 truncate" x-text="chat.titulo"></div>
                      <span class="text-xs text-base-content/30" x-text="chat.messageCount"></span>
                      <button class="btn btn-ghost btn-xs btn-square opacity-0 group-hover:opacity-100 transition-opacity"
                              @click.stop="deleteChat(chat.id)" title="Eliminar conversacion">
                        <i class="bi bi-trash3"></i>
                      </button>
                    </div>
                  </template>
                  <template x-if="chats.length === 0">
                    <p class="text-xs text-base-content/40 text-center py-6">No hay conversaciones</p>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- New chat modal -->
      <dialog class="modal" :class="{ 'modal-open': showNewChatModal }">
        <div class="modal-box">
          <h3 class="font-semibold mb-4">Nueva conversacion</h3>
          <input type="text" class="input input-bordered w-full"
                 placeholder="Titulo de la conversacion..." x-model="newChatTitle"
                 @keydown.enter.prevent="createChat()">
          <div class="modal-action">
            <button class="btn btn-ghost btn-sm" @click="showNewChatModal = false">Cancelar</button>
            <button class="btn btn-primary btn-sm" @click="createChat()">Crear</button>
          </div>
        </div>
        <div class="modal-backdrop" @click="showNewChatModal = false"></div>
      </dialog>

      <!-- ===== TAB: STATS ===== -->
      <template x-if="tab === 'stats'">
        <div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <template x-for="s in statsOverview" :key="s.tabla">
              <div class="stat bg-base-100 shadow-sm rounded-box p-3">
                <div class="stat-title text-xs"><i class="bi bi-table mr-1"></i><span x-text="s.tabla"></span></div>
                <div class="stat-value text-xl" x-text="s.registros"></div>
                <div class="stat-desc text-xs">registros</div>
              </div>
            </template>
          </div>
          <div class="card bg-base-100 shadow-xl p-4 mb-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold">Estadisticas</h3>
              <button class="btn btn-ghost btn-xs gap-1" @click="exportPDF()" x-show="Object.keys(estadisticas || {}).length > 0">
                <i class="bi bi-filetype-pdf"></i> Exportar PDF
              </button>
            </div>
            <template x-if="Object.keys(estadisticas || {}).length > 0">
              <div class="overflow-x-auto">
                <template x-for="(stats, tableName) in estadisticas" :key="tableName">
                  <div class="mb-4">
                    <h4 class="text-sm font-semibold mb-2" x-text="tableName"></h4>
                    <table class="table table-sm table-zebra">
                      <thead><tr><th>Metrica</th><th>Valor</th></tr></thead>
                      <tbody>
                        <tr><td>Registros</td><td x-text="stats.count"></td></tr>
                        <tr><td>Promedio</td><td x-text="stats.mean"></td></tr>
                        <tr><td>Mediana</td><td x-text="stats.median"></td></tr>
                        <tr><td>Minimo</td><td x-text="stats.min"></td></tr>
                        <tr><td>Maximo</td><td x-text="stats.max"></td></tr>
                        <tr x-show="stats.stddev != null"><td>Desviacion Std</td><td x-text="stats.stddev"></td></tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </div>
            </template>
            <template x-if="Object.keys(estadisticas || {}).length === 0">
              <p class="text-sm text-base-content/40">No hay datos estadisticos disponibles.</p>
            </template>
          </div>
        </div>
      </template>

      <!-- ===== TAB: PRED ===== -->
      <template x-if="tab === 'pred'">
        <div>
          <div class="card bg-base-100 shadow-xl p-4 mb-6">
            <h3 class="font-semibold flex items-center gap-2 mb-4">
              <i class="bi bi-graph-up-arrow text-accent"></i> Predicciones
            </h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <select x-model="predTabla" class="select select-bordered select-sm flex-1 min-w-[120px]">
                <option value="">Seleccionar tabla...</option>
                <template x-for="t in tablasDisponibles" :key="t">
                  <option :value="t" x-text="t"></option>
                </template>
              </select>
              <select x-model="predCampo" class="select select-bordered select-sm flex-1 min-w-[120px]">
                <option value="">Campo numerico...</option>
              </select>
              <button class="btn btn-accent btn-sm" @click="predecir()" :disabled="!predTabla || !predCampo">
                <i class="bi bi-lightning-charge"></i> Predecir
              </button>
            </div>
            <template x-if="prediccion">
              <div class="bg-base-200 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="badge" :class="prediccion.tendencia === 'creciente' ? 'badge-success' : 'badge-error'">
                    <i :class="prediccion.tendencia === 'creciente' ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                    <span x-text="prediccion.tendencia"></span>
                  </span>
                  <span class="text-xs text-base-content/60">R<sup>2</sup> = <span x-text="prediccion.r2"></span></span>
                </div>
                <p class="text-xs font-mono text-base-content/40 mb-2" x-text="prediccion.formula"></p>
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <template x-for="p in prediccion.proyectados" :key="p.periodo">
                    <div class="text-center p-2 bg-base-100 rounded-lg">
                      <div class="text-xs text-base-content/60">Periodo <span x-text="p.periodo"></span></div>
                      <div class="font-bold text-accent" x-text="formatoMoneda(p.valor)"></div>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div class="card bg-base-100 shadow-xl p-4">
            <h3 class="font-semibold flex items-center gap-2 mb-2">
              <i class="bi bi-info-circle text-info"></i> Comandos rapidos
            </h3>
            <div class="text-sm space-y-1 text-base-content/60">
              <p><kbd class="kbd kbd-xs">Ctrl+K</kbd> Abrir busqueda global</p>
              <p><kbd class="kbd kbd-xs">/ia stats [tabla]</kbd> Estadisticas de una tabla</p>
              <p><kbd class="kbd kbd-xs">/ia predict [tabla] [campo]</kbd> Predecir tendencia</p>
              <p><kbd class="kbd kbd-xs">/ia chat</kbd> Abrir chat conversacional</p>
            </div>
          </div>
        </div>
      </template>
    </div>
    `;
  },

  destroy() {
    console.log('🧠 [ia-jutia] Destruido');
  }
};

window.MODULES = window.MODULES || {};
window.MODULES['ia-jutia'] = ModuloIA;

// Alpine Store
document.addEventListener('alpine:init', () => {
  Alpine.data('iaData', () => ({
    tab: 'buscar',
    tabs: TABS,
    // Buscar
    query: '',
    resultados: [],
    searching: false,
    statsOverview: [],
    tablasDisponibles: [],
    predTabla: '',
    predCampo: '',
    prediccion: null,
    estadisticas: {},
    groupedResults: {},
    autocompleteResults: [],
    autocompleteIndex: -1,
    autocompleteVisible: false,
    _autocompleteCache: [],
    // Chat v0.3
    chats: [],
    currentChat: null,
    messages: [],
    chatting: false,
    pregunta: '',
    chatSidebarOpen: true,
    showNewChatModal: false,
    newChatTitle: '',
    historyQuery: '',
    historyResults: [],

    async init(q, tab) {
      this.tab = tab || 'buscar';
      this.query = q || '';
      if (window.ia) {
        this.tablasDisponibles = window.ia._tables || [];
        const stats = await window.ia.statsAll();
        this.statsOverview = stats.map(s => ({
          ...s,
          icono: 'bi bi-table'
        }));
        this._loadDetailedStats(stats);
        await this.loadChats();
      }
      if (this.query) await this.buscar();
    },

    setTab(id) {
      this.tab = id;
    },

    async buscar() {
      if (!this.query || !window.ia) return;
      this._saveQuery(this.query);
      this.searching = true;
      this.resultados = await window.ia.search(this.query);
      const wrapped = [{
        field: 'all',
        result: this.resultados.map(r => ({ id: r.id, doc: r }))
      }];
      this.groupedResults = this.groupResults(wrapped, this.query);
      this.searching = false;
    },

    async predecir() {
      if (!window.ia || !this.predTabla || !this.predCampo) return;
      this.prediccion = await window.ia.predict(this.predTabla, this.predCampo, 5);
    },

    formatoMoneda(v) {
      if (v == null) return '';
      return '$' + Number(v).toLocaleString('es', { minimumFractionDigits: 2 });
    },

    // v0.2 — Highlight + grouped results
    highlightText(text, query) {
      if (!query || !text) return text || '';
      const q = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const words = q.split(/\s+/).filter(Boolean);
      let result = text;
      words.forEach(word => {
        if (word.length < 2) return;
        const re = new RegExp('(' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        result = result.replace(re, '<mark class="ia-highlight">$1</mark>');
      });
      return result;
    },

    groupResults(results, query) {
      if (!results || !Array.isArray(results)) return {};
      const grouped = {};
      results.forEach(item => {
        const field = item.field || 'general';
        const items = item.result || [];
        items.forEach(r => {
          const table = r.doc?.tabla || r.doc?.tipo || field;
          if (!grouped[table]) {
            grouped[table] = { count: 0, items: [] };
          }
          grouped[table].items.push({
            ...r.doc,
            _highlighted: this.highlightText(r.doc?.nombre || r.doc?.descripcion || '', query)
          });
          grouped[table].count++;
        });
      });
      return grouped;
    },

    selectItem(item) {
      if (window.appRouter && item.id && item.tabla) {
        window.appRouter.go(item.tabla, { id: item.id });
      }
    },

    // v0.2 — Autocomplete methods
    _loadAutocompleteCache: function() {
      try {
        const saved = localStorage.getItem('ia_jutia_autocomplete');
        this._autocompleteCache = saved ? JSON.parse(saved) : [];
      } catch(e) {
        this._autocompleteCache = [];
      }
    },

    _saveQuery: function(query) {
      if (!query || query.length < 2) return;
      this._loadAutocompleteCache();
      const idx = this._autocompleteCache.indexOf(query);
      if (idx > -1) this._autocompleteCache.splice(idx, 1);
      this._autocompleteCache.unshift(query);
      if (this._autocompleteCache.length > 20) this._autocompleteCache = this._autocompleteCache.slice(0, 20);
      try {
        localStorage.setItem('ia_jutia_autocomplete', JSON.stringify(this._autocompleteCache));
      } catch(e) { /* quota exceeded - ignore */ }
    },

    getAutocomplete: function(query) {
      if (!query || query.length < 2) {
        this.autocompleteVisible = false;
        this.autocompleteResults = [];
        return;
      }
      const q = query.toLowerCase();
      const suggestions = [];
      this._loadAutocompleteCache();
      this._autocompleteCache.forEach(saved => {
        if (saved.toLowerCase().startsWith(q) && saved !== query) {
          suggestions.push({ text: saved, type: 'history', icon: 'clock-history' });
        }
      });
      try {
        if (window.ia && window.ia._workerReady) {
          window.ia._worker.postMessage({
            type: 'suggest',
            payload: { query: q, limit: 5 },
            id: 'autocomplete_' + Date.now()
          });
        }
      } catch(e) { /* worker not available */ }
      const seen = new Set();
      const unique = suggestions.filter(s => {
        const key = s.text.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 8);
      this.autocompleteResults = unique;
      this.autocompleteVisible = unique.length > 0;
    },

    selectAutocomplete: function(text) {
      this.query = text;
      this.autocompleteVisible = false;
      this.buscar();
    },

    _handleAutocompleteKeydown: function(e) {
      if (!this.autocompleteVisible) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.autocompleteIndex = Math.min(this.autocompleteIndex + 1, this.autocompleteResults.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.autocompleteIndex = Math.max(this.autocompleteIndex - 1, -1);
      } else if (e.key === 'Enter' && this.autocompleteIndex >= 0) {
        e.preventDefault();
        this.selectAutocomplete(this.autocompleteResults[this.autocompleteIndex].text);
      } else if (e.key === 'Escape') {
        this.autocompleteVisible = false;
        this.autocompleteIndex = -1;
      }
    },

    // v0.2 — L3 Export stats PDF
    _loadDetailedStats: async function(overview) {
      if (!window.ia || !window.db) return;
      const result = {};
      for (const s of overview) {
        const tabla = s.tabla;
        if (!tabla) continue;
        try {
          const sample = await window.db[tabla].limit(1).toArray();
          if (!sample.length) continue;
          const numericField = Object.keys(sample[0]).find(k =>
            typeof sample[0][k] === 'number' && k !== 'id' && k !== '_id'
          );
          if (!numericField) continue;
          const stats = await window.ia.stats(tabla, numericField);
          if (stats) {
            result[tabla] = {
              count: stats.count,
              mean: stats.media,
              median: stats.mediana,
              mode: stats.moda,
              min: stats.min,
              max: stats.max,
              stddev: stats.stddev
            };
          }
        } catch(e) {
          // skip table on error
        }
      }
      this.estadisticas = result;
    },

    // v0.2 — L3 Export stats PDF
    exportPDF: function() {
      const tables = this.estadisticas || {};
      const partes = [];

      partes.push('<html><head><meta charset="utf-8">');
      partes.push('<title>Reporte de Estadisticas</title>');
      partes.push('<style>');
      partes.push(`
        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1a1a2e; }
        h1 { font-size: 24px; margin-bottom: 4px; }
        .subtitle { color: #666; font-size: 14px; margin-bottom: 32px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
        th { background: #f0f0f5; text-align: left; padding: 8px 12px; font-weight: 600; border-bottom: 2px solid #ddd; }
        td { padding: 6px 12px; border-bottom: 1px solid #eee; }
        tr:nth-child(even) td { background: #fafafa; }
        .section-title { font-size: 16px; font-weight: 600; margin: 24px 0 12px; color: #333; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 11px; color: #999; text-align: center; }
        @media print {
          body { padding: 20px; }
          .no-print { display: none; }
        }
      `);
      partes.push('</style></head><body>');

      const appName = window.APP_CONFIG?.nombre || 'App';
      const date = new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
      partes.push('<h1>' + this._escapeHtml(appName) + '</h1>');
      partes.push('<div class="subtitle">Reporte generado: ' + date + '</div>');

      if (Object.keys(tables).length > 0) {
        for (const [tableName, tStats] of Object.entries(tables)) {
          if (!tStats) continue;
          partes.push('<div class="section-title">' + this._escapeHtml(tableName) + '</div>');
          partes.push('<table><thead><tr><th>Metrica</th><th>Valor</th></tr></thead><tbody>');
          const rows = [
            ['Registros', tStats.count],
            ['Promedio', tStats.mean],
            ['Mediana', tStats.median],
            ['Moda', tStats.mode],
            ['Minimo', tStats.min],
            ['Maximo', tStats.max],
            ['Desviacion Std', tStats.stddev]
          ];
          rows.forEach(([label, val]) => {
            if (val !== undefined && val !== null) {
              partes.push('<tr><td>' + this._escapeHtml(label) + '</td><td>' + this._escapeHtml(String(val)) + '</td></tr>');
            }
          });
          partes.push('</tbody></table>');
        }
      } else {
        partes.push('<p>No hay datos estadisticos disponibles.</p>');
      }

      partes.push('<div class="footer">IA Jutia - ' + appName + ' | ' + date + '</div>');
      partes.push('</body></html>');

      const win = window.open('', '_blank');
      if (win) {
        win.document.write(partes.join(''));
        win.document.close();
        setTimeout(function() {
          win.focus();
          win.print();
          setTimeout(function() { win.close(); }, 500);
        }, 300);
      }
    },

    _escapeHtml: function(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    // — Chat v0.3: Gestion de hilos —
    async loadChats() {
      if (window.ia && window.ia.chat && window.ia.chat.list) {
        this.chats = await window.ia.chat.list();
      }
    },

    async selectChat(chatId) {
      if (!window.ia || !window.ia.chat || !window.ia.chat.load) return;
      const data = await window.ia.chat.load(chatId);
      this.currentChat = data.chat;
      this.messages = data.messages;
      if (window.innerWidth < 1024) this.chatSidebarOpen = false;
    },

    async createChat() {
      const title = this.newChatTitle.trim() || 'Nueva conversacion';
      if (window.ia && window.ia.chat && window.ia.chat.create) {
        const chat = await window.ia.chat.create(title);
        this.currentChat = chat;
        this.messages = [];
        this.showNewChatModal = false;
        this.newChatTitle = '';
        await this.loadChats();
      }
    },

    async deleteChat(chatId) {
      if (!window.ia || !window.ia.chat || !window.ia.chat.delete) return;
      await window.ia.chat.delete(chatId);
      if (this.currentChat && this.currentChat.id === chatId) {
        this.currentChat = null;
        this.messages = [];
      }
      await this.loadChats();
    },

    async saveMessage(rol, content, fuente, score) {
      if (!this.currentChat || !window.ia || !window.ia.chat || !window.ia.chat.addMessage) return;
      const msg = await window.ia.chat.addMessage(
        this.currentChat.id, rol, content, fuente, score
      );
      this.messages.push(msg);
      return msg;
    },

    // — Chat v0.3: Preguntar —
    async preguntar() {
      const q = this.pregunta;
      if (!q || !window.ia || !window.ia.chat || !window.ia.chat.ask) return;

      // Auto-crear chat si no hay seleccionado
      if (!this.currentChat) {
        const chat = await window.ia.chat.create(q.slice(0, 50));
        this.currentChat = chat;
        await this.loadChats();
      }

      await this.saveMessage('user', q);
      this.pregunta = '';
      this.chatting = true;

      const result = await window.ia.chat.ask(this.currentChat.id, q);

      await this.saveMessage('ia', result.respuesta, result.fuente, result.score || null);
      this.chatting = false;

      this.$nextTick(() => {
        if (this.$refs.chatBox) {
          this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        }
      });
    },

    // — Chat v0.3: Busqueda en historial (Nivel 2) —
    async searchHistory() {
      const q = this.historyQuery;
      if (!q || !window.ia || !window.ia.chat || !window.ia.chat.searchHistory) {
        this.historyResults = [];
        return;
      }
      this.historyResults = await window.ia.chat.searchHistory(q, 10);
    },

    selectHistoryResult(msg) {
      if (msg.chatId) {
        this.selectChat(msg.chatId);
        this.historyQuery = '';
        this.historyResults = [];
        this.setTab('chat');
      }
    }
  }));
});
