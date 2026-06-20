window['mod_read'] = function(storeName, decryptFields = []) {
  return {
    item: null,
    loading: true,
    error: null,
    async cargar(id) {
      this.loading = true; this.error = null;
      try {
        this.item = await db[storeName].get(id);
        if (!this.item) throw new Error('Registro no encontrado');
        for (const field of decryptFields) {
          if (this.item[field]) this.item[field] = cryptoHelpers.decrypt(this.item[field]);
        }
      } catch (e) { this.error = e.message; }
      finally { this.loading = false; }
    }
  };
};
