// core/ia-chat.js — IA Jutia Chat v0.3 (Full)
// Extiende Lite: fusión de consultas BD + QA sobre documentos
// Dependencias: core/ia.js (window.ia), core/ia-ingest.js (window.iaIngest)
// Expone: window.ia.chat (hereda Lite + askFull)
// Se carga DESPUES de core/ia.js y core/ia-ingest.js

;(function() {
  'use strict';

  if (typeof window.ia === 'undefined') {
    console.warn('[ia-chat] window.ia no disponible');
    return;
  }

  // Si el motor Lite ya se cargo, lo extendemos.
  // Si no, el Lite loader ya intento cargar el suyo.
  // Full siempre sobreescribe ask() con su version que consulta BD + docs.

  const _origAsk = window.ia.chat?.ask;

  const FullChat = {
    // — Consulta combinada BD + Documentos —
    async askFull(chatId, pregunta) {
      if (!pregunta) return { respuesta: 'Escribe una pregunta.', fuentes: [] };

      const resultado = {
        bd: null,
        docs: null
      };

      // 1. Consultar BD (patrones + FlexSearch)
      if (window.ia.chat && window.ia.chat.ask) {
        try {
          resultado.bd = await window.ia.chat.ask(chatId, pregunta);
        } catch(e) {
          console.warn('[ia-chat] Error en consulta BD:', e);
        }
      }

      // 2. Consultar documentos via QA
      if (window.ia && typeof window.ia.qa === 'function') {
        try {
          const qaResult = await window.ia.qa(pregunta);
          if (qaResult && qaResult.respuesta) {
            resultado.docs = qaResult;
          }
        } catch(e) {
          console.warn('[ia-chat] Error en QA docs:', e);
        }
      }

      // 3. Fusionar respuesta
      return this._fusionar(resultado, pregunta);
    },

    _fusionar(resultado, pregunta) {
      const tieneBD = resultado.bd && resultado.bd.respuesta && resultado.bd.fuente;
      const tieneDocs = resultado.docs && resultado.docs.respuesta;
      const bdFuente = resultado.bd?.fuente || null;
      const docsFuente = resultado.docs?.fuente || null;

      // Ambos tienen respuesta
      if (tieneBD && tieneDocs) {
        return {
          respuesta: 'Te encontre informacion de dos fuentes:\n\n' +
            '📊 **Desde la base de datos:**\n' + resultado.bd.respuesta + '\n\n' +
            '📄 **Desde documentos:**\n' + resultado.docs.respuesta,
          fuentes: [
            { tipo: 'bd', texto: bdFuente || resultado.bd.respuesta.slice(0, 80) },
            { tipo: 'doc', texto: docsFuente || resultado.docs.fuente || 'Documento relacionado' }
          ],
          score: resultado.docs.score || null
        };
      }

      // Solo BD
      if (tieneBD) {
        return {
          respuesta: '📊 **Desde la base de datos:**\n' + resultado.bd.respuesta,
          fuentes: [{ tipo: 'bd', texto: bdFuente }],
          score: null
        };
      }

      // Solo Docs
      if (tieneDocs) {
        return {
          respuesta: '📄 **Desde documentos:**\n' + resultado.docs.respuesta,
          fuentes: [{ tipo: 'doc', texto: docsFuente || resultado.docs.fuente }],
          score: resultado.docs.score
        };
      }

      // Ninguno
      return {
        respuesta: 'No encontre informacion en la base de datos ni en los documentos.\n\n' +
          'Prueba con:\n' +
          '- Preguntas sobre datos: "¿Cuantos clientes hay?"\n' +
          '- Preguntas sobre documentos: "¿Que dice el contrato?"',
        fuentes: []
      };
    },

    // — Historial con contexto de BD+Docs (Nivel 2) —
    async searchHistoryFull(query, limit) {
      limit = limit || 10;
      const results = [];
      if (window.ia.chat && window.ia.chat.searchHistory) {
        const hist = await window.ia.chat.searchHistory(query, limit);
        results.push(...hist);
      }
      return results;
    }
  };

  // Extender window.ia.chat con metodos Full
  if (window.ia.chat) {
    Object.assign(window.ia.chat, FullChat);
  } else {
    window.ia.chat = FullChat;
  }

  console.log('[ia-chat] v0.3 Full: consultas BD + documentos activas');
})();
