// license.js — Sistema de verificación de licencias AHA
// Dependencias: env.js (debe cargarse antes), CryptoJS, Web Crypto API

window.APP_CONFIG = window.APP_CONFIG || {
  plan: 'lite',
  maxRecords: 30,
  canExport: false,
  iaTier: 'lite',
  canWhiteLabel: false,
  customer: null
}

window.APP_ID = window.APP_ID || '{{APP_ID}}'

// PEM -> ArrayBuffer para Web Crypto API
function pemToArrayBuffer(pem) {
  const b64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s+/g, '')
  const raw = atob(b64)
  const buf = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i)
  return buf.buffer
}

// Importar llave publica RSA
async function importPublicKey() {
  const pem = `{{PUBLIC_KEY}}`
  const keyData = pemToArrayBuffer(pem)
  return crypto.subtle.importKey(
    'spki', keyData, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['verify']
  )
}

// Verificar firma RSA del payload (sign-then-encrypt: verificamos el JSON plano ya decriptado)
async function verifySignature(publicKey, data, signature) {
  return crypto.subtle.verify(
    { name: 'RSASSA-PKCS1-v1_5' }, publicKey, signature,
    new TextEncoder().encode(data)
  )
}

// Decriptar AES-256-CBC con CryptoJS
function decryptPayload(combined) {
  const parts = combined.split(':')
  if (parts.length !== 2) return null
  const key = CryptoJS.enc.Hex.parse('{{AES_KEY_HEX}}')
  const iv = CryptoJS.enc.Base64.parse(parts[0])
  const ciphertext = CryptoJS.enc.Base64.parse(parts[1])
  const decrypted = CryptoJS.AES.decrypt(
    CryptoJS.lib.CipherParams.create({ ciphertext, iv, key }),
    null, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv, key }
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}

function applyLicense(data, appLicense) {
  const plan = appLicense.plan || 'lite'
  const isLite = plan === 'lite'
  window.APP_CONFIG.plan = plan
  window.APP_CONFIG.maxRecords = isLite ? 30 : Infinity
  window.APP_CONFIG.canExport = !isLite
  window.APP_CONFIG.iaTier = isLite ? 'lite' : 'full'
  window.APP_CONFIG.canWhiteLabel = plan === 'enterprise'
  window.APP_CONFIG.customer = data.customer || null
}

async function checkLicense() {
  if (typeof ENV === 'undefined' || ENV === 'development') {
    Object.assign(window.APP_CONFIG, {
      plan: 'enterprise', maxRecords: Infinity, canExport: true,
      iaTier: 'full', canWhiteLabel: true,
      customer: { name: 'DEV', business: 'Modo Desarrollo' }
    })
    return true
  }

  if (!window.APP_ID || window.APP_ID.startsWith('{{')) {
    Object.assign(window.APP_CONFIG, {
      customer: { name: 'ERROR', business: 'APP_ID no configurado' }
    })
    return false
  }

  try {
    const publicKey = await importPublicKey()
    const ahaFiles = await scanAHAFiles()
    for (const content of ahaFiles) {
      const parts = content.trim().split('.')
      if (parts.length !== 3) continue
      const [ivB64, encryptedB64, sigB64] = parts
      const combined = ivB64 + ':' + encryptedB64
      const json = decryptPayload(combined)
      if (!json) continue
      const sigRaw = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0))
      const valid = await verifySignature(publicKey, json, sigRaw)
      if (!valid) continue
      const data = JSON.parse(json)
      if (data.apps && data.apps[window.APP_ID]) {
        applyLicense(data, data.apps[window.APP_ID])
        return true
      }
    }
  } catch (e) {
    console.warn('License check error:', e)
  }
  return false
}

async function scanAHAFiles() {
  const results = []

  if (window.NL_OS) {
    try {
      const entries = await Neutralino.filesystem.readDirectory('.')
      for (const entry of entries) {
        if (entry.type === 'FILE' && entry.entry.toLowerCase().endsWith('.aha')) {
          const content = await Neutralino.filesystem.readFile(entry.entry)
          results.push(content)
        }
      }
    } catch (e) { /* ignore */ }
    return results
  }

  return results
}

async function cargarLicencia() {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.aha'
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) { resolve(false); return }
      try {
        const text = await file.text()
        const publicKey = await importPublicKey()
        const parts = text.trim().split('.')
        if (parts.length !== 3) { resolve(false); return }
        const [ivB64, encryptedB64, sigB64] = parts
        const combined = ivB64 + ':' + encryptedB64
        const json = decryptPayload(combined)
        if (!json) { resolve(false); return }
        const sigRaw = Uint8Array.from(atob(sigB64), c => c.charCodeAt(0))
        const valid = await verifySignature(publicKey, json, sigRaw)
        if (!valid) { resolve(false); return }
        const data = JSON.parse(json)
        if (data.apps && data.apps[window.APP_ID]) {
          applyLicense(data, data.apps[window.APP_ID])
          resolve(true)
        } else {
          resolve(false)
        }
      } catch (e) {
        resolve(false)
      }
    }
    input.click()
  })
}
