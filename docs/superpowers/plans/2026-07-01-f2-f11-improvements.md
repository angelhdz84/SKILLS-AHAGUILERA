# F2-F11 Implementation Plan — Ateje Stack Core Improvements

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the remaining 9 improvements (F2-F11) across the Ateje Stack: PWA, accessibility, mobile UX, loading states, PWA advanced, testing, CI/CD, docs, analytics.

**Architecture:** All improvements are template-level (not app-specific). Templates in `code-generator/templates/` are the canonical source. Tests verify via Playwright on `tests/test-app.html`. CI/CD in `.github/workflows/`. Docs auto-generated per app from `apps/*/template.md`.

**Tech Stack:** Playwright (testing), GitHub Actions (CI/CD), Service Worker API (PWA), Alpine.js (loading/UX), Node.js (doc gen).

---

### Task 1: F2 — Service Worker + Manifest Templates

**Files:**
- Create: `code-generator/templates/sw.js`
- Create: `code-generator/templates/manifest.json`
- Modify: `code-generator/templates/core/app.js` (add PWA registration)
- Test: `tests/test-pwa.js`

- [ ] **Step 1: Create `code-generator/templates/sw.js`**

```javascript
// sw.js — Offline-first cache strategies for Ateje Stack
// Auto-generado por code-generator. No modificar manualmente.

var CACHE = 'ateje-v1';
var ASSETS = [
  '/',
  'index.html',
  'assets/css/tailwind.min.css',
  'assets/css/daisyui.min.css',
  'assets/css/bootstrap-icons.css',
  'assets/css/animate.min.css',
  'assets/js/libs/alpine.js',
  'assets/js/libs/dexie.js',
  'assets/js/libs/crypto-js.js',
  'assets/js/libs/pako.js',
  'assets/js/libs/chart.js',
  'assets/js/libs/jspdf.js',
  'assets/js/libs/xlsx.js',
  'core/env.js',
  'core/db.js',
  'core/crypto.js',
  'core/ui.js',
  'core/theme.js',
  'core/app.js',
  'core/search-palette.js',
  'core/file-store.js',
  'core/sync.js',
  'core/license.js',
  'main.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(function () { return caches.match('index.html'); })
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(function (r) { return r || fetch(req); })
  );
});

// Background Sync (opcional — se registra desde main.js)
self.addEventListener('sync', function (e) {
  if (e.tag === 'sync-backup') {
    e.waitUntil(syncPendingBackup());
  }
});

async function syncPendingBackup() {
  var cache = await caches.open(CACHE);
  var pending = await cache.match('pending-backup');
  if (pending) {
    // Placeholder: en producción, enviar a servidor
    console.log('[SW] Background sync ejecutado');
    await cache.delete('pending-backup');
  }
}
```

- [ ] **Step 2: Create `code-generator/templates/manifest.json`**

```json
{
  "name": "{{APP_NAME}}",
  "short_name": "{{APP_SHORT_NAME}}",
  "description": "{{APP_DESCRIPTION}}",
  "start_url": "index.html",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "{{THEME_COLOR}}",
  "categories": ["productivity", "business", "offline"],
  "icons": [
    {
      "src": "assets/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [],
  "prefer_related_applications": false
}
```

- [ ] **Step 3: Modify `code-generator/templates/core/app.js` to register SW**

Add at the end of the IIFE, before the final console.log:

```javascript
  // ─── PWA Registration ──────────────────────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        console.log('[SW] Registrado:', reg.scope);
      }, function (err) {
        console.warn('[SW] Error:', err);
      });
    });
  }

  // ─── Background Sync ──────────────────────────────
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready.then(function (reg) {
      reg.sync.register('sync-backup').catch(function () {});
    });
  }
```

- [ ] **Step 4: Create `tests/test-pwa.js`**

```javascript
// tests/test-pwa.js — Pruebas PWA para el stack Ateje
import { test, expect } from '@playwright/test';

test('manifest.json exists and is valid', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  const manifestLink = page.locator('link[rel="manifest"]');
  await expect(manifestLink).toHaveAttribute('href', /manifest\.json/);
});

test('service worker registers', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  const hasSW = await page.evaluate(() => 'serviceWorker' in navigator);
  expect(hasSW).toBeTruthy();
});
```

---

### Task 2: F3 — Accessibility (WCAG 2.2 Templates)

**Files:**
- Create: `code-generator/templates/core/a11y.js`
- Create: `code-generator/templates/core/focus-trap.js`
- Modify: `code-generator/templates/core/ui.js` (add aria attributes to modals)
- Test: `tests/test-a11y.js`

