// create.js — Módulo de creación de registros con cifrado y notificación
// window.mod_create expuesto globalmente

(function () {
  'use strict';

  if (typeof window.mod_create !== 'undefined') return;

  window.mod_create = function (storeName, encryptFields) {
    encryptFields = encryptFields || [];
    return {
      form: {},
      saving: false,
      error: null,
      guardar: function () {
        var self = this;
        this.saving = true;
        this.error = null;
        var data = {};
        for (var k in this.form) {
          if (this.form.hasOwnProperty(k)) data[k] = this.form[k];
        }
        data.id = window.uuid ? window.uuid() : crypto.randomUUID();
        data.createdAt = new Date().toISOString();
        var ps = [];
        for (var i = 0; i < encryptFields.length; i++) {
          var field = encryptFields[i];
          if (data[field] && window.cryptoHelpers && window.cryptoHelpers.encrypt) {
            try {
              data[field] = window.cryptoHelpers.encrypt(data[field]);
              ps.push(Promise.resolve());
            } catch (e) { ps.push(Promise.resolve()); }
          }
        }
        Promise.all(ps).then(function () {
          if (!window.db || !window.db[storeName]) {
            self.error = 'Store no disponible: ' + storeName;
            self.saving = false;
            if (window.UI && window.UI.toast) window.UI.toast(self.error, 'error');
            return;
          }
          window.db[storeName].add(data).then(function () {
            self.form = {};
            self.saving = false;
            if (window.UI && window.UI.toast) window.UI.toast('Guardado correctamente', 'success');
          }).catch(function (e) {
            self.error = e.message || 'Error al guardar';
            self.saving = false;
            if (window.UI && window.UI.toast) window.UI.toast(self.error, 'error');
          });
        }).catch(function () {
          self.saving = false;
        });
      }
    };
  };
})();
