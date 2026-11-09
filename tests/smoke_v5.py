#!/usr/bin/env python3
"""Portable v5 smoke test. Requires Playwright and installed Chromium.

pip install playwright && python -m playwright install chromium
python tests/smoke_v5.py

This adds a reproducible *current* check; historical v5 results are archived
in docs/v5/TEST_REPORT_V5.md, not silently claimed to have been rerun.
"""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
from playwright.sync_api import sync_playwright


def check(label, outcome):
    print(("PASS " if outcome else "FAIL ") + label)
    if not outcome:
        raise AssertionError(label)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto((ROOT / "index.html").as_uri(), wait_until="domcontentloaded")
    check("Full-screen title visible", page.locator("#v5New").is_visible())
    page.locator("#v5New").click()
    check("Character creator available", page.locator("#v5CubName").is_visible())
    page.locator("#v5CubName").fill("Clover")
    page.locator("#v5Start").click()
    page.wait_for_timeout(250)
    state = page.evaluate("window.LittleTradingPost.getState()")
    check("Starting at Mama's Den", state["location"] == "den")
    check("Three berries", state["inv"].get("berry", 0) == 3)
    check("One very nice stick", state["inv"].get("stick", 0) == 1)
    check("Two littermates", all(any(n["id"] == who for n in state["npcs"]) for who in ("fern", "pebble")))
    check("Player age 11 months", state.get("avatar") is not None)
    check("No JavaScript exceptions", not errors)
    print("8/8 smoke assertions passed")
    browser.close()
