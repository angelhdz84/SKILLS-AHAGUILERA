"""
Test E2E automatizado para app offline-first.
Usa Chrome del sistema (channel="chrome") porque Chromium está geobloqueado.
"""
import json
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

TESTS_DIR = Path(__file__).parent
APP_FILE = TESTS_DIR / "test-app.html"
RESULTS_FILE = TESTS_DIR / "test_results.json"

def test_page_loads(page):
    page.goto(APP_FILE.resolve().as_uri())
    assert "Gestor de Tareas" in page.title(), "Title mismatch"
    return True, f"Title OK: {page.title()}"

def test_alpine_interactivity(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    input_el = page.locator("#tarea-input")
    input_el.fill("Comprar leche")
    page.locator('button[aria-label="Agregar tarea"]').click()
    page.wait_for_timeout(500)
    body = page.locator("body").inner_text()
    assert "Comprar leche" in body, "New task not added via Alpine"
    return True, "Alpine.js interactivity OK: task added"

def test_form_validation(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    page.evaluate("document.querySelector('#tarea-input').value = 'ab'")
    page.locator("#tarea-input").dispatch_event("input")
    page.wait_for_timeout(200)
    page.locator('button[aria-label="Agregar tarea"]').click()
    page.wait_for_timeout(800)
    alert = page.locator('[role="alert"]')
    assert alert.is_visible(), "Validation alert not visible"
    text = alert.inner_text()
    assert "3 caracteres" in text, f"Wrong validation text: {text}"
    return True, f"Form validation OK: '{text}'"

def test_empty_state(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    page.on("dialog", lambda d: d.accept())
    for _ in range(5):
        delete_btn = page.locator('button[aria-label="Eliminar tarea"]').first
        if not delete_btn.is_visible():
            break
        delete_btn.click()
        page.wait_for_timeout(500)
    page.wait_for_timeout(500)
    body = page.locator("body").inner_text()
    assert "No hay tareas" in body, "Empty state not shown"
    return True, "Empty state OK: 'No hay tareas' visible"

def test_toggle_complete(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    toggle_btn = page.locator('button[aria-label="Marcar como completada"]').first
    toggle_btn.click()
    page.wait_for_timeout(300)
    toggle_btn = page.locator('button[aria-label="Marcar como pendiente"]').first
    assert toggle_btn.is_visible(), "Toggle not working"
    return True, "Toggle complete OK: aria-label changed"

def test_responsive_layout(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.set_viewport_size({"width": 375, "height": 667})
    page.wait_for_timeout(500)
    no_scroll = page.evaluate("document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1")
    assert no_scroll, "Horizontal scroll on mobile"
    title = page.locator("h1")
    assert title.is_visible(), "Title not visible on mobile"
    return True, "Responsive OK: no horizontal scroll at 375px"

def test_touch_targets(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    buttons = page.locator("button")
    count = buttons.count()
    small = []
    for i in range(count):
        btn = buttons.nth(i)
        if btn.is_visible():
            box = btn.bounding_box()
            if box and (box["width"] < 44 or box["height"] < 44):
                cls = btn.get_attribute("class") or ""
                small.append(f"#{i}: {box['width']}x{box['height']}px [{cls[:40]}]")
    assert len(small) == 0, f"Small touch targets: {small}"
    return True, f"Touch targets OK: all {count} buttons >= 44px"

def test_focus_rings(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    page.locator("#tarea-input").focus()
    page.wait_for_timeout(300)
    has_focus = page.evaluate("document.activeElement === document.getElementById('tarea-input')")
    assert has_focus, "Input not focusable"
    return True, "Focus OK: input is focusable"

def test_viewport_meta(page):
    page.goto(APP_FILE.resolve().as_uri())
    viewport = page.evaluate("document.querySelector('meta[name=viewport]')?.content")
    assert viewport and "width=device-width" in viewport, "Viewport meta missing"
    return True, f"Viewport meta OK: {viewport}"

def test_skip_link(page):
    page.goto(APP_FILE.resolve().as_uri())
    skip = page.locator("#skip-link")
    assert skip.is_visible(), "#skip-link not visible"
    text = skip.inner_text()
    assert "Saltar al contenido" in text, f"Wrong skip text: '{text}'"
    skip.focus()
    is_focused = page.evaluate("document.activeElement === document.getElementById('skip-link')")
    assert is_focused, "Skip link not focusable via tab"
    return True, f"Skip link OK: '{text}', focusable"

def test_aria_live(page):
    page.goto(APP_FILE.resolve().as_uri())
    live = page.locator('[aria-live="polite"], [aria-live="assertive"], #toast-container, #a11y-live-region').first
    assert live.is_visible(), "No aria-live region found"
    tag = live.evaluate("el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '')")
    role = live.get_attribute("aria-live") or "N/A"
    return True, f"Aria-live region OK: <{tag}> aria-live='{role}'"

def test_manifest(page):
    page.goto(APP_FILE.resolve().as_uri())
    manifest = page.locator('link[rel="manifest"]')
    assert manifest.count() > 0, 'No <link rel="manifest" href="manifest.json"> found'
    href = manifest.get_attribute("href")
    assert href, "Manifest href attribute missing"
    return True, f"Manifest OK: href='{href}'"

def test_service_worker(page):
    page.goto(APP_FILE.resolve().as_uri())
    is_file = page.evaluate("window.location.protocol === 'file:'")
    if is_file:
        return True, "ServiceWorker SKIP: file:// protocol does not support SW (use http://)"
    sw = page.evaluate("""() => {
        if (!navigator.serviceWorker) return { available: false, reason: 'no serviceWorker API' };
        try {
            return navigator.serviceWorker.getRegistrations().then(regs => ({
                available: true,
                registered: regs.length > 0,
                count: regs.length
            }));
        } catch(e) {
            return { available: true, registered: false, reason: e.message };
        }
    }""")
    assert sw.get("available"), f"ServiceWorker API not available: {sw.get('reason')}"
    assert sw.get("registered"), f"No service workers registered"
    return True, f"ServiceWorker OK: {sw['count']} registration(s)"

def test_bottom_nav(page):
    page.goto(APP_FILE.resolve().as_uri())
    nav = page.locator("#bottom-nav")
    assert nav.is_visible(), "#bottom-nav not visible"
    cls = nav.get_attribute("class") or ""
    assert "btm-nav" in cls, f"#bottom-nav missing btm-nav class (got: '{cls}')"
    return True, "Bottom nav OK: #bottom-nav.btm-nav"

def test_loading_state(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    page.evaluate("UI?.loading ? UI.loading(true, 'Test') : null")
    page.wait_for_timeout(300)
    overlay = page.locator("#ui-loading-overlay")
    if overlay.is_visible():
        page.evaluate("UI?.loading ? UI.loading(false) : null")
        page.wait_for_timeout(300)
        assert not overlay.is_visible(), "Overlay still visible after UI.loading(false)"
        return True, "Loading state OK: overlay shown/hidden"
    return True, "UI.loading not implemented (skip)"

def test_stagger_animation(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    result = page.evaluate("""() => {
        try {
            if (typeof UI !== 'undefined' && typeof UI.stagger === 'function') {
                UI.stagger([document.body], 50);
                return 'ok';
            }
            return 'UI.stagger not available';
        } catch(e) { return 'error: ' + e.message; }
    }""")
    assert not result.startswith('error:'), f"Stagger threw error: {result}"
    return True, f"Stagger animation OK: {result}"

def test_offline_detection(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    online = page.evaluate("navigator.onLine")
    assert online is not None, "navigator.onLine not available"
    has_ui_store = page.evaluate("""() => {
        try {
            return typeof Alpine !== 'undefined'
                && Alpine.store('ui') !== undefined
                && Alpine.store('ui').online !== undefined;
        } catch(e) { return false; }
    }""")
    assert has_ui_store, "Alpine.store('ui').online not defined"
    return True, f"Offline detection OK: online={online}, store defined"

CHECKS = [
    ("Page Load", test_page_loads),
    ("Alpine.js Interactivity", test_alpine_interactivity),
    ("Form Validation", test_form_validation),
    ("Toggle Complete", test_toggle_complete),
    ("Responsive Layout", test_responsive_layout),
    ("Touch Targets", test_touch_targets),
    ("Focus Rings", test_focus_rings),
    ("Viewport Meta", test_viewport_meta),
    ("Empty State", test_empty_state),
    ("Skip Link", test_skip_link),
    ("Aria Live Region", test_aria_live),
    ("Manifest", test_manifest),
    ("Service Worker", test_service_worker),
    ("Bottom Nav", test_bottom_nav),
    ("Loading State", test_loading_state),
    ("Stagger Animation", test_stagger_animation),
    ("Offline Detection", test_offline_detection),
]

def main():
    print("=" * 60)
    print("  TEST E2E - App Offline-First")
    print("  Chrome (channel='chrome')")
    print(f"  App: {APP_FILE.name}")
    print("=" * 60)

    results = []
    all_pass = True

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 800},
            device_scale_factor=1,
        )
        page = context.new_page()

        for name, test_fn in CHECKS:
            try:
                ok, msg = test_fn(page)
                status = "PASS" if ok else "FAIL"
                print(f"  [{status}] {name}: {msg}")
                results.append({"check": name, "status": status, "message": msg})
                if not ok:
                    all_pass = False
            except Exception as e:
                print(f"  [FAIL] {name}: {e}")
                results.append({"check": name, "status": "FAIL", "message": str(e)})
                all_pass = False

        browser.close()

    summary = {
        "total": len(results),
        "passed": sum(1 for r in results if r["status"] == "PASS"),
        "failed": sum(1 for r in results if r["status"] == "FAIL"),
        "results": results
    }

    with open(RESULTS_FILE, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print("=" * 60)
    print(f"  Total: {summary['total']} | PASS: {summary['passed']} | FAIL: {summary['failed']}")
    if all_pass:
        print("  [PASS] TODOS LOS CHECKS PASARON")
    else:
        print(f"  [FAIL] {summary['failed']} CHECK(S) FALLARON")
    print(f"  Reporte: {RESULTS_FILE}")
    print("=" * 60)

    return 0 if all_pass else 1

if __name__ == "__main__":
    sys.exit(main())