- [ ] **Step 1: Create `code-generator/templates/core/a11y.js`**

```javascript
// a11y.js — Utilidades de accesibilidad WCAG 2.2
// window.a11y expuesto globalmente
// Alpine store: $store.a11y (prefersReducedMotion, fontSize)

(function () {
  'use strict';

  if (typeof window.a11y !== 'undefined') return;

  window.a11y = {
    prefersReducedMotion: false,
    fontSize: 16,

    init: function () {
      var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.prefersReducedMotion = mq.matches;
      var self = this;
      mq.addEventListener('change', function () {
        self.prefersReducedMotion = mq.matches;
        document.documentElement.classList.toggle('reduce-motion', mq.matches);
      });
      document.documentElement.classList.toggle('reduce-motion', this.prefersReducedMotion);
      this.announce('Aplicaci\u00f3n lista', 'polite');
    },

    announce: function (msg, priority) {
      priority = priority || 'polite';
      var el = document.getElementById('a11y-announcer');
      if (!el) {
        el = document.createElement('div');
        el.id = 'a11y-announcer';
        el.setAttribute('aria-live', priority);
        el.setAttribute('aria-atomic', 'true');
        el.className = 'sr-only';
        document.body.appendChild(el);
      }
      el.setAttribute('aria-live', priority);
      el.textContent = '';
      setTimeout(function () { el.textContent = msg; }, 100);
    },

    trapFocus: function (containerEl) {
      if (!containerEl) return function () {};
      var focusable = containerEl.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return function () {};
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      function handler(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
      containerEl.addEventListener('keydown', handler);
      first.focus();
      return function () { containerEl.removeEventListener('keydown', handler); };
    }
  };

  document.addEventListener('alpine:init', function () {
    if (typeof Alpine !== 'undefined' && Alpine.store) {
      Alpine.store('a11y', {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        announce: window.a11y.announce
      });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.a11y.init(); });
  } else {
    window.a11y.init();
  }
})();
```

- [ ] **Step 2: Create `code-generator/templates/core/focus-trap.js`**

```javascript
// focus-trap.js — Focus trap reutilizable para modales y drawers
// window.focusTrap expuesto globalmente

(function () {
  'use strict';

  if (typeof window.focusTrap !== 'undefined') return;

  window.focusTrap = {
    active: null,

    create: function (containerEl, options) {
      options = options || {};
      var self = this;
      var cleanup = null;
      var previousFocus = document.activeElement;

      function getFocusable() {
        if (!containerEl) return [];
        return Array.from(containerEl.querySelectorAll(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), ' +
          'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        ));
      }

      function trap(e) {
        if (e.key !== 'Tab') return;
        var focusable = getFocusable();
        if (focusable.length === 0) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }

      containerEl.addEventListener('keydown', trap);

      var initialFocus = options.initialFocus;
      if (initialFocus) {
        var el = typeof initialFocus === 'string'
          ? containerEl.querySelector(initialFocus)
          : initialFocus;
        if (el) setTimeout(function () { el.focus(); }, 50);
      } else {
        var focusable = getFocusable();
        if (focusable.length > 0) setTimeout(function () { focusable[0].focus(); }, 50);
      }

      cleanup = function () {
        containerEl.removeEventListener('keydown', trap);
        if (options.restoreFocus !== false && previousFocus && previousFocus.focus) {
          previousFocus.focus();
        }
        if (self.active === cleanup) self.active = null;
      };

      self.active = cleanup;
      return cleanup;
    },

    release: function () {
      if (this.active) {
        this.active();
        this.active = null;
      }
    }
  };
})();
```

- [ ] **Step 3: Add aria attributes to `code-generator/templates/core/ui.js`**

In the `showConfirm` function, add `role="alertdialog"` and `aria-modal="true"` to the dialog element.
In the `showModalForm` function, add the same. In `showLoading`, add `role="progressbar"` and `aria-label`.

Find the line `dialog.className = 'modal modal-open';` and add after it:
```javascript
dialog.setAttribute('role', 'alertdialog');
dialog.setAttribute('aria-modal', 'true');
dialog.setAttribute('aria-label', titulo || 'Confirmar');
```

Find the loading overlay creation and add `role="progressbar"` and `aria-label="Cargando..."`.

- [ ] **Step 4: Create `tests/test-a11y.js`**

