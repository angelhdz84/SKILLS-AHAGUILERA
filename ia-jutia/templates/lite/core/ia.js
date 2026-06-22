// core/ia.js — IA Jutia Lite: FlexSearch + Estadísticas + Predicciones
// Dependencias: FlexSearch (window.FlexSearch), Dexie (window.db)
// Expone: window.ia

;(function() {
  'use strict';

  const IA = {
    version: '1.0-lite',
    _flex: null,
    _tables: [],
    _paletteOpen: false,

    // ── Init ──────────────────────────────────────────────
    initLite() {
      if (typeof FlexSearch === 'undefined') {
        console.warn('⚠️ ia-jutia: FlexSearch no disponible. Busqueda desactivada.');
        return;
      }
      this._flex = new FlexSearch.Document({
        document: {
          id: 'id',
          index: ['nombre', 'descripcion', 'notas', 'texto'],
          store: ['nombre', 'tipo', 'tabla']
        },
        tokenize: 'forward',
        cache: true
      });
      this._registerDefaultTables();
      this._initPalette();
      console.log('🧠 ia-jutia Lite iniciado');

      if (typeof Alpine !== 'undefined') {
        Alpine.store('ia', {
          query: '',
          results: [],
          searching: false,
          paletteOpen: false
        });
      }
    },

    _registerDefaultTables() {
      if (!window.db) return;
      const tables = [];
      for (const key of Object.keys(window.db)) {
        if (key.startsWith('_')) continue;
        if (typeof window.db[key]?.toArray === 'function') {
          tables.push(key);
        }
      }
      tables.forEach(t => this.registerTable(t));
      this._tables = tables;
    },

    async registerTable(nombre, campos) {
      if (!this._flex) return;
      if (!window.db || !window.db[nombre]) return;

      const total = await window.db[nombre].count();
      const BATCH = 200;
      for (let offset = 0; offset < total; offset += BATCH) {
        const rows = await window.db[nombre].offset(offset).limit(BATCH).toArray();
        const docs = rows.map(r => ({
          id: `${nombre}-${r.id || r._id}`,
          nombre: r.nombre || r.titulo || r.name || '',
          descripcion: r.descripcion || r.desc || '',
          notas: r.notas || r.observaciones || '',
          texto: JSON.stringify(r).slice(0, 500),
          tipo: r.tipo || nombre,
          tabla: nombre
        }));
        docs.forEach(d => this._flex.add(d));
      }
    },

    indexRecord(tabla, record) {
      if (!this._flex || !record) return;
      const doc = {
        id: `${tabla}-${record.id || record._id}`,
        nombre: record.nombre || record.titulo || record.name || '',
        descripcion: record.descripcion || record.desc || '',
        notas: record.notas || record.observaciones || '',
        texto: JSON.stringify(record).slice(0, 500),
        tipo: record.tipo || tabla,
        tabla: tabla
      };
      this._flex.add(doc);
    },

    removeRecord(tabla, id) {
      if (!this._flex || !id) return;
      this._flex.remove(`${tabla}-${id}`);
    },

    // ── Búsqueda ──────────────────────────────────────────
    search(query, opts = {}) {
      if (!this._flex || !query) return Promise.resolve([]);
      if (typeof Alpine !== 'undefined') {
        Alpine.store('ia').searching = true;
      }

      return new Promise(resolve => {
        const results = this._flex.search(query, {
          limit: opts.limit || 20,
          enrich: true,
          suggest: true
        });

        const flat = [];
        for (const res of results) {
          for (const item of res.result || []) {
            if (item.doc) flat.push(item.doc);
          }
        }

        if (typeof Alpine !== 'undefined') {
          Alpine.store('ia').results = flat;
          Alpine.store('ia').searching = false;
        }
        resolve(flat);
      });
    },

    // ── Estadísticas ──────────────────────────────────────
    stats(tabla, campo) {
      if (!window.db || !window.db[tabla]) return null;
      return window.db[tabla].toArray().then(rows => {
        const valores = rows
          .map(r => parseFloat(r[campo]))
          .filter(v => !isNaN(v));

        if (valores.length === 0) return null;

        const sum = valores.reduce((a, b) => a + b, 0);
        const media = sum / valores.length;
        const sorted = [...valores].sort((a, b) => a - b);
        const mediana = sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
        const moda = this._calcularModa(valores);
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        const varianza = valores.reduce((acc, v) => acc + (v - media) ** 2, 0) / valores.length;
        const stddev = Math.sqrt(varianza);

        return {
          tabla, campo, count: valores.length,
          media: +media.toFixed(2),
          mediana: +mediana.toFixed(2),
          moda: +moda.toFixed(2),
          min: +min.toFixed(2),
          max: +max.toFixed(2),
          stddev: +stddev.toFixed(2),
          suma: +sum.toFixed(2)
        };
      });
    },

    async statsAll() {
      if (!window.db) return [];
      const tablas = this._tables.length ? this._tables : Object.keys(window.db).filter(k => !k.startsWith('_'));
      const results = await Promise.all(tablas.map(async t => {
        const registros = await window.db[t].count();
        const sample = registros > 0 ? await window.db[t].limit(1).toArray() : [];
        return { tabla: t, registros, campos: sample.length ? Object.keys(sample[0]).length : 0 };
      }));
      return results;
    },

    _calcularModa(valores) {
      const freq = {};
      let maxFreq = 0, moda = valores[0];
      valores.forEach(v => {
        freq[v] = (freq[v] || 0) + 1;
        if (freq[v] > maxFreq) { maxFreq = freq[v]; moda = v; }
      });
      return maxFreq > 1 ? moda : valores[0];
    },

    // ── Predicciones (JS puro, sin ML) ────────────────────
    predict(tabla, campo, periodos = 3) {
      if (!window.db || !window.db[tabla]) return Promise.resolve(null);
      return window.db[tabla].toArray().then(rows => {
        const valores = rows
          .map(r => ({ x: r.id || r._id, y: parseFloat(r[campo]) }))
          .filter(v => !isNaN(v.y));

        if (valores.length < 2) return null;

        const ys = valores.map(v => v.y);
        const xs = valores.map((_, i) => i);

        return this.forecast(ys, periodos);
      });
    },

    forecast(valores, n = 3) {
      if (valores.length < 2) return null;
      const xs = valores.map((_, i) => i);
      const nVal = valores.length;

      const sumX = xs.reduce((a, b) => a + b, 0);
      const sumY = valores.reduce((a, b) => a + b, 0);
      const sumXY = xs.reduce((acc, x, i) => acc + x * valores[i], 0);
      const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

      const pendiente = (nVal * sumXY - sumX * sumY) / (nVal * sumX2 - sumX * sumX);
      const intercepto = (sumY - pendiente * sumX) / nVal;

      const proyectados = [];
      for (let i = 1; i <= n; i++) {
        const x = nVal + i - 1;
        proyectados.push({ periodo: i, valor: +(pendiente * x + intercepto).toFixed(2) });
      }

      const mediaY = sumY / nVal;
      const ssTotal = valores.reduce((acc, y) => acc + (y - mediaY) ** 2, 0);
      const ssRes = valores.reduce((acc, y, i) => acc + (y - (pendiente * i + intercepto)) ** 2, 0);
      const r2 = ssTotal ? +(1 - ssRes / ssTotal).toFixed(4) : 0;

      return {
        tendencia: pendiente >= 0 ? 'creciente' : 'decreciente',
        pendiente: +pendiente.toFixed(4),
        intercepto: +intercepto.toFixed(2),
        r2,
        historico: valores,
        proyectados,
        formula: `y = ${pendiente.toFixed(2)}x + ${intercepto.toFixed(2)}`
      };
    },

    movingAverage(valores, ventana = 3) {
      if (valores.length < ventana) return [...valores];
      const resultado = [];
      for (let i = 0; i <= valores.length - ventana; i++) {
        const avg = valores.slice(i, i + ventana).reduce((a, b) => a + b, 0) / ventana;
        resultado.push(+avg.toFixed(2));
      }
      return resultado;
    },

    // ── Utilidades ────────────────────────────────────────
    async exportResumen(tabla) {
      if (!window.db || !window.db[tabla]) return '';
      const registros = await window.db[tabla].count();
      let txt = `=== Resumen: ${tabla} ===\n`;
      txt += `Registros: ${registros}\n`;
      txt += `Ultima actualizacion: ${new Date().toLocaleDateString('es')}\n`;
      txt += `---\n`;
      if (registros > 0) {
        const sample = await window.db[tabla].limit(1).toArray();
        const keys = Object.keys(sample[0]).slice(0, 5);
        txt += `Campos: ${keys.join(', ')}\n`;
      }
      return txt;
    },

    // ── Command Palette ───────────────────────────────────
    _initPalette() {
      if (typeof Alpine === 'undefined') return;
      const self = this;
      document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
          const store = Alpine.store('ia');
          if (store) store.paletteOpen = !store.paletteOpen;
        }
      });
    }
  };

  window.ia = IA;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IA.initLite());
  } else {
    IA.initLite();
  }
})();
