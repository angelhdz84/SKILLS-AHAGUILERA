// project.config.js — Configuracion white-label para apps offline-first
// NOTA: Metadata-only sample. Los modulos reales se definen en specs/[app].md.
// Las skills leen este archivo para determinar perfil, tema y metadatos base.

window.APP_CONFIG = {
  app: {
    nombre: 'MiAppOffline',
    version: '1.0.0',
    tipo: 'Gestion',
    descripcion: 'App offline-first generada desde SKILLS-AHAGUILERA'
  },
  perfil: 'lite',
  iaJutia: 'lite',
  modulosActivos: [
    'dashboard',
    'configuracion',
    'inventario',
    'clientes',
    'reportes'
  ],
  tema: {
    modo: 'claro',
    colores: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      accent: '#EA580C',
      neutral: '#1E293B',
      'base-100': '#FFFFFF',
      'base-200': '#F1F5F9',
      'base-300': '#CBD5E1',
      info: '#0EA5E9',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    tipografia: {
      fuente: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  },
  cifrado: {
    camposSensibles: ['nombre', 'email', 'telefono', 'direccion'],
    storageKey: 'app_llave_cifrado'
  },
  data: {
    dir: 'data/',
    maxFileSize: 10 * 1024 * 1024,
    tipos: ['avatar', 'foto', 'doc', 'logo', 'backup'],
    avatars: { default: 'data/defaults/avatar.png', size: 200, calidad: 0.8 }
  },
  sync: {
    primaryFormat: 'json',
    secondaryFormats: [],
    includeFiles: true,
    encrypt: true,
    maxExportSize: 50 * 1024 * 1024
  },
  ui: {
    formsMode: 'modal',
    alerts: 'toast',
    confirmDelete: true,
    avatars: true,
    avatarDefault: 'data/defaults/avatar.png'
  },
  modulos: {
    dashboard: { titulo: 'Dashboard', icono: 'bi-speedometer2', activo: true },
    configuracion: { titulo: 'Configuracion', icono: 'bi-gear', activo: true },
    inventario: { titulo: 'Inventario', icono: 'bi-box', activo: true },
    clientes: { titulo: 'Clientes', icono: 'bi-people', activo: true },
    reportes: { titulo: 'Reportes', icono: 'bi-file-earmark-bar-graph', activo: true }
  }
};