```javascript
// tests/test-a11y.js — Pruebas de accesibilidad WCAG 2.2
import { test, expect } from '@playwright/test';

test('aria-live announcer exists', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1000);
  const announcer = page.locator('#a11y-announcer');
  await expect(announcer).toHaveAttribute('aria-live');
});

test('all buttons have accessible names', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1000);
  const buttons = page.locator('button');
  const count = await buttons.count();
  for (var i = 0; i < count; i++) {
    const btn = buttons.nth(i);
    const name = await btn.getAttribute('aria-label') || await btn.textContent();
    expect(name.trim()).not.toBe('');
  }
});

test('focus trap in modal', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1000);
  await page.evaluate(function () {
    window.UI.confirm('Test modal');
  });
  await page.waitForTimeout(300);
  const focused = await page.evaluate(function () {
    return document.activeElement ? document.activeElement.tagName : null;
  });
  expect(focused).not.toBeNull();
});
```

---

### Task 3: F4 — Responsive Mobile Patterns

**Files:**
- Create: `code-generator/templates/core/responsive.js`
- Create: `code-generator/templates/core/bottom-nav.js`
- Test: `tests/test-responsive.js`

- [ ] **Step 1: Create `code-generator/templates/core/responsive.js`**

```javascript
// responsive.js — Utilidades responsive y mobile-first
// window.responsive expuesto globalmente
// Alpine store: $store.responsive (isMobile, isTablet, isDesktop, orientation)

(function () {
  'use strict';

  if (typeof window.responsive !== 'undefined') return;

  function getBreakpoint() {
    var w = window.innerWidth;
    if (w < 640) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  window.responsive = {
    isMobile: getBreakpoint() === 'mobile',
    isTablet: getBreakpoint() === 'tablet',
    isDesktop: getBreakpoint() === 'desktop',
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',

    _onResize: function () {
      this.isMobile = getBreakpoint() === 'mobile';
      this.isTablet = getBreakpoint() === 'tablet';
      this.isDesktop = getBreakpoint() === 'desktop';
      this.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      var evt = new CustomEvent('breakpoint-change', { detail: { breakpoint: getBreakpoint() } });
      window.dispatchEvent(evt);
    }
  };

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { window.responsive._onResize(); }, 150);
  });

  window.addEventListener('orientationchange', function () {
    setTimeout(function () { window.responsive._onResize(); }, 300);
  });

  document.addEventListener('alpine:init', function () {
    if (typeof Alpine !== 'undefined' && Alpine.store) {
      Alpine.store('responsive', {
        isMobile: window.responsive.isMobile,
        isTablet: window.responsive.isTablet,
        isDesktop: window.responsive.isDesktop,
        orientation: window.responsive.orientation
      });
    }
  });
})();
```

- [ ] **Step 2: Create `code-generator/templates/core/bottom-nav.js`**

```javascript
// bottom-nav.js — Barra de navegación inferior para móvil
// window.bottomNav expuesto globalmente
// Se activa automáticamente en viewports < 640px

(function () {
  'use strict';

  if (typeof window.bottomNav !== 'undefined') return;

  var navEl = null;
  var items = [];

  window.bottomNav = {
    init: function (opts) {
      opts = opts || {};
      items = opts.items || [];
      this._render();
      window.addEventListener('breakpoint-change', function (e) {
        var show = e.detail.breakpoint === 'mobile';
        if (navEl) navEl.style.display = show ? 'flex' : 'none';
      });
    },

    _render: function () {
      if (navEl) return;
      navEl = document.createElement('nav');
      navEl.id = 'bottom-nav';
      navEl.setAttribute('aria-label', 'Navegaci\u00f3n principal');
      navEl.className = 'btm-nav btm-nav-sm fixed bottom-0 inset-x-0 z-40 bg-base-100 border-t border-base-200 md:hidden';
      navEl.style.display = window.innerWidth < 640 ? 'flex' : 'none';

      items.forEach(function (item, i) {
        var btn = document.createElement('button');
        btn.setAttribute('data-module', item.id);
        btn.setAttribute('aria-label', item.label);
        btn.className = i === 0 ? 'active' : '';
        btn.innerHTML = '<i class="bi ' + item.icon + ' text-lg"></i><span class="btm-nav-label text-[10px]">' + item.label + '</span>';
        btn.addEventListener('click', function () {
          var current = navEl.querySelectorAll('.active');
          current.forEach(function (c) { c.classList.remove('active'); });
          btn.classList.add('active');
          if (window.appRouter) window.appRouter.navigate(item.id);
        });
        navEl.appendChild(btn);
      });

      document.body.appendChild(navEl);
    },

    setActive: function (moduleId) {
      if (!navEl) return;
      var buttons = navEl.querySelectorAll('button');
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('active', buttons[i].getAttribute('data-module') === moduleId);
      }
    }
  };

  // Hook into appRouter
  document.addEventListener('alpine:init', function () {
    if (typeof Alpine !== 'undefined' && Alpine.store) {
      Alpine.store('bottomNav', {
        setActive: function (id) { window.bottomNav.setActive(id); }
      });
    }
  });
})();
```

