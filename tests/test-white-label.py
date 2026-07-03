"""
Test de White-Label: brand-loader.js + feature-flags.js
Valida carga de config, conversion OKLCH, feature gating y Alpine store.
Requiere: pytest + playwright
"""
import json
import os
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

TESTS_DIR = Path(__file__).parent
ROOT_DIR = TESTS_DIR.parent
TEST_FILE = TESTS_DIR / "test-white-label.html"
BRAND_CONFIG = ROOT_DIR / "deployment-jigue" / "templates" / "brand.config.json"
BRAND_LOADER = ROOT_DIR / "code-generator" / "templates" / "core" / "brand-loader.js"
FEATURE_FLAGS = ROOT_DIR / "code-generator" / "templates" / "core" / "feature-flags.js"

RESULTS_FILE = TESTS_DIR / "test_results.json"


# ─── Tests estáticos (sin browser) ────────────────────────────────

def test_brand_config_structure():
    """Valida que brand.config.json tenga la estructura completa de DEFAULTS"""
    assert BRAND_CONFIG.exists(), f"brand.config.json not found at {BRAND_CONFIG}"
    with open(BRAND_CONFIG, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    assert "colors" in cfg, "Missing 'colors' key"
    required_colors = ["primary", "secondary", "accent", "neutral",
                       "base-100", "base-200", "base-300",
                       "info", "success", "warning", "error"]
    for c in required_colors:
        assert c in cfg["colors"], f"Missing color '{c}' in brand.config.json"
        assert cfg["colors"][c].startswith("#"), f"Color '{c}' not hex: {cfg['colors'][c]}"
    assert "fonts" in cfg, "Missing 'fonts' key"
    for fkey in ["heading", "body", "mono"]:
        assert fkey in cfg["fonts"], f"Missing font '{fkey}'"
    assert "logo" in cfg, "Missing 'logo' key"
    for lkey in ["light", "dark", "favicon", "splash"]:
        assert lkey in cfg["logo"], f"Missing logo key '{lkey}'"
    return True, f"brand.config.json OK: {len(required_colors)} colors, {len(cfg['fonts'])} fonts"


def test_brand_loader_es5():
    """Valida que brand-loader.js no use ES6+ syntax prohibida"""
    with open(BRAND_LOADER, "r", encoding="utf-8") as f:
        content = f.read()
    violations = []
    if "const " in content: violations.append("const")
    if "let " in content: violations.append("let")
    if "async " in content: violations.append("async")
    if "() =>" in content or "=> " in content: violations.append("arrow function")
    if "`" in content and "${" in content: violations.append("template literal")
    assert len(violations) == 0, f"ES6+ violations: {violations}"
    return True, "brand-loader.js is ES5 compliant"


def test_feature_flags_structure():
    """Valida feature-flags.js structure"""
    with open(FEATURE_FLAGS, "r", encoding="utf-8") as f:
        content = f.read()
    assert "PLAN_HIERARCHY" in content, "Missing PLAN_HIERARCHY"
    for plan in ["lite", "professional", "business"]:
        assert plan in content, f"Missing plan '{plan}' in feature-flags.js"
    assert "canWhiteLabel" in content, "Missing canWhiteLabel flag"
    assert "window.APP_CONFIG" in content, "Missing APP_CONFIG dependency"
    return True, "feature-flags.js structure OK: 3 plans, canWhiteLabel gated"


# ─── Tests con browser ────────────────────────────────────────────

def test_page_load(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(500)
    title = page.title()
    assert "AHA Test" in title or "White-Label" in title, f"Title mismatch: got '{title}'"
    return True, f"Title OK: {title}"


def test_alpine_init(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    has_store = page.evaluate("""() => {
        try {
            return typeof Alpine !== 'undefined'
                && Alpine.store('brand') !== undefined;
        } catch(e) { return false; }
    }""")
    assert has_store, "Alpine.store('brand') not set after init"
    return True, "Alpine.store('brand') initialized"


def test_brand_colors(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    root = page.evaluate("""() => {
        const s = document.documentElement.style;
        return {
            primary: s.getPropertyValue('--p').trim(),
            secondary: s.getPropertyValue('--s').trim(),
            accent: s.getPropertyValue('--a').trim(),
            neutral: s.getPropertyValue('--n').trim(),
            b1: s.getPropertyValue('--b1').trim(),
            b2: s.getPropertyValue('--b2').trim(),
            b3: s.getPropertyValue('--b3').trim(),
            in: s.getPropertyValue('--in').trim(),
            su: s.getPropertyValue('--su').trim(),
            wa: s.getPropertyValue('--wa').trim(),
            er: s.getPropertyValue('--er').trim()
        };
    }""")
    for key, val in root.items():
        assert val, f"DaisyUI CSS variable --{key} is empty"
        # DaisyUI v4: --p: 0.35 0.07 256 (L C H space-separated, sin oklch() wrapper)
        parts = val.split()
        is_oklch_components = len(parts) >= 3 and all(p.replace('.','',1).replace('-','',1).isdigit() for p in parts[:3])
        assert "oklch" in val or "hsl" in val or val.startswith("#") or is_oklch_components, \
            f"--{key} invalid format: {val}"
    return True, f"DaisyUI OKLCH tokens applied: {sum(1 for v in root.values() if v)} vars"


def test_feature_gating(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    gating = page.evaluate("""() => {
        try {
            const ff = Alpine.store('ff');
            return {
                enabled: ff.enabled('canWhiteLabel'),
                canExport: ff.enabled('canExport'),
                plan: ff.list().maxRecords
            };
        } catch(e) { return { error: e.message }; }
    }""")
    assert "error" not in gating, f"Feature flag error: {gating['error']}"
    assert gating["enabled"] is True, \
        f"canWhiteLabel should be True for Business plan, got {gating['enabled']}"
    assert gating["canExport"] is True, "canExport should be True for Business"
    assert gating["plan"] == 999999, \
        f"maxRecords should be large for Business, got {gating['plan']}"
    return True, "Feature gating OK: canWhiteLabel=True for Business"


def test_config_persistence(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    result = page.evaluate("""() => {
        try {
            Alpine.store('brand').setAppName('Cliente Demo');
            Alpine.store('brand').savePreview();
            const raw = localStorage.getItem('ateje_brand_preview');
            if (!raw) return { error: 'No preview saved' };
            const parsed = JSON.parse(raw);
            return { appName: parsed.appName, saved: true };
        } catch(e) { return { error: e.message }; }
    }""")
    assert "error" not in result, f"Persistence error: {result['error']}"
    assert result["appName"] == "Cliente Demo", \
        f"appName mismatch: {result['appName']}"
    return True, f"Config persistence OK: appName='{result['appName']}'"


def test_set_color(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    result = page.evaluate("""() => {
        try {
            Alpine.store('brand').setColor('primary', '#ff0000');
            Alpine.store('brand').setColor('accent', '#00ff00');
            Alpine.store('brand').savePreview();
            const raw = localStorage.getItem('ateje_brand_preview');
            const parsed = JSON.parse(raw);
            return {
                primary: parsed.colors.primary,
                accent: parsed.colors.accent
            };
        } catch(e) { return { error: e.message }; }
    }""")
    assert "error" not in result, f"setColor error: {result['error']}"
    assert result["primary"] == "#ff0000", f"primary not updated: {result['primary']}"
    assert result["accent"] == "#00ff00", f"accent not updated: {result['accent']}"
    return True, "setColor OK: primary=#ff0000, accent=#00ff00"


def test_set_font(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    result = page.evaluate("""() => {
        try {
            Alpine.store('brand').setFont('heading', 'Georgia, serif');
            Alpine.store('brand').savePreview();
            const raw = localStorage.getItem('ateje_brand_preview');
            const parsed = JSON.parse(raw);
            return { heading: parsed.fonts.heading };
        } catch(e) { return { error: e.message }; }
    }""")
    assert "error" not in result, f"setFont error: {result['error']}"
    assert result["heading"] == "Georgia, serif", \
        f"font not updated: {result['heading']}"
    return True, "setFont OK: heading=Georgia, serif"


def test_reset_config(page):
    page.goto(TEST_FILE.resolve().as_uri())
    page.wait_for_timeout(1500)
    result = page.evaluate("""() => {
        try {
            Alpine.store('brand').setAppName('Custom');
            Alpine.store('brand').setColor('primary', '#ff0000');
            Alpine.store('brand').resetConfig();
            const cfg = Alpine.store('brand').get();
            return {
                appName: cfg.appName,
                primary: cfg.colors.primary
            };
        } catch(e) { return { error: e.message }; }
    }""")
    assert "error" not in result, f"resetConfig error: {result['error']}"
    assert result["appName"] == "", f"appName not reset: {result['appName']}"
    assert result["primary"] == "#1e3a5f", \
        f"primary not reset to default: {result['primary']}"
    return True, "resetConfig OK: restored defaults"


CHECKS = [
    ("Brand Config Structure", test_brand_config_structure),
    ("Brand Loader ES5", test_brand_loader_es5),
    ("Feature Flags Structure", test_feature_flags_structure),
    ("Page Load", test_page_load),
    ("Alpine Init", test_alpine_init),
    ("Brand Colors Applied", test_brand_colors),
    ("Feature Gating", test_feature_gating),
    ("Config Persistence", test_config_persistence),
    ("Set Color", test_set_color),
    ("Set Font", test_set_font),
    ("Reset Config", test_reset_config),
]


def main():
    print("=" * 60)
    print("  TEST WHITE-LABEL")
    print("  brand-loader.js + feature-flags.js")
    print(f"  Browser: {TEST_FILE.name}")
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
                if name in ("Brand Config Structure", "Brand Loader ES5",
                            "Feature Flags Structure"):
                    ok, msg = test_fn()
                else:
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
