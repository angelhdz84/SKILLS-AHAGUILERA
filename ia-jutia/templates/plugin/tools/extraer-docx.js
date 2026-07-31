// modules/ia-jutia/tools/extraer-docx.js — Extraccion de texto DOCX (Full+)
// Dependencias: Mammoth.js (window.mammoth)
// ES5 compatible

;(function() {
  'use strict';

  function _toArrayBuffer(archivo) {
    // Normalizar Blob/File a ArrayBuffer (si ya es ArrayBuffer/Uint8Array, pasar)
    if (archivo && typeof archivo.arrayBuffer === 'function' && !(archivo instanceof ArrayBuffer)) {
      return archivo.arrayBuffer();
    }
    return Promise.resolve(archivo);
  }

  if (window.IA_TOOLS && typeof window.IA_TOOLS.register === 'function') {
    window.IA_TOOLS.register('extraer-docx', {
      nombre: 'Extraer DOCX',
      descripcion: 'Extrae texto de archivos Word (.docx) usando Mammoth.js',
      estado: 'disponible',

      ejecutar: async function(contexto) {
        var archivo = contexto && contexto.archivo;
        if (!archivo) return { exito: false, error: 'No se proporciono archivo DOCX', tool: 'extraer-docx' };

        if (typeof window.mammoth === 'undefined') {
          return { exito: false, error: 'Mammoth.js no esta cargado. Verifica que assets/mammoth.min.js existe.', tool: 'extraer-docx' };
        }

        try {
          var buffer = await _toArrayBuffer(archivo);
          var result = await window.mammoth.extractRawText({ arrayBuffer: buffer });
          return { exito: true, texto: (result.value || '').slice(0, 50000), tool: 'extraer-docx' };
        } catch(e) {
          return { exito: false, error: 'Error leyendo DOCX: ' + ((e && e.message) || String(e)), tool: 'extraer-docx' };
        }
      }
    });
  }
})();
