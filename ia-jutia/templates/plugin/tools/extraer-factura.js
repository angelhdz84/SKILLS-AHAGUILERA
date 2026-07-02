// tools/extraer-factura.js — IA Jutia: Extraccion multi-region Latam v1.0
// Detecta pais, extrae datos fiscales de texto de factura/boleta
// Auto-registra en window.IA_TOOLS al cargarse

;(function() {
  'use strict';

  // Fingerprints por pais — terminos comunes en facturas
  var PAISES = [
    { pais: 'Argentina', codigo: 'AR', fingerprint: /factura\s*(a|b|c|electr[oó]nica)|cuit|responsable\s*inscripto|iva\s*21|monotributista/i, fiscalId: 'CUIT', reId: /\b(\d{2}-\d{8}-\d{1})\b/ },
    { pais: 'Bolivia', codigo: 'BO', fingerprint: /nit|factura\s*(computarizada|original)|c[oó]digo\s*control|casa\s*matriz/i, fiscalId: 'NIT', reId: /\b(\d{7,10})\b/ },
    { pais: 'Chile', codigo: 'CL', fingerprint: /rut|boleta|factura\s*electr[oó]nica|sii|giro\s*del\s*contribuyente|iva?\s*19/i, fiscalId: 'RUT', reId: /\b(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])\b/ },
    { pais: 'Colombia', codigo: 'CO', fingerprint: /nit|factura\s*electr[oó]nica|r[eé]gimen\s*com[úu]n|dian|iva\s*19|resoluci[oó]n\s*dian/i, fiscalId: 'NIT', reId: /\b(\d{9,10}-\d{1})\b/ },
    { pais: 'Costa Rica', codigo: 'CR', fingerprint: /c[eé]dula\s*(jur[íi]dica|f[íi]sica)|factura\s*electr[oó]nica|hacienda|cp[\d-]{12}/i, fiscalId: 'Cedula', reId: /\b(\d{9,12})\b/ },
    { pais: 'Ecuador', codigo: 'EC', fingerprint: /ruc|factura|gu[ií]a\s*remisi[oó]n|comprobante\s*(de|electr[oó]nico)|sri/i, fiscalId: 'RUC', reId: /\b(\d{13})\b/ },
    { pais: 'El Salvador', codigo: 'SV', fingerprint: /nit|factura\s*electr[oó]nica|dv\d{2}|mh|comprobante\s*de\s*cr[eé]dito/i, fiscalId: 'NIT', reId: /\b(\d{14,17})\b/ },
    { pais: 'Guatemala', codigo: 'GT', fingerprint: /nit|factura\s*(cambiaria|electr[oó]nica)|fel|sat|serie\s*[a-z]\d/i, fiscalId: 'NIT', reId: /\b(\d{7,13})\b/ },
    { pais: 'Honduras', codigo: 'HN', fingerprint: /rtn|factura\s*(cambiaria|electr[oó]nica)|saru|impuesto\s*sobre\s*ventas/i, fiscalId: 'RTN', reId: /\b(\d{14,16})\b/ },
    { pais: 'Mexico', codigo: 'MX', fingerprint: /rfc|cfdi|factura\s*electr[oó]nica|sat|uso\s*cfdi|forma\s*de\s*pago|regimen\s*fiscal/i, fiscalId: 'RFC', reId: /\b([A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3})\b/ },
    { pais: 'Nicaragua', codigo: 'NI', fingerprint: /ruc|factura\s*electr[oó]nica|dgi|comprobante\s*fiscal/i, fiscalId: 'RUC', reId: /\b(\d{10,14})\b/ },
    { pais: 'Panama', codigo: 'PA', fingerprint: /ruc|factura\s*(electr[oó]nica|fiscal)|dgi|timbrado|isr/i, fiscalId: 'RUC', reId: /\b(\d{6,15})\b/ },
    { pais: 'Paraguay', codigo: 'PY', fingerprint: /ruc|factura\s*(electr[oó]nica|de\s*cr[eé]dito)|timbrado|dgi|iva\s*10/i, fiscalId: 'RUC', reId: /\b(\d{6,15})\b/ },
    { pais: 'Peru', codigo: 'PE', fingerprint: /ruc|factura\s*electr[oó]nica|boleta\s*de\s*venta|sunat|tipo\s*(a|b)|igv\s*18/i, fiscalId: 'RUC', reId: /\b(\d{11})\b/ },
    { pais: 'Uruguay', codigo: 'UY', fingerprint: /rut|factura\s*electr[oó]nica|iva\s*22|dgi|contribuyente\s*iva|timbre/i, fiscalId: 'RUT', reId: /\b(\d{1,3}\.?\d{3}\.?\d{3}-\d{1})\b/ }
  ];

  function detectarPais(texto) {
    var puntajes = [];
    for (var i = 0; i < PAISES.length; i++) {
      var p = PAISES[i];
      var match = texto.match(p.fingerprint);
      if (match) {
        puntajes.push({ pais: p, score: match.length });
      }
    }
    if (puntajes.length === 0) return null;
    puntajes.sort(function(a, b) { return b.score - a.score; });
    return puntajes[0].pais;
  }

  function extraerId(texto, pais) {
    if (!pais || !pais.reId) return null;
    var match = texto.match(pais.reId);
    return match ? match[1] : null;
  }

  function extraerRazonSocial(texto) {
    var patrones = [
      /(?:raz[oó]n\s*social|nombre\s*(?:del\s*)?(?:contribuyente|cliente|comercial))\s*[:\-]?\s*([^\n,.]+)/i,
      /(?:empresa|compañ[íi]a|cliente)\s*[:\-]?\s*([^\n,.]+)/i
    ];
    for (var i = 0; i < patrones.length; i++) {
      var m = texto.match(patrones[i]);
      if (m && m[1].trim().length > 2) return m[1].trim();
    }
    return null;
  }

  function extraerTotal(texto) {
    var patrones = [
      /total\s*(?:general|a\s*pagar|del\s*comprobante)?\s*[:\-]?\s*[$|S/.\s]*(\d[\d.,]*)/i,
      /(?:importe|monto)\s*(?:total|a\s*pagar)?\s*[:\-]?\s*[$|S/.\s]*(\d[\d.,]*)/i,
      /(?:subtotal|iva|igv|isr)\s*[:\-]?\s*[$|S/.\s]*(\d[\d.,]*)/i
    ];
    for (var i = 0; i < patrones.length; i++) {
      var m = texto.match(patrones[i]);
      if (m) {
        var val = parseFloat(m[1].replace(/[.,\s]/g, '').replace(/(\d{2})$/, '.$1'));
        if (!isNaN(val) && val > 0) return val;
      }
    }
    return null;
  }

  function extraerFecha(texto) {
    var patrones = [
      /(?:fecha|emisi[oó]n)\s*[:\-]?\s*(\d{1,2}\s*[/\-]\s*\d{1,2}\s*[/\-]\s*\d{2,4})/i,
      /(\d{1,2}\s*de\s*[a-záéíóúñ]+\s*de\s*\d{4})/i,
      /(\d{4}\s*[/\-]\s*\d{1,2}\s*[/\-]\s*\d{1,2})/i
    ];
    for (var i = 0; i < patrones.length; i++) {
      var m = texto.match(patrones[i]);
      if (m) return m[1].trim();
    }
    return null;
  }

  function limpiarTexto(texto) {
    return texto
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .trim();
  }

  var Tool = {
    nombre: 'extraer-factura',
    descripcion: 'Extrae datos de facturas/boletas Latam. Detecta pais automaticamente',
    estado: 'disponible',
    patrones: [
      /factura/i, /boleta/i, /recibo/i, /comprobante/i,
      /extrae?\s*(?:r\s*)?(?:factura|boleta|recibo)/i,
      /leer\s*(?:factura|boleta|recibo)/i
    ],

    ejecutar: function(contexto) {
      contexto = contexto || {};
      var texto = contexto.texto || '';

      if (!texto) {
        return Promise.resolve({
          error: 'No se proporciono texto de factura',
          tool: 'extraer-factura'
        });
      }

      var limpio = limpiarTexto(texto);
      var pais = detectarPais(limpio);
      var resultado = {
        tool: 'extraer-factura',
        pais: pais ? { nombre: pais.pais, codigo: pais.codigo, idFiscal: pais.fiscalId } : null,
        numeroDocumento: pais ? extraerId(limpio, pais) : null,
        razonSocial: extraerRazonSocial(limpio),
        total: extraerTotal(limpio),
        fecha: extraerFecha(limpio),
        confianza: pais ? 'alta' : 'baja',
        textoLimpio: limpio.slice(0, 1000)
      };

      return Promise.resolve(resultado);
    }
  };

  // Auto-registrar en el registry
  if (typeof window.IA_TOOLS !== 'undefined' && window.IA_TOOLS.register) {
    window.IA_TOOLS.register(Tool.nombre, Tool);
  }
})();
