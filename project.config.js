// project.config.js — Configuración white-label para apps offline-first
// Las skills leen este archivo para determinar módulos activos, tema y metadatos.

window.APP_CONFIG = {
  app: {
    nombre: 'MiAppOffline',
    version: '1.0.0',
    tipo: 'Gestión',
    descripcion: 'App offline-first generada desde SKILLS-AHAGUILERA'
  },
  modulosActivos: [
    'dashboard',
    'configuracion'
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
  modulos: {
    dashboard: { titulo: 'Dashboard', icono: 'bi-speedometer2', activo: true },
    configuracion: { titulo: 'Configuración', icono: 'bi-gear', activo: true }
  }
};
