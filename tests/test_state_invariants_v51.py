"""Property-based stress on the *actual v5.1 browser game*, not a toy Python economy.

Requires pytest, hypothesis, playwright Chromium. Uses a local HTTP server
so browser storage and same-origin behavior are realistic.
"""
import math
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread

import pytest
from hypothesis import given, settings, strategies as st, HealthCheck
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

@pytest.fixture(scope="module")
def browser():
    srv = ThreadingHTTPServer(("127.0.0.1", 0),
        partial(QuietHandler, directory=str(ROOT)))
    Thread(target=srv.serve_forever, daemon=True).start()
    with sync_playwright() as playwright:
        app = playwright.chromium.launch(headless=True)
        yield app, f"http://127.0.0.1:{srv.server_port}/"
        app.close()
    srv.shutdown()

OPS = ["post", "den", "river", "trail", "playground", "rival", "sleep", "honey", "mama"]

@settings(max_examples=9, deadline=None, suppress_health_check=[HealthCheck.function_scoped_fixture])
@given(st.lists(st.sampled_from(OPS), min_size=8, max_size=32))
def test_world_state_invariants(browser, operations):
    app, url = browser
    ctx = app.new_context(viewport={"width": 1280, "height": 720})
    page = ctx.new_page()
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    try:
        page.goto(url)
        page.locator("#v5New").click()
        page.locator("#v5CubName").fill("Clover")
        page.locator("#v5Start").click()
        for op in operations:
            if op in {"post", "den", "river", "trail", "playground", "rival"}:
                page.evaluate("location => window.LittleTradingPost.travel(location, true)", op)
            elif op == "sleep":
                page.evaluate("window.LittleTradingPost.sleep()")
            elif op == "honey":
                page.evaluate("window.LittleTradingPost.consumeHoney()")
            elif op == "mama":
                if page.evaluate("window.LittleTradingPost.getState().location") == "den":
                    page.evaluate("window.LittleTradingPost.mamaTalk()")
            state = page.evaluate("window.LittleTradingPost.getState()")
            assert state["day"] >= 1
            assert state["location"] in {"post", "den", "river", "trail", "playground", "rival", "woods", "pebble"}
            assert len({n["id"] for n in state["npcs"]}) == len(state["npcs"])
            for inv in [state["inv"], *(n["inv"] for n in state["npcs"])]:
                assert all(isinstance(q, int) and q >= 0 for q in inv.values())
            assert isinstance(state["honey"], int) and state["honey"] >= 0
            for need in state["needs"].values():
                assert math.isfinite(need) and 0 <= need <= 100
            assert all(math.isfinite(x) for x in state["playerPos"])
            # A blocked UI modal does not erase the world-state or duplicate NPC records.
        assert not errors, errors
    finally:
        ctx.close()
