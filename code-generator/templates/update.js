window['mod_update'] = function(storeName, encryptFields = []) {
  return {
    form: {},
    loading: true,
    saving: false,
    error: null,
    async cargar(id) {
      this.loading = true;
      try {
        const item = await db[storeName].get(id);
        if (!item) throw new Error('Registro no encontrado');
        for (const field of encryptFields) {
          if (item[field]) item[field] = cryptoHelpers.decrypt(item[field]);
        }
        this.form = { ...item };
      } catch (e) { this.error = e.message; }
      finally { this.loading = false; }
    },
    async guardar() {
      this.saving = true; this.error = null;
      try {
        const data = { ...this.form, updatedAt: new Date().toISOString() };
        for (const field of encryptFields) {
          if (data[field]) data[field] = cryptoHelpers.encrypt(data[field]);
        }
        await db[storeName].put(data);
        Alpine.store('toast').show('Actualizado correctamente', 'success');
      } catch (e) { this.error = e.message; Alpine.store('toast').show(e.message, 'error'); }
      finally { this.saving = false; }
    }
  };
};
