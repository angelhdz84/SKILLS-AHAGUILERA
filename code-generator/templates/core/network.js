// network.js — Monitoreo de conectividad offline-first
// window.network expuesto globalmente
// Alpine store instanciado en alpine:init para evitar $store undefined
// Evento: connection-change con detail.online
// Banner offline automatico via Alpine store
// Dependencias: Alpine.js

(function () {
  'use strict';

  if (typeof window.network !== 'undefined') return;

  window.network = {
    online: navigator.onLine,

    init: function () {
      var self = this;
      window.addEventListener('online', function () { self._setStatus(true); });
      window.addEventListener('offline', function () { self._setStatus(false); });

      if (typeof Alpine !== 'undefined' && Alpine.store && !Alpine.store('network')) {
        Alpine.store('network', { online: navigator.onLine, showBanner: false });
      }
      this._startPing();
    },

    _setStatus: function (status) {
      this.online = status;
      this._notify();
    },

    _notify: function () {
      var evt = new CustomEvent('connection-change', {
        detail: { online: this.online }
      });
      window.dispatchEvent(evt);
      this._setStore();
    },

    _setStore: function () {
      if (typeof Alpine !== 'undefined' && Alpine.store) {
        Alpine.store('network', { online: this.online, showBanner: !this.online });
      }
    },

    _startPing: function () {
      var self = this;
      setInterval(function () {
        var img = new Image();
        img.onload = function () { if (!self.online) self._setStatus(true); };
        img.onerror = function () { if (self.online) self._setStatus(false); };
        img.src = './favicon.ico?_t=' + Date.now();
      }, 30000);
    }
  };

  document.addEventListener('alpine:init', function () {
    Alpine.store('network', {
      online: navigator.onLine,
      showBanner: false
    });
  });

  window.network.init();
})();