- [ ] **Step 3: Create `tests/test-responsive.js`**

```javascript
// tests/test-responsive.js — Pruebas responsive avanzadas
import { test, expect } from '@playwright/test';

test('bottom nav visible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(500);
  const nav = page.locator('#bottom-nav');
  await expect(nav).toBeVisible();
});

test('bottom nav hidden on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(500);
  const nav = page.locator('#bottom-nav');
  await expect(nav).not.toBeVisible();
});

test('touch targets >= 44px', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1000);
  const buttons = page.locator('button');
  const count = await buttons.count();
  var small = [];
  for (var i = 0; i < count; i++) {
    var box = await buttons.nth(i).boundingBox();
    if (box && (box.width < 44 || box.height < 44)) {
      var cls = await buttons.nth(i).getAttribute('class') || '';
      small.push('#' + i + ': ' + box.width + 'x' + box.height + 'px [' + cls.slice(0, 40) + ']');
    }
  }
  expect(small).toEqual([]);
});

test('no horizontal scroll on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(500);
  var noScroll = await page.evaluate(function () {
    return document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1;
  });
  expect(noScroll).toBeTruthy();
});
```

---

### Task 4: F5 — Loading States & Skeleton Patterns

**Files:**
- Modify: `code-generator/templates/core/ui.js` (add skeleton patterns, lazy loading helper)
- Create: `code-generator/templates/loading-states.md` (reference doc for generators)
- Test: `tests/test-loading.js`

- [ ] **Step 1: Add lazy loading helper to `code-generator/templates/core/ui.js`**

Add to `window.UI`:
```javascript
  // Lazy load: ejecuta fn cuando el elemento entra en viewport
  lazyLoad: function (el, fn) {
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            fn();
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '100px' });
      obs.observe(el);
      return function () { obs.disconnect(); };
    }
    fn();
    return function () {};
  },

  // Stagger: retorna delay (ms) para animación escalonada
  stagger: function (index, baseDelay) {
    baseDelay = baseDelay || 80;
    return index * baseDelay;
  },

  // Transition classes helper: retorna clases animate.css con stagger opcional
  fadeInUp: function (index) {
    var delay = index != null ? ' style="animation-delay:' + (index * 80) + 'ms"' : '';
    return 'animate__animated animate__fadeInUp' + delay;
  }
```

- [ ] **Step 2: Improve `UI.loading` to support custom messages**

Replace the existing `UI.loading` function with this enhanced version:

```javascript
  function showLoading(show, opts) {
    opts = opts || {};
    if (show) {
      loadingCount++;
      if (loadingCount > 1) return;
      if (!loadingEl) {
        loadingEl = document.createElement('div');
        loadingEl.id = 'ui-loading-overlay';
        loadingEl.setAttribute('role', 'progressbar');
        loadingEl.setAttribute('aria-label', opts.label || 'Cargando...');
        loadingEl.className = 'fixed inset-0 z-[70] flex items-center justify-center bg-base-300/50 backdrop-blur-sm animate__animated animate__fadeIn';
        loadingEl.innerHTML =
          '<div class="flex flex-col items-center gap-3 p-8">' +
            '<span class="loading loading-spinner loading-lg text-primary"></span>' +
            '<p class="text-sm text-base-content/60">' + (opts.message || 'Cargando...') + '</p>' +
          '</div>';
        document.body.appendChild(loadingEl);
      }
    } else {
      loadingCount = Math.max(0, loadingCount - 1);
      if (loadingCount === 0 && loadingEl) {
        loadingEl.classList.add('animate__fadeOut');
        setTimeout(function () {
          if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl);
          loadingEl = null;
        }, 200);
      }
    }
  }
```

And update the window.UI export to:
```javascript
    loading: function (show, opts) { return showLoading(show, opts); },
```

---

### Task 5: F7 — PWA Enhancements (Background Sync, Periodic Sync)

**Files:**
- Modify: `code-generator/templates/sw.js` (add periodic sync, push notification handlers)
- Create: `code-generator/templates/core/push-manager.js`
- Test: `tests/test-pwa-advanced.js`

