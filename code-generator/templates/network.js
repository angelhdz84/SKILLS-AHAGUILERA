window['mod_network'] = function() {
  return {
    online: navigator.onLine,
    syncQueue: [],
    syncing: false,
    init() {
      window.addEventListener('online', () => { this.online = true; this.procesarCola(); });
      window.addEventListener('offline', () => { this.online = false; });
    },
    async encolar(operacion) {
      this.syncQueue.push({ ...operacion, ts: Date.now() });
      await db.syncQueue.add({ operacion, ts: Date.now(), sincronizado: false });
    },
    async procesarCola() {
      if (this.syncing || !this.online) return;
      this.syncing = true;
      try {
        const pendientes = await db.syncQueue.where('sincronizado').equals(false).toArray();
        for (const item of pendientes) {
          try {
            await db.syncQueue.update(item.id, { sincronizado: true });
          } catch (e) { console.error('Sync error:', e); }
        }
        this.syncQueue = [];
        Alpine.store('toast').show('Sincronizacion completada', 'success');
      } finally { this.syncing = false; }
    }
  };
};
