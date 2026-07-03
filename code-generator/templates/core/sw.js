// sw.js — Offline-first Service Worker
// Estrategias: Cache-First (assets), Network-First (API), Stale-While-Revalidate (CDN)
// Versión de caché controlada por DB_VERSION para invalidación en upgrades

// DB_VERSION se extrae del query param ?v= al registrar (app.js pasa window.DB_VERSION)
var CACHE_PREFIX = 'v1';
var DB_VERSION = new URL(self.location.href).searchParams.get('v') || 1;
var CACHE = CACHE_PREFIX + '-' + DB_VERSION;

// NOTA: apps específicas deben extender PRECACHE_URLS con sus módulos, CSS y data
// TODO: REEMPLAZAR con PRECACHE_URLS dinámicos generados por code-generator Fase 2 listando
//       todos los módulos en modules/<modulo>/ para evitar precache manual en cada template
var PRECACHE_URLS = [
  './',
  'index.html',
  'core/env.js',
  'core/db.js',
  'core/crypto.js',
  'core/ui.js',
  'core/theme.js',
  'core/app.js',
  'core/search-palette.js',
  'core/file-store.js',
  'core/sync.js',
  'core/license.js',
  'core/network.js',
  'core/brand-loader.js',
  'core/feature-flags.js',
  'main.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) {
          return k.startsWith(CACHE_PREFIX + '-') && k !== CACHE;
        }).map(function (k) {
          return caches.delete(k);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  var url = req.url;

  // Network-First para requests de API
  if (url.indexOf('/api/') !== -1) {
    e.respondWith(
      fetch(req).catch(function () {
        return caches.match(req);
      })
    );
    return;
  }

  // Stale-While-Revalidate para Google Fonts y CDNs externos
  if (url.indexOf('fonts.googleapis.com') !== -1 ||
      url.indexOf('fonts.gstatic.com') !== -1 ||
      url.indexOf('cdnjs.cloudflare.com') !== -1 ||
      url.indexOf('cdn.jsdelivr.net') !== -1 ||
      url.indexOf('unpkg.com') !== -1) {
    e.respondWith(
      caches.open(CACHE).then(function (cache) {
        return cache.match(req).then(function (cached) {
          var fetchPromise = fetch(req).then(function (response) {
            if (response && response.ok) {
              cache.put(req, response.clone());
            }
            return response;
          }).catch(function () {
            return cached;
          });
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // Cache-First para assets estáticos (JS, CSS, HTML, imágenes, fuentes)
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (response) {
        if (response && response.ok && req.method === 'GET') {
          var clone = response.clone();
          caches.open(CACHE).then(function (cache) {
            cache.put(req, clone);
          });
        }
        return response;
      });
    })
  );
});

// Push event — mostrar notificación desde el servidor o demonio
self.addEventListener('push', function (e) {
  var data = {};
  try {
    if (e.data) {
      try {
        data = e.data.json();
      } catch (_) {
        data = { title: e.data.text(), body: '' };
      }
    }
  } catch (_) {
    data = { title: 'Nueva notificación', body: '' };
  }
  var options = {
    body: data.body || '',
    icon: data.icon || '',
    badge: data.badge || '',
    tag: data.tag || 'push-default',
    data: data.data || {},
    vibrate: data.vibrate || [200, 100, 200]
  };
  e.waitUntil(
    self.registration.showNotification(data.title || 'Ateje', options)
  );
});

// Notification click — abrir URL o enfocar ventana existente
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = e.notification.data && e.notification.data.url;
  if (url) {
    e.waitUntil(
      clients.matchAll({ type: 'window' }).then(function (list) {
        for (var i = 0; i < list.length; i++) {
          if (list[i].url === url && 'focus' in list[i]) {
            return list[i].focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

// Sync event — enviar datos pendientes desde IndexedDB
self.addEventListener('sync', function (e) {
  if (e.tag === 'sync-pending') {
    e.waitUntil(new Promise(function (resolve) {
      try {
        console.log('[SW] Sync iniciado:', e.tag);
        if (typeof self.indexedDB === 'undefined') {
          console.log('[SW] No IndexedDB disponible');
          resolve();
          return;
        }
        var req = self.indexedDB.open('SyncQueue', 1);
        req.onupgradeneeded = function () {
          var db = req.result;
          if (!db.objectStoreNames.contains('queue')) {
            db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
          }
        };
        req.onsuccess = function () {
          var db = req.result;
          var tx = db.transaction('queue', 'readonly');
          var store = tx.objectStore('queue');
          var getAll = store.getAll();
          getAll.onsuccess = function () {
            var items = getAll.result || [];
            if (!items.length) {
              console.log('[SW] Sin pendientes');
              resolve();
              return;
            }
            Promise.all(items.map(function (item) {
              return fetch(item.url, {
                method: item.method || 'POST',
                headers: item.headers || { 'Content-Type': 'application/json' },
                body: item.body || null
              }).then(function (res) {
                if (res.ok) {
                  var dt = db.transaction('queue', 'readwrite');
                  dt.objectStore('queue').delete(item.id);
                }
                return res;
              }).catch(function (err) {
                console.warn('[SW] Error sync fetch:', item.url, err.message);
              });
            })).then(function () {
              console.log('[SW] Sync completado:', items.length, 'items');
              resolve();
            });
          };
          getAll.onerror = function () { resolve(); };
        };
        req.onerror = function () { resolve(); };
      } catch (err) {
        console.warn('[SW] Error sync:', err.message);
        resolve();
      }
    }));
  }
});
