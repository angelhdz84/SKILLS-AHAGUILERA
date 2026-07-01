// focus-trap.js — Focus trapping para modales y diálogos
// window.FocusTrap expuesto globalmente
// Dependencias: ninguna

(function () {
  'use strict';

  if (typeof window.FocusTrap !== 'undefined') return;

  var activeTrap = null;
  var previousFocus = null;
  var trapHandler = null;

  // ─── Focusable elements helper ──────────────────────
  function getFocusableElements(parent) {
    var selectors = 'input:not([disabled]):not([tabindex="-1"]),' +
      'select:not([disabled]):not([tabindex="-1"]),' +
      'textarea:not([disabled]):not([tabindex="-1"]),' +
      'button:not([disabled]):not([tabindex="-1"]),' +
      'a[href]:not([tabindex="-1"]),' +
      '[tabindex]:not([tabindex="-1"]),' +
      'area[href]:not([tabindex="-1"])';
    var elements = parent.querySelectorAll(selectors);
    var result = [];
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      if (el.hasAttribute('inert') || el.hasAttribute('data-inert')) continue;
      if (el.tabIndex < 0) continue;
      result.push(el);
    }
    return result;
  }

  // ─── Trap focus ────────────────────────────────────
  function trapFocus(element) {
    if (activeTrap) releaseFocus();
    activeTrap = element;
    previousFocus = document.activeElement;

    var focusable = getFocusableElements(element);
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    trapHandler = function (e) {
      if (e.key !== 'Tab') return;
      var els = getFocusableElements(activeTrap);
      if (els.length === 0) {
        e.preventDefault();
        return;
      }
      var first = els[0];
      var last = els[els.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', trapHandler);
  }

  // ─── Release focus ──────────────────────────────────
  function releaseFocus() {
    if (trapHandler) {
      document.removeEventListener('keydown', trapHandler);
      trapHandler = null;
    }
    if (previousFocus && previousFocus.focus && document.body.contains(previousFocus)) {
      try { previousFocus.focus(); } catch (e) {}
    }
    previousFocus = null;
    activeTrap = null;
  }

  // ─── Export ─────────────────────────────────────────
  window.FocusTrap = {
    trap: trapFocus,
    release: releaseFocus,
    getFocusable: getFocusableElements
  };
})();
