// modules/ia-jutia/ia-core.js — IA Jutia Core Plugin v1.0
// Dependencias: FlexSearch (window.FlexSearch, cargado por module.js)
// Expone: window.ia
// module.js llama a window.ia.init() despues de cargar FlexSearch

;(function() {
  'use strict';

  var IA = {
    version: '1.0-plugin',
    _flex: null,

    init: function() {
      if (typeof FlexSearch === 'undefined') {
        console.warn('[ia-core] FlexSearch no disponible');
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
      // Registrar tablas existentes (no _) en la DB principal
      this._registerDefaultTables();
      console.log('[ia-core] IA Jutia Core listo');
    },

    _registerDefaultTables: function() {
      if (!window.db) return;
      for (var key in window.db) {
        if (key.startsWith('_')) continue;
        if (typeof window.db[key].toArray === 'function') {
          this.registerTable(key);
        }
      }
    },

    registerTable: async function(nombre, campos) {
      if (!this._flex) return;
      var db = window.db || window.iaDB;
      if (!db) return;
      var tabla = db[nombre];
      if (!tabla || typeof tabla.count !== 'function') return;

      var total = await tabla.count();
      var BATCH = 200;
      for (var offset = 0; offset < total; offset += BATCH) {
        var rows = await tabla.offset(offset).limit(BATCH).toArray();
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var doc = {
            id: nombre + '-' + (r.id || r._id),
            nombre: r.nombre || r.titulo || r.name || '',
            descripcion: r.descripcion || r.desc || '',
            notas: r.notas || r.observaciones || '',
            texto: JSON.stringify(r).slice(0, 500),
            tipo: r.tipo || nombre,
            tabla: nombre
          };
          this._flex.add(doc);
        }
      }
    },

    indexRecord: function(tabla, record) {
      if (!this._flex || !record) return;
      var doc = {
        id: tabla + '-' + (record.id || record._id),
        nombre: record.nombre || record.titulo || record.name || '',
        descripcion: record.descripcion || record.desc || '',
        notas: record.notas || record.observaciones || '',
        texto: JSON.stringify(record).slice(0, 500),
        tipo: record.tipo || tabla,
        tabla: tabla
      };
      this._flex.add(doc);
    },

    removeRecord: function(tabla, id) {
      if (!this._flex || !id) return;
      this._flex.remove(tabla + '-' + id);
    },

    search: function(query, opts) {
      opts = opts || {};
      if (!this._flex || !query) return Promise.resolve([]);

      var store = null;
      if (typeof Alpine !== 'undefined') {
        store = Alpine.store('ia');
        if (store) store.searching = true;
      }

      var self = this;
      return new Promise(function(resolve) {
        var results = self._flex.search(query, {
          limit: opts.limit || 20,
          enrich: true
        });

        var flat = [];
        for (var ri = 0; ri < results.length; ri++) {
          for (var ii = 0; ii < (results[ri].result || []).length; ii++) {
            if (results[ri].result[ii].doc) {
              flat.push(results[ri].result[ii].doc);
            }
          }
        }

        if (store) {
          store.results = flat;
          store.searching = false;
        }
        resolve(flat);
      });
    },

    stats: function(tabla, campo) {
      var db = window.db || window.iaDB;
      if (!db || !db[tabla]) return Promise.resolve(null);
      var self = this;
      return db[tabla].toArray().then(function(rows) {
        return self._computeStats(rows, tabla, campo);
      });
    },

    _computeStats: function(rows, tabla, campo) {
      var valores = [];
      for (var i = 0; i < rows.length; i++) {
        var v = parseFloat(rows[i][campo]);
        if (!isNaN(v)) valores.push(v);
      }
      if (valores.length === 0) return null;

      var sum = valores.reduce(function(a, b) { return a + b; }, 0);
      var media = sum / valores.length;
      var sorted = valores.slice().sort(function(a, b) { return a - b; });
      var mediana = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      var moda = this._calcularModa(valores);
      var varianza = valores.reduce(function(acc, v) { return acc + (v - media) * (v - media); }, 0) / valores.length;

      return {
        tabla: tabla, campo: campo, count: valores.length,
        media: +(media.toFixed(2)),
        mediana: +(mediana.toFixed(2)),
        moda: +(moda.toFixed(2)),
        min: +(sorted[0].toFixed(2)),
        max: +(sorted[sorted.length - 1].toFixed(2)),
        stddev: +(Math.sqrt(varianza).toFixed(2)),
        suma: +(sum.toFixed(2))
      };
    },

    _calcularModa: function(valores) {
      var freq = {};
      var maxFreq = 0, moda = valores[0];
      for (var i = 0; i < valores.length; i++) {
        var v = valores[i];
        freq[v] = (freq[v] || 0) + 1;
        if (freq[v] > maxFreq) { maxFreq = freq[v]; moda = v; }
      }
      return maxFreq > 1 ? moda : valores[0];
    },

    statsAll: function() {
      var db = window.db || window.iaDB;
      if (!db) return Promise.resolve([]);
      var tablas = Object.keys(db).filter(function(k) {
        return !k.startsWith('_') && typeof db[k].count === 'function';
      });
      return Promise.all(tablas.map(function(t) {
        return db[t].count().then(function(count) {
          return { tabla: t, registros: count };
        });
      }));
    },

    predict: function(tabla, campo, periodos) {
      periodos = periodos || 3;
      var db = window.db || window.iaDB;
      if (!db || !db[tabla]) return Promise.resolve(null);
      return db[tabla].toArray().then(function(rows) {
        var valores = rows
          .map(function(r) { return { x: r.id || r._id, y: parseFloat(r[campo]) }; })
          .filter(function(v) { return !isNaN(v.y); });
        if (valores.length < 2) return null;
        var ys = valores.map(function(v) { return v.y; });
        return this.forecast(ys, periodos);
      }.bind(this));
    },

    forecast: function(valores, n) {
      n = n || 3;
      if (valores.length < 2) return null;
      var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
      for (var i = 0; i < valores.length; i++) {
        sumX += i;
        sumY += valores[i];
        sumXY += i * valores[i];
        sumX2 += i * i;
      }
      var nVal = valores.length;
      var pendiente = (nVal * sumXY - sumX * sumY) / (nVal * sumX2 - sumX * sumX);
      var intercepto = (sumY - pendiente * sumX) / nVal;

      var proyectados = [];
      for (var j = 1; j <= n; j++) {
        var x = nVal + j - 1;
        proyectados.push({ periodo: j, valor: +(pendiente * x + intercepto).toFixed(2) });
      }

      var mediaY = sumY / nVal;
      var ssTotal = valores.reduce(function(acc, y) { return acc + (y - mediaY) * (y - mediaY); }, 0);
      var ssRes = 0;
      for (var k = 0; k < valores.length; k++) {
        var diff = valores[k] - (pendiente * k + intercepto);
        ssRes += diff * diff;
      }
      var r2 = ssTotal ? +(1 - ssRes / ssTotal).toFixed(4) : 0;

      return {
        tendencia: pendiente >= 0 ? 'creciente' : 'decreciente',
        pendiente: +pendiente.toFixed(4),
        intercepto: +intercepto.toFixed(2),
        r2: r2,
        historico: valores,
        proyectados: proyectados,
        formula: 'y = ' + pendiente.toFixed(2) + 'x + ' + intercepto.toFixed(2)
      };
    },

    movingAverage: function(valores, ventana) {
      ventana = ventana || 3;
      if (valores.length < ventana) return valores.slice();
      var resultado = [];
      for (var i = 0; i <= valores.length - ventana; i++) {
        var sum = 0;
        for (var j = i; j < i + ventana; j++) {
          sum += valores[j];
        }
        resultado.push(+(sum / ventana).toFixed(2));
      }
      return resultado;
    },

    exportResumen: async function(tabla) {
      var db = window.db || window.iaDB;
      if (!db || !db[tabla]) return '';
      var registros = await db[tabla].count();
      var txt = '=== Resumen: ' + tabla + ' ===\n';
      txt += 'Registros: ' + registros + '\n';
      txt += 'Ultima actualizacion: ' + new Date().toLocaleDateString('es') + '\n';
      txt += '---\n';
      if (registros > 0) {
        var sample = await db[tabla].limit(1).toArray();
        var keys = Object.keys(sample[0]).slice(0, 5);
        txt += 'Campos: ' + keys.join(', ') + '\n';
      }
      return txt;
    }
  };

  window.ia = IA;
})();