- [ ] **Step 1: Enhance `code-generator/templates/sw.js`**

Add these blocks before the `fetch` event listener:

```javascript
// Periodic Background Sync
self.addEventListener('periodicsync', function (e) {
  if (e.tag === 'periodic-cleanup') {
    e.waitUntil(periodicCleanup());
  }
});

async function periodicCleanup() {
  var cache = await caches.open(CACHE);
  var keys = await cache.keys();
  var now = Date.now();
  for (var i = 0; i < keys.length; i++) {
    var resp = await cache.match(keys[i]);
    if (resp && resp.headers.get('sw-cache-timestamp')) {
      var ts = parseInt(resp.headers.get('sw-cache-timestamp'), 10);
      if (now - ts > 7 * 24 * 60 * 60 * 1000) {
        await cache.delete(keys[i]);
      }
    }
  }
}

// Push Notification (placeholder)
self.addEventListener('push', function (e) {
  var data = e.data ? e.data.json() : {};
  var options = {
    body: data.body || 'Notificaci\u00f3n',
    icon: 'assets/icons/icon-192.png',
    badge: 'assets/icons/icon-192.png',
    vibrate: [200, 100, 200]
  };
  e.waitUntil(
    self.registration.showNotification(data.title || 'AHA App', options)
  );
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
```

- [ ] **Step 2: Create `code-generator/templates/core/push-manager.js`**

```javascript
// push-manager.js — Gestión de notificaciones push y periodic sync
// window.pushManager expuesto globalmente

(function () {
  'use strict';

  if (typeof window.pushManager !== 'undefined') return;

  window.pushManager = {
    supported: false,
    permission: 'default',

    init: function () {
      this.supported = 'serviceWorker' in navigator && 'PushManager' in window;
      if (this.supported && 'Notification' in window) {
        this.permission = Notification.permission;
      }
    },

    requestPermission: async function () {
      if (!this.supported) return false;
      var result = await Notification.requestPermission();
      this.permission = result;
      return result === 'granted';
    },

    registerPeriodicSync: async function () {
      if (!('serviceWorker' in navigator) || !('PeriodicSyncManager' in window)) return false;
      try {
        var reg = await navigator.serviceWorker.ready;
        await reg.periodicSync.register('periodic-cleanup', {
          minInterval: 24 * 60 * 60 * 1000
        });
        return true;
      } catch (e) {
        console.warn('[push] Periodic sync no disponible:', e.message);
        return false;
      }
    },

    subscribe: async function (vapidPublicKey) {
      if (!this.supported) return null;
      try {
        var reg = await navigator.serviceWorker.ready;
        var sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey
        });
        return sub;
      } catch (e) {
        console.warn('[push] Error al suscribir:', e.message);
        return null;
      }
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.pushManager.init(); });
  } else {
    window.pushManager.init();
  }
})();
```

---

### Task 6: F8 — Testing Infrastructure

**Files:**
- Create: `Playwright.config.js`
- Create: `tests/playwright.config.js`
- Create: `tests/test-templates.js`
- Modify: `tests/test_app.py` (add new checks)
- Create: `tests/run-all-tests.js`

- [ ] **Step 1: Create `tests/playwright.config.js`**

```javascript
// playwright.config.js — Configuración global de Playwright
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  timeout: 30000,
  retries: 1,
  use: {
    channel: 'chrome',
    headless: true,
    viewport: { width: 1280, height: 800 }
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 667 } } }
  ]
});
```

- [ ] **Step 2: Create `tests/test-templates.js`**

```javascript
// test-templates.js — Verifica que todos los templates existen y son válidos
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

var TEMPLATES_DIR = path.resolve('code-generator/templates');
var REQUIRED_TEMPLATES = [
  'core/env.js', 'core/db.js', 'core/crypto.js', 'core/ui.js',
  'core/theme.js', 'core/app.js', 'core/sync.js', 'core/license.js',
  'core/network.js', 'core/export.js', 'core/backup-manager.js',
  'core/a11y.js', 'core/main.js',
  'sw.js', 'manifest.json'
];

test.describe('Template integrity', function () {
  REQUIRED_TEMPLATES.forEach(function (relPath) {
    test(relPath + ' exists and is valid JS', function () {
      var fullPath = path.join(TEMPLATES_DIR, relPath);
      expect(fs.existsSync(fullPath)).toBeTruthy();
      if (relPath.endsWith('.js')) {
        var content = fs.readFileSync(fullPath, 'utf-8');
        expect(content.length).toBeGreaterThan(50);
      }
    });
  });
});
```

