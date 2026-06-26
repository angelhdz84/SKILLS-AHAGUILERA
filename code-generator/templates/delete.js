window['mod_delete'] = function(storeName) {
  return {
    async ejecutar(id, label = 'este registro') {
      const ok = await UI.confirm(`Eliminar ${label}?`)
      if (!ok) return
      try {
        await db[storeName].delete(id)
        UI.toast('Eliminado correctamente', 'success')
        if (typeof this.onDeleted === 'function') this.onDeleted(id)
      } catch (e) {
        UI.toast(e.message, 'error')
      }
    }
  }
}
