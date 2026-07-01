const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

if (process.argv.includes('--help')) {
  console.log(`
USO
  node scripts/generate-keypair.js

Genera par RSA 2048-bit en:
  keys/private.pem   <- NO COMPARTIR. Backup seguro.
  keys/public.pem    <- Se embebe en cada app generada.

SIN argumentos. Ejecutar una vez al iniciar el proyecto.
`)
  process.exit(0)
}

const keysDir = path.join(__dirname, '..', 'keys')
if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir, { recursive: true })

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
})

fs.writeFileSync(path.join(keysDir, 'private.pem'), privateKey)
fs.writeFileSync(path.join(keysDir, 'public.pem'), publicKey)

console.log('RSA key pair generated')
console.log('  Private: keys/private.pem  <- GUARDAR, NO COMPARTIR')
console.log('  Public:  keys/public.pem   <- Se embebe en las apps')