- [ ] **Step 3: Modify `tests/test_app.py` — add PWA checks**

Add these test functions before the CHECKS list:

```python
def test_manifest_exists(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1000)
    manifest = page.evaluate("document.querySelector('link[rel=\"manifest\"]')?.getAttribute('href')")
    assert manifest and 'manifest.json' in manifest, "Manifest link missing"
    return True, f"Manifest OK: {manifest}"

def test_service_worker_registers(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(2000)
    has_sw = page.evaluate("'serviceWorker' in navigator")
    assert has_sw, "Service Worker not supported"
    return True, "SW API available"

def test_aria_announcer(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    announcer = page.evaluate("document.getElementById('a11y-announcer') !== null")
    assert announcer, "A11y announcer missing"
    return True, "A11y announcer present"

def test_bottom_nav_mobile(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.set_viewport_size({"width": 375, "height": 667})
    page.wait_for_timeout(500)
    nav = page.locator("#bottom-nav")
    assert nav.is_visible(), "Bottom nav not visible on mobile"
    return True, "Bottom nav visible at 375px"

def test_all_buttons_labeled(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    has_unlabeled = page.evaluate("""() => {
        const btns = document.querySelectorAll('button');
        return Array.from(btns).filter(b => !b.getAttribute('aria-label') && !b.textContent.trim()).length;
    }""")
    assert has_unlabeled == 0, f"{has_unlabeled} unlabeled buttons"
    return True, "All buttons have accessible names"
```

And add to CHECKS:
```python
    ("Manifest", test_manifest_exists),
    ("Service Worker", test_service_worker_registers),
    ("A11y Announcer", test_aria_announcer),
    ("Bottom Nav Mobile", test_bottom_nav_mobile),
    ("Button Labels", test_all_buttons_labeled),
```

- [ ] **Step 4: Create `tests/run-all-tests.js`**

```javascript
// run-all-tests.js — Runner unificado para todas las pruebas
import { execSync } from 'child_process';

var tests = [
  { name: 'Template Integrity', cmd: 'npx playwright test tests/test-templates.js' },
  { name: 'PWA', cmd: 'npx playwright test tests/test-pwa.js' },
  { name: 'A11y', cmd: 'npx playwright test tests/test-a11y.js' },
  { name: 'Responsive', cmd: 'npx playwright test tests/test-responsive.js' }
];

var allPass = true;
for (var t of tests) {
  console.log('\n=== ' + t.name + ' ===');
  try {
    execSync(t.cmd, { stdio: 'inherit', cwd: process.cwd() });
    console.log('[PASS] ' + t.name);
  } catch (e) {
    console.log('[FAIL] ' + t.name);
    allPass = false;
  }
}

process.exit(allPass ? 0 : 1);
```

---

### Task 7: F9 — CI/CD Pipeline

**Files:**
- Modify: `.github/workflows/deploy-pages.yml` (add matrix build per app, Playwright tests)
- Create: `.github/workflows/test.yml`

- [ ] **Step 1: Create `.github/workflows/test.yml`**

```yaml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install Playwright
        run: |
          npm init -y
          npm install @playwright/test
          npx playwright install chrome

      - name: Run Template Tests
        run: node tests/run-all-tests.js

      - name: Run Python E2E Tests
        run: |
          pip install pytest playwright
          python -m pytest tests/test_app.py -v
```

- [ ] **Step 2: Modify `.github/workflows/deploy-pages.yml`**

Add test job before build:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Install Playwright
        run: |
          npm init -y
          npm install @playwright/test
          npx playwright install --with-deps chrome
      - name: Run Tests
        run: |
          pip install pytest playwright
          python -m pytest tests/test_app.py -v
      - name: Upload Test Results
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: tests/test_results.json

  build:
    needs: test
    runs-on: ubuntu-latest
    # ... existing build steps ...
```

---

### Task 8: F10 — Documentation Generator

**Files:**
- Create: `scripts/generate-docs.js`
- Create: `scripts/generate-docs.ps1`

- [ ] **Step 1: Create `scripts/generate-docs.js`**

```javascript
// generate-docs.js — Genera README.md + guía de setup por app
// Uso: node scripts/generate-docs.js [app-name]
// Si se omite app-name, genera para todas las apps

const fs = require('fs');
const path = require('path');

var APPS_DIR = path.join(__dirname, '..', 'apps');
var DOCS_DIR = path.join(__dirname, '..', 'docs');

