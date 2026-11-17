"""Chrome replay of the creator, staged barter, Human Trail and Silverfin."""
from ribbon_mouse import *


def select_creator_options(page):
    page.locator("#v5New").click()
    preview = page.locator("#v5Preview")
    for name in ("Coat", "Markings", "Accessory", "Eyes", "EyeShape", "Gender", "Temperament"):
        select = page.locator("#v5" + name)
        visuals = set()
        for value in select.locator("option").evaluate_all("options => options.map(option => option.value)"):
            select.select_option(value)
            visuals.add(preview.evaluate("canvas => canvas.toDataURL()"))
        if name not in ("Gender", "Temperament"):
            assert len(visuals) == select.locator("option").count(), name
    page.locator("#v5Start").click()
    expect(page.locator("#v5CreateErr")).to_contain_text("2–22 letters")
    page.locator("#v5CubName").fill("Fern")
    page.locator("#v5Start").click()
    expect(page.locator("#v5CreateErr")).to_contain_text("already belongs")
    page.locator("#v5Back").click()
    page.locator("#v5New").click()
    page.locator("#v5CubName").fill("Rowan")
    page.locator("#v5Temperament").select_option("Evil")
    page.locator("#v5Start").click()
    assert all(n["rel"] == -6 for n in state(page)["npcs"])
    page.locator("#v5Pause").click()
    page.locator("#v5New").click()
    page.locator("#v5CubName").fill("Alder")
    page.locator("#v5Temperament").select_option("Curious")
    page.locator("#v5Markings").select_option("Pale chest")
    page.locator("#v5Eyes").select_option("Amber")
    page.locator("#v5EyeShape").select_option("Round")
    page.screenshot(path=OUT / "creator.png")
    page.locator("#v5Start").click()
    avatar = state(page)["avatar"]
    assert (avatar["eyes"], avatar["eyeShape"], avatar["markings"]) == ("amber","round","pale chest")
    page.reload()
    page.locator("#v5Continue").click()
    assert state(page)["avatar"] == avatar


def day_replay(page):
    finish_pebble_objective(page)
    click_cub(page, "fern")
    talking = state(page)
    page.wait_for_timeout(500)
    assert [n["worldPos"] for n in state(page)["npcs"]] == [n["worldPos"] for n in talking["npcs"]]
    page.get_by_role("button",name="Ask about the Human Trail").click()
    expect(page.locator("#modalBody")).to_contain_text("shiny mouthpiece")
    assert state(page)["trailClue"]
    page.get_by_role("button",name="SAY GOODBYE").click()
    click_cub(page, "fern")
    page.locator("#v5BarterOption").click()
    panel = page.locator("#woodlandTradeStatus")
    berry = page.locator('#yourTrade button[title^="Berry:"]')
    stick = page.locator('#yourTrade button[title^="Nice stick:"]')
    their_berry = page.locator('#theirTrade button[title^="Berry:"]')
    stick.click()
    their_berry.click()
    page.locator("#tradeBtn").click()
    expect(panel).to_contain_text("accepts")
    berry.click()
    expect(panel).to_contain_text("pending")
    page.locator("#tradeBtn").click()
    expect(panel).to_contain_text("accepts")
    before = state(page)
    page.wait_for_timeout(800)
    assert state(page)["tick"] == before["tick"]
    assert [n["worldPos"] for n in state(page)["npcs"]] == [n["worldPos"] for n in before["npcs"]]
    page.screenshot(path=OUT / "trade.png")
    page.locator("#tradeBtn").click()
    assert state(page)["trades"] == before["trades"] + 1
    assert state(page)["inv"].get("stick",0) == before["inv"].get("stick",0)-1
    after = state(page)
    page.locator("#tradeBtn").dispatch_event("click")
    assert state(page)["inv"] == after["inv"]
    assert state(page)["trades"] == after["trades"]
    page.keyboard.press("Escape")
    travel(page, "trail")
    click_world(page,640,380)
    page.get_by_role("button",name="Let them see you").click()
    page.wait_for_function("LittleTradingPost.getState().dayAdventure?.subject === 'the parked car'")
    page.screenshot(path=OUT / "human-trail.png")
    found=state(page)["totalFound"]
    click_world(page,290,350)
    page.wait_for_function("found => LittleTradingPost.getState().totalFound > found",arg=found)
    travel(page, "den")
    click_world(page,563,242)
    page.get_by_role("button",name="Tell Mama what happened today").click()
    expect(page.locator("#modalBody")).to_contain_text("I’m glad you came back")
    page.get_by_role("button",name="BACK TO THE DEN").click()
    page.locator("#v5Rest").click()
    page.get_by_role("button",name="CURL UP AND SLEEP").click()
    assert state(page)["day"] > before["day"]
    print("Day 1: Fern’s clue, trade, parked car, and Mama’s response",flush=True)

    travel(page,"trail")
    click_world(page,290,350)
    page.wait_for_function("LittleTradingPost.getState().dayAdventure?.day === LittleTradingPost.getState().day")
    discovery=state(page)["dayAdventure"]["subject"]
    assert discovery!="the parked car"
    travel(page,"den")
    click_world(page,563,242)
    page.get_by_role("button",name="Tell Mama what happened today").click()
    assert state(page)["dayAdventure"]["told"]=="mama"
    page.get_by_role("button",name="BACK TO THE DEN").click()
    page.locator("#v5Rest").click()
    page.get_by_role("button",name="CURL UP AND SLEEP").click()
    assert state(page)["day"]==before["day"]+2
    print("Day 2: "+discovery+"; told Mama and slept",flush=True)

    page.locator("#v5Rest").click()
    page.get_by_role("button",name="CURL UP AND SLEEP").click()
    page.get_by_role("button",name="Stay close to Pebble").click()
    assert state(page)["dayAdventure"]["subject"]=="the noise that frightened Pebble"
    page.get_by_role("button",name="CURL UP AND SLEEP").click()
    assert state(page)["day"]==before["day"]+3
    print("Day 3: chose to stay with Pebble after hearing a noise at the den",flush=True)


