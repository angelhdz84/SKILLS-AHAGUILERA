// FileStore — Gestión unificada de archivos (avatares, fotos, docs)
// Dos backends: Lite (Dexie blobs) / Full (disco APP_DATA_DIR)
// window.FileStore expuesto globalmente

(function () {
  const PERFIL = window.APP_CONFIG?.perfil || 'lite';
  const DIR = window.APP_CONFIG?.data?.dir || 'data/';
  const MAX_SIZE = window.APP_CONFIG?.data?.maxFileSize || 10 * 1024 * 1024;

  async function hashFile(blob) {
    const buf = await blob.arrayBuffer();
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  window.FileStore = {
    APP_DATA_DIR: DIR,

    // Guarda archivo: tipo('avatar'|'foto'|'doc'), nombre original, blob
    // Retorna: { path, hash, url }
    async save(tipo, nombre, blob) {
      if (blob.size > MAX_SIZE) throw new Error(`Archivo excede ${Math.round(MAX_SIZE/1024/1024)}MB`);
      const ext = nombre.split('.').pop();
      const id = uuid();
      const path = `${tipo}/${id}.${ext}`;
      const hash = await hashFile(blob);

      // Registrar en _files
      await db._files.put({ path, tipo, nombre, mime: blob.type, size: blob.size, hash, refCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });

      if (PERFIL === 'lite') {
        // Almacenar blob en Dexie
        await db._file_blobs.put({ path, blob });
        return { path, hash, url: URL.createObjectURL(blob) };
      } else {
        // Full: escribir a disco
        const fullPath = `${DIR}${path}`;
        const resp = await fetch(URL.createObjectURL(blob));
        const buf = await resp.arrayBuffer();
        await Neutralino.filesystem.writeBinaryFile(fullPath, buf);
        return { path, hash, url: `/${fullPath}` };
      }
    },

    // Obtener URL para <img> o <a>
    async getURL(path) {
      if (!path) return null;
      if (PERFIL === 'lite') {
        const entry = await db._file_blobs.get(path);
        if (!entry?.blob) return null;
        return URL.createObjectURL(entry.blob);
      } else {
        // Verificar que existe
        try { await Neutralino.filesystem.getStats(`${DIR}${path}`); return `/${DIR}${path}`; }
        catch { return null; }
      }
    },

    // Leer archivo como Blob
    async read(path) {
      if (PERFIL === 'lite') {
        const entry = await db._file_blobs.get(path);
        return entry?.blob || null;
      } else {
        const data = await Neutralino.filesystem.readBinaryFile(`${DIR}${path}`);
        return new Blob([data]);
      }
    },

    // Eliminar archivo
    async delete(path) {
      if (PERFIL === 'lite') {
        await db._file_blobs.delete(path);
      } else {
        try { await Neutralino.filesystem.removeFile(`${DIR}${path}`); } catch {}
      }
      await db._files.delete(path);
    },

    // Obtener metadata desde _files
    async meta(path) {
      return await db._files.get(path);
    },

    // Limpiar huérfanos: archivos con refCount === 0
    async cleanOrphans() {
      const orphans = await db._files.where('refCount').equals(0).toArray();
      for (const f of orphans) {
        await this.delete(f.path);
      }
      return orphans.length;
    },

    // Obtener avatar predeterminado
    avatarDefault() {
      return window.APP_CONFIG?.data?.avatars?.default || 'data/defaults/avatar.svg';
    }
  };
})();
