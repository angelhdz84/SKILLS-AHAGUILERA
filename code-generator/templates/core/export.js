// ExportEngine — Exportacion unificada a Excel/PDF/CSV
// window.ExportEngine expuesto globalmente
// Dependencias: jsPDF (opcional para PDF), UI.toast, UI.confirm

(function () {
  'use strict';

  if (typeof window.ExportEngine !== 'undefined') return;

  var _avatarCache = new Map();

  window.ExportEngine = {

    excel: function (titulo, headers, rows, avatarField) {
      if (!rows || !rows.length) { UI.toast('No hay datos para exportar', 'warning'); return; }
      UI.toast('Generando Excel...', 'info');

      var head = headers.map(function (h) { return '<th>' + ExportEngine._escapeHtml(h) + '</th>'; }).join('');
      var body = '';
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var cells = headers.map(function (h) {
          var val = row[h.value || h];
          if (h.type === 'currency') return '<td style="text-align:right">' + ExportEngine._formatCurrency(val) + '</td>';
          if (h.type === 'date') return '<td style="text-align:center">' + ExportEngine._formatDate(val) + '</td>';
          if (h.type === 'badge') {
            var badgeColor = (val && val.color) || '#e5e7eb';
            var badgeLabel = val ? (val.label || String(val) || '') : '';
            return '<td><span style="background:' + badgeColor + ';padding:2px 8px;border-radius:999px;font-size:11px">' + ExportEngine._escapeHtml(badgeLabel) + '</span></td>';
          }
          if (h.type === 'number') {
            return '<td style="text-align:right">' + (val != null ? Number(val).toLocaleString('es-MX') : '') + '</td>';
          }
          return '<td>' + ExportEngine._escapeHtml(val != null ? val : '') + '</td>';
        }).join('');
        body += '<tr>' + cells + '</tr>';
      }

      var html = '<html><head><meta charset="UTF-8"><style>table{border-collapse:collapse;width:100%;font-family:Inter,sans-serif;font-size:12px}th{background:#1e3a5f;color:#fff;padding:8px 10px;text-align:left}td{padding:6px 10px;border-bottom:1px solid #e2e8f0}tr:nth-child(even){background:#f8fafc}</style></head><body><h2>' + ExportEngine._escapeHtml(titulo) + '</h2><table><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></body></html>';

      var blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = titulo.replace(/[^a-zA-Z0-9-_]/g, '_') + '.xls';
      a.click();
      URL.revokeObjectURL(url);
      UI.toast('Excel descargado', 'success');
    },

    pdf: function (titulo, headers, rows, avatarField) {
      var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
      if (jsPDF) {
        return this._pdfConLibreria(titulo, headers, rows, avatarField);
      }
      UI.toast('PDF no disponible en esta app', 'warning');
    },

    _pdfConLibreria: function (titulo, headers, rows, avatarField) {
      UI.toast('Generando PDF...', 'info');
      try {
        var doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        doc.setFontSize(16);
        doc.text(titulo, 14, 20);
        doc.setFontSize(8);
        var colCount = headers.length;
        var startY = 30;
        doc.autoTable({
          head: [headers.map(function (h) { return h.label || h.value || h; })],
          body: rows.map(function (row) {
            return headers.map(function (h) {
              var val = row[h.value || h];
              if (h.type === 'currency') return ExportEngine._formatCurrency(val);
              if (h.type === 'date') return ExportEngine._formatDate(val);
              if (h.type === 'badge') {
                if (val && typeof val === 'object') return ExportEngine._escapeHtml(val.label || '');
                return ExportEngine._escapeHtml(String(val));
              }
              return ExportEngine._escapeHtml(val != null ? String(val) : '');
            });
          }),
          startY: startY,
          theme: 'grid',
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [30, 58, 95], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { top: 20, right: 14, bottom: 20, left: 14 },
          pageBreak: 'auto'
        });

        doc.save(titulo.replace(/[^a-zA-Z0-9-_]/g, '_') + '.pdf');
        UI.toast('PDF descargado', 'success');
      } catch (err) {
        UI.toast('Error al generar PDF: ' + (err.message || 'Error'), 'error');
      }
    },

    csv: function (titulo, headers, rows, avatarField) {
      UI.toast('Generando CSV...', 'info');
      var csvRows = [];
      var headerRow = headers.map(function (h) { return '"' + ExportEngine._escapeCsv(h.label || h.value || h) + '"'; }).join(',');
      csvRows.push(headerRow);
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var dataRow = headers.map(function (h) {
          var val = row[h.value || h];
          if (val == null) return '""';
          return '"' + ExportEngine._escapeCsv(String(val)) + '"';
        }).join(',');
        csvRows.push(dataRow);
      }

      var bom = '\uFEFF';
      var csvString = bom + csvRows.join('\n');
      var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = titulo.replace(/[^a-zA-Z0-9-_]/g, '_') + '.csv';
      a.click();
      URL.revokeObjectURL(url);
      UI.toast('CSV descargado', 'success');
    },

    _escapeHtml: function (text) {
      if (text == null) return '';
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },

    _escapeCsv: function (text) {
      if (text == null) return '';
      return String(text).replace(/"/g, '""');
    },

    _formatCurrency: function (val) {
      if (val == null || isNaN(Number(val))) return '';
      return '$' + Number(val).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    _formatDate: function (val) {
      if (!val) return '';
      try {
        var d = new Date(val);
        if (isNaN(d.getTime())) return String(val);
        return d.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
      } catch (e) { return String(val); }
    }
  };
})();
