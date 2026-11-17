"""Reserved gifts and Fern's ribbon mouse in the assembled browser game."""
import argparse
from contextlib import ExitStack
from copy import deepcopy
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "test-results" / "v51" / "ribbon-mouse"
OUT.mkdir(parents=True, exist_ok=True)


def state(page):
    return page.evaluate("LittleTradingPost.getState()")


def cub(save, name):
    return next(n for n in save["npcs"] if n["id"] == name)


def start(page, url):
    page.goto(url)
    page.locator("#v5New").click()
    page.locator("#v5CubName").fill("Alder")
    page.locator("#v5Start").click()


def gift_cases(page):
    page.evaluate("window.__LTP_TEST__ = true")
    initial = state(page)
    for change in ("berry available", "mouse only", "berry reserved during approach",
                   "berry removed during approach"):
        save = deepcopy(initial)
        fern = cub(save, "fern")
        pebble = cub(save, "pebble")
        fern.update(inv={"mouse": 1}, reservedInv={"mouse": 1})
        pebble.update(inv={"stick": 1}, reservedInv={})
        if change != "mouse only":
            fern["inv"]["berry"] = 1
        assert page.evaluate("(s) => LittleTradingPost.importSave(s)", save)
        assert page.evaluate("LittleTradingPost.npcTestMeeting('fern','pebble','share')")
        if change.endswith("during approach"):
            save = state(page)
            fern = cub(save, "fern")
            assert fern["meetPlan"]["stage"] == "approach"
            if change.startswith("berry reserved"):
                fern["reservedInv"]["berry"] = 1
            else:
                del fern["inv"]["berry"]
            assert page.evaluate("(s) => LittleTradingPost.importSave(s)", save)
        before = state(page)
        page.evaluate("LittleTradingPost.npcTestAdvance(12)")
        result = state(page)
        assert not cub(result, "fern")["meetPlan"]
        expected_fern = cub(before, "fern")["inv"].copy()
        expected_pebble = {"stick": 1}
        if change == "berry available":
            del expected_fern["berry"]
            expected_pebble["berry"] = 1
        else:
            assert any("declined before finishing" in entry["s"] for entry in result["log"])
        assert cub(result, "fern")["inv"] == expected_fern
        assert cub(result, "pebble")["inv"] == expected_pebble
        assert cub(result, "fern")["reservedInv"] == cub(before, "fern")["reservedInv"]
        assert page.evaluate("LittleTradingPost.importSave(JSON.parse(LittleTradingPost.exportSave()))")
        for actor in ("fern", "pebble"):
            for field in ("inv", "reservedInv"):
                assert cub(state(page), actor)[field] == cub(result, actor)[field]
        print("PASS: " + change, flush=True)


def click_cub(page, name):
    page.wait_for_function("""id => {
        const s = LittleTradingPost.getState(), n = s.npcs.find(c => c.id === id);
        return n.location === s.location && !n.travelPlan;
    }""", arg=name)
    x, y = cub(state(page), name)["worldPos"]
    click_world(page, x, y)
    page.locator("#cubChoices").get_by_role("button",name="Talk",exact=True).click()
    page.locator("#continueCubDialogue").click()


def click_world(page, x, y):
    world = page.locator("#world")
    world.scroll_into_view_if_needed()
    box = world.bounding_box()
    scale = min(box["width"] / 768, box["height"] / 434)
    world.click(position={"x": (box["width"] - 768 * scale) / 2 + x * scale,
                          "y": (box["height"] - 434 * scale) / 2 + y * scale})


def travel(page, location):
    page.locator("#v5Map").click()
    page.locator(f'[data-route="{location}"]').click()


def offer_mouse(page):
    click_cub(page, "fern")
    page.locator("#fernMouseStory").click()
    expect(page.locator("#modalBody")).to_contain_text("Mama used to tuck this mouse")
    page.get_by_role("button", name="BACK", exact=True).click()
    travel(page, "post")
    page.wait_for_function("""() => {
      const fern = LittleTradingPost.getState().npcs.find(n => n.id === 'fern');
      return fern.location === 'post' && fern.travelPlan?.stage === 'arriving';
    }""")
    page.screenshot(path=OUT / "01-fern-arrives.png")
    click_cub(page, "fern")
    page.locator("#v5BarterOption").click()
    offer = page.locator('#yourTrade button[title^="Berry:"]')
    mouse = page.locator('#theirTrade button[title^="Fern\'s ribbon mouse:"]')
    offer.click()
    mouse.click()
    page.locator("#tradeBtn").click()
    expect(page.locator("#tradeResult")).to_contain_text("Maybe I’d trade with Pebble")
    refused = state(page)
    assert cub(refused, "fern")["inv"]["fernMouse"] == 1
    assert refused["treasureHistory"]["fernMouse"]["stage"] == "offered"
    assert "formerOwner" not in refused["treasureHistory"]["fernMouse"]
    page.screenshot(path=OUT / "02-fern-refuses.png")
    page.locator(".v5PanelClose").click()


def finish_pebble_objective(page):
    click_world(page, 563, 242)
    expect(page.locator("#modalTitle")).to_contain_text("MAMA BROWN BEAR")
    page.get_by_role("button", name="BACK TO THE DEN").click()
    click_world(page, 217, 273)
    page.wait_for_function("LittleTradingPost.getState().tutorial.step === 2")
    click_cub(page, "pebble")
    page.wait_for_function("LittleTradingPost.getState().tutorial.step === 3")
    page.get_by_role("button", name="SAY GOODBYE").click()


