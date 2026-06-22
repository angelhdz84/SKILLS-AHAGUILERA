# Stack offline-first (no negociable)

## Reglas comunes (ambos perfiles)

- ✅ Variables globales (`Alpine`, `Dexie`, `CryptoJS`) para reactividad
- ✅ `cryptoHelpers.encrypt()` en campos sensibles (CryptoJS en ambos)
- ✅ UI: DaisyUI + Bootstrap Icons + Animate.css en español
- ❌ CDNs en runtime — todo local en `assets/` o vía npm bundle
- ❌ Fetch/axios para datos — usar Dexie (IndexedDB local)
- ✅ Todo en español (UI, comentarios, docs)

## Perfil Lite (file://)

- ❌ `import`/`export`/`type="module"` — CORS en `file://` bloquea ES6 modules
- ❌ Build steps — la app se abre con doble clic en `index.html`
- ✅ Librerías en `assets/js/libs/` vía curl
- ✅ Service Worker para PWA opcional

## Perfil Full (NeutralinoJS .exe + Capacitor .apk)

- ✅ `import`/`export` NO permitido en `public/` (mismo que Lite, mismo código)
- ✅ Build .exe: `neu build --release` → `dist/[app]-win_x64.zip` (~2MB runtime)
- ✅ Build .apk: `npx cap sync android && cd android && ./gradlew assembleRelease`
- ✅ Ventana nativa, bandeja sistema, notificaciones (sin terminal)
- ✅ .apk Android nativo con Capacitor (WebView Chrome, plugins nativos)
- ✅ Neutralino API vía `window.Neutrino` en `public/core/neutralino.js`
- ✅ Dependencias vía `npm install` (no Bun)
- ✅ `neutralino.config.json` en raíz del proyecto
- ✅ `capacitor.config.json` en raíz del proyecto (si se genera .apk)
- ✅ `android/` directorio con proyecto Gradle (si se genera .apk)
- ✅ Descargar `neutralino.js`: `curl -o public/core/neutralino.js https://raw.githubusercontent.com/neutralinojs/neutralino.js/main/neutralino.js`
- ✅ Mismo frontend que Lite en `public/` (Alpine + Dexie + CryptoJS + DaisyUI)
- ✅ **Runtime detection**: `window.CAPACITOR` y `window.native.*` helpers con fallback web
- ✅ **Plugins Capacitor**: SQLite FTS5 nativo, cámara, GPS, notificaciones, compartir
- Opcional: WebGPU acceleration en WebView2 (Edge Chromium) / Android WebView para Transformers.js
