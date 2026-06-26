// FileStore — Gestión unificada de archivos (avatares, fotos, docs)
// Dos backends: Lite (Dexie blobs) / Full (disco APP_DATA_DIR)
// window.FileStore expuesto globalmente

(function () {
  const PERFIL = window.APP_CONFIG?.perfil || 'lite';
  const DIR = window.APP_CONFIG?.data?.dir || 'data/';
  const MAX_SIZE = window.APP_CONFIG?.data?.maxFileSize || 10 * 1024 * 1024;
  const _objectUrls = new Set();

  function revokeUrl(url) {
    if (url?.startsWith('blob:')) { URL.revokeObjectURL(url); _objectUrls.delete(url); }
  }

  async function hashBlob(blob) {
    if (!window.crypto?.subtle?.digest) return '';
    try {
      const buf = await blob.arrayBuffer();
      const hash = await crypto.subtle.digest('SHA-256', buf);
      return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    } catch { return ''; }
  }

  function readAsArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  window.FileStore = {
    APP_DATA_DIR: DIR,

    async save(tipo, nombre, blob) {
      if (blob.size > MAX_SIZE) throw new Error(`Archivo excede ${Math.round(MAX_SIZE/1024/1024)}MB`);
      const ext = nombre.split('.').pop();
      const id = uuid();
      const path = `${tipo}/${id}.${ext}`;
      const hash = await hashBlob(blob);

      await db._files.put({
        path, tipo, nombre, mime: blob.type, size: blob.size, hash,
        refCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
      });

      if (PERFIL === 'lite') {
        try {
          await db._file_blobs.put({ path, blob });
        } catch (e) {
          await db._files.delete(path);
          throw e;
        }
        const url = URL.createObjectURL(blob);
        _objectUrls.add(url);
        return { path, hash, url };
      }

      try {
        const buf = await readAsArrayBuffer(blob);
        await window.Neutralino?.filesystem?.writeBinaryFile(`${DIR}${path}`, buf);
        return { path, hash, url: `/${DIR}${path}` };
      } catch (e) {
        await db._files.delete(path);
        throw e;
      }
    },

    async getURL(path) {
      if (!path) return null;
      if (PERFIL === 'lite') {
        const entry = await db._file_blobs.get(path);
        if (!entry?.blob) return null;
        const url = URL.createObjectURL(entry.blob);
        _objectUrls.add(url);
        return url;
      }
      try {
        await window.Neutralino?.filesystem?.getStats(`${DIR}${path}`);
        return `/${DIR}${path}`;
      } catch { return null; }
    },

    async read(path) {
      if (!path) return null;
      if (PERFIL === 'lite') {
        const entry = await db._file_blobs.get(path);
        return entry?.blob || null;
      }
      try {
        const data = await window.Neutralino?.filesystem?.readBinaryFile(`${DIR}${path}`);
        return data ? new Blob([data]) : null;
      } catch { return null; }
    },

    async delete(path) {
      if (!path) return;
      if (PERFIL === 'lite') {
        await db._file_blobs.delete(path);
      } else {
        try { await window.Neutralino?.filesystem?.removeFile(`${DIR}${path}`); } catch {}
      }
      await db._files.delete(path);
    },

    async meta(path) {
      return path ? db._files.get(path) : null;
    },

    async cleanOrphans() {
      const orphans = await db._files.where('refCount').equals(0).toArray();
      for (const f of orphans) {
        await this.delete(f.path);
      }
      return orphans.length;
    },

    avatarDefault() {
      return window.APP_CONFIG?.data?.avatars?.default || 'data/defaults/avatar.svg';
    },

    revokeAll() {
      for (const url of _objectUrls) URL.revokeObjectURL(url);
      _objectUrls.clear();
    }
  };
})();
