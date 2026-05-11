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