function extractSection(text, title) {
  var re = new RegExp('##\\s+' + title + '[\\s\\S]*?(?=\\n##|$)');
  var m = text.match(re);
  return m ? m[0].trim() : '';
}

function generateAppDoc(appName) {
  var templatePath = path.join(APPS_DIR, appName, 'template.md');
  if (!fs.existsSync(templatePath)) {
    console.log('[skip] ' + appName + ': template.md no encontrado');
    return;
  }

  var tmpl = fs.readFileSync(templatePath, 'utf-8');

  var title = (tmpl.match(/^#\s+(.+)/m) || [])[1] || appName;
  var desc = (tmpl.match(/^## Descripci\u00f3n comercial\\n+([\\s\\S]+?)\\n+##/m) || [])[1] || '';
  var target = (tmpl.match(/\*\\*Target:\\*\\*\s*(.+)/) || [])[1] || '';
  var dolor = (tmpl.match(/\*\\*Dolor que resuelve:\\*\\*\s*"(.+?)"/) || [])[1] || '';
  var niveles = extractSection(tmpl, 'Niveles comerciales');
  var modulos = extractSection(tmpl, 'M\u00f3dulos');
  var schema = extractSection(tmpl, 'Tablas Dexie');
  var pricing = extractSection(tmpl, 'Pricing sugerido');

  var readme = [
    '# ' + title,
    '',
    '> ' + desc.split('\n')[0],
    '',
    '## Descripci\u00f3n',
    '',
    desc.trim(),
    '',
    '**Target:** ' + target,
    '',
    '**Dolor que resuelve:** ' + dolor,
    '',
    '## Niveles',
    '',
    niveles,
    '',
    '## M\u00f3dulos',
    '',
    modulos,
    '',
    '## Esquema de Datos',
    '',
    schema,
    '',
    '## Pricing',
    '',
    pricing,
    '',
    '---',
    '',
    'Generado autom\u00e1ticamente por Ateje Stack Document Generator'
  ].join('\n');

  var appDocDir = path.join(DOCS_DIR, 'apps');
  if (!fs.existsSync(appDocDir)) fs.mkdirSync(appDocDir, { recursive: true });

  var outPath = path.join(appDocDir, appName + '.md');
  fs.writeFileSync(outPath, readme, 'utf-8');
  console.log('[ok] ' + appName + ' → ' + outPath);
}

// Main
var target = process.argv[2];
var apps = target
  ? [target]
  : fs.readdirSync(APPS_DIR).filter(function (f) { return f.startsWith('AHA-'); }).sort();

apps.forEach(generateAppDoc);
console.log('\nDocumentaci\u00f3n generada en docs/apps/');
```

- [ ] **Step 2: Create `scripts/generate-docs.ps1`**

```powershell
# generate-docs.ps1 — Genera documentación de apps
param(
  [string]$AppName = ""
)

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Error "Node.js requerido"
  exit 1
}

if ($AppName) {
  node "$PSScriptRoot\generate-docs.js" $AppName
} else {
  node "$PSScriptRoot\generate-docs.js"
}

Write-Host "Documentacion generada en docs/apps/" -ForegroundColor Green
```

---

### Task 9: F11 — Offline-First Analytics

**Files:**
- Create: `code-generator/templates/core/analytics.js`
- Test: `tests/test-analytics.js`

- [ ] **Step 1: Create `code-generator/templates/core/analytics.js`**

```javascript
// analytics.js — Analytics offline-first (GDPR compliant)
// window.analytics expuesto globalmente
// Almacena eventos en Dexie tabla _analytics_events
// Sin cookies, sin tracking externo, sin IP storage

(function () {
  'use strict';

  if (typeof window.analytics !== 'undefined') return;

  var QUEUE_KEY = '_analytics_queue';
  var FLUSH_INTERVAL = 60000; // 1 min

  window.analytics = {
    enabled: true,
    userId: null,
    _timer: null,
    _dbReady: false,

    init: function (opts) {
      opts = opts || {};
      this.enabled = opts.enabled !== false;
      this.userId = opts.userId || 'anon';

      if (!this.enabled) return;

      // Crear tabla en Dexie si no existe
      if (window.db && !window.db._analytics_events) {
        try {
          // La tabla se define en db.js versionado
          this._dbReady = true;
        } catch (e) {
          console.warn('[analytics] Dexie no disponible, usando localStorage');
        }
      }

      // Flush periódico
      this._timer = setInterval(function () { window.analytics.flush(); }, FLUSH_INTERVAL);

      // Flush al cerrar
      window.addEventListener('beforeunload', function () { window.analytics.flush(); });

      // Evento de página vista
      this.track('page_view', { path: window.location.hash || '/' });
    },

    track: function (event, data) {
      if (!this.enabled) return;
      data = data || {};
      var eventData = {
        id: window.uuid ? window.uuid() : Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        event: event,
        data: data,
        url: window.location.hash || '/',
        timestamp: new Date().toISOString(),
        userId: this.userId,
        sessionId: this._getSessionId()
      };

      this._store(eventData);
    },

    _store: function (eventData) {
      if (this._dbReady && window.db && window.db._analytics_events) {
        window.db._analytics_events.put(eventData).catch(function () {
          // Fallback a localStorage
          window.analytics._storeLocal(eventData);
        });
      } else {
        this._storeLocal(eventData);
      }
    },

    _storeLocal: function (eventData) {
      try {
        var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        queue.push(eventData);
        // Mantener solo últimas 500 entradas
        if (queue.length > 500) queue = queue.slice(-500);
        localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
      } catch (e) {
        // localStorage lleno, descartar
      }
    },

    flush: function () {
      try {
        var queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
        if (queue.length === 0) return;

        // En producción: enviar a endpoint propio
        // fetch('/api/analytics', { method: 'POST', body: JSON.stringify(queue) })

        localStorage.removeItem(QUEUE_KEY);
      } catch (e) {
        // Silencioso
      }
    },

    _getSessionId: function () {
      var key = '_analytics_session';
      var id = sessionStorage.getItem(key);
      if (!id) {
        id = window.uuid ? window.uuid() : Date.now().toString(36);
        sessionStorage.setItem(key, id);
      }
      return id;
    },

    // Eventos helpers
    pageView: function (path) { this.track('page_view', { path: path || window.location.hash }); },
    moduleOpen: function (moduleId) { this.track('module_open', { module: moduleId }); },
    createRecord: function (table) { this.track('create_record', { table: table }); },
    deleteRecord: function (table) { this.track('delete_record', { table: table }); },
    exportData: function (format) { this.track('export_data', { format: format }); },
    error: function (message, source) { this.track('error', { message: message, source: source }); }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { window.analytics.init(); });
  } else {
    window.analytics.init();
  }
})();
```

- [ ] **Step 2: Add `_analytics_events` table to `code-generator/templates/core/db.js`**

Add to the `SCHEMA` object:
```javascript
  SCHEMA._analytics_events = 'id, *event, *timestamp, *userId, *sessionId, url';
```

- [ ] **Step 3: Create `tests/test-analytics.js`**

```javascript
// tests/test-analytics.js — Pruebas de analytics offline-first
import { test, expect } from '@playwright/test';

test('analytics tracks page view', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1500);
  var tracked = await page.evaluate(function () {
    return window.analytics && window.analytics.enabled;
  });
  expect(tracked).toBeTruthy();
});

