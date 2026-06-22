// core/ia-ingest.js — IA Jutia Full: Ingesta documentos + QA
// Dependencias: window.ia, pdf.js, mammoth.js, marked.js, SheetJS (xlsx),
//               Transformers.js (pipeline de @xenova/transformers)
// Expone: window.iaIngest

;(function() {
  'use strict';

  const INGEST = {
    // ── Detectar tipo y parsear ──────────────────────────
    async file(blob, flexIndex) {
      const ext = this._getExtension(blob.name);
      const tipo = this._getTipo(ext);

      let texto = '';
      try {
        switch (tipo) {
          case 'pdf': texto = await this.parse.pdf(blob); break;
          case 'docx': texto = await this.parse.docx(blob); break;
          case 'xlsx': texto = await this.parse.xlsx(blob); break;
          case 'csv': texto = await this.parse.csv(blob); break;
          case 'md': texto = await this.parse.md(blob); break;
          case 'json': texto = await this.parse.json(blob); break;
          default: texto = await this.parse.txt(blob);
        }
      } catch (err) {
        console.error('⚠️ ia-ingest: Error parseando', blob.name, err);
        return { error: `Error al leer ${blob.name}: ${err.message}` };
      }

      if (!texto || texto.length < 10) {
        return { error: `No se pudo extraer texto de ${blob.name}` };
      }

      const docId = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const chunks = this.chunk(texto, 512, 64);
      const paginas = tipo === 'pdf' ? this._estimarPaginas(texto) : null;

      const docInfo = {
        id: docId, nombre: blob.name, tipo,
        tamano: blob.size, fecha: new Date().toISOString(),
        paginas, chunks: chunks.length,
        resumen: texto.slice(0, 200) + (texto.length > 200 ? '...' : '')
      };

      // Guardar en Dexie
      await this.indexDocument(docId, chunks, docInfo, flexIndex);

      // Actualizar estado Alpine
      if (typeof Alpine !== 'undefined') {
        const docs = Alpine.store('ia').documentos || [];
        Alpine.store('ia').documentos = [...docs, docInfo];
      }

      return { ok: true, docId, chunks: chunks.length, nombre: blob.name };
    },

    _getExtension(nombre) {
      return nombre.split('.').pop().toLowerCase();
    },

    _getTipo(ext) {
      const mapa = {
        pdf: 'pdf', docx: 'docx', doc: 'docx',
        xlsx: 'xlsx', xls: 'xlsx', csv: 'csv',
        md: 'md', markdown: 'md',
        json: 'json', txt: 'txt', text: 'txt',
        html: 'txt', htm: 'txt', xml: 'txt', log: 'txt'
      };
      return mapa[ext] || 'txt';
    },

    _estimarPaginas(texto) {
      return Math.max(1, Math.ceil(texto.length / 3000));
    },

    // ── Parsers ───────────────────────────────────────────
    parse: {
      async pdf(blob) {
        if (typeof pdfjsLib === 'undefined') {
          return 'PDF.js no disponible. Asegurate de cargar pdf.js en index.html.';
        }
        const arrayBuffer = await blob.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let texto = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          texto += content.items.map(item => item.str).join(' ') + '\n';
        }
        return texto;
      },

      async docx(blob) {
        if (typeof mammoth === 'undefined') {
          return 'mammoth.js no disponible. Asegurate de cargar mammoth.js en index.html.';
        }
        const arrayBuffer = await blob.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || '';
      },

      async xlsx(blob) {
        if (typeof XLSX === 'undefined') {
          return 'SheetJS no disponible.';
        }
        const arrayBuffer = await blob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let texto = '';
        workbook.SheetNames.forEach(name => {
          const sheet = workbook.Sheets[name];
          const csv = XLSX.utils.sheet_to_csv(sheet);
          texto += `--- Hoja: ${name} ---\n${csv}\n`;
        });
        return texto;
      },

      async csv(blob) {
        const text = await blob.text();
        return text;
      },

      async md(blob) {
        const text = await blob.text();
        if (typeof marked !== 'undefined') {
          return marked.parse(text, { async: false }) || text;
        }
        return text;
      },

      async json(blob) {
        const text = await blob.text();
        try {
          const data = JSON.parse(text);
          return JSON.stringify(data, null, 2);
        } catch {
          return text;
        }
      },

      async txt(blob) {
        return blob.text();
      }
    },

    // ── Chunking ──────────────────────────────────────────
    chunk(texto, tamano = 512, overlap = 64) {
      const palabras = texto.split(/\s+/);
      const chunks = [];
      let inicio = 0;
      while (inicio < palabras.length) {
        const fin = Math.min(inicio + tamano, palabras.length);
        const chunkText = palabras.slice(inicio, fin).join(' ');
        chunks.push({
          texto: chunkText,
          inicio: inicio,
          fin: fin,
          tokens: fin - inicio
        });
        inicio += tamano - overlap;
      }
      return chunks;
    },

    // ── Indexar en Dexie + FlexSearch + SQLite (FTS5) ─────
    async indexDocument(docId, chunks, docInfo, flexIndex) {
      if (!window.db) return;

      // Guardar metadata del documento
      await window.db._ia_docs.put(docInfo);

      // Guardar chunks en Dexie (fallback universal)
      const chunkRows = chunks.map((c, i) => ({
        docId,
        indice: i,
        texto: c.texto,
        inicio: c.inicio,
        tokens: c.tokens
      }));
      await window.db._ia_chunks.bulkPut(chunkRows);

      // Guardar chunks en SQLite FTS5 (solo Full .exe)
      if (window.sqliteDB?.ready) {
        await window.sqliteDB.addChunks(chunks, docId);
      }

      // Indexar en FlexSearch
      if (flexIndex) {
        const flexDoc = {
          id: `doc-${docId}`,
          nombre: docInfo.nombre,
          descripcion: docInfo.resumen,
          notas: '',
          texto: chunks.slice(0, 5).map(c => c.texto).join(' ').slice(0, 1000),
          tipo: 'documento',
          tabla: '_ia_docs'
        };
        flexIndex.add(flexDoc);
      }
    },

    // ── Web Worker opcional ───────────────────────────────
    _worker: null,

    _getWorker() {
      if (typeof Worker === 'undefined') return null;
      if (!this._worker) {
        try {
          this._worker = new Worker('core/ia-worker.js');
        } catch (e) {
          console.warn('⚠️ ia-ingest: Worker no disponible, usando hilo principal');
          return null;
        }
      }
      return this._worker;
    },

    // ── QA Extractivo ─────────────────────────────────────
    async qa(pregunta, qaPipeline, embedPipeline) {
      if (!qaPipeline) {
        return { respuesta: 'Modelo de QA no cargado', fuente: null, score: 0 };
      }
      if (!window.db || !window.db._ia_chunks) {
        return { respuesta: 'No hay documentos indexados para consultar', fuente: null, score: 0 };
      }

      try {
        // Obtener chunks relevantes: FTS5 (sql.js) si disponible, si no muestreo paginado
        let chunksFiltrados;
        if (window.sqliteDB?.ready) {
          chunksFiltrados = await window.sqliteDB.searchChunks(pregunta, 5);
        } else {
          chunksFiltrados = await this._muestrearChunks(pregunta, embedPipeline);
        }
        if (chunksFiltrados.length === 0) {
          return { respuesta: 'No hay documentos indexados. Sube un archivo primero.', fuente: null, score: 0 };
        }

        // QA: delegar a Worker si disponible, si no hilo principal
        let mejorRespuesta;
        if (this._getWorker()) {
          mejorRespuesta = await this._qaWithWorker(pregunta, chunksFiltrados);
        } else {
          mejorRespuesta = await this._qaMainThread(pregunta, chunksFiltrados, qaPipeline);
        }

        if (!mejorRespuesta) {
          return { respuesta: 'No encontre una respuesta en los documentos disponibles.', fuente: null, score: 0 };
        }

        let fuente = null;
        if (mejorRespuesta.docId && window.db._ia_docs) {
          const doc = await window.db._ia_docs.get(mejorRespuesta.docId);
          if (doc) fuente = doc.nombre;
        }

        return {
          respuesta: mejorRespuesta.respuesta,
          fuente,
          score: +mejorRespuesta.score.toFixed(4),
          contexto: mejorRespuesta.contexto
        };
      } catch (err) {
        console.error('⚠️ ia-ingest: Error en QA:', err);
        return { respuesta: `Error al procesar la pregunta: ${err.message}`, fuente: null, score: 0 };
      }
    },

    async _muestrearChunks(pregunta, embedPipeline) {
      const totalChunks = await window.db._ia_chunks.count();
      if (totalChunks === 0) return [];

      let chunksFiltrados = [];
      if (embedPipeline) {
        const queryEmbed = await embedPipeline(pregunta, { pooling: 'mean', normalize: true });
        const queryVec = Array.from(queryEmbed.data);
        const BATCH = 50;
        const MAX_BATCHES = 3;
        let topScores = [];

        for (let offset = 0; offset < Math.min(totalChunks, BATCH * MAX_BATCHES); offset += BATCH) {
          const batch = await window.db._ia_chunks.offset(offset).limit(BATCH).toArray();
          for (const chunk of batch) {
            const score = chunk.embedding ? this._cosineSimilarity(queryVec, chunk.embedding) : 0;
            topScores.push({ ...chunk, score });
          }
          topScores.sort((a, b) => b.score - a.score);
          topScores = topScores.slice(0, 10);
        }
        chunksFiltrados = topScores.slice(0, 5).map(c => ({ docId: c.docId, texto: c.texto }));
      } else {
        const randomOffset = totalChunks > 10 ? Math.floor(Math.random() * (totalChunks - 10)) : 0;
        const batch = await window.db._ia_chunks.offset(randomOffset).limit(10).toArray();
        chunksFiltrados = batch.map(c => ({ docId: c.docId, texto: c.texto }));
      }
      return chunksFiltrados;
    },

    _qaWithWorker(pregunta, chunks) {
      return new Promise((resolve, reject) => {
        const worker = this._getWorker();
        if (!worker) return reject(new Error('Worker no disponible'));

        const id = Date.now().toString(36);
        const handler = (e) => {
          if (e.data.id !== id) return;
          worker.removeEventListener('message', handler);
          if (e.data.type === 'qa-result') resolve(e.data.data);
          else if (e.data.type === 'error') reject(new Error(e.data.error));
        };
        worker.addEventListener('message', handler);
        worker.postMessage({ type: 'qa', id, data: { pregunta, chunks } });
      });
    },

    async _qaMainThread(pregunta, chunks, qaPipeline) {
      let mejorRespuesta = null;
      for (const chunk of chunks) {
        try {
          const result = await qaPipeline(pregunta, chunk.texto);
          if (!mejorRespuesta || result.score > mejorRespuesta.score) {
            mejorRespuesta = {
              respuesta: result.answer,
              score: result.score,
              contexto: chunk.texto.slice(0, 300),
              docId: chunk.docId
            };
          }
        } catch (e) { /* skip chunk */ }
      }
      return mejorRespuesta;
    },

    _cosineSimilarity(a, b) {
      if (!a || !b || a.length !== b.length) return 0;
      let dot = 0, normA = 0, normB = 0;
      for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
      }
      const denom = Math.sqrt(normA) * Math.sqrt(normB);
      return denom ? dot / denom : 0;
    }
  };

  window.iaIngest = INGEST;
  console.log('🧠 ia-jutia: Modulo de ingesta listo');
})();
