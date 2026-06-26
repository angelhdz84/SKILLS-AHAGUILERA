// Command Palette (Cmd+K) — Navegación global de módulos + búsqueda IA
// Incluir en index.html: <script src="core/search-palette.js"></script>
// Orden: después de core/app.js, antes de main.js

document.addEventListener('alpine:init', () => {
  Alpine.data('searchPalette', () => ({
    open: false,
    query: '',
    selectedIdx: 0,
    keyboardNav: false,

    get modulos() {
      return Object.entries(window.APP_CONFIG?.modulos || {})
        .filter(([, m]) => m.activo !== false)
        .map(([id, m]) => ({
          id,
          title: m.titulo || id.charAt(0).toUpperCase() + id.slice(1),
          icon: m.icono || 'bi-box',
          type: 'module'
        }));
    },

    get filtered() {
      const q = this.query.toLowerCase().trim();
      let items = [];

      if (!q) {
        items = this.modulos.slice(0, 8);
      } else {
        items = this.modulos.filter(m =>
          m.title.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)
        );
      }

      // IA search results if window.ia exists
      if (q.length >= 2 && window.ia?.search) {
        const iaResults = window.ia.search(q, { limit: 3 });
        if (iaResults?.length) {
          items = items.concat(iaResults.slice(0, 3).map(r => ({
            id: r.id,
            title: r.nombre || r.titulo || r.id,
            subtitle: r.tipo || r.descripcion || '',
            icon: 'bi-search',
            type: 'record'
          })));
        }
      }

      return items;
    },

    get hasResults() {
      return this.filtered.length > 0;
    },

    openPalette() {
      this.open = true;
      this.query = '';
      this.selectedIdx = 0;
      this.keyboardNav = false;
      this.$nextTick(() => {
        const input = this.$el.querySelector('.sp-search-input');
        if (input) input.focus();
      });
    },

    closePalette() {
      this.open = false;
      this.query = '';
      this.selectedIdx = 0;
    },

    selectItem(item) {
      this.closePalette();
      if (item.type === 'module' && window.appRouter?.load) {
        window.appRouter.load(item.id);
      } else if (item.type === 'record' && window.appRouter?.load && item.id) {
        window.appRouter.load(item.id);
      }
    },

    onKeydown(e) {
      if (!this.open) return;
      this.keyboardNav = true;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedIdx = Math.min(this.selectedIdx + 1, this.filtered.length - 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedIdx = Math.max(this.selectedIdx - 1, 0);
      } else if (e.key === 'Enter' && this.filtered[this.selectedIdx]) {
        e.preventDefault();
        this.selectItem(this.filtered[this.selectedIdx]);
      } else if (e.key === 'Escape') {
        this.closePalette();
      }
    }
  }));
});
