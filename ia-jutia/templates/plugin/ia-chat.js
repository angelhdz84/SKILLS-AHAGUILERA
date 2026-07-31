// modules/ia-jutia/ia-chat.js — IA Jutia Chat Plugin v1.0
// Motor de chat conversacional con consultas a BD + FlexSearch fallback
// Dependencias: Dexie (window.db), FlexSearch (window.FlexSearch), window.ia
// Expone: window.ia.chat
// module.js llama a window.ia.chat.init() despues de cargar FlexSearch

;(function() {
  'use strict';

  // Patrones de consulta — detecta la intencion automaticamente
  var PATRONES = [
    { re: /(cuantos?|cuantas?|cuantos?)\s+(\w+)/i, tipo: 'count', tablaIdx: 2 },
    { re: /(cuantos?|cuantas?)\s+(\w+)\s+(hay|tengo|tenemos|registrados?)/i, tipo: 'count', tablaIdx: 2 },
    { re: /(total|suma)\s+(de\s+)?(\w+)/i, tipo: 'sum', tablaIdx: 3 },
    { re: /(cuanto|cuanta)\s+(es\s+)?(el\s+)?(total\s+)?(de\s+)?(\w+)/i, tipo: 'sum', tablaIdx: 6 },
    { re: /(quien|quienes?)\s+(tiene?|tienen?)\s+(el\s+)?(mayor|menor|maximo|minimo)\s+(\w+)/i, tipo: 'rank', campoIdx: 5, tabla: null },
    { re: /(cual|mayor|menor|maximo|minimo)\s+(\w+)\s+(de|en)\s+(\w+)/i, tipo: 'rank', campoIdx: 2, tablaIdx: 4 },
    { re: /(top|mejor|peor)\s+(\d+)?\s*(\w+)/i, tipo: 'top', limiteIdx: 2, campoIdx: 3 },
    { re: /(stock|existencia)\s+(menor|inferior|bajo|debajo)\s+(de\s+)?(\d+)/i, tipo: 'filter', tabla: null, campo: 'stock', op: 'lt', valIdx: 4 },
    { re: /(precio|costo|valor)\s+(mayor|superior|alto)\s+(de\s+)?(a\s+)?(\d+)/i, tipo: 'filter', tabla: null, campo: 'precio', op: 'gt', valIdx: 5 },
    { re: /(menor|inferior)\s+(de\s+)?(a\s+)?(\d+)\s+(\w+)/i, tipo: 'filter', tablaIdx: 5, valIdx: 4, op: 'lt' },
    { re: /(mayor|superior)\s+(de\s+)?(a\s+)?(\d+)\s+(\w+)/i, tipo: 'filter', tablaIdx: 5, valIdx: 4, op: 'gt' },
    { re: /(\w+)\s+(de\s+)?(esta|este)\s+(semana|mes|ano|dia|año)/i, tipo: 'date', tablaIdx: 1 },
    { re: /(\w+)\s+(del\s+)?(ultimo|ultimos?)\s+(\d+)\s+(dias?|meses?|semanas?|anos?|años?)/i, tipo: 'date_range', tablaIdx: 1, numIdx: 4, unidadIdx: 5 },
    { re: /(muestra|lista|muestrame|listame|ensena|enseñame|dime)\s+(los?|las?)?\s*(\w+)/i, tipo: 'list', tablaIdx: 3 },
    { re: /(todos?|todas?)\s+(los?|las?)\s+(\w+)/i, tipo: 'list', tablaIdx: 3 },
    { re: /(que|que?)\s+(compro|compró|pidio|pidió|solicito|solicitó)\s+(\w+)/i, tipo: 'relation', entidadIdx: 3 },
    { re: /(\w+)\s+(compro|compró|compró|pidio|pidió)\s+(\w+)/i, tipo: 'relation', sujetoIdx: 1, objetoIdx: 3 },
    { re: /(promedio|media|average)\s+(de\s+)?(\w+)/i, tipo: 'avg', tablaIdx: 3 },
    { re: /(comparar|compara)\s+(\w+)\s+(y|vs|versus)\s+(\w+)/i, tipo: 'compare', aIdx: 2, bIdx: 4 }
  ];

  var Chat = {
    _flexHistorial: null,
    _historyIndexed: false,

    init: function() {
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
      console.log('[ia-chat] v1.0-plugin listo' + (this._flexHistorial ? ' + historial' : ''));
    },

    create: async function(titulo) {
      var db = window.db || window.iaDB;
      if (!db || !db._ia_chats) return null;
      var chat = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        titulo: titulo || 'Nueva conversacion',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0
      };
      await db._ia_chats.put(chat);
      return chat;
    },

    list: async function() {
      var db = window.db || window.iaDB;
      if (!db || !db._ia_chats) return [];
      return await db._ia_chats.orderBy('updatedAt').reverse().toArray();
    },

    load: async function(chatId) {
      var db = window.db || window.iaDB;
      if (!db || !db._ia_chats || !chatId) return { chat: null, messages: [] };
      var chat = await db._ia_chats.get(chatId);
      var messages = await db._ia_messages
        .where('chatId').equals(chatId)
        .sortBy('createdAt');
      return { chat: chat, messages: messages };
    },

    delete: async function(chatId) {
      var db = window.db || window.iaDB;
      if (!db || !db._ia_chats) return;
      await db._ia_chats.delete(chatId);
      var msgs = await db._ia_messages.where('chatId').equals(chatId).toArray();
      for (var i = 0; i < msgs.length; i++) {
        await db._ia_messages.delete(msgs[i].id);
      }
    },

    addMessage: async function(chatId, rol, contenido, fuente, score) {
      var db = window.db || window.iaDB;
      if (!db || !db._ia_messages || !chatId) return null;
      var msg = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        chatId: chatId,
        rol: rol,
        contenido: contenido,
        fuente: fuente || null,
        score: score || null,
        createdAt: new Date().toISOString()
      };
      await db._ia_messages.put(msg);

      if (db._ia_chats) {
        var chat = await db._ia_chats.get(chatId);
        if (chat) {
          chat.messageCount = (chat.messageCount || 0) + 1;
          chat.updatedAt = msg.createdAt;
          await db._ia_chats.put(chat);
        }
      }

      if (this._flexHistorial && rol === 'ia') {
        this._flexHistorial.add(msg);
      }

      return msg;
    },

    ask: async function(chatId, pregunta) {
      if (!pregunta) return { respuesta: 'Escribe una pregunta.', fuente: null };

      // Guardar mensaje usuario
      if (chatId) {
        await this.addMessage(chatId, 'user', pregunta, null, null);
      }

      // 1. Intentar patrones NL primero
      var patron = this._matchPattern(pregunta);
      if (patron) {
        var result = await this._executePattern(patron, pregunta);
        if (result) {
          if (chatId) {
            await this.addMessage(chatId, 'ia', result.respuesta, result.fuente, result.score);
          }
          return result;
        }
      }

      // 2. Fallback: busqueda semantica (Full+) o FlexSearch (Lite)
      var respuestaIA = '';
      var fuente = 'flexsearch';

      if (window.iaFull && window.iaFull._ready && window.iaFull.searchHybrid) {
        // Full+: embeddings semanticos
        var semResults = await window.iaFull.searchHybrid(pregunta, { limit: 3 });
        if (semResults && semResults.length > 0) {
          respuestaIA = this._formatearResultados(semResults);
          fuente = 'semantico';
        }
      }

      if (!respuestaIA) {
        var flexResult = await this._flexFallback(pregunta);
        if (flexResult) {
          respuestaIA = flexResult.respuesta;
          fuente = flexResult.fuente;
        }
      }

      if (!respuestaIA) {
        respuestaIA = 'No entendi tu pregunta. Intenta con:\n\n' +
          '- "¿Cuantos clientes hay?"\n' +
          '- "Total de ventas"\n' +
          '- "Productos con stock menor a 10"\n' +
          '- "Muestra los proveedores"\n' +
          '- "¿Que compro Juan?"';
        fuente = null;
      }

      if (chatId) {
        await this.addMessage(chatId, 'ia', respuestaIA, fuente, null);
      }
      return { respuesta: respuestaIA, fuente: fuente };
    },

    _formatearResultados: function(resultados) {
      if (!resultados || resultados.length === 0) return 'Sin resultados.';
      var lines = ['Encontre esto en tus datos:\n'];
      for (var i = 0; i < Math.min(resultados.length, 3); i++) {
        var r = resultados[i];
        var nombre = r.nombre || r.tabla || 'documento';
        var texto = r.texto || r.descripcion || '';
        lines.push((i + 1) + '. **' + nombre + '**: ' + texto.slice(0, 200));
      }
      return lines.join('\n');
    },

    _matchPattern: function(pregunta) {
      var q = pregunta.toLowerCase().trim();
      for (var i = 0; i < PATRONES.length; i++) {
        var m = q.match(PATRONES[i].re);
        if (m) {
          var p = {};
          for (var k in PATRONES[i]) {
            if (k !== 're') p[k] = PATRONES[i][k];
          }
          p.match = m;
          return p;
        }
      }
      return null;
    },

    _getTablas: async function() {
      var db = window.db || window.iaDB;
      if (!db) return [];
      return Object.keys(db).filter(function(k) {
        return !k.startsWith('_') && typeof db[k].count === 'function';
      });
    },

    _detectarTabla: async function(nombre) {
      var tablas = await this._getTablas();
      var q = nombre.toLowerCase();

      var exacta = tablas.find(function(t) { return t.toLowerCase() === q; });
      if (exacta) return exacta;

      var parcial = tablas.find(function(t) { return t.toLowerCase().includes(q) || q.includes(t.toLowerCase()); });
      if (parcial) return parcial;

      var singular = tablas.find(function(t) {
        var tl = t.toLowerCase();
        return tl === q + 's' || tl === q + 'es' || q === tl + 's' || q === tl + 'es' ||
               tl.replace(/s$/, '') === q || q.replace(/s$/, '') === tl;
      });
      if (singular) return singular;

      return tablas[0] || null;
    },

    _executePattern: async function(patron, pregunta) {
      var db = window.db || window.iaDB;
      if (!db) return null;

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

    _execCount: async function(patron) {
      var db = window.db || window.iaDB;
      var nombreTabla = patron.match[patron.tablaIdx];
      var tabla = await this._detectarTabla(nombreTabla);
      if (!tabla || !db[tabla]) return null;
      var count = await db[tabla].count();
      return { respuesta: 'Hay **' + count + '** registros en **' + tabla + '**.', fuente: 'tabla:' + tabla };
    },

    _execSum: async function(patron) {
      var db = window.db || window.iaDB;
      var nombreTabla = patron.match[patron.tablaIdx];
      var tabla = await this._detectarTabla(nombreTabla);
      if (!tabla || !db[tabla]) return null;
      var sample = await db[tabla].limit(1).toArray();
      if (!sample.length) return { respuesta: 'No hay datos en ' + tabla + '.', fuente: null };
      var campoNum = Object.keys(sample[0]).find(function(k) {
        return typeof sample[0][k] === 'number' && k !== 'id' && k !== '_id';
      });
      if (!campoNum) return null;
      var rows = await db[tabla].toArray();
      var total = rows.reduce(function(s, r) { return s + (parseFloat(r[campoNum]) || 0); }, 0);
      return {
        respuesta: 'La suma total de **' + campoNum + '** en **' + tabla + '** es **$' + total.toFixed(2) + '**.',
        fuente: 'tabla:' + tabla
      };
    },

    _execRank: async function(patron) {
      var db = window.db || window.iaDB;
      var campo = patron.campoIdx ? patron.match[patron.campoIdx] : 'total';
      var nombreTabla = patron.tablaIdx ? patron.match[patron.tablaIdx] : null;
      var tabla = nombreTabla ? await this._detectarTabla(nombreTabla) : (await this._getTablas())[0];
      if (!tabla || !db[tabla]) return null;
      var isMax = /mayor|maximo/i.test(patron.match[0]);
      var rows = await db[tabla].toArray();
      var conValor = rows.filter(function(r) { return parseFloat(r[campo]) > 0; });
      if (!conValor.length) return null;
      conValor.sort(function(a, b) { return parseFloat(b[campo]) - parseFloat(a[campo]); });
      var top = isMax ? conValor[0] : conValor[conValor.length - 1];
      var nombre = top.nombre || top.titulo || top.name || top.id;
      return {
        respuesta: 'El ' + (isMax ? 'mayor' : 'menor') + ' **' + campo + '** en **' + tabla + '** es **' + nombre + '** con **' + parseFloat(top[campo]).toFixed(2) + '**.',
        fuente: 'tabla:' + tabla
      };
    },

    _execTop: async function(patron) {
      var db = window.db || window.iaDB;
      var limite = patron.match[patron.limiteIdx] ? parseInt(patron.match[patron.limiteIdx]) : 5;
      var campo = patron.match[patron.campoIdx];
      var tabla = await this._detectarTabla(campo);
      if (!tabla || !db[tabla]) return null;
      var rows = await db[tabla].toArray();
      if (!rows.length) return null;
      var camposNum = Object.keys(rows[0]).filter(function(k) {
        return typeof rows[0][k] === 'number' && k !== 'id';
      });
      var campoNum = camposNum[0] || 'id';
      rows.sort(function(a, b) { return parseFloat(b[campoNum]) - parseFloat(a[campoNum]); });
      var top = rows.slice(0, Math.min(limite, 10));
      var resp = '**Top ' + top.length + '** de **' + tabla + '**:\n\n';
      for (var i = 0; i < top.length; i++) {
        var nom = top[i].nombre || top[i].titulo || top[i].name || top[i].id;
        resp += (i + 1) + '. **' + nom + '** — ' + parseFloat(top[i][campoNum]).toFixed(2) + '\n';
      }
      return { respuesta: resp, fuente: 'tabla:' + tabla };
    },

    _execFilter: async function(patron) {
      var db = window.db || window.iaDB;
      var campo = patron.campo || 'stock';
      var val = parseInt(patron.match[patron.valIdx]);
      var nombreTabla = patron.tablaIdx ? patron.match[patron.tablaIdx] : null;
      var tabla = nombreTabla ? await this._detectarTabla(nombreTabla) : (await this._getTablas())[0];
      if (!tabla || !db[tabla] || isNaN(val)) return null;

      var rows;
      if (patron.op === 'lt') {
        rows = await db[tabla].where(campo).below(val).toArray();
      } else {
        rows = await db[tabla].where(campo).above(val).toArray();
      }

      if (!rows.length) {
        return { respuesta: 'No hay registros en **' + tabla + '** con **' + campo + '** ' + (patron.op === 'lt' ? 'menor a' : 'mayor a') + ' **' + val + '**.', fuente: 'tabla:' + tabla };
      }
      var opTxt = patron.op === 'lt' ? 'menor a' : 'mayor a';
      var resp = 'Hay **' + rows.length + '** registros en **' + tabla + '** con **' + campo + '** ' + opTxt + ' **' + val + '**:\n\n';
      var mostrar = rows.slice(0, 10);
      for (var i = 0; i < mostrar.length; i++) {
        var nom = mostrar[i].nombre || mostrar[i].titulo || mostrar[i].name || mostrar[i].id;
        resp += '- **' + nom + '** (' + campo + ': ' + mostrar[i][campo] + ')\n';
      }
      if (rows.length > 10) resp += '\n... y ' + (rows.length - 10) + ' mas.';
      return { respuesta: resp, fuente: 'tabla:' + tabla };
    },

    _execDate: async function(patron) {
      var db = window.db || window.iaDB;
      var nombreTabla = patron.match[patron.tablaIdx];
      var periodo = patron.match[3] || patron.match[4] || 'hoy';
      var tabla = await this._detectarTabla(nombreTabla);
      if (!tabla || !db[tabla]) return null;
      var hoy = new Date();
      var inicio;
      switch (periodo) {
        case 'semana': inicio = new Date(hoy); inicio.setDate(hoy.getDate() - hoy.getDay()); break;
        case 'mes': inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1); break;
        case 'ano':
        case 'año': inicio = new Date(hoy.getFullYear(), 0, 1); break;
        default: inicio = new Date(hoy); inicio.setHours(0, 0, 0, 0); break;
      }
      var rows = await db[tabla].toArray();
      var filtradas = rows.filter(function(r) {
        var f = r.fecha || r.createdAt || r.updatedAt;
        return f && new Date(f) >= inicio;
      });
      return {
        respuesta: 'En **' + tabla + '** hay **' + filtradas.length + '** registros ' + (periodo === 'hoy' ? 'de hoy' : 'de esta ' + periodo) + '.',
        fuente: 'tabla:' + tabla
      };
    },

    _execDateRange: async function(patron) {
      var db = window.db || window.iaDB;
      var nombreTabla = patron.match[patron.tablaIdx];
      var num = parseInt(patron.match[patron.numIdx]) || 7;
      var unidad = (patron.match[patron.unidadIdx] || 'dias').toLowerCase();
      var tabla = await this._detectarTabla(nombreTabla);
      if (!tabla || !db[tabla]) return null;
      var hoy = new Date();
      var inicio = new Date(hoy);
      if (unidad.startsWith('dia')) inicio.setDate(hoy.getDate() - num);
      else if (unidad.startsWith('sem')) inicio.setDate(hoy.getDate() - num * 7);
      else if (unidad.startsWith('mes')) inicio.setMonth(hoy.getMonth() - num);
      else if (unidad.startsWith('ano') || unidad.startsWith('año')) inicio.setFullYear(hoy.getFullYear() - num);
      var rows = await db[tabla].toArray();
      var filtradas = rows.filter(function(r) {
        var f = r.fecha || r.createdAt || r.updatedAt;
        return f && new Date(f) >= inicio;
      });
      return {
        respuesta: 'En los ultimos **' + num + ' ' + unidad + '** hay **' + filtradas.length + '** registros en **' + tabla + '**.',
        fuente: 'tabla:' + tabla
      };
    },

    _execList: async function(patron) {
      var db = window.db || window.iaDB;
      var nombreTabla = patron.match[patron.tablaIdx];
      var tabla = await this._detectarTabla(nombreTabla);
      if (!tabla || !db[tabla]) return null;
      var rows = await db[tabla].limit(15).toArray();
      if (!rows.length) return { respuesta: 'No hay registros en **' + tabla + '**.', fuente: null };
      var resp = '**' + rows.length + '** registros en **' + tabla + '**:\n\n';
      for (var i = 0; i < rows.length; i++) {
        var nom = rows[i].nombre || rows[i].titulo || rows[i].name || tabla + ' #' + (rows[i].id || (i + 1));
        resp += (i + 1) + '. ' + nom + '\n';
      }
      if (rows.length === 15) resp += '\n... (mostrando primeros 15)';
      return { respuesta: resp, fuente: 'tabla:' + tabla };
    },

    _execAvg: async function(patron) {
      var db = window.db || window.iaDB;
      var nombreTabla = patron.match[patron.tablaIdx];
      var tabla = await this._detectarTabla(nombreTabla);
      if (!tabla || !db[tabla]) return null;
      var sample = await db[tabla].limit(1).toArray();
      if (!sample.length) return { respuesta: 'No hay datos en ' + tabla + '.', fuente: null };
      var campoNum = Object.keys(sample[0]).find(function(k) {
        return typeof sample[0][k] === 'number' && k !== 'id' && k !== '_id';
      });
      if (!campoNum) return null;
      var rows = await db[tabla].toArray();
      var valores = rows.map(function(r) { return parseFloat(r[campoNum]); }).filter(function(v) { return !isNaN(v); });
      if (!valores.length) return null;
      var media = valores.reduce(function(a, b) { return a + b; }, 0) / valores.length;
      return {
        respuesta: 'El promedio de **' + campoNum + '** en **' + tabla + '** es **' + media.toFixed(2) + '** (sobre ' + valores.length + ' registros).',
        fuente: 'tabla:' + tabla
      };
    },

    _execCompare: async function(patron) {
      return null;
    },

    _execRelation: async function(patron, pregunta) {
      return null;
    },

    _flexFallback: async function(pregunta) {
      if (!window.ia || !window.ia._flex) return null;
      var results = await window.ia.search(pregunta, { limit: 5 });
      if (!results || !results.length) return null;

      var resp = 'Encontre estos resultados relacionados:\n\n';
      var vistos = {};
      for (var i = 0; i < results.length; i++) {
        var r = results[i];
        var key = r.tabla + '-' + r.id;
        if (vistos[key]) continue;
        vistos[key] = true;
        resp += '- **' + (r.nombre || r.tabla) + '** (' + r.tabla + ')\n';
      }
      resp += '\nPuedes usar el buscador para ver detalles.';
      return { respuesta: resp, fuente: 'flexsearch', score: null };
    },

    searchHistory: async function(query, limit) {
      limit = limit || 10;
      if (!this._flexHistorial || !query) return [];

      if (!this._historyIndexed) {
        await this._indexHistory();
      }

      var results = this._flexHistorial.search(query, {
        limit: limit,
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
      return flat;
    },

    _indexHistory: async function() {
      var db = window.db || window.iaDB;
      if (!db || !db._ia_messages || this._historyIndexed) return;
      try {
        var msgs = await db._ia_messages.where('rol').equals('ia').toArray();
        for (var i = 0; i < msgs.length; i++) {
          if (this._flexHistorial) this._flexHistorial.add(msgs[i]);
        }
        this._historyIndexed = true;
      } catch(e) {
        console.warn('[ia-chat] Error indexando historial:', e);
      }
    },

    getRelevantHistory: async function(pregunta, limit) {
      limit = limit || 3;
      var results = await this.searchHistory(pregunta, limit);
      return results.map(function(r) {
        return { contenido: r.contenido, chatId: r.chatId };
      });
    }
  };

  window.ia.chat = Chat;
})();
