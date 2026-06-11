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

      <!-- Resultados de busqueda -->
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
          <div class="space-y-2">
            <template x-for="r in resultados" :key="r.id">
              <div class="card bg-base-200 p-3 cursor-pointer hover:bg-base-300 transition-colors">
                <div class="flex items-start gap-3">
                  <i class="bi bi-file-text mt-1 text-primary"></i>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate" x-text="r.nombre || r.tabla"></p>
                    <p class="text-sm text-base-content/60 truncate" x-text="r.descripcion || r.texto?.slice(0, 120)"></p>
                    <span class="badge badge-ghost badge-xs mt-1" x-text="r.tabla"></span>
                  </div>
                </div>
              </div>
            </template>
          </div>
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
      this.searching = false;
    },

    async predecir() {
      if (!window.ia || !this.predTabla || !this.predCampo) return;
      this.prediccion = await window.ia.predict(this.predTabla, this.predCampo, 5);
    },

    formatoMoneda(v) {
      if (v == null) return '';
      return '$' + Number(v).toLocaleString('es', { minimumFractionDigits: 2 });
    }
  }));
});
