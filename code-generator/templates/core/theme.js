// theme.js — Inyección de CSS variables desde APP_CONFIG.tema
// window.themeStore expuesto globalmente
// Dependencias: Alpine.js

(function () {
  'use strict';

  if (typeof window.themeStore !== 'undefined') return;

  var defaults = {
    modo: 'light',
    colores: {
      primary: '#1e3a5f',
      secondary: '#64748b',
      accent: '#0ea5e9',
      neutral: '#1c1917',
      'base-100': '#ffffff',
      'base-200': '#f1f5f9',
      'base-300': '#e2e8f0',
      info: '#3b82f6',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    tipografia: {
      familia: 'Inter, system-ui, sans-serif',
      escala: {
        h1: '2.25rem',
        h2: '1.5rem',
        h3: '1.25rem',
        base: '1rem',
        small: '0.875rem',
        xs: '0.75rem'
      }
    },
    radius: '1rem',
    sombra: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  function getConfig() {
    var tema = window.APP_CONFIG && window.APP_CONFIG.tema;
    if (!tema) return defaults;

    var merged = JSON.parse(JSON.stringify(defaults));
    if (tema.modo) merged.modo = tema.modo;
    if (tema.colores) {
      for (var key in tema.colores) {
        if (tema.colores.hasOwnProperty(key)) merged.colores[key] = tema.colores[key];
      }
    }
    if (tema.tipografia) {
      if (tema.tipografia.familia) merged.tipografia.familia = tema.tipografia.familia;
      if (tema.tipografia.escala) {
        for (var ek in tema.tipografia.escala) {
          if (tema.tipografia.escala.hasOwnProperty(ek)) merged.tipografia.escala[ek] = tema.tipografia.escala[ek];
        }
      }
    }
    if (tema.radius) merged.radius = tema.radius;
    if (tema.sombra) merged.sombra = tema.sombra;
    return merged;
  }

  function applyTheme() {
    var config = getConfig();
    var root = document.documentElement;
    var colores = config.colores;

    for (var key in colores) {
      if (colores.hasOwnProperty(key)) {
        root.style.setProperty('--p' + key.replace('base-', 'b'), colores[key]);
      }
    }
    root.style.setProperty('--font-family', config.tipografia.familia);
    root.style.setProperty('--radius-box', config.radius);
    root.style.setProperty('--shadow-card', config.sombra);

    if (config.modo === 'dark') {
      root.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  }

  // ─── Export ───────────────────────────────────────────
  window.themeStore = {
    config: getConfig(),
    apply: applyTheme,
    toggle: function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      if (window.APP_CONFIG && window.APP_CONFIG.tema) {
        window.APP_CONFIG.tema.modo = next;
      }
      if (typeof Alpine !== 'undefined' && Alpine.store) {
        Alpine.store('theme', { modo: next });
      }
    }
  };

  // ─── Alpine store ─────────────────────────────────────
  document.addEventListener('alpine:init', function () {
    if (typeof Alpine !== 'undefined' && Alpine.store) {
      var cfg = getConfig();
      Alpine.store('theme', {
        modo: cfg.modo,
        toggle: window.themeStore.toggle
      });
    }
  });

  // ─── Aplicar al cargar ────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTheme);
  } else {
    applyTheme();
  }

  console.log('[theme] Inicializado');
})();