def story(page):
    finish_pebble_objective(page)
    offer_mouse(page)
    page.wait_for_function("""() => {
      const fern = LittleTradingPost.getState().npcs.find(n => n.id === 'fern');
      return fern.meetPlan?.give === 'fernMouse';
    }""", timeout=35000)
    pending = state(page)
    assert cub(pending, "fern")["inv"]["fernMouse"] == 1
    payment = cub(pending, "fern")["meetPlan"]["take"]
    page.screenshot(path=OUT / "03-pebble-approaches.png")
    page.wait_for_function("LittleTradingPost.getState().treasureHistory.fernMouse.stage === 'traded'")
    traded = state(page)
    data = traded["treasureHistory"]["fernMouse"]
    assert (data["formerOwner"], data["currentOwner"], data["day"]) == ("fern", "pebble", traded["day"])
    assert not cub(traded, "fern")["inv"].get("fernMouse")
    assert cub(traded, "pebble")["inv"]["fernMouse"] == 1
    assert cub(traded, "pebble")["reservedInv"]["fernMouse"] == 1
    for actor, delta in (("fern", 1), ("pebble", -1)):
        assert cub(traded, actor)["inv"].get(payment, 0) == cub(pending, actor)["inv"].get(payment, 0) + delta
    assert any("Ribbon mouse trade" in entry["s"] for entry in traded["log"])
    page.screenshot(path=OUT / "04-pebble-has-the-mouse.png")
    page.locator("#v5Journal").click()
    expect(page.locator("#tab-history")).to_contain_text("Ribbon mouse trade: Fern passed her den keepsake to Pebble")
    assert page.evaluate("LittleTradingPost.importSave(JSON.parse(LittleTradingPost.exportSave()))")
    assert state(page)["treasureHistory"]["fernMouse"] == data
    assert cub(state(page), "pebble")["inv"]["fernMouse"] == 1
    page.locator(".v5PanelClose").click()
    travel(page, "den")
    page.locator("#v5Rest").click()
    page.get_by_role("button", name="CURL UP AND SLEEP").click()
    assert state(page)["day"] > data["day"]
    click_cub(page, "fern")
    page.locator("#fernMouseStory").click()
    expect(page.locator("#modalBody")).to_contain_text("Pebble has my old ribbon mouse")
    page.screenshot(path=OUT / "05-next-morning.png")
    print("PASS: mouse story through the next morning via normal controls", flush=True)

    # Restore the actual pending trade into a separate save state and interrupt it.
    history = deepcopy(pending["treasureHistory"]["fernMouse"])
    cub(pending, "pebble")["location"] = "den"
    assert page.evaluate("(s) => LittleTradingPost.importSave(s)", pending)
    page.evaluate("window.__LTP_TEST__ = true; LittleTradingPost.npcTestAdvance(0.5)")
    interrupted = state(page)
    assert not cub(interrupted, "fern")["meetPlan"]
    assert interrupted["treasureHistory"]["fernMouse"] == history
    for actor in ("fern", "pebble"):
        assert cub(interrupted, actor)["inv"] == cub(pending, actor)["inv"]
        assert cub(interrupted, actor)["reservedInv"] == cub(pending, actor)["reservedInv"]
    print("PASS: interrupted mouse trade preserves both ownership and history", flush=True)


def early_story(page):
    offer_mouse(page)
    before = state(page)
    assert before["tutorial"]["step"] == 0
    assert cub(before, "pebble")["location"] == "den"
    assert not cub(before, "pebble").get("travelPlan")
    page.reload()
    page.locator("#v5Continue").click()
    reloaded = state(page)
    assert reloaded["treasureHistory"]["fernMouse"] == before["treasureHistory"]["fernMouse"]
    assert cub(reloaded, "fern")["reservedInv"]["fernMouse"] == 1
    travel(page, "den")
    finish_pebble_objective(page)
    released = state(page)
    assert released["treasureHistory"]["fernMouse"]["stage"] == "offered"
    assert cub(released, "pebble")["travelPlan"]["to"] == "post"
    page.screenshot(path=OUT / "06-tutorial-resumes.png")
    travel(page, "post")
    page.wait_for_function(
        "LittleTradingPost.getState().treasureHistory.fernMouse.stage === 'traded'",
        timeout=45000,
    )
    page.reload()
    page.locator("#v5Continue").click()
    result = state(page)
    assert result["tutorial"]["step"] == 3
    assert not cub(result, "fern")["inv"].get("fernMouse")
    assert cub(result, "pebble")["inv"]["fernMouse"] == 1
    assert result["treasureHistory"]["fernMouse"]["currentOwner"] == "pebble"
    assert sum(entry["text"].startswith("Ribbon mouse trade:") for entry in result["history"]) == 1
    print("PASS: early mouse story survives reload, tutorial resumes, trade completes exactly once", flush=True)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--chrome", action="store_true")
    args = parser.parse_args()
    handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as p, ExitStack() as cleanup:
        Thread(target=server.serve_forever, daemon=True).start()
        cleanup.callback(server.shutdown)
        url = f"http://127.0.0.1:{server.server_port}/"
        browser = p.chromium.launch(channel="chrome" if args.chrome else None)
        for name, exercise in (("gifts", gift_cases), ("story", story), ("early-story", early_story)):
            context = browser.new_context(viewport={"width":1440, "height":900})
            context.tracing.start(screenshots=True, snapshots=True)
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            try:
                start(page, url)
                exercise(page)
                assert not errors, errors
            finally:
                context.tracing.stop(path=OUT / f"{name}.zip")
                context.close()
        browser.close()


if __name__ == "__main__":
    main()
