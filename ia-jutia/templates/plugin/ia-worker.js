// modules/ia-jutia/ia-worker.js — IA Jutia Web Worker (Full+ DLC)
// Cargado por ia-full.js cuando Transformers.js esta disponible
// Usa importScripts() para cargar UMD bundle
// ES5 compatible syntax

self.onmessage = function(e) {
  var msg = e.data || {};

  switch (msg.type) {
    case 'init':
      // Transformers.js UMD debe estar cargado via importScripts ANTES de crear el worker
      self.postMessage({ type: 'ready', worker: 'ia-jutia', version: '2.0-full' });
      break;

    case 'embed':
      _handleEmbed(msg);
      break;

    case 'qa':
      _handleQA(msg);
      break;

    default:
      self.postMessage({ type: 'error', message: 'Tipo desconocido: ' + msg.type });
  }
};

function _handleEmbed(msg) {
  var texto = msg.text || '';
  if (!texto) {
    self.postMessage({ type: 'embed_result', vector: [], dimension: 0 });
    return;
  }

  // Usar Transformers.js pipeline
  try {
    if (typeof self.Transformers === 'undefined') {
      self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: 'Transformers.js no disponible' });
      return;
    }

    self.Transformers.env.localModelPath = msg.modelPath || 'modules/ia-jutia/models/';
    self.Transformers.env.allowRemoteModels = false;

    var pipeline = self.Transformers.pipeline;

    pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2').then(function(extract) {
      return extract(texto, { pooling: 'mean', normalize: true });
    }).then(function(result) {
      var data = result.tolist ? result.tolist() : [];
      self.postMessage({
        type: 'embed_result',
        vector: data,
        dimension: Array.isArray(data) && data.length > 0 && Array.isArray(data[0]) ? data[0].length : 384
      });
    }).catch(function(err) {
      self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: err.message });
    });
  } catch(e) {
    self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: e.message });
  }
}

function _handleQA(msg) {
  // Decision de producto: retrieval por keyword, SIN modelo QA NLP.
  // QA literal con modelo NLP se difiere a fase futura si el producto lo requiere.
  var pregunta = msg.question || '';
  var chunks = msg.chunks || [];

  if (!pregunta || chunks.length === 0) {
    self.postMessage({
      type: 'qa_result',
      respuesta: 'No se encontro respuesta',
      confianza: 0,
      chunkId: null
    });
    return;
  }

  // Retrieval por coincidencia keyword (sin modelo QA — decision de producto)
  var best = null;
  var bestScore = 0;
  var qWords = pregunta.toLowerCase().split(/\s+/);
  for (var i = 0; i < chunks.length; i++) {
    var text = (chunks[i].texto || '').toLowerCase();
    var score = 0;
    for (var j = 0; j < qWords.length; j++) {
      if (qWords[j].length > 2 && text.indexOf(qWords[j]) !== -1) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = chunks[i];
    }
  }
  self.postMessage({
    type: 'qa_result',
    respuesta: best ? best.texto.slice(0, 500) : 'No se encontro respuesta',
    confianza: bestScore / Math.max(qWords.length, 1),
    chunkId: best ? best.id : null
  });
}
