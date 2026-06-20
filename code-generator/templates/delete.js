window['mod_delete'] = function(storeName) {
  return {
    showModal: false,
    selectedId: null,
    deleting: false,
    confirmar(id) { this.selectedId = id; this.showModal = true; },
    cancelar() { this.showModal = false; this.selectedId = null; },
    async ejecutar() {
      if (!this.selectedId) return;
      this.deleting = true;
      try {
        await db[storeName].delete(this.selectedId);
        this.showModal = false;
        Alpine.store('toast').show('Eliminado correctamente', 'success');
        if (typeof this.onDeleted === 'function') this.onDeleted(this.selectedId);
        this.selectedId = null;
      } catch (e) { Alpine.store('toast').show(e.message, 'error'); }
      finally { this.deleting = false; }
    }
  };
};
