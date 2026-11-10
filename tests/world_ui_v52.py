#!/usr/bin/env python3
"""v5.2 world actor autonomy, Settings save, accessibility and mobile behavior."""
import copy
import json
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/"test-results"/"actor-v52"
OUTPUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass

srv=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
Thread(target=srv.serve_forever,daemon=True).start()
url=f"http://127.0.0.1:{srv.server_port}/"

def start(page):
    page.goto(url)
    page.locator("#v5New").click()
    page.locator("#v5CubName").fill("Clover")
    page.locator("#v5Start").click()

def check(ok,msg):
    if not ok:raise AssertionError(msg)
    print("PASS:",msg,flush=True)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    try:
        ctx=browser.new_context(viewport={"width":1440,"height":900},accept_downloads=True)
        page=ctx.new_page()
        errors=[]
        page.on("pageerror",lambda e: errors.append(str(e)))
        start(page)
        page.evaluate("window.__LTP_TEST__=true")
        state=lambda:page.evaluate("window.LittleTradingPost.getState()")
        first=state()
        fern=lambda:next(n for n in state()["npcs"] if n["id"]=="fern")
        check(first["location"]=="den" and first["inv"]=={"berry":3,"stick":1},
              "Game starts in den with original three berries and very nice stick")
        f0=fern()
        check(page.evaluate("window.LittleTradingPost.npcTestPhase(1)"),"Daytime NPC schedule can start")
        f1=fern()
        check(f1["location"]==f0["location"]=="den" and f1.get("travelPlan",{}).get("stage")=="leaving",
              "Fern begins physical departure without teleporting")
        check(page.evaluate("window.LittleTradingPost.npcTestAdvance(2)"),"Simulated two seconds of travel")
        f2=fern()
        check(f2["location"]=="den" and f2["worldPos"]!=f0["worldPos"],
              "Fern physically moves across her starting scene before leaving")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(90)")
        f3=fern()
        check(f3["location"]=="post" and not f3.get("travelPlan"),
              "Fern crosses world route, enters destination and finishes arrival")
        check("Walked from" in str(f3.get("memory",[])),"Travel is recorded in persistent NPC memory")
        check(not any(n["location"] not in page.evaluate("Object.keys(window.LittleTradingPost.world)") for n in state()["npcs"]),
              "Every cub occupies one real world location")
        # Deliberately move schedules back and forth for 30 day-cycles.
        for day in range(30):
            page.evaluate("(ph) => window.LittleTradingPost.npcTestPhase(ph)",day%4)
            page.evaluate("window.LittleTradingPost.npcTestAdvance(95)")
            st=state()
            check(len(set(n["id"] for n in st["npcs"]))==6,f"Day-cycle {day+1}: exactly six unique cubs")
            for n in st["npcs"]:
                check(n["location"] in page.evaluate("Object.keys(window.LittleTradingPost.world)") and all(isinstance(x,(int,float)) for x in n["worldPos"]),
                      f"Day-cycle {day+1}: {n['id']} has valid position")
        # Persistent travel-in-progress is serializable and survives reload.
        page.evaluate("window.LittleTradingPost.npcTestPhase(1)")
        before=state()
        page.reload()
        after=state()
        check([(n["id"],n.get("travelPlan")) for n in before["npcs"]]==
              [(n["id"],n.get("travelPlan")) for n in after["npcs"]],
              "NPC route plans persist through save reload")
        page.screenshot(path=str(OUTPUT/"desktop-scene.png"),full_page=True)

        # User-facing Settings save export and file import, not hidden developer controls.
        page.evaluate("window.LittleTradingPost.menu()")
        page.locator("#v5Settings").click()
        check(page.locator("#v52Export").is_visible() and page.locator("#v52Import").is_visible(),
              "Settings exposes real export and import controls")
        with page.expect_download() as info:page.locator("#v52Export").click()
        dl=info.value
        check(dl.suggested_filename.endswith(".json"),"Browser downloaded a portable JSON save")
        dl.save_as(str(OUTPUT/"test-export.json"))
        with page.expect_file_chooser() as choose:page.locator("#v52Import").click()
        chooser=choose.value
        chooser.set_files(str(OUTPUT/"test-export.json"))
        page.wait_for_timeout(250)
        check(state()["inv"]==after["inv"],"Reimporting exported Settings file preserves inventory")

        for width,height in [(390,844),(430,932)]:
            mobile=browser.new_context(viewport={"width":width,"height":height},
              device_scale_factor=1,is_mobile=True,has_touch=True)
            m=mobile.new_page()
            merrors=[]
            m.on("pageerror",lambda e:merrors.append(str(e)))
            start(m)
            check(m.locator("#v52Touch").is_visible(),f"{width}px: mobile touch controls are visible")
            check(m.locator("#v52Interact").is_visible(),f"{width}px: touch interaction is visible")
            check(m.evaluate("document.documentElement.scrollWidth<=innerWidth+1"),
                  f"{width}px: no horizontal page overflow")
            prior=m.evaluate("window.LittleTradingPost.getState().playerPos")
            left=m.locator('[data-direction="right"]')
            left.dispatch_event("pointerdown",{"pointerId":3,"pointerType":"touch"})
            m.wait_for_timeout(450)
            left.dispatch_event("pointerup",{"pointerId":3,"pointerType":"touch"})
            updated=m.evaluate("window.LittleTradingPost.getState().playerPos")
            check(updated[0]>prior[0]+8,f"{width}px: touch D-pad actually moves the cub")
            m.screenshot(path=str(OUTPUT/f"mobile-{width}.png"),full_page=True)
            check(not merrors,f"{width}px: no JavaScript errors")
            mobile.close()
        check(not errors,"Desktop flow produces no browser JavaScript errors")
    finally:
        browser.close()
        srv.shutdown()
