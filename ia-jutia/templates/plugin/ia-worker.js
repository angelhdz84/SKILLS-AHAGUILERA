// modules/ia-jutia/ia-worker.js — IA Jutia Web Worker (Full+ DLC)
// Cargado por ia-full.js cuando Transformers.js esta disponible
// Usa importScripts() para cargar UMD bundle
// ES5 compatible syntax

self.onmessage = function(e) {
  var msg = e.data || {};

  switch (msg.type) {
    case 'init':
      // Transformers.js UMD debe estar cargado via importScripts ANTES de crear el worker
      self.postMessage({ type: 'ready', worker: 'ia-jutia', version: '1.0-plugin-full' });
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
    // Configurar rutas WASM offline (como ia-full.js)
    if (self.Transformers.env.backends && self.Transformers.env.backends.onnx) {
      self.Transformers.env.backends.onnx.wasm = self.Transformers.env.backends.onnx.wasm || {};
      self.Transformers.env.backends.onnx.wasm.wasmPaths = 'modules/ia-jutia/assets/wasm/';
    }

    var pipelineFn = self.Transformers.pipeline;

    // Cachear pipeline para no recargar el modelo ONNX por mensaje
    var p = self._pipeline || pipelineFn('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    self._pipeline = p;

    p.then(function(extract) {
      return extract(texto, { pooling: 'mean', normalize: true });
    }).then(function(result) {
      var data = result.tolist ? result.tolist() : (result.data || []);
      var dim = 0;
      if (Array.isArray(data) && data.length > 0) {
        dim = Array.isArray(data[0]) ? data[0].length : data.length;
      }
      self.postMessage({
        type: 'embed_result',
        vector: data,
        dimension: dim
      });
    }).catch(function(err) {
      self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: (err && err.message) || String(err) });
    });
  } catch(e) {
    self.postMessage({ type: 'embed_result', vector: [], dimension: 0, error: (e && e.message) || String(e) });
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

  try {
    // Retrieval por coincidencia keyword (sin modelo QA — decision de producto)
    var best = null;
    var bestScore = 0;
    // Filtrar stop-words (<=2 chars) para no diluir la confianza
    var qWords = pregunta.toLowerCase().split(/\s+/).filter(function(w) { return w.length > 2; });
    for (var i = 0; i < chunks.length; i++) {
      if (!chunks[i] || !chunks[i].texto) continue;
      var text = chunks[i].texto.toLowerCase();
      var score = 0;
      for (var j = 0; j < qWords.length; j++) {
        if (text.indexOf(qWords[j]) !== -1) {
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
      confianza: qWords.length > 0 ? bestScore / qWords.length : 0,
      chunkId: best ? best.id : null
    });
  } catch(e) {
    self.postMessage({
      type: 'qa_result',
      respuesta: 'No se encontro respuesta',
      confianza: 0,
      chunkId: null,
      error: (e && e.message) || String(e)
    });
  }
}
