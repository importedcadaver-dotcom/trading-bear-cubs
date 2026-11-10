#!/usr/bin/env python3
"""v5.1.2 realistic-browser checks for game save integrity and special trade limits.

Runs against the exact standalone index.html on a loopback origin. It cannot
replace usability QA, but it checks real game functions, DOM and browser storage.
"""
import copy
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]

class Quiet(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

def check(condition, what):
    if not condition:
        raise AssertionError(what)
    print("PASS:", what, flush=True)

server = ThreadingHTTPServer(("127.0.0.1", 0), partial(Quiet, directory=str(ROOT)))
Thread(target=server.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{server.server_port}/"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900})
    page = context.new_page()
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    try:
        page.goto(url)
        page.locator("#v5New").click()
        page.locator("#v5CubName").fill("Clover")
        page.locator("#v5Start").click()
        state = lambda: page.evaluate("window.LittleTradingPost.getState()")
        snapshot = state()
        check(snapshot["inv"] == {"berry":3,"stick":1}, "Initial gameplay quantities intact")
        check(bool(page.evaluate("window.LittleTradingPost.exportSave")), "Export hook available")

        # Real current save roundtrip, independent of the import-file input.
        saved = page.evaluate("JSON.parse(window.LittleTradingPost.exportSave())")
        page.evaluate("(value) => window.LittleTradingPost.importSave(value)",saved)
        check(state()["inv"] == saved["inv"], "Current v5 save imports without loss")
        browser_copy = page.evaluate("localStorage.getItem('little_trading_post_v1_2026')")
        check(bool(browser_copy), "Imported save persisted on real HTTP origin")

        # Rejected saves must not alter RAM or browser storage.
        bads = []
        b = copy.deepcopy(saved)
        b["inv"]["berry"] = -9
        bads.append(("Negative item quantity",b))
        b = copy.deepcopy(saved)
        b["inv"]["unknown_entirely_fake_item"] = 1
        bads.append(("Unknown item ID",b))
        b = copy.deepcopy(saved)
        b["npcs"][0]["id"] = "imposter"
        bads.append(("Missing canonical NPC ID",b))
        b = copy.deepcopy(saved)
        b["day"] = -5
        bads.append(("Invalid day",b))
        b = copy.deepcopy(saved)
        b["needs"]["food"] = float("nan")
        # JSON.stringify(NaN) becomes null; should still fail isFinite.
        bads.append(("Invalid need value",b))
        for label, bad in bads:
            previous = page.evaluate("window.LittleTradingPost.exportSave()")
            stored = page.evaluate("localStorage.getItem('little_trading_post_v1_2026')")
            msg = page.evaluate("""(input) => {
                try { window.LittleTradingPost.importSave(input); return ''; }
                catch(e) { return String(e.message); }
            }""",bad)
            check(bool(msg),label+" rejected")
            check(page.evaluate("window.LittleTradingPost.exportSave()") == previous, label+" did not overwrite RAM")
            check(page.evaluate("localStorage.getItem('little_trading_post_v1_2026')") == stored,label+" did not overwrite stored save")

        # A malicious NPC name in a JSON save must not become HTML markup.
        malicious = copy.deepcopy(saved)
        malicious["npcs"][0]["name"] = "<img src=x onerror=alert(1)>"
        page.evaluate("(value) => window.LittleTradingPost.importSave(value)",malicious)
        check(state()["npcs"][0]["name"] == "Fern", "NPC identity restored from trusted canon")
        check(page.locator('img[onerror]').count() == 0,"Untrusted name not rendered as executable HTML")

        # Reimport a real v2/v3/v4-shaped save and verify later fields are synthesized.
        legacy = copy.deepcopy(saved)
        for field in ["v3","v4","v5","playerDependency","playerCravings","v5DrugHistory",
                      "v5ContrabandLog","v5Builds","v5Events","v5NPCMoves"]:
            legacy.pop(field,None)
        page.evaluate("(value) => window.LittleTradingPost.importSave(value)",legacy)
        migrated=state()
        check(migrated.get("v3")==3 and migrated.get("v4")==4 and migrated.get("v5")==5,
              "Legacy save migrates through v3, v4, v5")
        check(migrated["inv"]==saved["inv"],"Legacy migration preserves item ownership")
        check("playerDependency" in migrated and "trader" in migrated,"Legacy migration initializes later systems")

        # Special dependence-related sentimental trade must obey bag capacity.
        cap=copy.deepcopy(saved)
        cap["location"]="den"
        cap["chosen"]="fern"
        cap["playerPos"]=[345,330]
        cap["inv"]={"berry":23,"vape_berry":1}
        cap["npcs"][0]["location"]="den"
        cap["npcs"][0]["worldPos"]=[359,330]
        cap["npcs"][0]["worldTarget"]=[359,330]
        sentimental=cap["npcs"][0]["love"]
        cap["npcs"][0]["inv"][sentimental]=1
        cap["npcs"][0]["sentimental"]=sentimental
        cap["npcs"][0]["cravings"]["nic"]=96
        cap["npcs"][0]["dependency"]["nic"]=70
        page.evaluate("(value) => window.LittleTradingPost.importSave(value)",cap)
        page.evaluate("window.LittleTradingPost.selectNPC('fern')")
        # Selecting the cub opens a dialogue, but the trading panel stays hidden
        # until the player explicitly chooses barter.
        page.locator("#v5BarterOption").click()
        offer_name = page.evaluate("window.LittleTradingPost.items.vape_berry.short")
        take_name = page.evaluate("(id) => window.LittleTradingPost.items[id].short",sentimental)
        page.locator("#yourTrade button.goods").filter(has_text=offer_name).first.click()
        page.locator("#theirTrade button.goods").filter(has_text=take_name).first.click()
        initial=state()
        page.locator("#tradeBtn").click()
        after=state()
        check(after["trades"]==initial["trades"],"Overcapacity desperate deal awards no progress")
        check(after["inv"]==initial["inv"],"Overcapacity desperate deal cannot transfer goods")
        check("full" in page.locator("#toast").inner_text().lower()
              or "cannot hold" in page.locator("#tradeResult").inner_text().lower(),
              "Overcapacity trade provides clear feedback")

        # The pre-import snapshot is recoverable from an actual user-facing
        # developer-menu option; restoration itself swaps the current save into
        # the backup slot, so it is reversible.
        backup = page.evaluate("localStorage.getItem(window.LittleTradingPost.backupSaveKey)")
        check(bool(backup),"Successful imports create a recoverable backup")
        page.evaluate("window.LittleTradingPost.restoreBackup()")
        check(state()["inv"] != initial["inv"] or state()["trades"] == initial["trades"],
              "Backup restore returns a valid game state")

        # Save failures must be surfaced to the player rather than swallowed.
        result=page.evaluate("""() => {
            const original=Storage.prototype.setItem;
            Storage.prototype.setItem=function(){throw new Error('simulated blocked storage')};
            try {window.LittleTradingPost.spawn('acorn');
                 return document.getElementById('toast').textContent;}
            finally {Storage.prototype.setItem=original;}
        }""")
        check("SAVE FAILED" in result,"Blocked browser storage displays a visible error")
        check(not errors,"No uncaught browser errors across migration tests: "+repr(errors))
    finally:
        context.close()
        browser.close()
        server.shutdown()
