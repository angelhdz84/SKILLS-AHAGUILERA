#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DOCS_FILE = 'docs/API.md';
const IGNORE_DIRS = ['node_modules', 'tests'];
const GLOBALS = new Set([
  'console', 'document', 'window', 'localStorage', 'sessionStorage',
  'navigator', 'fetch', 'setTimeout', 'setInterval', 'clearTimeout',
  'clearInterval', 'Math', 'JSON', 'Object', 'Array', 'String',
  'Number', 'Boolean', 'Date', 'RegExp', 'Map', 'Set', 'Promise',
  'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'undefined', 'null',
  'open', 'close', 'innerWidth', 'innerHeight', 'location', 'history',
  'File', 'Blob', 'FileReader', 'FormData', 'URL', 'TextEncoder',
  'TextDecoder', 'crypto', 'performance', 'AbortController',
  'IntersectionObserver', 'MutationObserver', 'ResizeObserver',
  'requestAnimationFrame', 'cancelAnimationFrame', 'customElements',
  'self', 'globalThis', 'Alpine', 'Dexie', 'pako', 'CryptoJS',
  'Chart', 'jspdf', 'XLSX', 'bootstrap', 'htmx', 'hyperscript'
]);

function help() {
  console.log(`
USO
  node scripts/generate-docs.js [opciones]

OPCIONES
  --dir <path>   Directorio a escanear (default: ./modules)
  --watch        Modo watch: regenera al detectar cambios
  --help         Muestra esta ayuda

Ejemplos:
  node scripts/generate-docs.js
  node scripts/generate-docs.js --dir modules
  node scripts/generate-docs.js --dir apps/mi-app/modules --watch
`);
  process.exit(0);
}

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) help();

  const opts = { dir: 'modules', watch: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dir': opts.dir = args[++i]; break;
      case '--watch': opts.watch = true; break;
      default: console.error('Argumento desconocido:', args[i]); process.exit(1);
    }
  }
  return opts;
}

function findJSFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (IGNORE_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findJSFiles(fullPath));
    } else if (entry.name.endsWith('.js')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractModuleName(content, filename) {
  const match = content.match(/window\.MODULES\s*\[\s*['"]([^'"]+)['"]\s*\]/);
  if (match) return match[1];
  return path.basename(filename, '.js');
}

function extractModuleDescription(content) {
  const lines = content.split('\n');
  const comments = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') && !trimmed.startsWith('// ──') && !trimmed.startsWith('// Depende')) {
      const text = trimmed.replace(/^\/\//, '').trim();
      if (text) comments.push(text);
    } else if (comments.length > 0) {
      break;
    }
  }

  if (comments.length === 0) {
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('/*')) {
        const endIdx = lines.findIndex(l => l.trim().endsWith('*/'));
        if (endIdx > -1) {
          const block = lines.slice(lines.indexOf(line) + 1, endIdx)
            .map(l => l.replace(/^\s*\*\s?/g, '').trim())
            .filter(Boolean);
          return block.join(' ');
        }
      }
    }
  }

  return comments.join(' ');
}

