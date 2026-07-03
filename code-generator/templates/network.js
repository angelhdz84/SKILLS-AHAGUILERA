// network.js — Módulo de sincronización offline-first con cola de operaciones
// window.mod_network expuesto globalmente

(function () {
  'use strict';

  if (typeof window.mod_network !== 'undefined') return;

  window.mod_network = function () {
    return {
      online: navigator.onLine,
      syncQueue: [],
      syncing: false,
      init: function () {
        var self = this;
        window.addEventListener('online', function () { self.online = true; self.procesarCola(); });
        window.addEventListener('offline', function () { self.online = false; });
      },
      encolar: function (operacion) {
        this.syncQueue.push({ operacion: operacion, ts: Date.now() });
        var self = this;
        if (window.db && window.db.syncQueue) {
          window.db.syncQueue.add({ operacion: operacion, ts: Date.now(), sincronizado: false }).catch(function () {});
        }
      },
      procesarCola: function () {
        var self = this;
        if (this.syncing || !this.online) return;
        this.syncing = true;
        try {
          if (!window.db || !window.db.syncQueue) { this.syncing = false; return; }
          window.db.syncQueue.where('sincronizado').equals(false).toArray().then(function (pendientes) {
            var ps = [];
            for (var i = 0; i < pendientes.length; i++) {
              (function (item) {
                ps.push(
                  window.db.syncQueue.update(item.id, { sincronizado: true }).catch(function () {})
                );
              })(pendientes[i]);
            }
            return Promise.all(ps).then(function () {
              self.syncQueue = [];
              if (window.UI && window.UI.toast) {
                window.UI.toast('Sincronizacion completada', 'success');
              }
              self.syncing = false;
            });
          }).catch(function () { self.syncing = false; });
        } catch (e) { self.syncing = false; }
      }
    };
  };
})();
