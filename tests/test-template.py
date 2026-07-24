"""
Test E2E automatizado para template app.
Usa Chrome del sistema via conftest.py (channel="chrome").
Template base — copiar y adaptar para cada app.
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
    assert "AHA" in page.title() or "Test" in page.title() or "Task" in page.title(), "Title mismatch"
    return True, f"Title OK: {page.title()}"


def test_alpine_interactivity(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    buttons = page.locator("button")
    count = buttons.count()
    assert count > 0, "No interactive elements found"
    return True, f"Alpine.js OK: {count} buttons"


def test_responsive_layout(page):
    page.goto(APP_FILE.resolve().as_uri())
    page.set_viewport_size({"width": 375, "height": 667})
    page.wait_for_timeout(500)
    no_scroll = page.evaluate(
        "document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1"
    )
    assert no_scroll, "Horizontal scroll on mobile"
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


    # ─── Tests específicos de la app ─────────────────────────────
    # Agregar aquí funciones test específicas de la aplicación.
    # Cada función recibe `page` (Playwright Page) y retorna (bool, str).
# Ejemplo:
#
# def test_mi_funcion(page):
#     page.goto(APP_FILE.resolve().as_uri())
#     ...
#     return True, "Descripción del test"


CHECKS = [
    ("Page Load", test_page_loads),
    ("Alpine.js Interactivity", test_alpine_interactivity),
    ("Responsive Layout", test_responsive_layout),
    ("Touch Targets", test_touch_targets),
    # ─── Tests de la app ───────────────────────────────────────
    # Agregar aquí las tuplas (name, test_fn) para cada test específico.
]


def main():
    print("=" * 60)
    print("  TEST E2E - Template App")
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
