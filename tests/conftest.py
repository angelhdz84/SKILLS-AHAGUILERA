"""
Configuración global de pytest-playwright.
Usa Chrome del sistema (channel="chrome") porque el CDN de Chromium
está geobloqueado en esta ubicación.
"""
import pytest


@pytest.fixture(scope="session")
def browser_type_launch_args():
    return {"channel": "chrome", "headless": True}
