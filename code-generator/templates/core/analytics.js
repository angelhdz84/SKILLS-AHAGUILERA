// analytics.js — Telemetría offline-first
// window.Analytics expuesto globalmente
// Auto-track: hashchange + clicks en [data-track]
// Dependencias: Dexie.js (opcional), APP_CONFIG (opcional)

(function () {
  'use strict';

  if (typeof window.Analytics !== 'undefined') return;

  var endpoint = null;
  var queueKey = '_analytics_queue';

  function getEndpoint() {
    if (endpoint) return endpoint;
    endpoint = (window.APP_CONFIG && window.APP_CONFIG.analytics && window.APP_CONFIG.analytics.endpoint) || window.ANALYTICS_ENDPOINT || null;
    return endpoint;
  }

  function getDb() {
    return window.db || null;
  }

  function saveToLocal(entry) {
    var queue;
    try {
      queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
    } catch (e) {
      queue = [];
    }
    queue.push(entry);
    if (queue.length > 500) queue.splice(0, queue.length - 500);
    try {
      localStorage.setItem(queueKey, JSON.stringify(queue));
    } catch (e) {
      // localStorage lleno, ignorar
    }
  }

  function saveEvent(entry) {
    var db = getDb();
    if (db && db._analytics) {
      db._analytics.add(entry).catch(function () {
        saveToLocal(entry);
      });
    } else {
      saveToLocal(entry);
    }
  }

  function drainLocalToDb() {
    var db = getDb();
    if (!db || !db._analytics) return;
    var queue;
    try {
      queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
    } catch (e) {
      return;
    }
    if (!queue.length) return;
    localStorage.removeItem(queueKey);
    db._analytics.bulkAdd(queue).catch(function () {
      // Si falla, re-grabar en localStorage
      saveToLocal.apply(null, queue);
    });
  }

  function getPageFromHash() {
    var hash = window.location.hash || '#/';
    var match = hash.match(/^#\/([^?]+)/);
    return match ? match[1] : 'home';
  }

  // ─── API pública ─────────────────────────────────────

  function trackPageView(page) {
    page = page || getPageFromHash();
    var entry = {
      page: page,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || '',
      online: navigator.onLine,
      synced: 0,
      createdAt: new Date().toISOString()
    };
    saveEvent(entry);
  }

  function trackEvent(category, action, label, value) {
    var entry = {
      category: category,
      action: action,
      label: label || '',
      value: typeof value === 'number' ? value : null,
      timestamp: Date.now(),
      synced: 0,
      createdAt: new Date().toISOString()
    };
    saveEvent(entry);
  }

  function syncAnalytics() {
    var db = getDb();
    if (!db || !db._analytics) return;
    var ep = getEndpoint();
    db._analytics.where('synced').equals(0).toArray().then(function (events) {
      if (!events.length) return;
      if (!ep) {
        // Sin endpoint configurado, marcar como synced (simulado)
        return db._analytics.bulkUpdate(events.map(function (e) {
          return { key: e.id, changes: { synced: 1 } };
        })).catch(function () {});
      }
      // Enviar al endpoint
      fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: events })
      }).then(function (res) {
        if (res.ok) {
          return db._analytics.bulkUpdate(events.map(function (e) {
            return { key: e.id, changes: { synced: 1 } };
          })).catch(function () {});
        }
      }).catch(function () {
        // Error de red, reintentar después
      });
    }).catch(function () {});
  }

  function cleanAnalytics(days) {
    days = days || 90;
    var cutoff = Date.now() - days * 86400000;
    var db = getDb();
    if (db && db._analytics) {
      db._analytics.where('timestamp').below(cutoff).delete().catch(function () {});
    }
    // Limpiar localStorage queue también
    try {
      var queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
      queue = queue.filter(function (e) { return e.timestamp >= cutoff; });
      localStorage.setItem(queueKey, JSON.stringify(queue));
    } catch (e) {}
  }

  // ─── Auto-track ─────────────────────────────────────

  function setupAutoTrack() {
    // Page views via hashchange
    window.addEventListener('hashchange', function () {
      trackPageView();
    });

    // Track clicks en [data-track]
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (!el) return;
      var data = el.getAttribute('data-track') || '';
      var parts = data.split(',');
      var category = parts[0] || 'ui';
      var action = parts[1] || 'click';
      var label = el.getAttribute('data-track-label') || parts[2] || '';
      var value = parseFloat(el.getAttribute('data-track-value') || parts[3]) || null;
      trackEvent(category, action, label, value);
    }, { passive: true });
  }

  // ─── Init ────────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    drainLocalToDb();
    setupAutoTrack();
    // Auto-clean cada 24h
    setInterval(function () { cleanAnalytics(90); }, 86400000);
  });

  // ─── Export ───────────────────────────────────────────
  window.Analytics = {
    trackPageView: trackPageView,
    trackEvent: trackEvent,
    syncAnalytics: syncAnalytics,
    cleanAnalytics: cleanAnalytics
  };

  console.log('[analytics] Listo');
})();
