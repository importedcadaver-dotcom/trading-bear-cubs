#!/usr/bin/env python3
"""Capture actual game screenshots from preserved HTML using headless Chromium.

Recreated screenshots are marked by file/version, not claimed to be the exact
old images uploaded to ChatGPT. Generated automatically by GitHub Actions.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "screenshots"
OUT.mkdir(parents=True, exist_ok=True)

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    for number in range(1, 5):
        version = f"v{number}"
        path = ROOT / "versions" / version / "index.html"
        if not path.is_file():
            continue
        try:
            page.goto(path.as_uri(), wait_until="domcontentloaded")
            page.wait_for_timeout(600)
            page.screenshot(path=str(OUT / f"{version}-historical-render.png"), full_page=True)
            print("Captured", version)
        except Exception as exc:
            print("Skipped historical screenshot", version, exc)
    page.goto((ROOT / "index.html").as_uri(), wait_until="domcontentloaded")
    page.wait_for_timeout(750)
    page.screenshot(path=str(OUT / "v5-title.png"), full_page=True)
    print("Saved v5 title")
    try:
        page.locator("#v5New").click(timeout=5000)
        page.wait_for_timeout(300)
        page.screenshot(path=str(OUT / "v5-character-creator.png"), full_page=True)
        print("Saved v5 creator")
        page.locator("#v5CubName").fill("Clover")
        page.locator("#v5Start").click(timeout=5000)
        page.wait_for_timeout(850)
        page.screenshot(path=str(OUT / "v5-mamas-den.png"), full_page=True)
        print("Saved first-morning gameplay")
        for name, location in [("v5-market.png", "post"), ("v5-human-trail.png", "trail"), ("v5-riverside.png", "river")]:
            try:
                page.evaluate("(location) => window.LittleTradingPost.travel(location)", location)
                page.wait_for_timeout(400)
                actual = page.evaluate("window.LittleTradingPost.getState().location")
                if actual == location:
                    page.screenshot(path=str(OUT / name), full_page=True)
                    print("Saved", name)
                else:
                    print("Could not reach", location, "currently", actual)
            except Exception as exc:
                print("Scene capture skipped", location, exc)
    except Exception as exc:
        print("Additional v5 screenshots unavailable:", exc)
    browser.close()
