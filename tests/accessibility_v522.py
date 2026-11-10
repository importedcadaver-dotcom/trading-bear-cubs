#!/usr/bin/env python3
"""v5.2.2 accessibility and schedule-safe onboarding browser regression.

This is deterministic automated QA, NOT a substitute for three real novice testers.
"""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"test-results"/"accessibility-v522"
OUT.mkdir(parents=True,exist_ok=True)

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass

server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
url=f"http://127.0.0.1:{server.server_port}/"

def check(condition,label):
    assert condition,label
    print("PASS:",label,flush=True)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    try:
        ctx=browser.new_context(viewport={"width":1440,"height":900})
        page=ctx.new_page()
        errors=[]
        page.on("pageerror",lambda e:errors.append(str(e)))
        page.goto(url)
        page.locator("#v5New").click()
        page.locator("#v5CubName").fill("Clover")
        page.locator("#v5Start").click()
        check("1/8" in page.locator(".v51TutorialBeacon").inner_text(),
              "Tutorial starts with a visible, numbered Mama objective")
        check("W A S D" in page.locator("#world").get_attribute("aria-label"),
              "World canvas exposes screen-reader control instructions")
        page.locator("#v51NeedDetails").click()
        check(page.locator("#modalBackdrop.open").count()==1,"Needs dialog opens")
        page.wait_for_timeout(30)
        check(page.evaluate("document.activeElement.closest('#modal')!==null"),
              "Keyboard focus enters the active dialog")
        check(page.locator("#modal").get_attribute("aria-modal")=="true",
              "Dialog marks itself modal for assistive technology")
        page.keyboard.press("Escape")
        check(page.locator("#modalBackdrop.open").count()==0,"Escape closes the dialog")
        check(page.evaluate("document.activeElement.id")=="v51NeedDetails",
              "Closing a dialog restores the previous keyboard focus")

        page.evaluate("window.__LTP_TEST__=true")
        check(page.evaluate("window.LittleTradingPost.tutorialTestStep(2)"),
              "Test-gated tutorial step injection works")
        page.evaluate("window.LittleTradingPost.npcTestPhase(1)")
        a=page.evaluate("window.LittleTradingPost.getState()")
        pebble=next(x for x in a["npcs"] if x["id"]=="pebble")
        check(pebble["location"]=="den" and not pebble.get("travelPlan"),
              "Pebble cannot leave the den during his required tutorial interaction")
        check("3/8" in page.locator(".v51TutorialBeacon").inner_text(),
              "Current Pebble objective remains visibly explained")
        page.evaluate("window.LittleTradingPost.tutorialTestStep(7)")
        page.evaluate("window.LittleTradingPost.npcTestPhase(1)")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(95)")
        b=page.evaluate("window.LittleTradingPost.getState()")
        fern=next(x for x in b["npcs"] if x["id"]=="fern")
        check(fern["location"]=="post" and not fern.get("travelPlan"),
              "Fern arrives at trading post instead of indefinitely blocking first trade")
        check("8/8" in page.locator(".v51TutorialBeacon").inner_text(),
              "First-trade tutorial displays where to meet Fern")
        page.screenshot(path=str(OUT/"tutorial-desktop.png"),full_page=True)

        for width,height in [(390,844),(430,932)]:
            context=browser.new_context(viewport={"width":width,"height":height},
                                         is_mobile=True,has_touch=True,device_scale_factor=1)
            mobile=context.new_page()
            mobile.goto(url)
            mobile.locator("#v5New").click()
            mobile.locator("#v5CubName").fill("Clover")
            mobile.locator("#v5Start").click()
            buttons=mobile.locator("#v52Touch button")
            check(buttons.count()==6,f"{width}px: all six touch controls available")
            for rect in buttons.evaluate_all("(elements) => elements.map(e => e.getBoundingClientRect().toJSON())"):
                check(rect["width"]>=44 and rect["height"]>=44,
                      f"{width}px: a touch target meets at least 44×44 CSS pixels")
            check(mobile.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),
                  f"{width}px: no horizontal page overflow")
            mobile.screenshot(path=str(OUT/f"mobile-{width}.png"),full_page=True)
            context.close()
        check(not errors,"Desktop onboarding and modal flow had no uncaught exceptions")
    finally:
        browser.close()
        server.shutdown()
