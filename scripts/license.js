#!/usr/bin/env node
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function help() {
  console.log(`
USO
  node scripts/license.js generate <args>

ARGUMENTOS
  --plan     L | P | E        (requerido) L=Lite, P=Profesional, E=Enterprise
  --apps     lista separada   (requerido) IDs de app separados por coma
               por coma                   ej: aha-pos,aha-inventario
  --customer nombre completo  (requerido) Nombre del cliente
  --business nombre negocio   (opcional)  Nombre del negocio
  --phone    telefono         (opcional)  Telefono
  --email    email            (opcional)  Correo electronico
  --out      directorio       (opcional)  Directorio de salida (default: ./licencias)
  --compat   JSON string      (opcional)  Mapeo de compatibilidad de apps

EJEMPLOS
  node scripts/license.js generate --plan P --apps "aha-pos,aha-inventario" --customer "Juan Perez" --business "Ferreteria El Clavo"
  node scripts/license.js generate --plan L --apps "aha-pos" --customer "Ana Lopez" --out ./licencias
`)
  process.exit(0)
}

function sanitize(str) {
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseArgs() {
  const args = process.argv.slice(2)
  if (args.length === 0 || args.includes('--help')) help()

  const cmd = args[0]
  if (cmd !== 'generate') {
    console.error('Comando desconocido:', cmd)
    process.exit(1)
  }

  const opts = {}
  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--plan': opts.plan = args[++i]; break
      case '--apps': opts.apps = args[++i]; break
      case '--customer': opts.customer = args[++i]; break
      case '--business': opts.business = args[++i]; break
      case '--phone': opts.phone = args[++i]; break
      case '--email': opts.email = args[++i]; break
      case '--out': opts.out = args[++i]; break
      case '--compat': opts.compat = args[++i]; break
      default: console.error('Argumento desconocido:', args[i]); process.exit(1)
    }
  }

  if (!opts.plan || !opts.apps || !opts.customer) {
    console.error('Error: --plan, --apps y --customer son requeridos')
    process.exit(1)
  }

  if (!['L', 'P', 'E'].includes(opts.plan.toUpperCase())) {
    console.error('Error: --plan debe ser L, P o E')
    process.exit(1)
  }

  return opts
}

const PLAN_MAP = { L: 'lite', P: 'profesional', E: 'enterprise' }

function generateLicense(opts) {
  const keysDir = path.join(__dirname, '..', 'keys')
  const privateKeyPath = path.join(keysDir, 'private.pem')

  if (!fs.existsSync(privateKeyPath)) {
    console.error('Error: keys/private.pem no encontrado. Ejecuta primero node scripts/generate-keypair.js')
    process.exit(1)
  }

  const privateKey = fs.readFileSync(privateKeyPath, 'utf8')

  const now = new Date()
  const pad2 = (n) => String(n).padStart(2, '0')
  const dateStr = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}`
  const timeStr = `${pad2(now.getHours())}${pad2(now.getMinutes())}`
  const isoStr = now.toISOString().replace('Z', '+00:00')

  const appList = opts.apps.split(',').map(a => a.trim()).filter(Boolean)
  const planLabel = opts.plan.toUpperCase()
  const appCount = appList.length
  const licenseId = `AHA-${planLabel}${appCount}-${dateStr}-${timeStr}`

  const apps = {}
  for (const app of appList) {
    apps[app] = { plan: PLAN_MAP[planLabel], min_version: '1.0' }
  }

  const compat = opts.compat ? (() => {
    try { return JSON.parse(opts.compat) } catch { return {} }
  })() : {}

  const payload = {
    id: licenseId,
    customer: {
      name: opts.customer,
      business: opts.business || '',
      phone: opts.phone || '',
      email: opts.email || ''
    },
    apps,
    issued: isoStr,
    compat
  }

  const payloadJson = JSON.stringify(payload, null, 2)

  const signer = crypto.createSign('sha256')
  signer.update(payloadJson)
  signer.end()
  const signature = signer.sign(privateKey)

  const aesKey = crypto.createHash('sha256').update('aha-license-system-v1').digest()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv)
  const encrypted = Buffer.concat([cipher.update(payloadJson, 'utf8'), cipher.final()])

  const ivB64 = iv.toString('base64')
  const encryptedB64 = encrypted.toString('base64')
  const signatureB64 = signature.toString('base64')
  const ahaContent = `${ivB64}.${encryptedB64}.${signatureB64}`

  const outBase = opts.out || './licencias'
  const dateDir = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`
  const outDir = path.join(outBase, dateDir)
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const fileName = (opts.business ? sanitize(opts.business) : sanitize(opts.customer)) + '.aha'
  const filePath = path.join(outDir, fileName)
  fs.writeFileSync(filePath, ahaContent, 'utf8')

  const csvDir = path.resolve(outBase)
  if (!fs.existsSync(csvDir)) fs.mkdirSync(csvDir, { recursive: true })
  const csvPath = path.join(csvDir, 'historial.csv')
  const csvHeader = 'id,fecha,cliente,negocio,plan,apps\n'
  const csvLine = `${licenseId},${dateStr},${opts.customer},${opts.business || ''},${PLAN_MAP[planLabel]} (${appCount} app(s)),${appList.join(';')}\n`

  if (!fs.existsSync(csvPath)) {
    fs.writeFileSync(csvPath, csvHeader + csvLine, 'utf8')
  } else {
    fs.appendFileSync(csvPath, csvLine, 'utf8')
  }

  console.log(`
Licencia generada
  Archivo: ${path.relative(process.cwd(), filePath)}
  ID: ${licenseId}
  Plan: ${PLAN_MAP[planLabel]} (${appCount} app(s))
  Cliente: ${opts.customer}${opts.business ? ' / ' + opts.business : ''}
`)
}

const opts = parseArgs()
generateLicense(opts)
