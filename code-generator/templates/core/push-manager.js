// push-manager.js — Push notifications + Background Sync
// window.PushManager expuesto globalmente
// Dependencias: Service Worker registrado (sw.js)

(function () {
  'use strict';

  if (typeof window.PushManager !== 'undefined') return;

  function getSW() {
    return navigator.serviceWorker.ready;
  }

  function requestPermission() {
    return new Promise(function (resolve) {
      if (!('Notification' in window)) {
        resolve('denied');
        return;
      }
      if (Notification.permission === 'granted') {
        resolve('granted');
        return;
      }
      if (Notification.permission === 'denied') {
        resolve('denied');
        return;
      }
      Notification.requestPermission().then(function (result) {
        resolve(result);
      });
    });
  }

  function notify(title, options) {
    options = options || {};
    return requestPermission().then(function (permission) {
      if (permission !== 'granted') {
        return Promise.reject(new Error('Notification permission not granted'));
      }
      return getSW().then(function (reg) {
        return reg.showNotification(title, {
          body: options.body || '',
          icon: options.icon || '',
          badge: options.badge || '',
          tag: options.tag || '',
          data: options.data || {},
          actions: options.actions || [],
          vibrate: options.vibrate || []
        });
      });
    });
  }

  function registerSync(tag) {
    return getSW().then(function (reg) {
      if ('sync' in reg) {
        return reg.sync.register(tag);
      }
      return Promise.reject(new Error('Background Sync no soportado'));
    }).catch(function (err) {
      console.warn('[PushManager] Sync falló:', err.message);
      throw err;
    });
  }

  function isSubscribed() {
    return getSW().then(function (reg) {
      return reg.pushManager.getSubscription();
    }).then(function (sub) {
      return sub !== null;
    }).catch(function () {
      return false;
    });
  }

  window.PushManager = {
    requestPermission: requestPermission,
    notify: notify,
    registerSync: registerSync,
    getSW: getSW,
    isSubscribed: isSubscribed
  };
})();
