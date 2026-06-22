---
name: capacitor-android
description: Configura Capacitor para generar .apk Android nativo desde apps del stack offline-first. Incluye plugins: SQLite nativo (FTS5), cámara, GPS, notificaciones, compartir. Convierte la app web en APK publicable en Google Play.
license: MIT
compatibility: Requiere Android Studio (o command line tools), JDK 17+, Gradle. Node.js >= 18. npm install @capacitor/core @capacitor/cli.
meta:
  author: Angel Hernandez - ahaguilera.dev
  version: "1.0"
  triggers:
    - "apk"
    - "android"
    - "capacitor"
    - "movil"
    - "telefono"
    - "google play"
    - "empaquetar movil"
    - "build android"
  stack: ["capacitor", "android", "gradle", "npm"]
  perfiles: [full]
  language: es
---

# SKILL: capacitor-android (Empaquetado .apk nativo con Capacitor)

> **Proposito**: Configurar Capacitor para generar .apk Android desde apps del stack Ateje. Mismo frontend (Alpine + Dexie + DaisyUI) en WebView nativo, con plugins para SQLite FTS5, cámara, GPS, notificaciones y compartir.
> **Input**: Proyecto generado con `public/` (index.html, core/, modules/, assets/)
> **Output**: `android/` + `capacitor.config.json` + `.apk` firmado listo para distribuir

---

## REGLAS FUNDAMENTALES

1. **NO modificar el frontend** — El HTML/JS/CSS corre igual en WebView Android
2. **NO reescribir módulos** — Solo agregar deteccion runtime (`if (Capacitor)`)
3. **SI mantener fallback web** — Si Capacitor no esta disponible, la app funciona con APIs web
4. **SI usar @capacitor-community/sqlite** para SQLite nativo (FTS5) en lugar de sql.js WASM
5. **NO incluir modelos Transformers.js de 230MB en el .apk** — Descargar bajo demanda

---

## FASE 0: Deteccion de Necesidad

Antes de iniciar, confirma que el proyecto requiere .apk:

```
📋 ¿Generar .apk Android con Capacitor?

[1] Si, configurar Capacitor + plugins nativos
[2] No, solo .exe (Neutralino) + web (GitHub Pages)
[3] Cancelar
```

### Prerequisitos

1. Verifica entorno:
```
🔍 Verificando requisitos Capacitor...
  node --version: >= 18
  npm --version: (viene con Node)
  Java --version: >= 17 (para Gradle)
  Android SDK: ¿instalado? [Si/No]
```

2. Si falta Android SDK:
```
❌ Android SDK no detectado.
Instalación:
  Opcion A: Android Studio → SDK Manager → SDK 33+
  Opcion B: command line tools → sdkmanager "platforms;android-33"
```

3. Si todo listo, confirma: `✅ Entorno validado.`

---

## FASE 1: Inicializar Capacitor

```
[▓▓▓░░░░░░░░░░░░░] 20% • Instalando Capacitor...
```

1. Instalar dependencias base:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

2. Inicializar Capacitor:
```bash
npx cap init "AppName" "com.empresa.app" --web-dir "public"
```

3. Agregar plataforma Android:
```bash
npx cap add android
```

4. Verificar estructura generada:
```
📁 proyecto/
  ├── android/                    ← Proyecto Android nativo (Gradle)
  │   ├── app/
  │   │   ├── src/main/
  │   │   │   ├── AndroidManifest.xml
  │   │   │   ├── java/com/empresa/app/
  │   │   │   └── res/
  │   │   └── build.gradle
  │   ├── build.gradle
  │   └── settings.gradle
  ├── public/                     ← WebApp (sin cambios)
  ├── capacitor.config.json       ← Config Capacitor
  └── package.json
```

5. Confirmar:
```
✅ Capacitor inicializado.
  App: AppName
  ID: com.empresa.app
  WebDir: public/
  Android: android/
```

---

## FASE 2: Instalar Plugins Nativos

```
[▓▓▓▓▓░░░░░░░░░░░] 40% • Instalando plugins nativos...
```

### 2.1 SQLite nativo con FTS5

```bash
npm install @capacitor-community/sqlite
npx cap sync android
```

Configurar en `capacitor.config.json`:
```json
{
  "plugins": {
    "CapacitorSQLite": {
      "androidIsEncrypted": false,
      "iosIsEncrypted": false
    }
  }
}
```

