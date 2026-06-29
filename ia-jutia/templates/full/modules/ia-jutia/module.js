// modules/ia-jutia/module.js — IA Jutia (Full)
// Busqueda + Ingesta documentos + Chat QA + Predicciones
// Depende de: core/ia.js (window.ia), core/ia-ingest.js (window.iaIngest)

const ModuloIA = {
  id: 'ia-jutia',
  titulo: 'IA / Busqueda Inteligente',
  icono: 'bi bi-robot',

  async init() {
    console.log('🧠 [ia-jutia] Modulo IA Full listo');
    if (window.ia && !window.ia._modelosCargados) {
      await window.ia.initFull();
    }
  },

  async render(params = {}) {
    const q = params.query || '';
    return `
    <div x-data="iaFullData()" x-init="init('${q}')" class="animate__animated animate__fadeIn">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold flex items-center gap-2">
          <i class="bi bi-robot text-primary"></i> IA / Busqueda Inteligente
        </h2>
        <span class="badge badge-accent badge-sm">
          <i class="bi bi-stars me-1"></i>Full
        </span>
      </div>

      <!-- Buscador global -->
      <div class="card bg-base-100 shadow-xl p-4 mb-6">
        <label class="input input-bordered flex items-center gap-2">
          <i class="bi bi-search text-base-content/40"></i>
          <input type="text" x-model="query" @input.debounce="buscar()"
                 placeholder="Buscar en datos y documentos..."
                 class="grow bg-transparent border-0 outline-none" />
          <kbd class="kbd kbd-sm hidden sm:inline">Ctrl+K</kbd>
        </label>
      </div>

      <!-- Resultados busqueda -->
      <template x-if="query.length > 0">
        <div class="mb-6">
          <span class="text-sm text-base-content/60 mb-2 block">
            <template x-if="searching">Buscando...</template>
            <template x-if="!searching"><span x-text="resultados.length + ' resultados'"></span></template>
          </span>
          <template x-if="!searching && resultados.length === 0">
            <div class="text-center py-8 text-base-content/40">
              <i class="bi bi-inbox text-4xl"></i>
              <p class="mt-2">Sin resultados para "<span x-text="query"></span>"</p>
            </div>
          </template>
          <div class="space-y-2">
            <template x-for="r in resultados" :key="r.id">
              <div class="card bg-base-200 p-3 cursor-pointer hover:bg-base-300 transition-colors">
                <div class="flex items-start gap-3">
                  <i class="bi" :class="r.tabla === '_ia_docs' ? 'bi-file-earmark-text' : 'bi-table'"></i>
                  <div class="flex-1 min-w-0">
                    <p class="font-medium truncate" x-text="r.nombre || r.tabla"></p>
                    <p class="text-sm text-base-content/60 truncate" x-text="r.texto?.slice(0, 120)"></p>
                    <span class="badge badge-ghost badge-xs mt-1" x-text="r.tabla"></span>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </template>

      <!-- Panel principal (sin busqueda) -->
      <template x-if="!query">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Columna izquierda: Documentos -->
          <div class="space-y-4">
            <!-- Upload zone -->
            <div class="card bg-base-100 shadow-xl p-4">
              <h3 class="font-semibold flex items-center gap-2 mb-3">
                <i class="bi bi-cloud-upload text-primary"></i> Subir documento
              </h3>
              <div @drop.prevent="subirArchivo($event)"
                   @dragover.prevent="dragOver = true"
                   @dragleave="dragOver = false"
                   class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
                   :class="dragOver ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/50'"
                   @click="$refs.fileInput.click()">
                <i class="bi bi-file-earmark-plus text-3xl text-base-content/30"></i>
                <p class="text-sm text-base-content/60 mt-2">Arrastra archivos aqui o haz clic para subir</p>
                <p class="text-xs text-base-content/40 mt-1">PDF, DOCX, XLSX, CSV, MD, TXT, JSON</p>
                <input type="file" x-ref="fileInput" @change="subirArchivo($event)"
                       accept=".pdf,.docx,.xlsx,.csv,.md,.txt,.json" class="hidden" />
              </div>
              <template x-if="uploading">
                <div class="mt-3">
                  <progress class="progress progress-primary w-full" :value="uploadProgress" max="100"></progress>
                  <span class="text-xs text-base-content/60">Procesando documento...</span>
                </div>
              </template>
              <!-- OCR status indicator (v0.2) -->
              <div x-show="$store.ia?.ocrStatus"
                   x-cloak
                   class="mt-2 flex items-center gap-2 text-sm"
                   :class="$store.ia?.ocrStatus?.type === 'progress' ? 'text-info' : $store.ia?.ocrStatus?.type === 'done' ? 'text-success' : 'text-error'">
                <i class="bi" :class="$store.ia?.ocrStatus?.type === 'progress' ? 'bi-arrow-repeat animate-spin' : $store.ia?.ocrStatus?.type === 'done' ? 'bi-check-circle' : 'bi-exclamation-circle'"></i>
                <span x-text="$store.ia?.ocrStatus?.message"></span>
              </div>
            </div>

            <!-- Lista documentos -->
            <div class="card bg-base-100 shadow-xl p-4">
              <h3 class="font-semibold flex items-center gap-2 mb-3">
                <i class="bi bi-files text-secondary"></i> Documentos indexados
                <span class="badge badge-sm" x-text="documentos.length"></span>
              </h3>
              <template x-if="documentos.length === 0">
                <p class="text-sm text-base-content/40 text-center py-4">Aun no hay documentos subidos</p>
              </template>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                <template x-for="doc in documentos" :key="doc.id">
                  <div class="flex items-center justify-between p-2 bg-base-200 rounded-lg">
                    <div class="flex items-center gap-2 min-w-0">
                      <i class="bi" :class="iconoDoc(doc.tipo)"></i>
                      <div class="min-w-0">
                        <p class="text-sm truncate" x-text="doc.nombre"></p>
                        <p class="text-xs text-base-content/40">
                          <span x-text="doc.tipo?.toUpperCase()"></span>
                          <template x-if="doc.paginas"> · <span x-text="doc.paginas + ' pags'"></span></template>
                          · <span x-text="tamanoLegible(doc.tamano)"></span>
                        </p>
                      </div>
                    </div>
                    <button class="btn btn-ghost btn-xs btn-square text-error" @click="eliminarDoc(doc.id)">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </template>
              </div>
            </div>

            <!-- Stats overview -->
            <div class="card bg-base-100 shadow-xl p-4">
              <h3 class="font-semibold flex items-center gap-2 mb-3">
                <i class="bi bi-bar-chart text-accent"></i> Vista general
              </h3>
              <div class="grid grid-cols-2 gap-2">
                <template x-for="s in statsOverview" :key="s.tabla">
                  <div class="stat bg-base-200 rounded-lg p-2">
                    <div class="stat-title text-xs truncate" x-text="s.tabla"></div>
                    <div class="stat-value text-lg" x-text="s.registros"></div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- Columna derecha: Chat QA + Predicciones -->
          <div class="space-y-4">
            <!-- Chat QA -->
            <div class="card bg-base-100 shadow-xl p-4 flex flex-col" style="min-height: 400px;">
              <h3 class="font-semibold flex items-center gap-2 mb-3">
                <i class="bi bi-chat-dots text-info"></i> Pregunta sobre documentos
              </h3>
              <div class="flex-1 overflow-y-auto mb-3 space-y-3" style="max-height: 300px;" x-ref="chatBox">
                <template x-if="mensajes.length === 0">
                  <div class="text-center py-8 text-base-content/30">
                    <i class="bi bi-question-circle text-3xl"></i>
                    <p class="text-sm mt-2">Haz una pregunta sobre los documentos subidos</p>
                    <p class="text-xs mt-1">Ej: "Cual es el total de ventas?" o "Resume el contrato"</p>
                  </div>
                </template>
                <template x-for="(msg, i) in mensajes" :key="i">
                  <div>
                    <div class="chat chat-end" x-show="msg.rol === 'user'">
                      <div class="chat-bubble chat-bubble-primary text-sm" x-text="msg.texto"></div>
                    </div>
                    <div class="chat chat-start" x-show="msg.rol === 'ia'">
                      <div class="chat-bubble chat-bubble-info text-sm">
                        <p x-text="msg.texto"></p>
                        <template x-if="msg.fuente">
                          <p class="text-xs text-base-content/50 mt-1 border-t border-base-content/20 pt-1">
                            <i class="bi bi-link-45deg"></i> Fuente: <span x-text="msg.fuente"></span>
                            <template x-if="msg.score">
                              <span> · confianza: <span x-text="(msg.score * 100).toFixed(0) + '%'"></span></span>
                            </template>
                          </p>
                        </template>
                      </div>
                    </div>
                  </div>
                </template>
                <template x-if="chatting">
                  <div class="chat chat-start">
                    <div class="chat-bubble chat-bubble-ghost">
                      <span class="loading loading-dots loading-sm"></span>
                    </div>
                  </div>
                </template>
              </div>
              <form @submit.prevent="preguntar()" class="flex gap-2">
                <input type="text" x-model="preguntaActual" placeholder="Escribe tu pregunta..."
                       class="input input-bordered flex-1" :disabled="chatting" />
                <button type="submit" class="btn btn-info btn-square" :disabled="!preguntaActual || chatting">
                  <i class="bi bi-send"></i>
                </button>
              </form>
            </div>

            <!-- Predicciones -->
            <div class="card bg-base-100 shadow-xl p-4">
              <h3 class="font-semibold flex items-center gap-2 mb-3">
                <i class="bi bi-graph-up-arrow text-accent"></i> Predicciones
              </h3>
              <div class="flex flex-wrap gap-2 mb-3">
                <select x-model="predTabla" class="select select-bordered select-xs flex-1">
                  <option value="">Tabla...</option>
                  <template x-for="t in tablasDisponibles" :key="t">
                    <option :value="t" x-text="t"></option>
                  </template>
                </select>
                <select x-model="predCampo" class="select select-bordered select-xs flex-1">
                  <option value="">Campo...</option>
                </select>
                <button class="btn btn-accent btn-xs" @click="predecir()" :disabled="!predTabla || !predCampo">
                  <i class="bi bi-lightning-charge"></i> Predecir
                </button>
              </div>
              <template x-if="prediccion">
                <div class="bg-base-200 rounded-lg p-2">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="badge badge-xs" :class="prediccion.tendencia === 'creciente' ? 'badge-success' : 'badge-error'">
                      <i :class="prediccion.tendencia === 'creciente' ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                      <span x-text="prediccion.tendencia"></span>
                    </span>
                    <span class="text-xs text-base-content/60">R<sup>2</sup> = <span x-text="prediccion.r2"></span></span>
                  </div>
                  <div class="grid grid-cols-3 gap-1">
                    <template x-for="p in prediccion.proyectados" :key="p.periodo">
                      <div class="text-center p-1 bg-base-100 rounded text-xs">
                        P<span x-text="p.periodo"></span>: <span class="font-bold" x-text="formatoMoneda(p.valor)"></span>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    `;
  },

  destroy() {
    console.log('🧠 [ia-jutia] Destruido');
  }
};

