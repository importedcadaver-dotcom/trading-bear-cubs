#!/usr/bin/env python3
"""Real archived v1–v5 save fixtures, tested against the live v5.1.2 import path.

Opens each version's *actual* historical HTML in the browser and obtains a
localStorage save produced by that version, then imports it into current code.
No hand-crafted synthetic old-version shapes substitute for these fixtures.
"""
import json
from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
SAVE="little_trading_post_v1_2026"

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):
        pass

server=ThreadingHTTPServer(("127.0.0.1",0), partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
url=f"http://127.0.0.1:{server.server_port}/"

with sync_playwright() as playwright:
    browser=playwright.chromium.launch(headless=True)
    try:
        for version in ["v1","v2","v3","v4","v5"]:
            ctx=browser.new_context(viewport={"width":1440,"height":900})
            page=ctx.new_page()
            errors=[]
            page.on("pageerror",lambda e:errors.append(str(e)))
            try:
                page.goto(url+f"versions/{version}/index.html")
                if version in {"v1","v2"}:
                    # Historical versions use a day-advance control that invokes save.
                    page.evaluate("document.getElementById('nextBtn').click()")
                elif version=="v3":
                    page.evaluate("window.LittleTradingPost.spawn('acorn')")
                else:
                    page.evaluate("window.LittleTradingPost.newGame()")
                raw=page.evaluate(f"localStorage.getItem('{SAVE}')")
                assert raw, f"{version} did not persist a genuine save"
                legacy=json.loads(raw)
                assert legacy["version"]==1
                assert len(legacy["npcs"])==6
                assert len(legacy["inv"])>=1

                page.goto(url)
                assert page.evaluate("typeof window.LittleTradingPost.importSave")=="function"
                result=page.evaluate("""(raw) => {
                    try {return {ok:window.LittleTradingPost.importSave(raw)}}
                    catch(e){return {error:String(e.message)}}
                }""",legacy)
                assert result.get("ok"),f"{version} import error: {result.get('error')}"
                current=page.evaluate("window.LittleTradingPost.getState()")
                assert current["inv"]==legacy["inv"],f"{version} lost historical items"
                assert current.get("v5")==5 and current.get("v4")==4 and current.get("v3")==3
                assert len(current["npcs"])==6
                assert current["day"]>=legacy["day"]
                assert current["location"] in {"post","den","river","woods","pebble","trail","rival","playground"}
                assert not errors, f"{version} emitted browser errors: {errors}"
                print(f"PASS: {version} real archived save imports into v5.1.2 without item loss",flush=True)
            finally:
                ctx.close()
    finally:
        browser.close()
        server.shutdown()
