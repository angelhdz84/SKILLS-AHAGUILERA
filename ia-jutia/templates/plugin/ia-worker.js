// modules/ia-jutia/ia-worker.js — IA Jutia Web Worker (Full DLC)
// Workers are self-contained — they use self.onmessage pattern
// ES5 compatible syntax
// Uso: new Worker('modules/ia-jutia/ia-worker.js')

self.onmessage = function(e) {
  var msg = e.data || {};
  
  switch (msg.type) {
    case 'init':
      // In a real deployment, this would import transformers.js
      // importScripts(self.modelPath + '/transformers.min.js');
      self.postMessage({ type: 'ready', worker: 'ia-jutia', version: '1.0' });
      break;
      
    case 'qa':
      // Placeholder QA — real impl would call pipeline('question-answering', ...)
      var chunks = msg.chunks || [];
      var question = msg.question || '';
      
      // Simple keyword matching as placeholder
      var best = null;
      var bestScore = 0;
      var qWords = question.toLowerCase().split(/\s+/);
      
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
      break;
      
    case 'embed':
      // Placeholder embedding — returns random vector
      var vector = [];
      var dim = 384;
      for (var vi = 0; vi < dim; vi++) {
        vector.push(Math.random() * 2 - 1);
      }
      self.postMessage({
        type: 'embed_result',
        vector: vector,
        dimension: dim
      });
      break;
      
    default:
      self.postMessage({ type: 'error', message: 'Tipo de mensaje desconocido: ' + msg.type });
  }
};
