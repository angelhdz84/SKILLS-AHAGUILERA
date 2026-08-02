// tools/_registry.js — IA Jutia Tool Registry v1.0
// Registro central de herramientas IA. Cada tool se auto-registra.
// Expone: window.IA_TOOLS
// module.js carga dinamicamente los tools desde modules/ia-jutia/tools/*.js

;(function() {
  'use strict';

  var Registry = {
    _tools: {},

    register: function(nombre, tool) {
      if (!nombre || !tool) return;
      this._tools[nombre] = tool;
      // Actualizar store Alpine si existe
      if (typeof Alpine !== 'undefined') {
        var store = Alpine.store('ia');
        if (store) {
          store.tools = this.list();
        }
      }
      console.log('[ia-tools] Registrada: ' + nombre);
    },

    get: function(nombre) {
      return this._tools[nombre] || null;
    },

    list: function() {
      var result = [];
      for (var name in this._tools) {
        if (this._tools.hasOwnProperty(name)) {
          var t = this._tools[name];
          result.push({
            nombre: t.nombre || name,
            estado: t.estado || 'disponible',
            descripcion: t.descripcion || ''
          });
        }
      }
      return result;
    },

    ejecutar: function(nombre, contexto) {
      var tool = this._tools[nombre];
      if (!tool) return Promise.reject(new Error('Tool no encontrado: ' + nombre));
      if (typeof tool.ejecutar !== 'function') return Promise.reject(new Error('Tool ' + nombre + ' no implementa ejecutar()'));
      return tool.ejecutar(contexto);
    },

    // Buscar tool que coincida con un texto de entrada
    detectar: function(texto) {
      for (var name in this._tools) {
        if (!this._tools.hasOwnProperty(name)) continue;
        var t = this._tools[name];
        if (t.patrones && Array.isArray(t.patrones)) {
          for (var i = 0; i < t.patrones.length; i++) {
            if (t.patrones[i].test(texto)) {
              return name;
            }
          }
        }
      }
      return null;
    },

    limpiar: function() {
      this._tools = {};
    }
  };

  window.IA_TOOLS = Registry;
  console.log('[ia-tools] Registry listo');
})();