**Uso en JS (runtime detection):**
```javascript
async function initSQLiteNative() {
  if (typeof Capacitor === 'undefined') return fallbackWeb();
  try {
    const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
    const db = await CapacitorSQLite.createConnection({
      database: 'ia-jutia',
      version: 1,
      encrypted: false,
      mode: 'no-encryption'
    });
    await db.open();
    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(texto, docId)
    `);
    return db;
  } catch (e) {
    return fallbackWeb();
  }
}
```

### 2.2 Camara

```bash
npm install @capacitor/camera
npx cap sync android
```

**Uso:**
```javascript
async function tomarFoto() {
  if (typeof Capacitor !== 'undefined' && Capacitor.isPluginAvailable('Camera')) {
    const { Camera, CameraResultType } = await import('@capacitor/camera');
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      quality: 90
    });
    return photo.dataUrl;
  }
  // Fallback web: input file
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    };
    input.click();
  });
}
```

### 2.3 Geolocalizacion

```bash
npm install @capacitor/geolocation
npx cap sync android
```

**Uso:**
```javascript
async function obtenerPosicion() {
  if (typeof Capacitor !== 'undefined' && Capacitor.isPluginAvailable('Geolocation')) {
    const { Geolocation } = await import('@capacitor/geolocation');
    const pos = await Geolocation.getCurrentPosition();
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  }
  // Fallback web: browser navigator.geolocation
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      reject
    );
  });
}
```

### 2.4 Notificaciones locales

```bash
npm install @capacitor/local-notifications
npx cap sync android
```

**Uso:**
```javascript
async function mostrarNotificacion(titulo, cuerpo) {
  if (typeof Capacitor !== 'undefined' && Capacitor.isPluginAvailable('LocalNotifications')) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    await LocalNotifications.schedule({
      notifications: [{ title: titulo, body: cuerpo, id: Date.now() }]
    });
  } else {
    // Fallback web: Notification API del navegador
    if (Notification.permission === 'granted') {
      new Notification(titulo, { body: cuerpo });
    }
  }
}
```

### 2.5 Compartir nativo

```bash
npm install @capacitor/share
npx cap sync android
```

**Uso:**
```javascript
async function compartir(texto) {
  if (typeof Capacitor !== 'undefined' && Capacitor.isPluginAvailable('Share')) {
    const { Share } = await import('@capacitor/share');
    await Share.share({ text: texto });
  } else {
    // Fallback web: Web Share API
    if (navigator.share) {
      await navigator.share({ text: texto });
    } else {
      await navigator.clipboard.writeText(texto);
    }
  }
}
```

### 2.6 Verificar sync de plugins

```bash
npx cap sync android
```

```
✅ Plugins instalados:
  - @capacitor/core
  - @capacitor/android
  - @capacitor-community/sqlite (FTS5 nativo)
  - @capacitor/camera
  - @capacitor/geolocation
  - @capacitor/local-notifications
  - @capacitor/share
```

---

## FASE 3: Adaptar Codigo Frontend

```
[▓▓▓▓▓▓▓░░░░░░░░░] 60% • Adaptando codigo para deteccion runtime...
```

### 3.1 Deteccion universal de Capacitor

Agregar al inicio de `core/app.js` o `main.js`:

```javascript
// Detectar entorno: Capacitor (Android nativo) vs web
window.CAPACITOR = typeof Capacitor !== 'undefined';

