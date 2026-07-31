// modules/ia-jutia/tools/extraer-pdf.js — Extraccion de texto PDF (Full+)
// Dependencias: PDF.js (window.pdfjsLib)
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
    window.IA_TOOLS.register('extraer-pdf', {
      nombre: 'Extraer PDF',
      descripcion: 'Extrae texto de archivos PDF usando PDF.js',
      estado: 'disponible',

      ejecutar: async function(contexto) {
        var archivo = contexto && contexto.archivo;
        if (!archivo) return { exito: false, error: 'No se proporciono archivo PDF', tool: 'extraer-pdf' };

        if (typeof window.pdfjsLib === 'undefined') {
          return { exito: false, error: 'PDF.js no esta cargado. Verifica que assets/pdf.min.js existe.', tool: 'extraer-pdf' };
        }

        var doc = null;
        try {
          // Configurar worker local si es posible (file:// no puede cargar worker por CORS)
          if (window.pdfjsLib.GlobalWorkerOptions && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
            try {
              window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'modules/ia-jutia/assets/pdf.worker.min.js';
            } catch(we) { /* fallback: PDF.js usara su worker por defecto */ }
          }

          var buffer = await _toArrayBuffer(archivo);
          var data = new Uint8Array(buffer);
          var loadingTask = window.pdfjsLib.getDocument({ data: data });
          // Compatible con PDF.js v2/v3 (task.promise) y v4+ (promise directo)
          doc = await (loadingTask.promise ? loadingTask.promise : loadingTask);
          var paginas = Math.min(doc.numPages, 100);
          var textoCompleto = [];

          for (var pi = 1; pi <= paginas; pi++) {
            var page = await doc.getPage(pi);
            var content = await page.getTextContent();
            var strings = content.items.map(function(item) { return item.str; });
            textoCompleto.push(strings.join(' '));
          }

          return { exito: true, texto: textoCompleto.join('\n\n').slice(0, 50000), paginas: paginas, tool: 'extraer-pdf' };
        } catch(e) {
          return { exito: false, error: 'Error leyendo PDF: ' + ((e && e.message) || String(e)), tool: 'extraer-pdf' };
        } finally {
          if (doc && typeof doc.destroy === 'function') {
            try { doc.destroy(); } catch(de) {}
          }
        }
      }
    });
  }
})();
