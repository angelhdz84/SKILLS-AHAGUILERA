// bottom-nav.js — Bottom navigation component (DaisyUI btm-nav)
// window.BottomNav expuesto globalmente
// Evento: bottomnav:navigate con { id }
// Dependencias: ninguna (Bootstrap Icons para íconos)
// Opcional: window.Responsive para breakpoint detection

(function () {
  'use strict';

  if (typeof window.BottomNav !== 'undefined') return;

  var _navEl = null;
  var _items = [];
  var _activeId = null;
  var _clickHandlers = [];

  // ─── Create ─────────────────────────────────────────
  function createBottomNav(items) {
    if (_navEl) destroyBottomNav();
    _items = items || [];

    _navEl = document.createElement('nav');
    _navEl.id = 'bottom-nav';
    _navEl.setAttribute('aria-label', 'Navegación principal');
    _navEl.className = 'btm-nav btm-nav-xs flex fixed bottom-0 left-0 right-0 z-50 lg:relative lg:btm-nav-lg lg:btm-nav-md';

    renderItems();

    document.body.appendChild(_navEl);

    if (window.Responsive && window.Responsive.onBreakpoint) {
      window.Responsive.onBreakpoint('lg', function () {
        if (_navEl) _navEl.classList.remove('btm-nav-xs');
      }, function () {
        if (_navEl) _navEl.classList.add('btm-nav-xs');
      });
    }

    return _navEl;
  }

  function renderItems() {
    if (!_navEl) return;
    _navEl.innerHTML = '';
    _clickHandlers = [];

    for (var i = 0; i < _items.length; i++) {
      var item = _items[i];
      var btn = document.createElement('button');
      btn.className = (item.id === _activeId) ? 'active' : '';

      var icon = document.createElement('i');
      icon.className = 'bi ' + (item.icon || 'bi-circle');
      btn.appendChild(icon);

      var label = document.createElement('span');
      label.className = 'btm-nav-label';
      label.textContent = item.label || '';
      btn.appendChild(label);

      btn.setAttribute('aria-label', item.label || ('Navegar a ' + item.id));
      btn.setAttribute('data-nav-id', item.id);

      (function (id) {
        var handler = function () {
          setActive(id);
          var evt = new CustomEvent('bottomnav:navigate', {
            detail: { id: id },
            bubbles: true
          });
          _navEl.dispatchEvent(evt);
        };
        btn.addEventListener('click', handler);
        _clickHandlers.push({ el: btn, handler: handler, id: id });
      })(item.id);

      _navEl.appendChild(btn);
    }
  }

  // ─── Set active ─────────────────────────────────────
  function setActive(id) {
    _activeId = id;
    if (!_navEl) return;
    var buttons = _navEl.querySelectorAll('button');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      var navId = btn.getAttribute('data-nav-id');
      if (navId === id) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  }

  // ─── Destroy ────────────────────────────────────────
  function destroyBottomNav() {
    if (_navEl && _navEl.parentNode) {
      _navEl.parentNode.removeChild(_navEl);
    }
    for (var i = 0; i < _clickHandlers.length; i++) {
      var entry = _clickHandlers[i];
      entry.el.removeEventListener('click', entry.handler);
    }
    _clickHandlers = [];
    _items = [];
    _activeId = null;
    _navEl = null;
  }

  // ─── Export ─────────────────────────────────────────
  window.BottomNav = {
    create: createBottomNav,
    destroy: destroyBottomNav,
    setActive: setActive
  };
})();
