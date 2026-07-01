// ExportEngine — Exportación unificada a Excel/PDF/CSV
// window.ExportEngine expuesto globalmente
// Dependencias: jsPDF (opcional para PDF), UI.toast, UI.confirm

(function () {
  'use strict';

  if (typeof window.ExportEngine !== 'undefined') return;

  const _avatarCache = new Map();

  window.ExportEngine = {

    // ─── Excel (HTML-to-XLS, zero dependencias) ───

    excel(titulo, headers, rows, avatarField) {
      if (!rows?.length) { UI.toast('No hay datos para exportar', 'warning'); return; }
      UI.toast('Generando Excel...', 'info');

      const head = headers.map(h => `<th>${this._escapeHtml(h)}</th>`).join('');
      let body = '';
      for (const row of rows) {
        const cells = headers.map(h => {
          const val = row[h.value || h];
          if (h.type === 'currency') return `<td style="text-align:right">${this._formatCurrency(val)}</td>`;
          if (h.type === 'date') return `<td style="text-align:center">${this._formatDate(val)}</td>`;
          if (h.type === 'badge') return `<td><span style="background:${val?.color||'#e5e7eb'};padding:2px 8px;border-radius:999px;font-size:11px">${this._escapeHtml(val?.label||val||'')}</span></td>`;
          if (h.type === 'number') return `<td style="text-align:right">${val != null ? Number(val).toLocaleString('es-MX') : ''}</td>`;
          return `<td>${this._escapeHtml(val ?? '')}</td>`;
        }).join('');
        body += `<tr>${cells}</tr>`;
      }

      const avatarBlock = avatarField && rows.some(r => r[avatarField])
        ? `<style>td img.avatar{width:32px;height:32px;border-radius:50%;object-fit:cover}</style>`
        : '';

      const html = `<html><head><meta charset="UTF-8">
        <style>table{border-collapse:collapse;width:100%}th{background:#1e3a5f;color:#fff;padding:8px 12px;text-align:left;font-size:12px}
        td{padding:6px 12px;border-bottom:1px solid #e5e7eb;font-size:12px}tr:nth-child(even){background:#f9fafb}
        h2{font-family:sans-serif;color:#1e3a5f;margin-bottom:8px}
        .total{font-weight:bold;border-top:2px solid #1e3a5f}
        </style>${avatarBlock}</head><body>
        <h2>${this._escapeHtml(titulo)}</h2>
        <p style="font-size:11px;color:#666">Exportado: ${new Date().toLocaleString('es-MX')}</p>
        <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></body></html>`;

      const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
      this._download(blob, `${titulo}-${new Date().toISOString().slice(0, 10)}.xls`);
      UI.toast(`Excel generado: ${rows.length} filas`, 'success');
    },

    // ─── CSV ───

    csv(titulo, headers, rows) {
      if (!rows?.length) { UI.toast('No hay datos para exportar', 'warning'); return; }
      UI.toast('Generando CSV...', 'info');

      const head = headers.map(h => this._escapeCsv(h.label || h)).join(',');
      const body = rows.map(row => {
        return headers.map(h => {
          const val = row[h.value || h];
          if (h.type === 'currency') return this._escapeCsv(this._formatCurrency(val));
          if (h.type === 'date') return this._escapeCsv(this._formatDate(val));
          return this._escapeCsv(val ?? '');
        }).join(',');
      }).join('\n');
      const bom = '\uFEFF';
      const csv = bom + head + '\n' + body + '\n';
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      this._download(blob, `${titulo}-${new Date().toISOString().slice(0, 10)}.csv`);
      UI.toast(`CSV generado: ${rows.length} filas`, 'success');
    },

    // ─── PDF ───

    pdf(titulo, htmlContent, options = {}) {
      const { orientation = 'portrait', format = 'a4', avatarField } = options;

      // Si jsPDF está disponible, usarlo para generar PDF descargable
      if (typeof window.jspdf?.jsPDF !== 'undefined' || typeof window.jsPDF !== 'undefined') {
        this._pdfConJsPDF(titulo, htmlContent, options);
        return;
      }

      // Fallback: window.print() para web / Print plugin para Capacitor
      if (window.Capacitor?.Plugins?.Print) {
        this._printCapacitor(titulo, htmlContent);
        return;
      }

      this._printWindow(titulo, htmlContent, avatarField);
    },

    async _pdfConJsPDF(titulo, htmlContent, options) {
      const doc = new (window.jsPDF || window.jspdf?.jsPDF)(options.orientation || 'portrait', 'mm', options.format || 'a4');
      const pageW = options.orientation === 'landscape' ? 297 : 210;
      const margin = 15;
      const contentW = pageW - margin * 2;
      let y = margin;

      // Título
      doc.setFontSize(16);
      doc.setTextColor(30, 58, 95);
      doc.text(titulo, margin, y);
      y += 8;

      // Fecha
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Exportado: ${new Date().toLocaleString('es-MX')}`, margin, y);
      y += 6;

      // Subtítulo
      if (options.subtitle) {
        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        doc.text(options.subtitle, margin, y);
        y += 8;
      }

      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageW - margin, y);
      y += 6;

      // Renderizar HTML como texto estructurado
      const rows = options.rows;
      const headers = options.tableHeaders;

      if (headers?.length && rows?.length) {
        // Encabezados de tabla
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        const colW = contentW / headers.length;
        let x = margin;
        doc.setFillColor(30, 58, 95);
        doc.setTextColor(255, 255, 255);
        for (const h of headers) {
          doc.rect(x, y, colW, 7, 'F');
          doc.text(h.label || h, x + 1, y + 5);
          x += colW;
        }
        y += 9;
        doc.setTextColor(50, 50, 50);
        doc.setFont(undefined, 'normal');

        // Filas
        for (const row of rows) {
          if (y > 280) {
            doc.addPage();
            y = margin;
          }
          x = margin;
          let maxH = 6;
          for (const h of headers) {
            const val = row[h.value || h];
            const text = h.type === 'currency' ? this._formatCurrency(val)
              : h.type === 'date' ? this._formatDate(val)
              : String(val ?? '');
            doc.text(text, x + 1, y + 4);
            x += colW;
          }
          y += maxH + 2;
        }
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(180, 180, 180);
      doc.text(`Generado por ${APP_CONFIG?.app?.nombre || 'AHA'}`, margin, 290);
      doc.text(new Date().toISOString().slice(0, 10), pageW - margin - 30, 290, { align: 'right' });

      const blob = doc.output('blob');
      const filename = `${titulo}-${new Date().toISOString().slice(0, 10)}.pdf`;

      if (window.Neutralino) {
        try {
          const buf = await blob.arrayBuffer();
          const path = await Neutralino.os.showSaveDialog('Guardar PDF', {
            filters: [{ name: 'PDF', extensions: ['pdf'] }],
            defaultPath: filename
          });
          if (!path) return;
          await Neutralino.filesystem.writeBinaryFile(path, new Uint8Array(buf));
        } catch {
          this._download(blob, filename);
        }
      } else {
        this._download(blob, filename);
      }
      UI.toast(`PDF generado: ${rows?.length || 0} filas`, 'success');
    },

    async _printCapacitor(titulo, htmlContent) {
      const fullHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8">
        <style>body{font-family:sans-serif;padding:20px;color:#333}
        h2{color:#1e3a5f}table{width:100%;border-collapse:collapse;margin-top:10px}
        th{background:#1e3a5f;color:#fff;padding:8px;text-align:left;font-size:12px}
        td{padding:6px 8px;border-bottom:1px solid #ddd;font-size:12px}
        .footer{font-size:10px;color:#999;margin-top:30px;text-align:center}
        @media print{body{padding:10px}}
        </style></head><body>
        <h2>${this._escapeHtml(titulo)}</h2>
        <p style="font-size:11px;color:#666">${new Date().toLocaleString('es-MX')}</p>
        ${htmlContent}
        <div class="footer">Generado por ${APP_CONFIG?.app?.nombre || 'AHA'}</div>
        </body></html>`;
      try {
        await Capacitor.Plugins.Print.print({ name: titulo, html: fullHtml });
      } catch (e) {
        UI.toast('Error al imprimir: ' + e.message, 'error');
      }
    },

    _printWindow(titulo, htmlContent, avatarField) {
      const win = window.open('', '_blank');
      if (!win) { UI.toast('Permite ventanas emergentes para exportar PDF', 'warning'); return; }
      win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
        <title>${this._escapeHtml(titulo)}</title>
        <style>body{font-family:sans-serif;padding:20px;color:#333;max-width:800px;margin:auto}
        h2{color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:8px}
        table{width:100%;border-collapse:collapse;margin-top:10px}
        th{background:#1e3a5f;color:#fff;padding:8px;text-align:left;font-size:12px}
        td{padding:6px 8px;border-bottom:1px solid #ddd;font-size:12px}
        tr:nth-child(even){background:#f9fafb}
        .footer{font-size:10px;color:#999;margin-top:30px;text-align:center;border-top:1px solid #ddd;padding-top:10px}
        img.avatar{width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle}
        @media print{body{padding:10px}h2{page-break-after:avoid}}
        </style></head><body>
        <h2>${this._escapeHtml(titulo)}</h2>
        <p style="font-size:11px;color:#666">${new Date().toLocaleString('es-MX')}</p>
        ${htmlContent}
        <div class="footer">Generado por ${APP_CONFIG?.app?.nombre || 'AHA'}</div>
        <script>window.onload=function(){setTimeout(function(){window.print();window.close()},500)}</script>
        </body></html>`);
      win.document.close();
    },

    // ─── Avatares ───

    async avatarToDataUri(ruta) {
      if (!ruta) return null;
      if (_avatarCache.has(ruta)) return _avatarCache.get(ruta);

      try {
        let dataUri = null;

        if (window.Neutralino) {
          const fullPath = ruta.startsWith('/') ? ruta : `${Neutralino?.app?.getPath?.() || ''}/${ruta}`;
          try {
            const data = await Neutralino.filesystem.readBinaryFile(fullPath);
            const blob = new Blob([data]);
            dataUri = await this._blobToDataUri(blob);
          } catch {}
        } else if (window.Capacitor) {
          try {
            const result = await Capacitor.Plugins.Filesystem.readFile({ path: ruta });
            dataUri = `data:image/jpeg;base64,${result.data}`;
          } catch {}
        } else {
          try {
            const resp = await fetch(ruta);
            if (resp.ok) {
              const blob = await resp.blob();
              dataUri = await this._blobToDataUri(blob);
            }
          } catch {}
        }

        // Cachear (incluso null para evitar re-fetch)
        _avatarCache.set(ruta, dataUri);
        return dataUri;
      } catch {
        _avatarCache.set(ruta, null);
        return null;
      }
    },

    async resolveAvatarsEnRows(rows, avatarField) {
      if (!avatarField || !rows?.length) return rows;
      const results = [];
      for (const row of rows) {
        if (row[avatarField]) {
          const dataUri = await this.avatarToDataUri(row[avatarField]);
          if (dataUri) results.push({ ...row, _avatarDataUri: dataUri });
          else results.push(row);
        } else {
          results.push(row);
        }
      }
      return results;
    },

    // ─── Helpers ───

    _download(blob, filename) {
      if (window.Neutralino) {
        this._neutralinoSave(blob, [
          { name: 'Archivo', extensions: [filename.split('.').pop()] }
        ], filename);
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },

    async _neutralinoSave(blob, filters, defaultName) {
      try {
        const buf = await blob.arrayBuffer();
        const path = await Neutralino.os.showSaveDialog('Guardar', {
          filters,
          defaultPath: defaultName
        });
        if (!path) return;
        await Neutralino.filesystem.writeBinaryFile(path, new Uint8Array(buf));
      } catch {
        this._downloadBlob(blob, defaultName);
      }
    },

    _downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    },

    _blobToDataUri(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    _escapeHtml(str) {
      if (str == null) return '';
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    },

    _escapeCsv(str) {
      if (str == null) return '""';
      const s = String(str).replace(/"/g, '""');
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    },

    _formatCurrency(n) {
      if (n == null) return '';
      return '$' + Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    _formatDate(d) {
      if (!d) return '';
      const dt = new Date(d);
      if (isNaN(dt)) return String(d);
      return dt.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  };
})();