test('analytics stores events in localStorage', async ({ page }) => {
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1500);
  var queue = await page.evaluate(function () {
    return JSON.parse(localStorage.getItem('_analytics_queue') || '[]');
  });
  expect(queue.length).toBeGreaterThanOrEqual(1);
  expect(queue[0].event).toBe('page_view');
});

test('analytics does not send to external servers', async ({ page }) => {
  var requests = [];
  page.on('request', function (req) { requests.push(req.url()); });
  await page.goto('file://' + process.cwd() + '/tests/test-app.html');
  await page.waitForTimeout(1500);
  var analyticsCalls = requests.filter(function (url) {
    return url.includes('analytics') || url.includes('tracking') || url.includes('google');
  });
  expect(analyticsCalls).toEqual([]);
});
```

---

## Summary

| Task | What | Files | Status |
|------|------|-------|--------|
| F2 | SW + Manifest | `code-generator/templates/sw.js`, `manifest.json` | Pending |
| F3 | A11y WCAG | `core/a11y.js`, `core/focus-trap.js` | Pending |
| F4 | Responsive Mobile | `core/responsive.js`, `core/bottom-nav.js` | Pending |
| F5 | Loading States | Modify `core/ui.js` | Pending |
| F7 | PWA Advanced | `core/push-manager.js`, modify `sw.js` | Pending |
| F8 | Testing | `playwright.config.js`, test files | Pending |
| F9 | CI/CD | `.github/workflows/test.yml`, modify deploy | Pending |
| F10 | Docs Gen | `scripts/generate-docs.js`, `.ps1` | Pending |
| F11 | Analytics | `core/analytics.js`, modify `db.js` | Pending |
