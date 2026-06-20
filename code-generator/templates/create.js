window['mod_create'] = function(storeName, encryptFields = []) {
  return {
    form: {},
    saving: false,
    error: null,
    async guardar() {
      this.saving = true; this.error = null;
      try {
        const data = { ...this.form, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        for (const field of encryptFields) {
          if (data[field]) data[field] = cryptoHelpers.encrypt(data[field]);
        }
        await db[storeName].add(data);
        this.form = {};
        Alpine.store('toast').show('Guardado correctamente', 'success');
      } catch (e) { this.error = e.message; Alpine.store('toast').show(e.message, 'error'); }
      finally { this.saving = false; }
    }
  };
};