window.MODULES = window.MODULES || {};
window.MODULES['ia-jutia'] = ModuloIA;

document.addEventListener('alpine:init', () => {
  Alpine.data('iaFullData', () => ({
    query: '',
    resultados: [],
    searching: false,
    dragOver: false,
    uploading: false,
    uploadProgress: 0,
    documentos: [],
    mensajes: [],
    chatting: false,
    preguntaActual: '',
    statsOverview: [],
    tablasDisponibles: [],
    predTabla: '',
    predCampo: '',
    prediccion: null,
    // v0.2 — OCR
    ocrStatus: null,
    // v0.2 — Chat historial
    chats: [],
    currentChat: null,
    messages: [],
    chatSidebarOpen: true,
    newChatTitle: '',
    showNewChatModal: false,
    pregunta: '',

    async init(q) {
      this.query = q || '';
      if (window.ia) {
        this.tablasDisponibles = window.ia._tables || [];
        this.documentos = Alpine.store('ia')?.documentos || [];
        const stats = await window.ia.statsAll();
        this.statsOverview = stats;
        await this.loadChats();
      }
      if (this.query) await this.buscar();
    },

    async buscar() {
      if (!this.query || !window.ia) return;
      this.searching = true;
      if (window.ia.searchHybrid) {
        this.resultados = await window.ia.searchHybrid(this.query);
      } else {
        this.resultados = await window.ia.search(this.query);
      }
      this.searching = false;
    },

    async subirArchivo(e) {
      const files = e.dataTransfer?.files || e.target?.files;
      if (!files?.length) return;
      this.uploading = true;
      this.uploadProgress = 10;
      for (const file of files) {
        if (file.size > 50 * 1024 * 1024) {
          window.UI?.toast?.('Archivo muy grande (max 50MB)', 'error');
          continue;
        }
        this.uploadProgress = 30;
        const result = await window.ia.ingestFile(file);
        // v0.2 — OCR status from store
        this.ocrStatus = Alpine.store('ia')?.ocrStatus || null;
        this.uploadProgress = 100;
        if (result?.error) {
          window.UI?.toast?.(result.error, 'error');
        } else {
          window.UI?.toast?.(`${result.nombre} indexado (${result.chunks} chunks)`, 'success');
        }
      }
      this.uploading = false;
      this.uploadProgress = 0;
      setTimeout(() => { this.ocrStatus = null; }, 4000);
    },

    async preguntar() {
      const q = this.pregunta || this.preguntaActual;
      if (!q || !window.ia) return;

      // Auto-create chat if none selected
      if (!this.currentChat) {
        const chat = await window.ia.chatNew(q.slice(0, 50));
        this.currentChat = chat;
        await this.loadChats();
      }

      // Save user message
      await this.saveMessage('user', q);
      this.pregunta = '';
      this.preguntaActual = '';
      this.chatting = true;

      const result = await window.ia.qa(q);

      // Save assistant message
      await this.saveMessage('ia', result.respuesta, result.fuente, result.score);
      this.chatting = false;

      this.$nextTick(() => {
        if (this.$refs.chatBox) {
          this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
        }
      });
    },

    // v0.2 — alias for new HTML templates
    async hacerPregunta() {
      await this.preguntar();
    },

    async eliminarDoc(id) {
      await window.ia.deleteDocumento(id);
      this.documentos = Alpine.store('ia')?.documentos || [];
      window.UI?.toast?.('Documento eliminado', 'info');
    },

    async predecir() {
      if (!window.ia || !this.predTabla || !this.predCampo) return;
      this.prediccion = await window.ia.predict(this.predTabla, this.predCampo, 5);
    },

    iconoDoc(tipo) {
      const mapa = { pdf: 'bi-filetype-pdf', docx: 'bi-filetype-docx', xlsx: 'bi-filetype-xlsx', csv: 'bi-filetype-csv', md: 'bi-filetype-md' };
      return mapa[tipo] || 'bi-file-earmark';
    },

    tamanoLegible(bytes) {
      if (!bytes) return '';
      const u = ['B', 'KB', 'MB', 'GB'];
      let i = 0;
      let s = bytes;
      while (s >= 1024 && i < u.length - 1) { s /= 1024; i++; }
      return s.toFixed(1) + ' ' + u[i];
    },

    formatoMoneda(v) {
      if (v == null) return '';
      return '$' + Number(v).toLocaleString('es', { minimumFractionDigits: 2 });
    },

    // v0.2 — Chat methods
    async loadChats() {
      if (window.ia && window.ia.chatList) {
        this.chats = await window.ia.chatList();
      }
    },

    async selectChat(chatId) {
      if (!window.ia || !window.ia.chatLoad) return;
      const data = await window.ia.chatLoad(chatId);
      this.currentChat = data.chat;
      this.messages = data.messages;
      this.chatSidebarOpen = false;
    },

    async createChat() {
      const title = this.newChatTitle.trim() || 'Nueva conversacion';
      if (window.ia && window.ia.chatNew) {
        const chat = await window.ia.chatNew(title);
        this.currentChat = chat;
        this.messages = [];
        this.showNewChatModal = false;
        this.newChatTitle = '';
        await this.loadChats();
      }
    },

    async deleteChat(chatId) {
      if (!window.ia || !window.ia.chatDelete) return;
      await window.ia.chatDelete(chatId);
      if (this.currentChat && this.currentChat.id === chatId) {
        this.currentChat = null;
        this.messages = [];
      }
      await this.loadChats();
    },

    async saveMessage(rol, content, fuente, score) {
      if (!this.currentChat || !window.ia || !window.ia.chatAddMessage) return;
      const msg = await window.ia.chatAddMessage(
        this.currentChat.id, rol, content, fuente, score
      );
      this.messages.push(msg);
      return msg;
    }
  }));
});
