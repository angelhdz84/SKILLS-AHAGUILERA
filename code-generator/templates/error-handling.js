window['mod_errorHandler'] = function() {
  return {
    errors: [],
    add(error) {
      const id = Date.now();
      this.errors.push({ id, message: error.message || error, time: new Date().toLocaleTimeString() });
      if (this.errors.length > 5) this.errors.shift();
      setTimeout(() => this.remove(id), 8000);
    },
    remove(id) { this.errors = this.errors.filter(e => e.id !== id); },
    async wrap(fn) {
      try { return await fn(); }
      catch (e) { this.add(e); return null; }
    }
  };
};
