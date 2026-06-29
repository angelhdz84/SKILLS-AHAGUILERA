// modules/ia-jutia/module.js — IA Jutia (Lite)
// Busqueda inteligente + estadisticas + predicciones
// Depende de: core/ia.js (window.ia)

const ModuloIA = {
  id: 'ia-jutia',
  titulo: 'IA / Busqueda Inteligente',
  icono: 'bi bi-robot',

  async init() {
    console.log('🧠 [ia-jutia] Modulo IA Lite listo');
    if (window.ia && !window.ia._flex) {
      window.ia.initLite();
    }
  },

  async render(params = {}) {
    const q = params.query || '';
    return `
    <div x-data="iaData()" x-init="init('${q}')" class="animate__animated animate__fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <i class="bi bi-robot text-primary"></i> IA / Busqueda Inteligente
        </h2>
        <span class="badge badge-outline badge-sm">Lite</span>
      </div>

      <!-- Buscador -->
      <div class="card bg-base-100 shadow-xl p-4 mb-6">
        <label class="input input-bordered flex items-center gap-2">
          <i class="bi bi-search text-base-content/40"></i>
          <input type="text" x-model="query" @input.debounce="buscar()"
                 placeholder="Buscar en todos los datos... (Cmd+K)"
                 class="grow bg-transparent border-0 outline-none" />
          <kbd class="kbd kbd-sm text-base-content/40 hidden sm:inline">Ctrl+K</kbd>
        </label>
      </div>

      <!-- Resultados de busqueda agrupados -->
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

      <!-- Panel de Analisis -->
      <template x-if="!query">
        <div>
          <!-- Stats Rapid Overview -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <template x-for="s in statsOverview" :key="s.tabla">
              <div class="stat bg-base-100 shadow-sm rounded-box p-3">
                <div class="stat-title text-xs"><i :class="s.icono" class="mr-1"></i><span x-text="s.tabla"></span></div>
                <div class="stat-value text-xl" x-text="s.registros"></div>
                <div class="stat-desc text-xs">registros</div>
              </div>
            </template>
          </div>

          <!-- Predictor -->
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
                <option value="">Campo...</option>
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
                  <span class="text-xs text-base-content/60">R² = <span x-text="prediccion.r2"></span></span>
                </div>
                <p class="text-xs font-mono text-base-content/40 mb-2" x-text="prediccion.formula"></p>
                <div class="grid grid-cols-3 gap-2">
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

          <!-- Ayuda rapida -->
          <div class="card bg-base-100 shadow-xl p-4">
            <h3 class="font-semibold flex items-center gap-2 mb-2">
              <i class="bi bi-info-circle text-info"></i> Comandos rapidos
            </h3>
            <div class="text-sm space-y-1 text-base-content/60">
              <p><kbd class="kbd kbd-xs">Ctrl+K</kbd> Abrir busqueda global</p>
              <p><kbd class="kbd kbd-xs">/ia stats [tabla]</kbd> Estadisticas de una tabla</p>
              <p><kbd class="kbd kbd-xs">/ia predict [tabla] [campo]</kbd> Predecir tendencia</p>
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
    query: '',
    resultados: [],
    searching: false,
    statsOverview: [],
    tablasDisponibles: [],
    predTabla: '',
    predCampo: '',
    prediccion: null,
    groupedResults: {},

    async init(q) {
      this.query = q || '';
      if (window.ia) {
        this.tablasDisponibles = window.ia._tables || [];
        const stats = await window.ia.statsAll();
        this.statsOverview = stats.map(s => ({
          ...s,
          icono: 'bi bi-table'
        }));
      }
      if (this.query) await this.buscar();
    },

    async buscar() {
      if (!this.query || !window.ia) return;
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
    }
  }));
});
