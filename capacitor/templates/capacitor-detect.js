// INYECTAR en core/app.js antes de Alpine.start()
// ====================================================
// Deteccion universal de Capacitor (Android nativo) vs web
// ====================================================
window.CAPACITOR = typeof Capacitor !== 'undefined';

// Helper nativo con fallback web para cada plugin
window.native = window.native || {};

native.camera = async function () {
  if (window.CAPACITOR && Capacitor.isPluginAvailable && Capacitor.isPluginAvailable('Camera')) {
    var m = await import('@capacitor/camera');
    var photo = await m.Camera.getPhoto({ resultType: m.CameraResultType.DataUrl, quality: 90 });
    return photo.dataUrl;
  }
  return new Promise(function (resolve) {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function (e) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.readAsDataURL(e.target.files[0]);
    };
    inp.click();
  });
};

native.geolocation = async function () {
  if (window.CAPACITOR && Capacitor.isPluginAvailable && Capacitor.isPluginAvailable('Geolocation')) {
    var m = await import('@capacitor/geolocation');
    var pos = await m.Geolocation.getCurrentPosition();
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  }
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      function (p) { resolve({ lat: p.coords.latitude, lng: p.coords.longitude }); },
      reject
    );
  });
};

native.notify = async function (title, body) {
  if (window.CAPACITOR && Capacitor.isPluginAvailable && Capacitor.isPluginAvailable('LocalNotifications')) {
    var m = await import('@capacitor/local-notifications');
    await m.LocalNotifications.schedule({ notifications: [{ title: title, body: body, id: Date.now() }] });
  } else if (Notification.permission === 'granted') {
    new Notification(title, { body: body });
  }
};

native.share = async function (text) {
  if (window.CAPACITOR && Capacitor.isPluginAvailable && Capacitor.isPluginAvailable('Share')) {
    var m = await import('@capacitor/share');
    await m.Share.share({ text: text });
  } else if (navigator.share) {
    await navigator.share({ text: text });
  } else {
    await navigator.clipboard.writeText(text);
  }
};

native.sqlite = async function () {
  if (window.CAPACITOR && Capacitor.isPluginAvailable && Capacitor.isPluginAvailable('CapacitorSQLite')) {
    try {
      var m = await import('@capacitor-community/sqlite');
      var db = await m.CapacitorSQLite.createConnection({
        database: 'ia-jutia',
        version: 1,
        encrypted: false,
        mode: 'no-encryption'
      });
      await db.open();
      await db.execute(
        "CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(texto, docId)"
      );
      return db;
    } catch (e) {
      console.warn('native.sqlite: fallback a WASM', e.message);
      return null;
    }
  }
  return null;
};
