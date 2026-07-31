// modules/ia-jutia/tools/extraer-xlsx.js — Extraccion de texto XLSX (Full+)
// Dependencias: SheetJS (window.XLSX)
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
    window.IA_TOOLS.register('extraer-xlsx', {
      nombre: 'Extraer XLSX',
      descripcion: 'Extrae texto de archivos Excel (.xlsx/.xls) usando SheetJS',
      estado: 'disponible',

      ejecutar: async function(contexto) {
        var archivo = contexto && contexto.archivo;
        if (!archivo) return { exito: false, error: 'No se proporciono archivo XLSX', tool: 'extraer-xlsx' };

        if (typeof window.XLSX === 'undefined') {
          return { exito: false, error: 'SheetJS no esta cargado. Verifica que assets/xlsx.js existe.', tool: 'extraer-xlsx' };
        }

        try {
          var buffer = await _toArrayBuffer(archivo);
          var wb = window.XLSX.read(new Uint8Array(buffer), { type: 'array' });
          var lines = [];

          for (var si = 0; si < wb.SheetNames.length; si++) {
            var sheetName = wb.SheetNames[si];
            var sheet = wb.Sheets[sheetName];
            var json = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });

            lines.push('--- Hoja: ' + sheetName + ' ---');
            for (var ri = 0; ri < Math.min(json.length, 500); ri++) {
              if (json[ri] && json[ri].length > 0) {
                lines.push(json[ri].filter(function(c) { return c != null && c !== ''; }).join(' | '));
              }
            }
          }

          return { exito: true, texto: lines.join('\n').slice(0, 50000), tool: 'extraer-xlsx' };
        } catch(e) {
          return { exito: false, error: 'Error leyendo XLSX: ' + ((e && e.message) || String(e)), tool: 'extraer-xlsx' };
        }
      }
    });
  }
})();
