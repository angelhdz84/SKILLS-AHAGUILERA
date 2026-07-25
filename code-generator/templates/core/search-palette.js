// search-palette.js — Command Palette (Cmd+K) con registro de comandos
// Paleta de búsqueda tipo VS Code con atajos de teclado y navegación
// Alpine store: $store.palette
// API: window.SEARCH_PALETTE.register(id, label, icon, action)
// Dependencias: Alpine.js, DaisyUI, Bootstrap Icons

(function () {
  'use strict';

  if (typeof window.SEARCH_PALETTE !== 'undefined') return;

  // ─── Estado interno ──────────────────────────────────
  var _commands = [];
  var _isOpen = false;
  var _selectedIndex = 0;
  var _paletteEl = null;
  var _overlayEl = null;

  // ─── Alpine store ───────────────────────────────────
  document.addEventListener('alpine:init', function () {
    if (typeof Alpine !== 'undefined' && Alpine.store && !Alpine.store('palette')) {
      Alpine.store('palette', {
        open: false,
        query: '',
        results: [],
        commands: [],
        selectedIndex: 0
      });
    }
  });

  // ─── Actualizar store ───────────────────────────────
  function _updateStore() {
    if (typeof Alpine === 'undefined' || !Alpine.store) return;
    var query = Alpine.store('palette') ? Alpine.store('palette').query || '' : '';
    var results = _filterCommands(query);
    Alpine.store('palette', {
      open: _isOpen,
      query: query,
      results: results,
      commands: _commands,
      selectedIndex: _selectedIndex
    });
  }

  // ─── Filtrar comandos ───────────────────────────────
  function _filterCommands(query) {
    var q = (query || '').toLowerCase().trim();
    if (!q) {
      return _commands.slice(0, 10);
    }
    var out = [];
    for (var i = 0; i < _commands.length; i++) {
      var c = _commands[i];
      if (
        c.id.toLowerCase().indexOf(q) !== -1 ||
        c.label.toLowerCase().indexOf(q) !== -1
      ) {
        out.push(c);
      }
    }
    return out;
  }

  // ─── Abrir / Cerrar / Alternar ──────────────────────
  function _open() {
    _isOpen = true;
    _selectedIndex = 0;
    _updateStore();
    _focusInput();
  }

  function _close() {
    _isOpen = false;
    _selectedIndex = 0;
    _updateStore();
  }

  function _toggle() {
    if (_isOpen) {
      _close();
    } else {
      _open();
    }
  }

  // ─── Foco en input ──────────────────────────────────
  function _focusInput() {
    if (typeof Alpine !== 'undefined' && Alpine.nextTick) {
      Alpine.nextTick(function () {
        var input = document.getElementById('sp-input');
        if (input) input.focus();
      });
    }
  }

  // ─── Ejecutar comando seleccionado ──────────────────
  function _executeSelected() {
    var results = _filterCommands(
      Alpine.store('palette') ? Alpine.store('palette').query || '' : ''
    );
    if (_selectedIndex >= 0 && _selectedIndex < results.length) {
      var cmd = results[_selectedIndex];
      _close();
      try {
        cmd.action();
      } catch (e) {
        console.error('[palette] Error ejecutando comando:', e);
      }
    }
  }

  // ─── Manejador de teclado global ────────────────────
  function _onKeydown(e) {
    // Cmd+K / Ctrl+K — abrir/cerrar paleta
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      e.stopPropagation();
      _toggle();
      return;
    }

    // Solo procesar si está abierta
    if (!_isOpen) return;

    var results = _filterCommands(
      Alpine.store('palette') ? Alpine.store('palette').query || '' : ''
    );

    if (e.key === 'Escape') {
      e.preventDefault();
      _close();
      return;
    }

    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _selectedIndex = Math.min(_selectedIndex + 1, results.length - 1);
      _updateStore();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      _selectedIndex = Math.max(_selectedIndex - 1, 0);
      _updateStore();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      _executeSelected();
    }
  }

  // ─── Clic fuera para cerrar ─────────────────────────
  function _onClickOutside(e) {
    if (!_isOpen) return;
    var target = e.target;
    // Si el clic no está dentro del panel de la paleta
    if (_paletteEl && !_paletteEl.contains(target)) {
      // Ignorar si es el atajo de teclado (para evitar toggle doble)
      if (target.tagName === 'BODY' || target.tagName === 'HTML') return;
      _close();
    }
  }

  // ─── Escuchar eventos ────────────────────────────────
  document.addEventListener('keydown', _onKeydown);

  // Usamos mousedown en vez de click para mejor sincronización
  document.addEventListener('mousedown', function (e) {
    // Diferir para dar tiempo al focus del input
    setTimeout(function () { _onClickOutside(e); }, 50);
  });

  // Observar cambios en el DOM para detectar el elemento palette
  function _watchPaletteEl() {
    var el = document.getElementById('search-palette');
    if (el) {
      _paletteEl = el;
      return true;
    }
    return false;
  }

  // Intentar detectar cada vez que se abre
  var _origOpen = _open;
  _open = function () {
    if (!_paletteEl) _watchPaletteEl();
    _origOpen();
  };

  // ─── API pública ────────────────────────────────────
  window.SEARCH_PALETTE = {
    /**
     * Registrar un comando en la paleta
     * @param {string} id      - Identificador único
     * @param {string} label   - Texto visible
     * @param {string} icon    - Clase Bootstrap Icon (ej: 'bi-folder')
     * @param {function} action - Función a ejecutar
     */
    register: function (id, label, icon, action) {
      if (!id || !label) {
        console.warn('[palette] register requiere id y label');
        return;
      }
      // Evitar duplicados
      for (var i = 0; i < _commands.length; i++) {
        if (_commands[i].id === id) return;
      }
      _commands.push({
        id: id,
        label: label,
        icon: icon || 'bi-terminal',
        action: action || function () {}
      });
      _updateStore();
      console.log('[palette] Comando registrado:', id);
    },

    /**
     * Desregistrar un comando por id
     */
    unregister: function (id) {
      var idx = -1;
      for (var i = 0; i < _commands.length; i++) {
        if (_commands[i].id === id) { idx = i; break; }
      }
      if (idx !== -1) {
        _commands.splice(idx, 1);
        _updateStore();
      }
    },

    open: function () { _open(); },
    close: function () { _close(); },
    toggle: function () { _toggle(); },

    isOpen: function () { return _isOpen; },

    getCommands: function () {
      return _commands.slice();
    },

    /**
     * Template HTML para insertar en la shell de la app
     * Renderiza la paleta como un modal flotante centrado
     */
    render: function () {
      return '' +
        '<div id="search-palette" x-data x-show="$store.palette.open"' +
        '     x-transition:enter="transition ease-out duration-200"' +
        '     x-transition:enter-start="opacity-0 scale-95"' +
        '     x-transition:enter-end="opacity-100 scale-100"' +
        '     x-transition:leave="transition ease-in duration-150"' +
        '     x-transition:leave-start="opacity-100 scale-100"' +
        '     x-transition:leave-end="opacity-0 scale-95"' +
        '     class="fixed inset-0 z-[80] flex items-start justify-center pt-[15vh]"' +
        '     style="display: none;">' +
        '' +
        '  <!-- Overlay -->' +
        '  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm"' +
        '       x-show="$store.palette.open"' +
        '       x-transition:enter="transition-opacity ease-out duration-200"' +
        '       x-transition:enter-start="opacity-0"' +
        '       x-transition:enter-end="opacity-100"' +
        '       x-transition:leave="transition-opacity ease-in duration-150"' +
        '       x-transition:leave-start="opacity-100"' +
        '       x-transition:leave-end="opacity-0">' +
        '  </div>' +
        '' +
        '  <!-- Panel -->' +
        '  <div class="relative w-full max-w-xl mx-4 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden"' +
        '       @keydown.escape.window="$store.palette.open = false">' +
        '' +
        '    <!-- Input de búsqueda -->' +
        '    <div class="flex items-center gap-3 px-4 py-3 border-b border-base-300">' +
        '      <i class="bi bi-search text-lg text-base-content/40"></i>' +
        '      <input id="sp-input" type="text"' +
        '             x-model="$store.palette.query"' +
        '             @input="$store.palette.selectedIndex = 0"' +
        '             placeholder="Buscar comandos..."' +
        '             class="w-full bg-transparent outline-none text-base-content placeholder:text-base-content/30 text-sm"' +
        '             autocomplete="off" autocorrect="off" spellcheck="false">' +
        '      <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono bg-base-300 rounded text-base-content/40">' +
        '        ESC' +
        '      </kbd>' +
        '    </div>' +
        '' +
        '    <!-- Resultados -->' +
        '    <div class="max-h-80 overflow-y-auto py-2 scrollbar-thin"' +
        '         x-show="$store.palette.results.length > 0">' +
        '      <template x-for="(cmd, idx) in $store.palette.results" :key="cmd.id">' +
        '        <button @click="' +
        '          $store.palette.open = false;' +
        '          SEARCH_PALETTE.close();' +
        '          cmd.action();' +
        '        "' +
        '                class="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors"' +
        '                :class="idx === $store.palette.selectedIndex' +
        '                  ? \'bg-primary/10 text-primary\' ' +
        '                  : \'hover:bg-base-200 text-base-content\'">' +
        '          <i :class="cmd.icon || \'bi-terminal\'" class="text-lg w-6 text-center shrink-0"></i>' +
        '          <div class="flex-1 min-w-0">' +
        '            <div class="text-sm font-medium truncate" x-text="cmd.label"></div>' +
        '            <div class="text-xs text-base-content/40 truncate" x-text="cmd.id"></div>' +
        '          </div>' +
        '          <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-base-300 rounded text-base-content/30"' +
        '                x-show="idx === $store.palette.selectedIndex">' +
        '            â†’' +
        '          </kbd>' +
        '        </button>' +
        '      </template>' +
        '    </div>' +
        '' +
        '    <!-- Sin resultados -->' +
        '    <div class="flex flex-col items-center py-8 text-base-content/30"' +
        '         x-show="$store.palette.results.length === 0 && $store.palette.query">' +
        '      <i class="bi bi-search text-3xl mb-2"></i>' +
        '      <p class="text-sm">Sin resultados para "<span x-text="$store.palette.query"></span>"</p>' +
        '    </div>' +
        '' +
        '    <!-- Hint inicial -->' +
        '    <div class="flex flex-col items-center py-8 text-base-content/30"' +
        '         x-show="$store.palette.results.length === 0 && !$store.palette.query">' +
        '      <i class="bi bi-command text-3xl mb-2"></i>' +
        '      <p class="text-sm">Escribe para buscar comandos</p>' +
        '      <div class="flex gap-2 mt-3">' +
        '        <span class="text-[10px] px-1.5 py-0.5 bg-base-300 rounded font-mono">â†‘ â†“</span>' +
        '        <span class="text-[10px]">Navegar</span>' +
        '        <span class="text-[10px] px-1.5 py-0.5 bg-base-300 rounded font-mono">â†µ</span>' +
        '        <span class="text-[10px]">Ejecutar</span>' +
        '        <span class="text-[10px] px-1.5 py-0.5 bg-base-300 rounded font-mono">ESC</span>' +
        '        <span class="text-[10px]">Cerrar</span>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>';
    },

    /**
     * Inyectar el HTML de la paleta en el body
     */
    mount: function () {
      if (document.getElementById('search-palette')) return;
      var div = document.createElement('div');
      div.innerHTML = this.render();
      // Extraer el primer hijo (el elemento raíz del template)
      var child = div.firstElementChild;
      if (child) {
        document.body.appendChild(child);
        _paletteEl = document.getElementById('search-palette');
      }
    }
  };

  console.log('[palette] Search palette iniciado');
})();
