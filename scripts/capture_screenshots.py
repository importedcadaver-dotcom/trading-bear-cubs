#!/usr/bin/env python3
"""Generate real Chromium screenshots, from files already committed to GitHub.

Run: pip install playwright && python -m playwright install chromium
     python scripts/capture_screenshots.py

A failed optional scene capture does not replace the user's historical screenshots.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page.goto((ROOT / "index.html").as_uri(), wait_until="domcontentloaded")
    page.wait_for_timeout(700)
    page.screenshot(path=str(OUT / "v5-title.png"), full_page=True)
    print("Saved v5 title")
    try:
        page.locator("#v5New").click(timeout=5000)
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / "v5-character-creator.png"), full_page=True)
        print("Saved creator")
        page.locator("#v5CubName").fill("Clover")
        page.locator("#v5Start").click(timeout=5000)
        page.wait_for_timeout(1000)
        page.screenshot(path=str(OUT / "v5-mamas-den.png"), full_page=True)
        print("Saved first-morning gameplay")
    except Exception as exc:
        print("Additional screenshots unavailable:", exc)
    browser.close()
