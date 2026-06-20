window['mod_search'] = function(storeName, fields = []) {
  return {
    query: '',
    results: [],
    searching: false,
    debounceTimer: null,
    buscar() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(async () => {
        if (!this.query.trim()) { this.results = []; return; }
        this.searching = true;
        try {
          const q = this.query.toLowerCase();
          const all = await db[storeName].toArray();
          this.results = all.filter(item =>
            fields.some(f => item[f] && item[f].toString().toLowerCase().includes(q))
          );
        } catch (e) { Alpine.store('toast').show('Error en busqueda: ' + e.message, 'error'); }
        finally { this.searching = false; }
      }, 300);
    },
    limpiar() { this.query = ''; this.results = []; }
  };
};