// Helper universal para usar plugins nativos con fallback web
window.native = {
  async camera() {
    if (window.CAPACITOR && Capacitor.isPluginAvailable('Camera')) {
      const { Camera, CameraResultType } = await import('@capacitor/camera');
      const photo = await Camera.getPhoto({ resultType: CameraResultType.DataUrl });
      return photo.dataUrl;
    }
    return fallbackFileInput();
  },
  async geolocation() {
    if (window.CAPACITOR && Capacitor.isPluginAvailable('Geolocation')) {
      const { Geolocation } = await import('@capacitor/geolocation');
      const pos = await Geolocation.getCurrentPosition();
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }
    return browserGeolocation();
  },
  async notify(title, body) {
    if (window.CAPACITOR && Capacitor.isPluginAvailable('LocalNotifications')) {
      const { LocalNotifications } = await import('@capacitor/local-notifications');
      await LocalNotifications.schedule({ notifications: [{ title, body, id: Date.now() }] });
    } else if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  },
  async share(text) {
    if (window.CAPACITOR && Capacitor.isPluginAvailable('Share')) {
      const { Share } = await import('@capacitor/share');
      await Share.share({ text });
    } else if (navigator.share) {
      await navigator.share({ text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  }
};
```

### 3.2 SQLite nativo para IA Jutia (FTS5)

En el perfil Full con Capacitor, el modulo `ia-sqlite.js` debe detectar
si puede usar el plugin nativo en vez de sql.js (WASM):

```javascript
// En ia-sqlite.js, despues de init():
async _initCapacitorSQLite() {
  if (typeof Capacitor === 'undefined') return false;
  try {
    const { CapacitorSQLite } = await import('@capacitor-community/sqlite');
    const db = await CapacitorSQLite.createConnection({
      database: 'ia-jutia',
      version: 1,
      encrypted: false,
      mode: 'no-encryption'
    });
    await db.open();
    await db.execute(`
      CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(texto, docId)
    `);
    this._capDb = db;
    this.ready = true;
    console.log('🧠 ia-sqlite: SQLite nativo (Capacitor) listo con FTS5');
    return true;
  } catch (e) {
    console.warn('⚠️ ia-sqlite: Error SQLite nativo, fallback WASM:', e.message);
    return false;
  }
}
```

### 3.3 Cargar modelos IA bajo demanda

En Android, los modelos Transformers.js (~230MB) NO deben incluirse en el .apk.
Descargar bajo demanda la primera vez:

```javascript
async function descargarModelosSiNecesario() {
  const modelos = [
    { ruta: 'assets/models/bert-qa.onnx', url: 'https://huggingface.co/Xenova/bert-base-multilingual-uncased-squad/resolve/main/onnx/model.onnx' },
    { ruta: 'assets/models/minilm-embeddings.onnx', url: 'https://huggingface.co/Xenova/all-MiniLM-L6-v2/resolve/main/onnx/model.onnx' }
  ];
  for (const m of modelos) {
    const existe = await fetch(m.ruta, { method: 'HEAD' }).then(r => r.ok).catch(() => false);
    if (!existe) {
      // Descargar y guardar en assets/models/
      const resp = await fetch(m.url);
      const blob = await resp.blob();
      // Guardar via Capacitor Filesystem o Dexie como blob
      await saveToAssets(m.ruta, blob);
    }
  }
}
```

---

## FASE 4: Build .apk

```
[▓▓▓▓▓▓▓▓▓▓░░░░░░] 80% • Compilando .apk...
```

### 4.1 Sync web → Android

Sincronizar el codigo web actualizado con el proyecto Android:

```bash
npx cap sync android
```

### 4.2 Build release

```bash
cd android
./gradlew assembleRelease
cd ..
```

### 4.3 Verificar APK

```bash
if (Test-Path "android/app/build/outputs/apk/release/app-release.apk") {
  "✅ APK generado: android/app/build/outputs/apk/release/app-release.apk"
}
```

### 4.4 Firmar .apk (opcional, para Play Store)

Para distribuir en Google Play, firmar con keystore:

```bash
cd android
./gradlew bundleRelease  # Genera .aab para Play Store
# O firmar .apk directamente:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore mi-keystore.jks app-release-unsigned.apk alias-name
```

### 4.5 Reporte

```
✅ APK GENERADO

Resumen:
  App: AppName (com.empresa.app)
  APK: android/app/build/outputs/apk/release/app-release.apk
  Tamaño: ~5MB base + modelos IA (descarga unica ~230MB)
  Plugins: SQLite FTS5, Camara, GPS, Notificaciones, Compartir
  SDK minima: Android 8 (API 26)
  Target SDK: Android 14 (API 34)

📱 Instalar en dispositivo:
  adb install android/app/build/outputs/apk/release/app-release.apk

🚀 Publicar en Play Store:
  - Generar .aab: cd android && ./gradlew bundleRelease
  - Subir a Google Play Console
```

---

## FASE 5: CI/CD para Build Automatico

```
[▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░] 95% • Configurando CI...
```

Agregar workflow `.github/workflows/build-apk.yml`:

```yaml
name: Build APK
on:
  push:
    tags: ['v*']
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - name: Setup Android SDK
        uses: android-actions/setup-android@v3
      - name: Install dependencies
        run: npm ci
      - name: Sync Capacitor
        run: npx cap sync android
      - name: Build APK
        run: cd android && ./gradlew assembleRelease
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: app-release.apk
          path: android/app/build/outputs/apk/release/app-release.apk
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          files: android/app/build/outputs/apk/release/app-release.apk
```

---

## REFERENCIAS

- Capacitor docs: https://capacitorjs.com/docs
- Capacitor Android: https://capacitorjs.com/docs/android
- @capacitor-community/sqlite: https://github.com/capacitor-community/sqlite
- Capacitor Camera: https://capacitorjs.com/docs/apis/camera
- Capacitor Geolocation: https://capacitorjs.com/docs/apis/geolocation
- Capacitor Local Notifications: https://capacitorjs.com/docs/apis/local-notifications
- Capacitor Share: https://capacitorjs.com/docs/apis/share
- Android Gradle: https://developer.android.com/build
