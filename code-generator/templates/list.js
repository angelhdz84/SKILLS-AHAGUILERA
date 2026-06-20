window['mod_list'] = function(storeName) {
  return {
    items: [],
    filtered: [],
    loading: true,
    search: '',
    sortField: 'createdAt',
    sortDir: 'desc',
    async init() {
      this.loading = true;
      try {
        this.items = await db[storeName].toArray();
        this.filtrar();
      } catch (e) { Alpine.store('toast').show('Error al cargar: ' + e.message, 'error'); }
      finally { this.loading = false; }
    },
    filtrar() {
      let r = this.items;
      if (this.search) {
        const q = this.search.toLowerCase();
        r = r.filter(i => JSON.stringify(i).toLowerCase().includes(q));
      }
      r.sort((a, b) => {
        const va = a[this.sortField] || '', vb = b[this.sortField] || '';
        return this.sortDir === 'asc' ? va > vb ? 1 : -1 : va < vb ? 1 : -1;
      });
      this.filtered = r;
    }
  };
};