def river_replay(page):
    rescue=state(page)
    rescue.update(location="river",playerPos=[540,401])
    rescue["needs"].update(energy=10,health=80)
    assert page.evaluate("(s) => LittleTradingPost.importSave(s)",rescue)
    page.get_by_role("button",name="Take Fern’s paw").click()
    assert state(page)["location"]=="den" and not state(page)["dead"]
    position=state(page)["playerPos"]
    page.keyboard.down("a")
    page.wait_for_function("x => LittleTradingPost.getState().playerPos[0]<x",arg=position[0]-3)
    page.keyboard.up("a")
    for health in (80,20):
        save=state(page)
        save.update(location="river",playerPos=[390,401])
        save["needs"].update(energy=10,health=health)
        assert page.evaluate("(s) => LittleTradingPost.importSave(s)",save)
        page.wait_for_function("""health => {
          const s=LittleTradingPost.getState();
          return health===20 ? s.dead : s.playerPos[0]<200 && s.needs.health===44;
        }""",arg=health)
    expect(page.locator("#modalTitle")).to_contain_text("A little life ended")
    expect(page.get_by_role("button",name="NEW RUN")).to_be_visible()
    page.screenshot(path=OUT / "river-outcome.png")
    page.get_by_role("button",name="RELOAD THIS MORNING").click()
    assert state(page)["location"]=="den" and not state(page)["dead"]


def rare_discoveries(page):
    baseline=state(page)
    for seed, item in ((1000,"trailSweets"),(4000,"glassPipe")):
        save=deepcopy(baseline)
        save.update(location="trail",playerPos=[307,377],rand=seed,dayAdventure=None)
        assert page.evaluate("(s) => LittleTradingPost.importSave(s)",save)
        click_world(page,290,350)
        page.wait_for_function("item => LittleTradingPost.getState().inv[item]>0",arg=item)
    save=deepcopy(baseline)
    save.update(location="woods",playerPos=[552,309],rand=64000,dayAdventure=None)
    assert page.evaluate("(s) => LittleTradingPost.importSave(s)",save)
    click_world(page,535,282)
    page.wait_for_function("LittleTradingPost.getState().dayAdventure?.subject.includes('fallen log')")
    save=deepcopy(baseline)
    save.update(location="trail",playerPos=[307,377],rand=64000)
    save["orphan"]["status"]="mama"
    save["dayAdventure"]={"day":save["day"],"subject":"the fresh boot prints"}
    assert save["trailClue"]
    assert page.evaluate("(s) => LittleTradingPost.importSave(s)",save)
    click_world(page,290,350)
    page.wait_for_function("LittleTradingPost.getState().inv.vape>0")
    travel(page,"den")
    click_world(page,563,242)
    page.get_by_role("button",name="Tell Mama what happened today").click()
    expect(page.locator("#modalBody")).to_contain_text("vape")
    page.screenshot(path=OUT/"rare-vape-at-home.png")
    page.get_by_role("button",name="BACK TO THE DEN").click()


def human_risk_replay(page):
    for seed, outcome in ((1,"rescue"),(64000,"poacher")):
        save=state(page)
        save.update(location="trail",playerPos=[584,203],rand=seed,humanTracksDay=None)
        save["needs"]["health"]=45
        assert page.evaluate("(s) => LittleTradingPost.importSave(s)",save)
        click_world(page,567,176)
        page.get_by_role("button",name="Look closer").click()
        if outcome=="rescue":
            page.get_by_role("button",name="Call to Mama").click()
            page.reload()
            page.locator("#v5Continue").click()
            page.get_by_role("button",name="Go to Mama").click()
            assert state(page)["location"]=="den"
        else:
            assert state(page)["deathCause"]=="poacher"
            page.get_by_role("button",name="NEW RUN").click()
            expect(page.locator("#v5CubName")).to_be_visible()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--chrome", action="store_true")
    args = parser.parse_args()
    handler = partial(SimpleHTTPRequestHandler, directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1", 0), handler) as server, sync_playwright() as p:
        Thread(target=server.serve_forever, daemon=True).start()
        try:
            browser=p.chromium.launch(channel="chrome" if args.chrome else None)
            context=browser.new_context(viewport={"width":1440,"height":900})
            context.tracing.start(screenshots=True,snapshots=True)
            page=context.new_page()
            errors=[]
            page.on("pageerror",lambda error: errors.append(str(error)))
            page.goto(f"http://127.0.0.1:{server.server_port}/")
            try:
                select_creator_options(page)
                print("PASS: creator controls and save reload",flush=True)
                day_replay(page)
                print("PASS: fresh-save day replay",flush=True)
                river_replay(page)
                print("PASS: seeded Silverfin survival and death",flush=True)
                rare_discoveries(page)
                print("PASS: seeded edibles, bong, body and vape discovery",flush=True)
                human_risk_replay(page)
                print("PASS: seeded Human Trail rescue and poacher death",flush=True)
                assert not errors, errors
            finally:
                context.tracing.stop(path=OUT/"playable-day.zip")
                browser.close()
        finally:
            server.shutdown()
