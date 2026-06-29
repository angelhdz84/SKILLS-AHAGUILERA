// core/ia.js — IA Jutia Full: FlexSearch + Estadisticas + Predicciones + Orquestacion
// Dependencias: FlexSearch, Dexie, Alpine
// Expone: window.ia (hereda Lite + añade metodos de orquestacion Full)

;(function() {
  'use strict';

  const IA = {
    version: '1.0-full',
    _flex: null,
    _tables: [],
    _paletteOpen: false,
    _qaPipeline: null,
    _embedPipeline: null,
    _modelosCargados: false,

    // ── Init ──────────────────────────────────────────────
    initLite() {
      if (typeof FlexSearch === 'undefined') {
        console.warn('⚠️ ia-jutia: FlexSearch no disponible.');
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

      if (typeof Alpine !== 'undefined') {
        Alpine.store('ia', {
          query: '',
          results: [],
          searching: false,
          paletteOpen: false,
          documentos: [],
          chatting: false,
          mensajes: [],
          uploadProgress: 0,
          uploading: false
        });
      }
      console.log('🧠 ia-jutia Full: nucleo Lite listo');
    },

    async initFull() {
      this.initLite();
      await Promise.all([
        this._loadModelos(),
        window.sqliteDB?.init?.()
      ]);
      await this._cargarDocumentosGuardados();
      console.log('🧠 ia-jutia Full: modelos + SQLite cargados');
    },

    async _loadModelos() {
      if (typeof pipeline === 'undefined') {
        console.warn('⚠️ ia-jutia: Transformers.js no disponible. QA desactivado.');
        return;
      }
      try {
        // WebGPU si disponible (WebView2 Edge Chromium 113+), fallback WASM automatico
        const device = (typeof navigator !== 'undefined' && navigator.gpu) ? 'webgpu' : 'wasm';
        this._embedPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
          local: true,
          dtype: 'q4',
          device,
          modelPath: 'assets/models/minilm-embeddings.onnx'
        });
        this._qaPipeline = await pipeline('question-answering', 'Xenova/bert-base-multilingual-uncased-squad', {
          local: true,
          dtype: 'q4',
          device,
          modelPath: 'assets/models/bert-qa.onnx'
        });
        this._modelosCargados = true;
        console.log('🧠 ia-jutia: Modelos Transformers.js cargados');
      } catch (err) {
        console.warn('⚠️ ia-jutia: Error cargando modelos:', err.message);
      }
    },

    async _cargarDocumentosGuardados() {
      if (!window.db || !window.db._ia_docs) return;
      try {
        const docs = await window.db._ia_docs.reverse().limit(100).toArray();
        if (typeof Alpine !== 'undefined') {
          Alpine.store('ia').documentos = docs.map(d => ({
            id: d.id, nombre: d.nombre, tipo: d.tipo,
            fecha: d.fecha, paginas: d.paginas, tamano: d.tamano,
            resumen: d.resumen
          }));
        }
      } catch (e) { /* silent */ }
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
          descripcion: r.descripcion || '',
          notas: r.notas || '',
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

    _registerDefaultTables() {
      if (!window.db) return;
      for (const key of Object.keys(window.db)) {
        if (key.startsWith('_')) continue;
        if (typeof window.db[key]?.toArray === 'function') {
          this.registerTable(key);
          this._tables.push(key);
        }
      }
    },

    // ── Busqueda (hereda Lite) ────────────────────────────
    search(query, opts = {}) {
      if (!this._flex || !query) return Promise.resolve([]);
      if (typeof Alpine !== 'undefined') {
        Alpine.store('ia').searching = true;
      }
      return new Promise(resolve => {
        const results = this._flex.search(query, { limit: opts.limit || 20, enrich: true, suggest: true });
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

    // v0.2 — Busqueda hibrida FlexSearch + Embeddings
    _getEmbedding: async function(text) {
      try {
        if (window.iaIngest && window.iaIngest._getEmbedding) {
          return await window.iaIngest._getEmbedding(text);
        }
        return null;
      } catch (e) {
        console.warn('[IA] Embedding error:', e);
        return null;
      }
    },

    _cosineSimilarity: function(vecA, vecB) {
      if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
      let dot = 0, normA = 0, normB = 0;
      for (let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
      }
      const denom = Math.sqrt(normA) * Math.sqrt(normB);
      return denom === 0 ? 0 : dot / denom;
    },

    searchHybrid: async function(query, opts = {}) {
      if (!query) return [];

      const limit = opts.limit || 50;
      const flexWeight = 0.6;
      const semanticWeight = 0.4;

      const flexResults = await this.search(query, { ...opts, limit: limit * 2 });
      if (!flexResults || flexResults.length === 0) return [];

      let enriched = false;
      const queryEmbedding = await this._getEmbedding(query);

      if (queryEmbedding) {
        try {
          const db = window.db;
          if (db && db._ia_chunks) {
            const docIds = flexResults.map(r => r.id).filter(Boolean);
            const chunks = await db._ia_chunks
              .where('docId')
              .anyOf(docIds)
              .toArray();

            if (chunks.length > 0) {
              const semanticScores = {};
              for (const chunk of chunks) {
                if (chunk.embedding) {
                  const score = this._cosineSimilarity(queryEmbedding, chunk.embedding);
                  semanticScores[chunk.docId] = Math.max(semanticScores[chunk.docId] || 0, score);
                }
              }

              const total = flexResults.length;
              flexResults.forEach((r, i) => {
                const flexScore = total > 0 ? 1 - (i / total) : 1;
                const semanticScore = semanticScores[r.id] || 0;
                r._combinedScore = flexScore * flexWeight + semanticScore * semanticWeight;
              });
              enriched = true;
            }
          }
        } catch (e) {
          console.warn('[IA] Semantic enrichment error:', e);
        }
      }

      if (enriched) {
        flexResults.sort((a, b) => (b._combinedScore || 0) - (a._combinedScore || 0));
      }

      if (flexResults.length > limit) flexResults.length = limit;

      if (typeof Alpine !== 'undefined') {
        Alpine.store('ia').results = flexResults;
      }

      return flexResults;
    },

    // ── Documentos (Full) ─────────────────────────────────
    async getDocumentos() {
      if (!window.db || !window.db._ia_docs) return [];
      return window.db._ia_docs.toArray();
    },

    async deleteDocumento(id) {
      if (!window.db) return;
      await window.db._ia_chunks.where('docId').equals(id).delete();
      await window.db._ia_docs.delete(id);
      if (window.sqliteDB?.ready) {
        await window.sqliteDB.removeChunks(id);
      }
      const docs = await this.getDocumentos();
      if (typeof Alpine !== 'undefined') {
        Alpine.store('ia').documentos = docs;
      }
    },

    // ── QA (Full, llama a ia-ingest) ──────────────────────
    async qa(pregunta) {
      if (!this._qaPipeline) return { respuesta: 'Modelo de IA no cargado. Verifica que los modelos esten en assets/models/', fuente: null, score: 0 };
      if (typeof window.iaIngest?.qa === 'function') {
        return window.iaIngest.qa(pregunta, this._qaPipeline, this._embedPipeline);
      }
      return { respuesta: 'Modulo de ingesta no disponible', fuente: null, score: 0 };
    },

    async ingestFile(blob) {
      if (typeof window.iaIngest?.file === 'function') {
        return window.iaIngest.file(blob, this._flex);
      }
      return { error: 'Modulo de ingesta no disponible' };
    },

    // ── Estadisticas y Predicciones (identico Lite) ──────
    stats(tabla, campo) {
      if (!window.db || !window.db[tabla]) return Promise.resolve(null);
      return window.db[tabla].toArray().then(rows => {
        const valores = rows.map(r => parseFloat(r[campo])).filter(v => !isNaN(v));
        if (valores.length === 0) return null;
        const sum = valores.reduce((a, b) => a + b, 0);
        const media = sum / valores.length;
        const sorted = [...valores].sort((a, b) => a - b);
        const mediana = sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
        const varianza = valores.reduce((acc, v) => acc + (v - media) ** 2, 0) / valores.length;
        return {
          tabla, campo, count: valores.length,
          media: +media.toFixed(2), mediana: +mediana.toFixed(2),
          min: +sorted[0].toFixed(2), max: +sorted[sorted.length - 1].toFixed(2),
          stddev: +Math.sqrt(varianza).toFixed(2), suma: +sum.toFixed(2)
        };
      });
    },

    async statsAll() {
      if (!window.db) return [];
      const results = await Promise.all(this._tables.map(async t => {
        const registros = await window.db[t].count();
        const sample = registros > 0 ? await window.db[t].limit(1).toArray() : [];
        return { tabla: t, registros, campos: sample.length ? Object.keys(sample[0]).length : 0 };
      }));
      return results;
    },

    predict(tabla, campo, periodos = 3) {
      if (!window.db || !window.db[tabla]) return Promise.resolve(null);
      return window.db[tabla].toArray().then(rows => {
        const valores = rows.map(r => parseFloat(r[campo])).filter(v => !isNaN(v));
        if (valores.length < 2) return null;
        return this.forecast(valores, periodos);
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
        pendiente: +pendiente.toFixed(4), intercepto: +intercepto.toFixed(2), r2,
        historico: valores, proyectados,
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

    async exportResumen(tabla) {
      if (!window.db || !window.db[tabla]) return '';
      const registros = await window.db[tabla].count();
      let txt = `=== Resumen: ${tabla} ===\nRegistros: ${registros}\n`;
      txt += `Ultima actualizacion: ${new Date().toLocaleDateString('es')}\n---\n`;
      if (registros > 0) {
        const sample = await window.db[tabla].limit(1).toArray();
        txt += `Campos: ${Object.keys(sample[0]).slice(0, 5).join(', ')}\n`;
      }
      return txt;
    },

    // ── Command Palette ───────────────────────────────────
    _initPalette() {
      if (typeof Alpine === 'undefined') return;
      document.addEventListener('keydown', function(e) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
          const store = Alpine.store('ia');
          if (store) store.paletteOpen = !store.paletteOpen;
        }
      });
    },

    // ── Chat historial (v0.2) ─────────────────────────
    async chatNew(titulo) {
      const db = window.db;
      if (!db) return { error: 'db no disponible' };
      const chat = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
        titulo: titulo || 'Nueva conversacion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0
      };
      await db._ia_chats.put(chat);
      return chat;
    },

    async chatList() {
      const db = window.db;
      if (!db) return [];
      return await db._ia_chats.orderBy('updatedAt').reverse().toArray();
    },

    async chatLoad(chatId) {
      const db = window.db;
      if (!db) return { chat: null, messages: [] };
      const chat = await db._ia_chats.get(chatId);
      const messages = await db._ia_messages.where('chatId').equals(chatId).sortBy('createdAt');
      return { chat, messages };
    },

    async chatDelete(chatId) {
      const db = window.db;
      if (!db) return;
      await db._ia_chats.delete(chatId);
      await db._ia_messages.where('chatId').equals(chatId).delete();
    },

    async chatAddMessage(chatId, rol, contenido, fuente, score) {
      const db = window.db;
      if (!db || !chatId) return;
      const msg = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
        chatId: chatId,
        rol: rol,
        contenido: contenido,
        fuente: fuente || null,
        score: score || null,
        createdAt: new Date().toISOString()
      };
      await db._ia_messages.put(msg);
      const chat = await db._ia_chats.get(chatId);
      if (chat) {
        chat.messageCount = (chat.messageCount || 0) + 1;
        chat.updatedAt = msg.createdAt;
        await db._ia_chats.put(chat);
      }
      return msg;
    }
  };

  window.ia = IA;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => IA.initLite());
  } else {
    IA.initLite();
  }
})();
