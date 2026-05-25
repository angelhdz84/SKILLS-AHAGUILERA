# Stack offline-first (no negociable)

- ❌ `import`/`export`/`type="module"` — CORS en `file://` bloquea ES6 modules
- ❌ `fetch`/`axios`/CDNs en runtime — 100% offline, sin dependencias externas
- ❌ Build steps — la app se abre con doble clic en `index.html`
- ✅ Variables globales (`Alpine`, `Dexie`, `CryptoJS`) para reactividad
- ✅ `cryptoHelpers.encrypt()` en campos sensibles
- ✅ UI: DaisyUI + Bootstrap Icons + Animate.css
- ✅ Todo en español (UI, comentarios, docs)
