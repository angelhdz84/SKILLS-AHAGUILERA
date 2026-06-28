# Stack offline-first (no negociable)

## Reglas comunes (todos los perfiles)

- ✅ Variables globales (`Alpine`, `Dexie`, `CryptoJS`) para reactividad
- ✅ `cryptoHelpers.encrypt()` en campos sensibles (CryptoJS en ambos)
- ✅ UI: DaisyUI + Bootstrap Icons + Animate.css en español
- ❌ CDNs en runtime — todo local en `assets/` o vía npm bundle
- ❌ Fetch/axios para datos — usar Dexie (IndexedDB local)
- ✅ Todo en español (UI, comentarios, docs)

## Perfil Lite (Essential — file://)

- ❌ `import`/`export`/`type="module"` — CORS en `file://` bloquea ES6 modules
- ❌ Build steps — la app se abre con doble clic en `index.html`
- ✅ Librerías en `assets/js/libs/` vía curl
- ✅ Service Worker para PWA opcional
- **Nivel comercial:** Essential
- **IA Jutía:** Lite (FlexSearch + estadísticas + predicciones)
- **Entregable:** ZIP + GitHub Pages. HTML visible (demo online)

## Perfil Professional (Neutralino .exe + Fixed WebView2)

- ✅ `import`/`export` NO permitido en `public/` (mismo que Lite, mismo código)
- ✅ Build .exe: `neu build --release` + `package-professional.ps1`
- ✅ **Sin dependencia de WebView2 del sistema** — incluye Fixed Version embebida
- ✅ Fixed WebView2 stripped: solo x64 + es-419.pak + swiftshader (WebGPU)
- ✅ Ventana nativa, bandeja sistema, notificaciones (sin terminal)
- ✅ Neutralino API vía `window.Neutrino` en `public/core/neutralino.js`
- ✅ `neutralino.config.json` en raíz del proyecto
- ✅ Mismo frontend que Lite en `public/` (Alpine + Dexie + CryptoJS + DaisyUI)
- ✅ **IA Jutía Full incluida**: FlexSearch + ingesta documentos + QA (WebGPU acelerado)
- ✅ **Sin HTML visible para el cliente** (resources.neu ofuscado con terser)
- ❌ No incluye .apk (solo .exe Windows)
- 📦 Tamaño entregable: ~30MB ZIP (app ~3MB + WebView2 fixed stripped ~53MB → ~28MB comprimido)

## Perfil Business (Professional + .apk + branding + docs)

- Todo lo del perfil Professional, más:
- ✅ Build .apk: `npx cap sync android && cd android && ./gradlew assembleRelease`
- ✅ .apk Android nativo con Capacitor (SQLite FTS5, cámara, GPS, notificaciones, compartir)
- ✅ `capacitor.config.json` en raíz del proyecto
- ✅ `android/` directorio con proyecto Gradle
- ✅ Branding personalizado: logo, colores, nombre del cliente aplicados en toda la UI
- ✅ Documentación personalizada: `GUIA_USUARIO.md`, `GUIA_INSTALACION.md`
- 📦 Tamaño entregable: ~35MB ZIP
