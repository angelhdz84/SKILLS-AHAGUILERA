// responsive.js — Responsive utilities: breakpoints, resize, container queries
// window.Responsive expuesto globalmente
// Alpine store: $store.ui.breakpoint (actualizado automáticamente)
// Dependencias: Alpine.js (para store sync, opcional)

(function () {
  'use strict';

  if (typeof window.Responsive !== 'undefined') return;

  var BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536
  };

  var _listeners = [];
  var _currentBreakpoint = null;

  function getMediaQuery(name) {
    var px = BREAKPOINTS[name];
    if (!px) return null;
    var next = null;
    var keys = Object.keys(BREAKPOINTS);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === name) {
        next = keys[i + 1] ? BREAKPOINTS[keys[i + 1]] : null;
        break;
      }
    }
    if (next) {
      return '(min-width: ' + px + 'px) and (max-width: ' + (next - 1) + 'px)';
    }
    return '(min-width: ' + px + 'px)';
  }

  function onBreakpoint(name, enterFn, exitFn) {
    var mq = getMediaQuery(name);
    if (!mq) {
      console.warn('[Responsive] Breakpoint not found:', name);
      return function () {};
    }

    var mql = window.matchMedia(mq);
    var handler = function (e) {
      if (e.matches) {
        if (typeof enterFn === 'function') enterFn();
      } else {
        if (typeof exitFn === 'function') exitFn();
      }
    };

    if (mql.matches && typeof enterFn === 'function') enterFn();
    mql.addEventListener('change', handler);

    var entry = { mql: mql, handler: handler, name: name };
    _listeners.push(entry);

    return function cleanup() {
      mql.removeEventListener('change', handler);
      for (var i = 0; i < _listeners.length; i++) {
        if (_listeners[i].mql === mql && _listeners[i].handler === handler) {
          _listeners.splice(i, 1);
          break;
        }
      }
    };
  }

  function currentBreakpoint() {
    if (_currentBreakpoint) return _currentBreakpoint;
    var keys = Object.keys(BREAKPOINTS);
    for (var i = keys.length - 1; i >= 0; i--) {
      var mq = getMediaQuery(keys[i]);
      if (mq && window.matchMedia(mq).matches) {
        _currentBreakpoint = keys[i];
        return _currentBreakpoint;
      }
    }
    return 'sm';
  }

  function onResize(fn, delay) {
    delay = delay || 150;
    var timer = null;

    function handler() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        fn();
        timer = null;
      }, delay);
    }

    window.addEventListener('resize', handler);
    return function cleanup() {
      if (timer) clearTimeout(timer);
      window.removeEventListener('resize', handler);
    };
  }

  function onContainerResize(el, fn) {
    if (!el || typeof ResizeObserver === 'undefined') {
      return function () {};
    }

    var ro = new ResizeObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        fn(entries[i].contentRect);
      }
    });

    ro.observe(el);
    return function cleanup() {
      ro.disconnect();
    };
  }

  // ─── Alpine store sync ──────────────────────────────
  function syncAlpineStore() {
    if (typeof Alpine === 'undefined' || !Alpine.store) return;
    if (!Alpine.store('ui')) {
      Alpine.store('ui', { breakpoint: currentBreakpoint() });
    } else {
      Alpine.store('ui').breakpoint = currentBreakpoint();
    }
  }

  // ─── CSS base: touch-action ─────────────────────────
  function injectBaseCSS() {
    if (document.getElementById('responsive-base-css')) return;
    var style = document.createElement('style');
    style.id = 'responsive-base-css';
    style.textContent =
      '* { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }';
    document.head.appendChild(style);
  }

  // ─── Breakpoint auto-track ──────────────────────────
  function initBreakpointTracker() {
    var keys = Object.keys(BREAKPOINTS);
    for (var i = 0; i < keys.length; i++) {
      (function (bp) {
        onBreakpoint(bp, function () {
          _currentBreakpoint = bp;
          syncAlpineStore();
        }, function () {
          _currentBreakpoint = currentBreakpoint();
          syncAlpineStore();
        });
      })(keys[i]);
    }
  }

  // ─── Init ───────────────────────────────────────────
  function init() {
    injectBaseCSS();
    initBreakpointTracker();
    _currentBreakpoint = currentBreakpoint();
  }

  document.addEventListener('alpine:init', function () {
    if (typeof Alpine !== 'undefined' && Alpine.store) {
      if (!Alpine.store('ui')) {
        Alpine.store('ui', { breakpoint: currentBreakpoint() });
      } else {
        Alpine.store('ui').breakpoint = currentBreakpoint();
      }
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Responsive = {
    onBreakpoint: onBreakpoint,
    currentBreakpoint: currentBreakpoint,
    onResize: onResize,
    onContainerResize: onContainerResize,
    BREAKPOINTS: BREAKPOINTS
  };
})();
