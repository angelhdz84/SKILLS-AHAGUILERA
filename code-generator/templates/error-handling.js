// error-handling.js — Gestor centralizado de errores con cola de 5 elementos
// window.mod_errorHandler expuesto globalmente

(function () {
  'use strict';

  if (typeof window.mod_errorHandler !== 'undefined') return;

  window.mod_errorHandler = function () {
    return {
      errors: [],
      add: function (error) {
        var id = Date.now();
        var self = this;
        this.errors.push({ id: id, message: error.message || String(error), time: new Date().toLocaleTimeString() });
        if (this.errors.length > 5) this.errors.shift();
        setTimeout(function () { self.remove(id); }, 8000);
      },
      remove: function (id) {
        this.errors = this.errors.filter(function (e) { return e.id !== id; });
      },
      wrap: function (fn) {
        var self = this;
        try {
          var result = fn();
          if (result && typeof result.then === 'function') {
            return result.then(function (val) { return val; }).catch(function (e) { self.add(e); return null; });
          }
          return result;
        } catch (e) {
          this.add(e);
          return null;
        }
      }
    };
  };
})();
