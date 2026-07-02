/**
 * IA Jutia — Lite Web Worker
 * FlexSearch en segundo plano para no bloquear UI
 *
 * Este worker se alimenta via blob URL desde core/ia.js
 * NO se carga como archivo externo (evita CSP issues en Neutralino)
 *
 * API:
 *   { type: 'init', payload: { config } }
 *   { type: 'search', payload: { query, opts } }
 *   { type: 'registerTable', payload: { nombre, campos, records } }
 *   { type: 'indexRecord', payload: { tabla, record } }
 *   { type: 'removeRecord', payload: { tabla, id } }
 *   { type: 'stats', payload: { tabla, campo, records } }
 *   { type: 'predict', payload: { valores, periodos } }
 *
 * Responses:
 *   { type, payload, id } matching request
 */

// FLEXSEARCH_SOURCE debe ser reemplazado con el contenido real de flexsearch.min.js durante build
// El build inlinea FlexSearch antes que este codigo en el Blob URL

let FlexSearch;
let index;

self.onmessage = function(e) {
  var data = e.data, type = data.type, payload = data.payload, id = data.id;

  switch(type) {
    case 'init':
      initWorker(payload);
      self.postMessage({ type: 'ready', payload: { status: 'ok' }, id: id });
      break;
    case 'search':
      handleSearch(payload, id);
      break;
    case 'registerTable':
      handleRegisterTable(payload, id);
      break;
    case 'indexRecord':
      handleIndexRecord(payload, id);
      break;
    case 'removeRecord':
      handleRemoveRecord(payload, id);
      break;
    case 'stats':
      handleStats(payload, id);
      break;
    case 'predict':
      handlePredict(payload, id);
      break;
  }
};

function initWorker(config) {
  config = config || {};
  FlexSearch = self.FlexSearch;
  if (!FlexSearch) {
    self.postMessage({ type: 'error', payload: { error: 'FlexSearch no disponible en Worker' }, id: 'init' });
    return;
  }
  index = new FlexSearch.Document({
    doc: {
      id: 'id',
      index: config.fields || ['nombre', 'descripcion', 'notas', 'texto'],
      store: config.store || ['nombre', 'tipo', 'tabla']
    },
    tokenize: config.tokenize || 'forward',
    cache: config.cache !== false,
    resolution: config.resolution || 9,
    context: {
      depth: config.contextDepth || 3,
      resolution: config.contextResolution || 3
    }
  });
}

function handleSearch(payload, id) {
  var query = payload.query, opts = payload.opts;
  if (!index || !query) {
    self.postMessage({ type: 'search', payload: [], id: id });
    return;
  }
  var results = index.search(query, {
    limit: (opts && opts.limit) || 50,
    enrich: true,
    suggest: (opts && opts.suggest !== false)
  });
  var flat = [];
  for (var ri = 0; ri < results.length; ri++) {
    for (var ii = 0; ii < (results[ri].result || []).length; ii++) {
      if (results[ri].result[ii].doc) flat.push(results[ri].result[ii].doc);
    }
  }
  self.postMessage({ type: 'search', payload: flat, id: id });
}

function handleRegisterTable(payload, id) {
  var nombre = payload.nombre, records = payload.records;
  if (!index || !records || !records.forEach) {
    self.postMessage({ type: 'registerTable', payload: { nombre: nombre, count: 0 }, id: id });
    return;
  }
  records.forEach(function(r) {
    index.add({
      id: nombre + '-' + (r.id || r._id),
      nombre: r.nombre || r.titulo || r.name || '',
      descripcion: r.descripcion || r.desc || '',
      notas: r.notas || r.observaciones || '',
      texto: JSON.stringify(r).slice(0, 500),
      tipo: r.tipo || nombre,
      tabla: nombre
    });
  });
  self.postMessage({ type: 'registerTable', payload: { nombre: nombre, count: records.length }, id: id });
}

function handleIndexRecord(payload, id) {
  var tabla = payload.tabla, record = payload.record;
  if (!index || !record) {
    self.postMessage({ type: 'indexRecord', payload: { success: false }, id: id });
    return;
  }
  index.add({
    id: tabla + '-' + (record.id || record._id),
    nombre: record.nombre || record.titulo || record.name || '',
    descripcion: record.descripcion || record.desc || '',
    notas: record.notas || record.observaciones || '',
    texto: JSON.stringify(record).slice(0, 500),
    tipo: record.tipo || tabla,
    tabla: tabla
  });
  self.postMessage({ type: 'indexRecord', payload: { success: true }, id: id });
}

function handleRemoveRecord(payload, id) {
  var tabla = payload.tabla, recId = payload.id;
  if (!index || !recId) {
    self.postMessage({ type: 'removeRecord', payload: { success: false }, id: id });
    return;
  }
  index.remove(tabla + '-' + recId);
  self.postMessage({ type: 'removeRecord', payload: { success: true }, id: id });
}

function handleStats(payload, id) {
  var records = payload.records, campo = payload.campo;
  if (!records || !records.length) {
    self.postMessage({ type: 'stats', payload: null, id: id });
    return;
  }
  var valores = records.map(function(r) { return parseFloat(r[campo]); }).filter(function(v) { return !isNaN(v); });
  var n = valores.length;
  if (n === 0) {
    self.postMessage({ type: 'stats', payload: null, id: id });
    return;
  }
  var sum = valores.reduce(function(a, b) { return a + b; }, 0);
  var mean = sum / n;
  var sorted = valores.slice().sort(function(a, b) { return a - b; });
  var median = n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)];
  var freq = {}, maxFreq = 0, mode = valores[0];
  valores.forEach(function(v) { freq[v] = (freq[v] || 0) + 1; if (freq[v] > maxFreq) { maxFreq = freq[v]; mode = v; } });
  var variance = valores.reduce(function(acc, v) { return acc + (v - mean) * (v - mean); }, 0) / n;
  self.postMessage({
    type: 'stats',
    payload: {
      count: n,
      min: sorted[0],
      max: sorted[n - 1],
      mean: Math.round(mean * 100) / 100,
      median: Math.round(median * 100) / 100,
      mode: Math.round(mode * 100) / 100,
      stddev: Math.round(Math.sqrt(variance) * 100) / 100
    },
    id: id
  });
}

function handlePredict(payload, id) {
  var valores = payload.valores, periodos = payload.periodos;
  if (!valores || valores.length < 2) {
    self.postMessage({ type: 'predict', payload: { error: 'Se requieren al menos 2 valores' }, id: id });
    return;
  }
  var n = valores.length;
  var xMean = (n - 1) / 2;
  var yMean = valores.reduce(function(a, b) { return a + b; }, 0) / n;
  var num = 0, den = 0;
  for (var i = 0; i < n; i++) {
    num += (i - xMean) * (valores[i] - yMean);
    den += (i - xMean) * (i - xMean);
  }
  var m = den !== 0 ? num / den : 0;
  var b = yMean - m * xMean;
  var predicciones = [];
  for (var j = 1; j <= (periodos || 3); j++) {
    predicciones.push(Math.round((m * (n - 1 + j) + b) * 100) / 100);
  }
  self.postMessage({
    type: 'predict',
    payload: {
      slope: Math.round(m * 100) / 100,
      intercept: Math.round(b * 100) / 100,
      predicciones: predicciones
    },
    id: id
  });
}
