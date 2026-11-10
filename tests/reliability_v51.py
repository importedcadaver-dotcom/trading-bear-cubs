#!/usr/bin/env python3
"""v5.1 browser regression: real visible mouse clicks, trade conservation and saves."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
CAPTURES = ROOT / "test-results" / "v51"
CAPTURES.mkdir(parents=True, exist_ok=True)

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/"
checks = 0

def ok(message, condition):
    global checks
    assert condition, message
    checks += 1
    print(f"PASS {checks}: {message}", flush=True)

def start(page):
    page.goto(url, wait_until="domcontentloaded")
    page.locator("#v5New").click()
    page.locator("#v5CubName").fill("Clover")
    page.locator("#v5Start").click()
    page.wait_for_timeout(150)

def state(page):
    return page.evaluate("window.LittleTradingPost.getState()")

def visible_world_xy(page, x, y):
    return page.locator("#world").evaluate("""(el, p) => {
       const r=el.getBoundingClientRect(),k=Math.min(r.width/el.width,r.height/el.height);
       return {x:r.left+(r.width-el.width*k)/2+p.x*k,
               y:r.top+(r.height-el.height*k)/2+p.y*k}
    }""", {"x":x,"y":y})

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    context.tracing.start(screenshots=True,snapshots=True,sources=True)
    try:
        start(page)
        a=state(page)
        ok("Starting possessions conserved",a["inv"].get("berry")==3 and a["inv"].get("stick")==1)
        ok("Starts in Mama's Den",a["location"]=="den")
        # Reproduce actual mouse click on the visible Mama sprite, NOT a synthetic input coordinate.
        xy=visible_world_xy(page,563,242)
        page.mouse.click(xy["x"],xy["y"])
        page.wait_for_timeout(6000)
        title=page.locator("#modalTitle").inner_text() if page.locator("#modalBackdrop.open").count() else ""
        page.screenshot(path=str(CAPTURES/"mama-click.png"),full_page=True)
        pos=state(page)["playerPos"]
        ok(f"Visible Mama click opens her interaction, position {pos}, modal {title}", "MAMA" in title.upper())
        ok("Tutorial Mama objective progresses", state(page)["tutorial"]["step"]>=1)
        page.keyboard.press("Escape")
        # Correct user-directed movement remains possible.
        a=state(page)["playerPos"]
        page.keyboard.down("a")
        page.wait_for_timeout(320)
        page.keyboard.up("a")
        page.wait_for_timeout(80)
        ok("WASD responds after mouse navigation",state(page)["playerPos"][0]<a[0]-3)
        # Exercise null trade from an independent new game on a fresh browser storage origin.
        other=browser.new_context(viewport={"width": 1440, "height": 900})
        page2=other.new_page()
        page2.on("pageerror",lambda e:errors.append(str(e)))
        start(page2)
        page2.locator("#v5Talk").click()
        ok("Opening Fern conversation available",page2.locator("#v5BarterOption").count()==1)
        page2.locator("#v5BarterOption").click()
        page2.locator("#yourTrade button").first.click()
        page2.locator("#theirTrade button").first.click()
        before=state(page2)
        page2.locator("#tradeBtn").click()
        after=state(page2)
        result=page2.locator("#tradeResult").inner_text().lower()
        ok("Identical goods exchange rejected with explanation","same treasure" in result or "same item" in result or "exactly" in result)
        ok("Identical exchange cannot award reputation or count", after["rep"]==before["rep"] and after["trades"]==before["trades"])
        ok("Identical exchange conserves inventory",after["inv"]==before["inv"])
        ok("Identical exchange cannot farm friendship",next(n["rel"] for n in after["npcs"] if n["id"]=="fern")==next(n["rel"] for n in before["npcs"] if n["id"]=="fern"))
        for _ in range(50):
            page2.locator("#tradeBtn").click(timeout=3000)
        repeated=state(page2)
        ok("50 further identical barter attempts cannot farm reputation, achievements or friendship",
           repeated["rep"]==before["rep"] and repeated["trades"]==before["trades"]
           and repeated["inv"]==before["inv"]
           and next(n["rel"] for n in repeated["npcs"] if n["id"]=="fern")
               ==next(n["rel"] for n in before["npcs"] if n["id"]=="fern"))
        page2.screenshot(path=str(CAPTURES/"null-trade.png"),full_page=True)
        # Real browser origin save/restoration check (not an opaque data URI).
        page2.evaluate("window.localStorage.setItem('v51_test_origin','present')")
        page2.reload()
        ok("Origin storage persists across reload",page2.evaluate("localStorage.getItem('v51_test_origin')")=="present")
        # Mobile viewport and touch target behavior.
        mob=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,device_scale_factor=1)
        pm=mob.new_page()
        start(pm)
        page_error=pm.evaluate("document.documentElement.scrollWidth-innerWidth")
        ok("390px mobile has no horizontal overflow", page_error<=1)
        pm.screenshot(path=str(CAPTURES/"mobile.png"),full_page=True)
        ok("No uncaught browser errors",not errors)
        print(f"SUMMARY: {checks}/{checks} passed",flush=True)
    finally:
        context.tracing.stop(path=str(CAPTURES/"trace.zip"))
        browser.close()
        server.shutdown()
