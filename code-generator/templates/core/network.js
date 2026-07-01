// network.js — Monitoreo de conectividad offline-first
// window.network expuesto globalmente
// Alpine store: $store.network.online
// Evento: connection-change con detail.online
// Banner offline automático via Alpine store
// Dependencias: Alpine.js

(function () {
  'use strict';

  if (typeof window.network !== 'undefined') return;

  window.network = {
    online: navigator.onLine,

    init() {
      window.addEventListener('online', () => this._setStatus(true));
      window.addEventListener('offline', () => this._setStatus(false));
      this._setStore();
    },

    _setStatus(status) {
      this.online = status;
      this._notify();
    },

    _notify() {
      const evt = new CustomEvent('connection-change', {
        detail: { online: this.online }
      });
      window.dispatchEvent(evt);
      this._setStore();
    },

    _setStore() {
      if (typeof Alpine !== 'undefined' && Alpine.store) {
        Alpine.store('network', { online: this.online });
      }
    }
  };

  document.addEventListener('alpine:init', () => {
    Alpine.store('network', {
      online: navigator.onLine,
      showBanner: false
    });
  });

  window.network.init();
})();
