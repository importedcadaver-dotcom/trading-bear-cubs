#!/usr/bin/env python3
"""Real-browser acceptance for physical NPC encounters and fair transactions.

Uses the maintained offline game at a local HTTP origin. No screenshot is
considered evidence unless NPC positions/memories/inventories are inspected.
"""
import copy
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"test-results"/"physical-v523"
OUT.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
server=ThreadingHTTPServer(("127.0.0.1",0),partial(Quiet,directory=str(ROOT)))
Thread(target=server.serve_forever,daemon=True).start()
url=f"http://127.0.0.1:{server.server_port}/"
def check(value,reason):
    assert value,reason
    print("PASS:",reason,flush=True)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    ctx=browser.new_context(viewport={"width":1440,"height":900})
    page=ctx.new_page()
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    try:
        page.goto(url)
        page.locator("#v5New").click()
        page.locator("#v5CubName").fill("Clover")
        page.locator("#v5Start").click()
        page.evaluate("window.__LTP_TEST__=true")
        state=lambda:page.evaluate("window.LittleTradingPost.getState()")
        actor=lambda id:next(n for n in state()["npcs"] if n["id"]==id)
        start=state()
        fern,pebble=actor("fern"),actor("pebble")
        check(fern["location"]==pebble["location"]=="den","Littermates begin together in den")

        # Multi-step play: creating an intention cannot cause an instant
        # relationship change. Outcomes occur only after physical approach.
        rel=fern.get("relTo",{}).get("pebble",0)
        check(page.evaluate("window.LittleTradingPost.npcTestMeeting('fern','pebble','wrestle')"),
              "Two actual cubs begin an autonomous wrestling intention")
        now=actor("fern")
        check(now.get("meetPlan",{}).get("stage")=="approach","Wrestling starts in approach state")
        check(now.get("relTo",{}).get("pebble",0)==rel,
              "Relationship does not change before meeting")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(2)")
        check(actor("fern")["worldPos"]!=fern["worldPos"],"Wrestling pair physically moves")
        page.screenshot(path=str(OUT/"01-wrestle-approach.png"),full_page=True)
        page.evaluate("window.LittleTradingPost.npcTestAdvance(20)")
        after=actor("fern")
        check(not after.get("meetPlan"),"Wrestling resolves after face-to-face action")
        check(after["relTo"]["pebble"]==rel+1,"Completed wrestling updates persistent relationship")
        check(any("Finished wrestle" in m for m in after["memory"]),
              "Wrestling completion is remembered")
        page.screenshot(path=str(OUT/"02-wrestling-complete.png"),full_page=True)

        # Physical sharing moves the same conserved item from one bear to
        # another; delayed transaction should not duplicate inventory.
        f=actor("fern");b=actor("pebble")
        gift=next((id for id,q in f["inv"].items() if q>0),None)
        check(bool(gift),"Fern has a physical item available for sharing")
        total=f["inv"].get(gift,0)+b["inv"].get(gift,0)
        check(page.evaluate("window.LittleTradingPost.npcTestMeeting('fern','pebble','share')"),
              "A second independent social action starts")
        check(actor("fern")["inv"].get(gift,0)==f["inv"].get(gift,0),
              "Goods remain in inventory until the exchange finishes")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(22)")
        f2=actor("fern");b2=actor("pebble")
        check(f2["inv"].get(gift,0)+b2["inv"].get(gift,0)==total,
              "Physical gift preserves total item quantity")
        check(f2["inv"].get(gift,0)==f["inv"].get(gift,0)-1,
              "Item changes hands only after the bears meet")
        page.screenshot(path=str(OUT/"03-treasure-share.png"),full_page=True)

        # A quarrel has a different relationship result and is also delayed.
        before=actor("fern").get("relTo",{}).get("pebble",0)
        check(page.evaluate("window.LittleTradingPost.npcTestMeeting('fern','pebble','argue')"),
              "Autonomous sibling argument can begin")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(20)")
        check(actor("fern")["relTo"]["pebble"]==before-1,
              "Completed argument affects persistent feelings")
        check(any("Finished argue" in m for m in actor("pebble")["memory"]),
              "Witness sibling remembers argument")
        page.screenshot(path=str(OUT/"04-sibling-argument.png"),full_page=True)

        # Scripted in-world NPC commerce is reciprocal and deferred too.
        f=actor("fern");b=actor("pebble")
        choices=[(x,y) for x,n in f["inv"].items() if n>0
                       for y,m in b["inv"].items() if m>0 and x!=y]
        check(bool(choices),"Pair owns distinct treasures to exchange")
        x,y=choices[0]
        totals={id:f["inv"].get(id,0)+b["inv"].get(id,0) for id in [x,y]}
        check(page.evaluate("(xy)=>window.LittleTradingPost.npcTestMeeting('fern','pebble','trade',xy[0],xy[1])",[x,y]),
              "Physical barter meeting can be scheduled")
        check(actor("fern")["inv"].get(x,0)==f["inv"].get(x,0),
              "Trade does not move goods before actors meet")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(22)")
        f2=actor("fern");b2=actor("pebble")
        check(not f2.get("meetPlan"),"Face-to-face trade completes")
        check(all(f2["inv"].get(id,0)+b2["inv"].get(id,0)==total
                  for id,total in totals.items()),"NPC-to-NPC trade conserves both goods")
        check(f2["deals"]==f["deals"]+1 and b2["deals"]==b["deals"]+1,
              "Only completed trade increments each NPC deal counter")
        page.screenshot(path=str(OUT/"05-npc-trade.png"),full_page=True)

        # Interrupted encounters must cancel, never complete remotely.
        start_f=actor("fern");start_b=actor("pebble")
        check(page.evaluate("window.LittleTradingPost.npcTestMeeting('fern','pebble','share')"),
              "Pending physical transfer created")
        page.evaluate("window.LittleTradingPost.npcTestPhase(1)")
        page.evaluate("window.LittleTradingPost.npcTestAdvance(1)")
        check(not actor("fern").get("meetPlan") and not actor("pebble").get("meetPlan"),
              "Scene departure cancels unfinished meeting")
        check(actor("fern")["inv"]==start_f["inv"] and actor("pebble")["inv"]==start_b["inv"],
              "Cancelled transfer never duplicates or loses items")

        # Obstacle navigation uses real map colliders from whichever location
        # the actors are in, independent of the player's current scene.
        sample=copy.deepcopy(state())
        for n in sample["npcs"]:
            if n["id"]=="fern":n["location"]="den";n["worldPos"]=[360,290];n["worldTarget"]=[360,290];n["travelPlan"]=None;n["meetPlan"]=None;n["navSteps"]=[]
            if n["id"]=="pebble":n["location"]="den";n["worldPos"]=[590,290];n["worldTarget"]=[590,290];n["travelPlan"]=None;n["meetPlan"]=None;n["navSteps"]=[]
        page.evaluate("(s)=>window.LittleTradingPost.importSave(s)",sample)
        check(page.evaluate("window.LittleTradingPost.npcTestMeeting('fern','pebble','chat')"),
              "Bears on opposite sides of den nest initiate meeting")
        all_positions=[]
        for j in range(25):
            page.evaluate("window.LittleTradingPost.npcTestAdvance(0.5)")
            all_positions.append((actor("fern")["worldPos"],actor("pebble")["worldPos"]))
        violations=page.evaluate("""(points)=>points.filter(pair=>
          pair.some(p=>window.LittleTradingPost.npcTestBlocked('den',p[0],p[1]))).length
          """,all_positions)
        check(violations==0,"Bears route around den nest without crossing collision geometry")
        check(not errors,"Physical encounter flow has no browser JavaScript crashes")
    finally:
        ctx.close()
        browser.close()
        server.shutdown()
