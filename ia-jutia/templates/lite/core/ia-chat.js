// core/ia-chat.js — IA Jutia Chat v0.3
// Motor de chat conversacional con consultas a BD + FlexSearch fallback
// Dependencias: Dexie (window.db), FlexSearch (window.FlexSearch)
// Expone: window.ia.chat
// Se carga DESPUES de core/ia.js

;(function() {
  'use strict';

  if (typeof window.ia === 'undefined') {
    console.warn('[ia-chat] window.ia no disponible. ia-chat.js debe cargarse despues de ia.js');
    return;
  }

  // Patrones de consulta — detecta la intencion automaticamente
  const PATRONES = [
    // conteo
    { re: /(cuantos?|cuantas?|cuantos?)\s+(\w+)/i, tipo: 'count', tablaIdx: 2 },
    { re: /(cuantos?|cuantas?)\s+(\w+)\s+(hay|tengo|tenemos|registrados?)/i, tipo: 'count', tablaIdx: 2 },

    // suma
    { re: /(total|suma)\s+(de\s+)?(\w+)/i, tipo: 'sum', tablaIdx: 3 },
    { re: /(cuanto|cuanta)\s+(es\s+)?(el\s+)?(total\s+)?(de\s+)?(\w+)/i, tipo: 'sum', tablaIdx: 6 },

    // ranking
    { re: /(quien|quienes?)\s+(tiene?|tienen?)\s+(el\s+)?(mayor|menor|maximo|minimo)\s+(\w+)/i, tipo: 'rank', campoIdx: 5, tabla: null },
    { re: /(cual|mayor|menor|maximo|minimo)\s+(\w+)\s+(de|en)\s+(\w+)/i, tipo: 'rank', campoIdx: 2, tablaIdx: 4 },
    { re: /(top|mejor|peor)\s+(\d+)?\s*(\w+)/i, tipo: 'top', limiteIdx: 2, campoIdx: 3 },

    // filtro
    { re: /(stock|existencia)\s+(menor|inferior|bajo|debajo)\s+(de\s+)?(\d+)/i, tipo: 'filter', tabla: null, campo: 'stock', op: 'lt', valIdx: 4 },
    { re: /(precio|costo|valor)\s+(mayor|superior|alto)\s+(de\s+)?(a\s+)?(\d+)/i, tipo: 'filter', tabla: null, campo: 'precio', op: 'gt', valIdx: 5 },
    { re: /(menor|inferior)\s+(de\s+)?(a\s+)?(\d+)\s+(\w+)/i, tipo: 'filter', tablaIdx: 5, valIdx: 4, op: 'lt' },
    { re: /(mayor|superior)\s+(de\s+)?(a\s+)?(\d+)\s+(\w+)/i, tipo: 'filter', tablaIdx: 5, valIdx: 4, op: 'gt' },

    // fecha
    { re: /(\w+)\s+(de\s+)?(esta|este)\s+(semana|mes|ano|dia|año)/i, tipo: 'date', tablaIdx: 1 },
    { re: /(\w+)\s+(del\s+)?(ultimo|ultimos?)\s+(\d+)\s+(dias?|meses?|semanas?|anos?|años?)/i, tipo: 'date_range', tablaIdx: 1, numIdx: 4, unidadIdx: 5 },

    // lista
    { re: /(muestra|lista|muestrame|listame|ensena|enseñame|dime)\s+(los?|las?)?\s*(\w+)/i, tipo: 'list', tablaIdx: 3 },
    { re: /(todos?|todas?)\s+(los?|las?)\s+(\w+)/i, tipo: 'list', tablaIdx: 3 },

    // relacional
    { re: /(que|que?)\s+(compro|compró|pidio|pidió|solicito|solicitó)\s+(\w+)/i, tipo: 'relation', entidadIdx: 3 },
    { re: /(\w+)\s+(compro|compró|compró|pidio|pidió)\s+(\w+)/i, tipo: 'relation', sujetoIdx: 1, objetoIdx: 3 },

    // comparativo
    { re: /(promedio|media|average)\s+(de\s+)?(\w+)/i, tipo: 'avg', tablaIdx: 3 },
    { re: /(comparar|compara)\s+(\w+)\s+(y|vs|versus)\s+(\w+)/i, tipo: 'compare', aIdx: 2, bIdx: 4 },
  ];

  const Chat = {
    _flexHistorial: null,
    _historyIndexed: false,

    // — Init —
    init() {
      if (typeof FlexSearch !== 'undefined') {
        this._flexHistorial = new FlexSearch.Document({
          document: {
            id: 'id',
            index: ['contenido', 'fuente'],
            store: ['contenido', 'fuente', 'rol', 'chatId', 'createdAt']
          },
          tokenize: 'forward',
          cache: true
        });
      }
      console.log('[ia-chat] v0.3 listo' + (this._flexHistorial ? ' + historial' : ''));
    },

    // — Gestion de hilos (Dexie) —
    async create(titulo) {
      if (!window.db || !window.db._ia_chats) return null;
      const chat = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        titulo: titulo || 'Nueva conversacion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0
      };
      await window.db._ia_chats.put(chat);
      return chat;
    },

    async list() {
      if (!window.db || !window.db._ia_chats) return [];
      return await window.db._ia_chats.orderBy('updatedAt').reverse().toArray();
    },

    async load(chatId) {
      if (!window.db || !window.db._ia_chats || !chatId) return { chat: null, messages: [] };
      const chat = await window.db._ia_chats.get(chatId);
      const messages = await window.db._ia_messages
        .where('chatId').equals(chatId)
        .sortBy('createdAt');
      return { chat, messages };
    },

    async delete(chatId) {
      if (!window.db || !window.db._ia_chats) return;
      await window.db._ia_chats.delete(chatId);
      const msgs = await window.db._ia_messages.where('chatId').equals(chatId).toArray();
      for (const m of msgs) {
        await window.db._ia_messages.delete(m.id);
      }
    },

    async addMessage(chatId, rol, contenido, fuente, score) {
      if (!window.db || !window.db._ia_messages || !chatId) return null;
      const msg = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        chatId,
        rol,
        contenido,
        fuente: fuente || null,
        score: score || null,
        createdAt: new Date().toISOString()
      };
      await window.db._ia_messages.put(msg);

      // Actualizar contador del chat
      if (window.db._ia_chats) {
        const chat = await window.db._ia_chats.get(chatId);
        if (chat) {
          chat.messageCount = (chat.messageCount || 0) + 1;
          chat.updatedAt = msg.createdAt;
          await window.db._ia_chats.put(chat);
        }
      }

      // Indexar en FlexSearch historial (solo mensajes IA)
      if (this._flexHistorial && rol === 'ia') {
        this._flexHistorial.add(msg);
      }

      return msg;
    },

    // — DB Query Engine (patrones + FlexSearch fallback) —
    async ask(chatId, pregunta) {
      if (!pregunta) return { respuesta: 'Escribe una pregunta.', fuente: null };

      // Paso 1: Intentar patrones
      const patron = this._matchPattern(pregunta);
      if (patron) {
        const result = await this._executePattern(patron, pregunta);
        if (result) return result;
      }

      // Paso 2: Fallback a FlexSearch
      const flexResult = await this._flexFallback(pregunta);
      if (flexResult) return flexResult;

      // Paso 3: Respuesta generica
      return {
        respuesta: 'No entendi tu pregunta. Intenta con:\n\n' +
          '- "¿Cuantos clientes hay?"\n' +
          '- "Total de ventas"\n' +
          '- "Productos con stock menor a 10"\n' +
          '- "Muestra los proveedores"\n' +
          '- "¿Que compro Juan?"',
        fuente: null
      };
    },

    _matchPattern(pregunta) {
      const q = pregunta.toLowerCase().trim();
      for (const p of PATRONES) {
        const m = q.match(p.re);
        if (m) return { ...p, match: m };
      }
      return null;
    },

    async _getTablas() {
      if (!window.db) return [];
      return Object.keys(window.db).filter(k =>
        !k.startsWith('_') && typeof window.db[k]?.count === 'function'
      );
    },

    async _detectarTabla(nombre, campos) {
      const tablas = await this._getTablas();
      const q = nombre.toLowerCase();

      // Coincidencia exacta primero
      const exacta = tablas.find(t => t.toLowerCase() === q);
      if (exacta) return exacta;

      // Coincidencia parcial
      const parcial = tablas.find(t => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()));
      if (parcial) return parcial;

      // Singular/plural
      const singular = tablas.find(t => {
        const tl = t.toLowerCase();
        return tl === q + 's' || tl === q + 'es' || q === tl + 's' || q === tl + 'es' ||
               tl.replace(/s$/, '') === q || q.replace(/s$/, '') === tl;
      });
      if (singular) return singular;

      return tablas[0] || null;
    },

    async _executePattern(patron, pregunta) {
      if (!window.db) return null;

      try {
        switch (patron.tipo) {
          case 'count': return await this._execCount(patron);
          case 'sum': return await this._execSum(patron);
          case 'rank': return await this._execRank(patron);
          case 'top': return await this._execTop(patron);
          case 'filter': return await this._execFilter(patron);
          case 'date': return await this._execDate(patron);
          case 'date_range': return await this._execDateRange(patron);
          case 'list': return await this._execList(patron);
          case 'relation': return await this._execRelation(patron, pregunta);
          case 'avg': return await this._execAvg(patron);
          case 'compare': return await this._execCompare(patron);
          default: return null;
        }
      } catch(e) {
        console.warn('[ia-chat] Error ejecutando patron:', e);
        return null;
      }
    },

    async _execCount(patron) {
      const nombreTabla = patron.match[patron.tablaIdx];
      const tabla = await this._detectarTabla(nombreTabla);
      if (!tabla) return null;
      const count = await window.db[tabla].count();
      return {
        respuesta: `Hay **${count}** registros en **${tabla}**.`,
        fuente: `tabla:${tabla}`
      };
    },

    async _execSum(patron) {
      const nombreTabla = patron.match[patron.tablaIdx];
      const tabla = await this._detectarTabla(nombreTabla);
      if (!tabla) return null;
      const sample = await window.db[tabla].limit(1).toArray();
      if (!sample.length) return { respuesta: `No hay datos en ${tabla}.`, fuente: null };
      const campoNum = Object.keys(sample[0]).find(k =>
        typeof sample[0][k] === 'number' && k !== 'id' && k !== '_id'
      );
      if (!campoNum) return null;
      const rows = await window.db[tabla].toArray();
      const total = rows.reduce((s, r) => s + (parseFloat(r[campoNum]) || 0), 0);
      return {
        respuesta: `La suma total de **${campoNum}** en **${tabla}** es **$${total.toFixed(2)}**.`,
        fuente: `tabla:${tabla}`
      };
    },

    async _execRank(patron) {
      const campo = patron.campoIdx ? patron.match[patron.campoIdx] : 'total';
      const nombreTabla = patron.tablaIdx ? patron.match[patron.tablaIdx] : null;
      const tabla = nombreTabla ? await this._detectarTabla(nombreTabla) : (await this._getTablas())[0];
      if (!tabla) return null;
      const isMax = /mayor|maximo/i.test(patron.match[0]);
      const rows = await window.db[tabla].toArray();
      const conValor = rows.filter(r => parseFloat(r[campo]) > 0);
      if (!conValor.length) return null;
      conValor.sort((a, b) => parseFloat(b[campo]) - parseFloat(a[campo]));
      const top = isMax ? conValor[0] : conValor[conValor.length - 1];
      const nombre = top.nombre || top.titulo || top.name || top.id;
      return {
        respuesta: `El ${isMax ? 'mayor' : 'menor'} **${campo}** en **${tabla}** es **${nombre}** con **${parseFloat(top[campo]).toFixed(2)}**.`,
        fuente: `tabla:${tabla}`
      };
    },

    async _execTop(patron) {
      const limite = patron.match[patron.limiteIdx] ? parseInt(patron.match[patron.limiteIdx]) : 5;
      const campo = patron.match[patron.campoIdx];
      const tabla = await this._detectarTabla(campo);
      if (!tabla) return null;
      const rows = await window.db[tabla].toArray();
      const fieldNames = Object.keys(rows[0] || {}).filter(k => typeof rows[0][k] === 'number' && k !== 'id');
      const campoNum = fieldNames[0] || 'id';
      rows.sort((a, b) => parseFloat(b[campoNum]) - parseFloat(a[campoNum]));
      const top = rows.slice(0, Math.min(limite, 10));
      let resp = `**Top ${top.length}** de **${tabla}**:\n\n`;
      top.forEach((r, i) => {
        const nom = r.nombre || r.titulo || r.name || r.id;
        resp += `${i + 1}. **${nom}** — ${parseFloat(r[campoNum]).toFixed(2)}\n`;
      });
      return { respuesta: resp, fuente: `tabla:${tabla}` };
    },

    async _execFilter(patron) {
      const campo = patron.campo || 'stock';
      const val = parseInt(patron.match[patron.valIdx]);
      const nombreTabla = patron.tablaIdx ? patron.match[patron.tablaIdx] : null;
      const tabla = nombreTabla ? await this._detectarTabla(nombreTabla) : (await this._getTablas())[0];
      if (!tabla || isNaN(val)) return null;

      let rows;
      if (patron.op === 'lt') {
        rows = await window.db[tabla].where(campo).below(val).toArray();
      } else {
        rows = await window.db[tabla].where(campo).above(val).toArray();
      }

      if (!rows.length) {
        return { respuesta: `No hay registros en **${tabla}** con **${campo}** ${patron.op === 'lt' ? 'menor a' : 'mayor a'} **${val}**.`, fuente: `tabla:${tabla}` };
      }
      const opTxt = patron.op === 'lt' ? 'menor a' : 'mayor a';
      let resp = `Hay **${rows.length}** registros en **${tabla}** con **${campo}** ${opTxt} **${val}**:\n\n`;
      rows.slice(0, 10).forEach(r => {
        const nom = r.nombre || r.titulo || r.name || r.id;
        resp += `- **${nom}** (${campo}: ${r[campo]})\n`;
      });
      if (rows.length > 10) resp += `\n... y ${rows.length - 10} mas.`;
      return { respuesta: resp, fuente: `tabla:${tabla}` };
    },

    async _execDate(patron) {
      const nombreTabla = patron.match[patron.tablaIdx];
      const periodo = patron.match[3] || patron.match[4] || 'hoy';
      const tabla = await this._detectarTabla(nombreTabla);
      if (!tabla) return null;
      const hoy = new Date();
      let inicio;
      switch (periodo) {
        case 'semana': inicio = new Date(hoy); inicio.setDate(hoy.getDate() - hoy.getDay()); break;
        case 'mes': inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); break;
        case 'ano':
        case 'año': inicio = new Date(hoy.getFullYear(), 0, 1); break;
        default: inicio = new Date(hoy); inicio.setHours(0, 0, 0, 0); break;
      }
      const rows = await window.db[tabla].toArray();
      const filtradas = rows.filter(r => {
        const f = r.fecha || r.createdAt || r.updatedAt;
        return f && new Date(f) >= inicio;
      });
      return {
        respuesta: `En **${tabla}** hay **${filtradas.length}** registros ${periodo === 'hoy' ? 'de hoy' : 'de esta ' + periodo}.`,
        fuente: `tabla:${tabla}`
      };
    },

    async _execDateRange(patron) {
      const nombreTabla = patron.match[patron.tablaIdx];
      const num = parseInt(patron.match[patron.numIdx]) || 7;
      const unidad = (patron.match[patron.unidadIdx] || 'dias').toLowerCase();
      const tabla = await this._detectarTabla(nombreTabla);
      if (!tabla) return null;
      const hoy = new Date();
      let inicio = new Date(hoy);
      if (unidad.startsWith('dia')) inicio.setDate(hoy.getDate() - num);
      else if (unidad.startsWith('sem')) inicio.setDate(hoy.getDate() - num * 7);
      else if (unidad.startsWith('mes')) inicio.setMonth(hoy.getMonth() - num);
      else if (unidad.startsWith('ano') || unidad.startsWith('año')) inicio.setFullYear(hoy.getFullYear() - num);
      const rows = await window.db[tabla].toArray();
      const filtradas = rows.filter(r => {
        const f = r.fecha || r.createdAt || r.updatedAt;
        return f && new Date(f) >= inicio;
      });
      return {
        respuesta: `En los ultimos **${num} ${unidad}** hay **${filtradas.length}** registros en **${tabla}**.`,
        fuente: `tabla:${tabla}`
      };
    },

    async _execList(patron) {
      const nombreTabla = patron.match[patron.tablaIdx];
      const tabla = await this._detectarTabla(nombreTabla);
      if (!tabla) return null;
      const rows = await window.db[tabla].limit(15).toArray();
      if (!rows.length) return { respuesta: `No hay registros en **${tabla}**.`, fuente: null };
      let resp = `**${rows.length}** registros en **${tabla}**:\n\n`;
      rows.forEach((r, i) => {
        const nom = r.nombre || r.titulo || r.name || `${tabla} #${r.id || i + 1}`;
        resp += `${i + 1}. ${nom}\n`;
      });
      if (rows.length === 15) resp += '\n... (mostrando primeros 15)';
      return { respuesta: resp, fuente: `tabla:${tabla}` };
    },

    async _execAvg(patron) {
      const nombreTabla = patron.match[patron.tablaIdx];
      const tabla = await this._detectarTabla(nombreTabla);
      if (!tabla) return null;
      const sample = await window.db[tabla].limit(1).toArray();
      if (!sample.length) return { respuesta: `No hay datos en ${tabla}.`, fuente: null };
      const campoNum = Object.keys(sample[0]).find(k =>
        typeof sample[0][k] === 'number' && k !== 'id' && k !== '_id'
      );
      if (!campoNum) return null;
      const rows = await window.db[tabla].toArray();
      const valores = rows.map(r => parseFloat(r[campoNum])).filter(v => !isNaN(v));
      if (!valores.length) return null;
      const media = valores.reduce((a, b) => a + b, 0) / valores.length;
      return {
        respuesta: `El promedio de **${campoNum}** en **${tabla}** es **${media.toFixed(2)}** (sobre ${valores.length} registros).`,
        fuente: `tabla:${tabla}`,
        score: null
      };
    },

    async _execCompare(patron) {
      return null; // Comparacion entre tablas requiere mas contexto — pendiente
    },

    async _execRelation(patron, pregunta) {
      return null; // Consultas relacionales requiere schema dinamico — pendiente
    },

    // — FlexSearch Fallback —
    async _flexFallback(pregunta) {
      if (!window.ia || !window.ia._flex) return null;
      const results = await window.ia.search(pregunta, { limit: 5 });
      if (!results || !results.length) return null;

      let resp = 'Encontre estos resultados relacionados:\n\n';
      const vistos = new Set();
      results.forEach(r => {
        const key = r.tabla + '-' + r.id;
        if (vistos.has(key)) return;
        vistos.add(key);
        resp += `- **${r.nombre || r.tabla}** (${r.tabla})\n`;
      });
      resp += '\nPuedes usar el buscador para ver detalles.';
      return { respuesta: resp, fuente: 'flexsearch', score: null };
    },

    // — Busqueda en historial de conversaciones (Nivel 2) —
    async searchHistory(query, limit) {
      limit = limit || 10;
      if (!this._flexHistorial || !query) return [];

      // Indexar mensajes IA si no se ha hecho
      if (!this._historyIndexed) {
        await this._indexHistory();
      }

      const results = this._flexHistorial.search(query, {
        limit,
        enrich: true
      });

      const flat = [];
      for (const res of results) {
        for (const item of res.result || []) {
          if (item.doc) flat.push(item.doc);
        }
      }
      return flat;
    },

    async _indexHistory() {
      if (!window.db || !window.db._ia_messages || this._historyIndexed) return;
      try {
        const msgs = await window.db._ia_messages.where('rol').equals('ia').toArray();
        for (const msg of msgs) {
          if (this._flexHistorial) this._flexHistorial.add(msg);
        }
        this._historyIndexed = true;
      } catch(e) {
        console.warn('[ia-chat] Error indexando historial:', e);
      }
    },

    // — Utilidades —
    async getRelevantHistory(pregunta, limit) {
      limit = limit || 3;
      const results = await this.searchHistory(pregunta, limit);
      return results.map(r => ({
        contenido: r.contenido,
        chatId: r.chatId
      }));
    }
  };

  // Exponer en window.ia
  window.ia.chat = Chat;

  // Inicializar cuando DOM este listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Chat.init());
  } else {
    Chat.init();
  }
})();
