// core/ia-worker.js — Transformers.js en Web Worker + q4 quantization
// Cargado como: new Worker('core/ia-worker.js')
// Dependencias: Transformers.js en assets/js/libs/ (cargado via importScripts)

let qaPipeline = null;
let embedPipeline = null;
let initialized = false;

self.addEventListener('message', async (e) => {
  const { type, id, data } = e.data;

  try {
    if (type === 'init') {
      if (initialized) {
        self.postMessage({ type: 'init-done', id });
        return;
      }
      importScripts('../assets/js/libs/transformers.min.js');
      if (typeof pipeline === 'undefined') {
        self.postMessage({ type: 'error', id, error: 'Transformers.js no disponible en Worker' });
        return;
      }
      // WebGPU si disponible (WebView2 Edge Chromium 113+), fallback WASM automatico
      const device = self.navigator?.gpu ? 'webgpu' : 'wasm';
      qaPipeline = await pipeline('question-answering', 'Xenova/bert-base-multilingual-uncased-squad', {
        local: true,
        dtype: 'q4',
        device,
        modelPath: 'assets/models/bert-qa.onnx'
      });
      embedPipeline = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        local: true,
        dtype: 'q4',
        device,
        modelPath: 'assets/models/minilm-embeddings.onnx'
      });
      initialized = true;
      self.postMessage({ type: 'init-done', id });
      return;
    }

    if (type === 'qa') {
      if (!qaPipeline) {
        self.postMessage({ type: 'error', id, error: 'QA pipeline no inicializado' });
        return;
      }
      const { pregunta, chunks } = data;
      let mejorRespuesta = null;
      for (const chunk of chunks) {
        try {
          const result = await qaPipeline(pregunta, chunk.texto);
          if (!mejorRespuesta || result.score > mejorRespuesta.score) {
            mejorRespuesta = {
              respuesta: result.answer,
              score: result.score,
              contexto: chunk.texto.slice(0, 300),
              docId: chunk.docId
            };
          }
        } catch (e) { /* skip chunk */ }
      }
      self.postMessage({ type: 'qa-result', id, data: mejorRespuesta });
      return;
    }

    if (type === 'embed') {
      if (!embedPipeline) {
        self.postMessage({ type: 'error', id, error: 'Embed pipeline no inicializado' });
        return;
      }
      const { texto } = data;
      const embedding = await embedPipeline(texto, { pooling: 'mean', normalize: true });
      self.postMessage({ type: 'embed-result', id, data: Array.from(embedding.data) });
      return;
    }
  } catch (err) {
    self.postMessage({ type: 'error', id, error: err.message });
  }
});
