// modules/ia-jutia/ia-worker.js — IA Jutia Web Worker (Full+ DLC)
// Creado dinamicamente por ia-full.js (embed) para NO bloquear la UI al
// cargar el modelo ONNX de embeddings (all-MiniLM-L6-v2, ~23MB) ni al generar vectores.
// Transformers.js UMD se carga aqui con importScripts (ruta local, 100% offline).
// Sintaxis ES5 compatible con promesas (sin import/export).
//
// Nota: requiere servirse por HTTP (fetch de modelos bloqueado en file://).
// Si el worker falla, ia-full.js hace fallback a pipeline en main thread.

// Cargar Transformers.js UMD (local). Si falla, se reporta al primer mensaje.
var __iaWorkerInitError = null;
try {
  importScripts('modules/ia-jutia/assets/transformers.min.js');
} catch (e) {
  __iaWorkerInitError = (e && e.message) || String(e);
}

self.onmessage = function(e) {
  var msg = e.data || {};
  switch (msg.type) {
    case 'init':
      _handleInit(msg);
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

function _handleInit(msg) {
  if (__iaWorkerInitError) {
    self.postMessage({ type: 'error', message: 'Transformers.js no cargo en worker: ' + __iaWorkerInitError });
    return;
  }
  if (typeof self.Transformers === 'undefined') {
    self.postMessage({ type: 'error', message: 'Transformers.js no disponible en worker' });
    return;
  }
  _configurarOffline(msg.modelPath);
  self.postMessage({ type: 'ready', worker: 'ia-jutia', version: '1.0-plugin-full' });
}

function _configurarOffline(modelPath) {
  self.Transformers.env = self.Transformers.env || {};
  self.Transformers.env.localModelPath = modelPath || 'modules/ia-jutia/models/';
  self.Transformers.env.allowRemoteModels = false;
  self.Transformers.env.backends = self.Transformers.env.backends || {};
  self.Transformers.env.backends.onnx = self.Transformers.env.backends.onnx || {};
  self.Transformers.env.backends.onnx.wasm = self.Transformers.env.backends.onnx.wasm || {};
  self.Transformers.env.backends.onnx.wasm.wasmPaths = 'modules/ia-jutia/assets/wasm/';
}

function _handleEmbed(msg) {
  var texto = msg.text || '';
  if (!texto) {
    self.postMessage({ type: 'embed_result', vector: [], dimension: 0 });
    return;
  }

  try {
    if (__iaWorkerInitError || typeof self.Transformers === 'undefined') {
      self.postMessage({
        type: 'embed_result',
        vector: [],
        dimension: 0,
        error: 'Transformers.js no disponible en worker'
      });
      return;
    }

    _configurarOffline(msg.modelPath);

    var pipelineFn = self.Transformers.pipeline;

    // Cachear pipeline: no recargar el modelo ONNX por mensaje
    var p = self._pipeline || pipelineFn('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    self._pipeline = p;

    p.then(function(extract) {
      return extract(texto, { pooling: 'mean', normalize: true });
    }).then(function(result) {
      var data = result.tolist ? result.tolist() : (result.data || []);
      // El tensor de feature-extraction tiene forma [1, dim]; aplanar si es 2D
      if (data && data.length === 1 && Array.isArray(data[0])) {
        data = data[0];
      }
      var dim = Array.isArray(data) ? data.length : 0;
      self.postMessage({ type: 'embed_result', vector: data, dimension: dim });
    }).catch(function(err) {
      // Resetear pipeline cacheado para permitir reintento en el proximo mensaje
      self._pipeline = null;
      self.postMessage({
        type: 'embed_result',
        vector: [],
        dimension: 0,
        error: (err && err.message) || String(err)
      });
    });
  } catch (e) {
    self._pipeline = null;
    self.postMessage({
      type: 'embed_result',
      vector: [],
      dimension: 0,
      error: (e && e.message) || String(e)
    });
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
  } catch (e) {
    self.postMessage({
      type: 'qa_result',
      respuesta: 'No se encontro respuesta',
      confianza: 0,
      chunkId: null,
      error: (e && e.message) || String(e)
    });
  }
}
