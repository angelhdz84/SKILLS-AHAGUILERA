// a11y.js — Accesibilidad global: skip-link, roles dinámicos, focus ring, ARIA live
// window.A11y expuesto globalmente
// Dependencias: ninguna

(function () {
  'use strict';

  if (typeof window.A11y !== 'undefined') return;

  // ─── Skip to content ────────────────────────────────
  function createSkipLink() {
    if (document.getElementById('skip-link')) return;
    var link = document.createElement('a');
    link.id = 'skip-link';
    link.href = '#app-content';
    link.className = 'skip-link sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-content focus:rounded-btn focus:shadow-lg';
    link.textContent = 'Saltar al contenido';
    document.body.insertBefore(link, document.body.firstChild);
  }

  // ─── Roles dinámicos (MutationObserver) ─────────────
  var _roleObserver = null;

  function applyRole(el) {
    var role = el.getAttribute('data-role');
    if (!role) return;
    switch (role) {
      case 'dialog':
        el.setAttribute('role', 'dialog');
        el.setAttribute('aria-modal', 'true');
        break;
      case 'alert':
        el.setAttribute('role', 'alert');
        break;
      case 'region':
        el.setAttribute('role', 'region');
        var label = el.getAttribute('data-label');
        if (label) el.setAttribute('aria-label', label);
        break;
    }
  }

  function initRoles() {
    if (_roleObserver) _roleObserver.disconnect();
    _roleObserver = new MutationObserver(function (mutations) {
      for (var m = 0; m < mutations.length; m++) {
        var mutation = mutations[m];
        if (mutation.type === 'childList') {
          for (var n = 0; n < mutation.addedNodes.length; n++) {
            var node = mutation.addedNodes[n];
            if (node.nodeType === 1) {
              applyRole(node);
              if (node.querySelectorAll) {
                var sub = node.querySelectorAll('[data-role]');
                for (var s = 0; s < sub.length; s++) applyRole(sub[s]);
              }
            }
          }
        }
      }
    });
    _roleObserver.observe(document.body, { childList: true, subtree: true });
    var existing = document.querySelectorAll('[data-role]');
    for (var i = 0; i < existing.length; i++) applyRole(existing[i]);
  }

  // ─── Focus ring visible (CSS global) ────────────────
  function injectFocusRing() {
    if (document.getElementById('a11y-focus-ring')) return;
    var style = document.createElement('style');
    style.id = 'a11y-focus-ring';
    style.textContent =
      ':focus-visible { outline: 2px solid var(--p); outline-offset: 2px; }' +
      ':focus:not(:focus-visible) { outline: none; }' +
      '.focus-ring:focus { outline: 2px solid var(--p); outline-offset: 2px; }';
    document.head.appendChild(style);
  }

  // ─── ARIA live regions ──────────────────────────────
  function getLiveRegion() {
    var region = document.getElementById('a11y-live-region');
    if (!region) {
      region = document.createElement('div');
      region.id = 'a11y-live-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      region.className = 'sr-only';
      document.body.appendChild(region);
    }
    return region;
  }

  function announce(msg, priority) {
    priority = (priority === 'assertive') ? 'assertive' : 'polite';
    var region = getLiveRegion();
    region.setAttribute('aria-live', priority);
    region.textContent = '';
    setTimeout(function () {
      region.textContent = msg;
    }, 50);
  }

  // ─── Init ───────────────────────────────────────────
  function init() {
    createSkipLink();
    injectFocusRing();
    initRoles();
  }

  document.addEventListener('DOMContentLoaded', init);

  window.A11y = {
    skipLink: createSkipLink,
    initRoles: initRoles,
    announce: announce,
    observe: initRoles
  };
})();
