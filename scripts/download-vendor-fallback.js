const https = require('https');
const fs = require('fs');
const path = require('path');

const vendorDir = path.resolve(__dirname, '..', 'modules', 'vendor');
if (!fs.existsSync(vendorDir)) fs.mkdirSync(vendorDir, { recursive: true });

const files = [
  { url: 'https://unpkg.com/alpinejs@3.14.8/dist/cdn.min.js', file: 'alpine.min.js' },
  { url: 'https://unpkg.com/chart.js@4.4.7/dist/chart.umd.min.js', file: 'chart.umd.min.js' },
  { url: 'https://unpkg.com/dexie@4.0.11/dist/dexie.min.js', file: 'dexie.min.js' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(vendorDir, dest);
    if (fs.existsSync(fullPath)) {
      console.log(`  -> ${dest} [EXISTE]`);
      return resolve();
    }
    const file = fs.createWriteStream(fullPath);
    console.log(`  -> ${dest}...`);
    https.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(fullPath);
        console.log(`     redirect to ${res.headers.location}`);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(fullPath);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); console.log(`     OK (${fs.statSync(fullPath).size} bytes)`); resolve(); });
    }).on('error', (err) => { file.close(); if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath); reject(err); });
  });
}

(async () => {
  console.log('Descargando librerias via Node.js...');
  let ok = true;
  for (const f of files) {
    try {
      await download(f.url, f.file);
    } catch (e) {
      console.error(`     ERROR: ${e.message}`);
      ok = false;
    }
  }
  if (ok) console.log('\nDescarga completada.');
  else console.log('\nAlgunas descargas fallaron.');
})();