function extractCommentBlock(lines, startIdx) {
  const comments = [];
  let idx = startIdx - 1;
  while (idx >= 0) {
    const trimmed = lines[idx].trim();
    if (trimmed.startsWith('// ──')) {
      if (comments.length === 0) { idx--; continue; }
      break;
    }
    if (trimmed.startsWith('//')) {
      const text = trimmed.replace(/^\/\//, '').trim();
      comments.unshift(text);
      idx--;
    } else if (trimmed.startsWith('/*') && trimmed.includes('*/')) {
      const text = trimmed.replace(/^\/\*|\*\/$/g, '').trim();
      comments.unshift(text);
      break;
    } else if (trimmed === '') {
      if (comments.length > 0) break;
      idx--;
    } else {
      break;
    }
  }
  return comments.join(' ');
}

function extractFunctions(content) {
  const lines = content.split('\n');
  const funcs = [];
  const seen = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    const match = trimmed.match(/^(async\s+)?(\w+)\s*[:\(]\s*(?:function\s*)?\(([^)]*)\)\s*[{=]/);
    if (!match) continue;

    const name = match[2];
    if (name.match(/^[A-Z_][A-Z0-9_]*$/) || GLOBALS.has(name)) continue;
    if (seen.has(name)) continue;
    seen.add(name);

    const desc = extractCommentBlock(lines, i);
    const rawParams = match[3].trim();
    const params = rawParams
      ? rawParams.split(',').map(p => p.trim().split('=')[0].trim()).filter(Boolean)
      : [];

    funcs.push({
      name,
      params,
      description: desc,
      line: i + 1
    });
  }

  return funcs;
}

function extractDependencies(content, moduleName) {
  const deps = new Set();
  const seen = new Set();
  const refs = content.matchAll(/window\.(\w+)/g);
  for (const ref of refs) {
    const name = ref[1];
    if (name === 'MODULES' || name === moduleName || seen.has(name)) continue;
    seen.add(name);
    if (!GLOBALS.has(name)) deps.add(name);
  }
  const dbRefs = content.matchAll(/db\.(\w+)/g);
  for (const ref of dbRefs) {
    deps.add('db.' + ref[1]);
  }
  const appConfig = content.match(/APP_CONFIG/g);
  if (appConfig) deps.add('APP_CONFIG');
  return [...deps];
}

function extractModuleObjectName(content) {
  const match = content.match(/(?:const|let|var)\s+(\w+)\s*=\s*\{[\s\S]*?^\s*\}\s*;/m);
  if (match) return match[1];
  const match2 = content.match(/^\s*const\s+(\w+)\s*=\s*\{/m);
  if (match2) return match2[1];
  return null;
}

function parseModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  const moduleName = extractModuleName(content, filePath);
  const description = extractModuleDescription(content);
  const functions = extractFunctions(content);
  const dependencies = extractDependencies(content, moduleName);
  const objName = extractModuleObjectName(content);

  return {
    name: moduleName,
    file: filePath,
    filename,
    description,
    functions,
    dependencies,
    objName
  };
}

function generateMarkdown(modules) {
  const date = new Date().toLocaleString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const lines = [];
  lines.push('# API Reference');
  lines.push('');
  lines.push('> Generado automáticamente el ' + date);
  lines.push('');
  lines.push('## Índice');
  lines.push('');

  for (const mod of modules) {
    const anchor = mod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    lines.push('- [' + mod.name + '](#' + anchor + ')');
  }
  lines.push('');

  for (const mod of modules) {
    const anchor = mod.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    lines.push('---');
    lines.push('');
    lines.push('## ' + mod.name);
    lines.push('');
    lines.push('**Archivo:** `' + path.relative(process.cwd(), mod.file).replace(/\\/g, '/') + '`');
    lines.push('');

    if (mod.description) {
      lines.push(mod.description);
      lines.push('');
    }

    if (mod.dependencies.length > 0) {
      lines.push('### Dependencias');
      lines.push('');
      for (const dep of mod.dependencies) {
        lines.push('- `' + dep + '`');
      }
      lines.push('');
    }

    if (mod.functions.length > 0) {
      lines.push('### Funciones');
      lines.push('');
      lines.push('| Función | Parámetros | Descripción |');
      lines.push('|---------|------------|-------------|');
      for (const fn of mod.functions) {
        const params = fn.params.length > 0 ? fn.params.join(', ') : '—';
        const desc = fn.description || '—';
        lines.push('| `' + fn.name + '` | ' + params + ' | ' + desc + ' |');
      }
      lines.push('');

      for (const fn of mod.functions) {
        lines.push('#### `' + fn.name + '(' + fn.params.join(', ') + ')`');
        lines.push('');
        if (fn.description) {
          lines.push(fn.description);
          lines.push('');
        }
        lines.push('- **Línea:** ' + fn.line);
        if (fn.params.length > 0) {
          lines.push('- **Parámetros:**');
          for (const p of fn.params) {
            lines.push('  - `' + p + '`');
          }
        }
        lines.push('');
      }
    }
  }

  lines.push('---');
  lines.push('');
  lines.push('*Fin del documento*');
  lines.push('');

  return lines.join('\n');
}

function generate(dir) {
  const modulesDir = path.resolve(dir);
  if (!fs.existsSync(modulesDir)) {
    console.error('Error: No existe el directorio ' + modulesDir);
    process.exit(1);
  }

  const files = findJSFiles(modulesDir);
  if (files.length === 0) {
    console.error('Error: No se encontraron módulos .js en ' + modulesDir);
    process.exit(1);
  }

  const modules = files.map(parseModule).sort((a, b) => a.name.localeCompare(b.name));

  const docsDir = path.resolve('docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const markdown = generateMarkdown(modules);
  const outputPath = path.resolve(DOCS_FILE);
  fs.writeFileSync(outputPath, markdown, 'utf8');

  const count = modules.length;
  const funcCount = modules.reduce((s, m) => s + m.functions.length, 0);
  console.log('Documentación generada: ' + DOCS_FILE);
  console.log('  Módulos: ' + count);
  console.log('  Funciones: ' + funcCount);
  return true;
}

const opts = parseArgs();

if (opts.watch) {
  const modulesDir = path.resolve(opts.dir);
  if (!fs.existsSync(modulesDir)) {
    console.error('Error: No existe el directorio ' + modulesDir);
    process.exit(1);
  }

  console.log('📡 Modo watch activo en ' + modulesDir);
  generate(opts.dir);

  try {
    fs.watch(modulesDir, { recursive: true }, (eventType, filename) => {
      if (filename && filename.endsWith('.js')) {
        console.log('🔄 Cambio detectado: ' + filename + ' — regenerando...');
        try {
          generate(opts.dir);
          console.log('✅ Docs actualizados');
        } catch (e) {
          console.error('❌ Error al regenerar: ' + e.message);
        }
      }
    });
    console.log('Presiona Ctrl+C para detener.');
  } catch (e) {
    console.error('Error al iniciar watch: ' + e.message);
    process.exit(1);
  }
} else {
  const ok = generate(opts.dir);
  process.exit(ok ? 0 : 1);
}
