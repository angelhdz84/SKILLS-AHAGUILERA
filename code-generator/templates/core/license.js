// license.js — Sistema de verificación de licencias AHA
// Dependencias: env.js (debe cargarse antes), CryptoJS, Web Crypto API

(function () {
  'use strict';

  if (typeof window.licenseLoaded !== 'undefined') return;
  window.licenseLoaded = true;

  window.APP_CONFIG = window.APP_CONFIG || {
    plan: 'lite',
    maxRecords: 30,
    canExport: false,
    iaTier: 'lite',
    canWhiteLabel: false,
    customer: null
  };

  window.APP_ID = window.APP_ID || '{{APP_ID}}';

  function pemToArrayBuffer(pem) {
    var b64 = pem
      .replace(/-----BEGIN PUBLIC KEY-----/g, '')
      .replace(/-----END PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');
    var raw = atob(b64);
    var buf = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
    return buf.buffer;
  }

  function importPublicKey() {
    var pem = '{{PUBLIC_KEY}}';
    var keyData = pemToArrayBuffer(pem);
    return crypto.subtle.importKey(
      'spki', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false, ['verify']
    );
  }

  function verifySignature(publicKey, data, signature) {
    return crypto.subtle.verify(
      { name: 'RSASSA-PKCS1-v1_5' }, publicKey, signature,
      new TextEncoder().encode(data)
    );
  }

  function decryptPayload(combined) {
    var parts = combined.split(':');
    if (parts.length !== 2) return null;
    var key = CryptoJS.enc.Hex.parse('{{AES_KEY_HEX}}');
    var iv = CryptoJS.enc.Base64.parse(parts[0]);
    var ciphertext = CryptoJS.enc.Base64.parse(parts[1]);
    var decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext, iv: iv, key: key }),
      null, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv, key: key }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  function applyLicense(data, appLicense) {
    var plan = appLicense.plan || 'lite';
    var isLite = plan === 'lite';
    window.APP_CONFIG.plan = plan;
    window.APP_CONFIG.maxRecords = isLite ? 30 : Infinity;
    window.APP_CONFIG.canExport = !isLite;
    window.APP_CONFIG.iaTier = isLite ? 'lite' : 'full';
    window.APP_CONFIG.canWhiteLabel = plan === 'enterprise' || plan === 'business';
    window.APP_CONFIG.customer = data.customer || null;
  }

  function scanAHAFiles() {
    var results = [];

    if (window.NL_OS) {
      try {
        return Neutralino.filesystem.readDirectory('.').then(function (entries) {
          var promises = [];
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (entry.type === 'FILE' && entry.entry.toLowerCase().endsWith('.aha')) {
              promises.push(
                Neutralino.filesystem.readFile(entry.entry).then(function (content) {
                  results.push(content);
                }).catch(function () {})
              );
            }
          }
          return Promise.all(promises).then(function () { return results; });
        }).catch(function () { return results; });
      } catch (e) {
        return Promise.resolve(results);
      }
    }

    return Promise.resolve(results);
  }

  window.checkLicense = function () {
    if (typeof ENV === 'undefined' || ENV === 'development') {
      for (var k in { plan: 'enterprise', maxRecords: Infinity, canExport: true, iaTier: 'full', canWhiteLabel: true }) {
        window.APP_CONFIG[k] = { plan: 'enterprise', maxRecords: Infinity, canExport: true, iaTier: 'full', canWhiteLabel: true }[k];
      }
      window.APP_CONFIG.plan = 'enterprise';
      window.APP_CONFIG.maxRecords = Infinity;
      window.APP_CONFIG.canExport = true;
      window.APP_CONFIG.iaTier = 'full';
      window.APP_CONFIG.canWhiteLabel = true;
      window.APP_CONFIG.customer = { name: 'DEV', business: 'Modo Desarrollo' };
      return Promise.resolve(true);
    }

    if (!window.APP_ID || window.APP_ID.startsWith('{{')) {
      window.APP_CONFIG.customer = { name: 'ERROR', business: 'APP_ID no configurado' };
      return Promise.resolve(false);
    }

    return importPublicKey().then(function (publicKey) {
      return scanAHAFiles().then(function (ahaFiles) {
        for (var i = 0; i < ahaFiles.length; i++) {
          var content = ahaFiles[i];
          var parts = content.trim().split('.');
          if (parts.length !== 3) continue;
          var ivB64 = parts[0], encryptedB64 = parts[1], sigB64 = parts[2];
          var combined = ivB64 + ':' + encryptedB64;
          var json = decryptPayload(combined);
          if (!json) continue;
          var sigRaw = new Uint8Array(atob(sigB64).split('').map(function (c) { return c.charCodeAt(0); }));
          return verifySignature(publicKey, json, sigRaw).then(function (valid) {
            if (!valid) return false;
            var data = JSON.parse(json);
            if (data.apps && data.apps[window.APP_ID]) {
              applyLicense(data, data.apps[window.APP_ID]);
              return true;
            }
            return false;
          });
        }
        return false;
      });
    }).catch(function (e) {
      console.warn('License check error:', e);
      return false;
    });
  };

  window.cargarLicencia = function () {
    return new Promise(function (resolve) {
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = '.aha';
      input.onchange = function (e) {
        var file = e.target.files[0];
        if (!file) { resolve(false); return; }
        var reader = new FileReader();
        reader.onload = function () {
          var text = reader.result;
          importPublicKey().then(function (publicKey) {
            var parts = text.trim().split('.');
            if (parts.length !== 3) { resolve(false); return; }
            var ivB64 = parts[0], encryptedB64 = parts[1], sigB64 = parts[2];
            var combined = ivB64 + ':' + encryptedB64;
            var json = decryptPayload(combined);
            if (!json) { resolve(false); return; }
            var sigRaw = new Uint8Array(atob(sigB64).split('').map(function (c) { return c.charCodeAt(0); }));
            verifySignature(publicKey, json, sigRaw).then(function (valid) {
              if (!valid) { resolve(false); return; }
              var data = JSON.parse(json);
              if (data.apps && data.apps[window.APP_ID]) {
                applyLicense(data, data.apps[window.APP_ID]);
                resolve(true);
              } else {
                resolve(false);
              }
            });
          }).catch(function () { resolve(false); });
        };
        reader.readAsText(file);
      };
      input.click();
    });
  };
})();
