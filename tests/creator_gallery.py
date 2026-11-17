"""Capture each visual creator option as a preview, a live cub, and a portrait."""
from ribbon_mouse import *


if __name__ == "__main__":
    gallery=OUT/"creator-gallery"
    gallery.mkdir(exist_ok=True)
    handler=partial(SimpleHTTPRequestHandler,directory=str(ROOT))
    with ThreadingHTTPServer(("127.0.0.1",0),handler) as server,sync_playwright() as p:
        Thread(target=server.serve_forever,daemon=True).start()
        try:
            browser=p.chromium.launch(channel="chrome")
            page=browser.new_page(viewport={"width":1440,"height":900})
            page.goto(f"http://127.0.0.1:{server.server_port}/")
            for field in ("Coat","Markings","Accessory","Eyes","EyeShape"):
                page.locator("#v5New").click()
                options=page.locator("#v5"+field).locator("option").evaluate_all(
                    "options => options.map(o => [o.value,o.textContent])"
                )
                for index,(value,label) in enumerate(options):
                    if index:
                        page.locator("#v5New").click()
                    page.locator("#v5CubName").fill("Gallery Cub")
                    page.locator("#v5"+field).select_option(value)
                    stem=gallery/f"{field}-{index+1}"
                    page.locator("#v5Preview").screenshot(path=str(stem)+"-preview.png")
                    page.locator("#v5Start").click()
                    appearance=state(page)["avatar"]
                    page.reload()
                    page.locator("#v5Continue").click()
                    assert state(page)["avatar"]==appearance
                    world=page.locator("#world").bounding_box()
                    x,y=state(page)["playerPos"]
                    scale=min(world["width"]/768,world["height"]/434)
                    page.screenshot(path=str(stem)+"-world.png",clip={
                        "x":world["x"]+(world["width"]-768*scale)/2+(x-32)*scale,
                        "y":world["y"]+(world["height"]-434*scale)/2+(y-33)*scale,
                        "width":64*scale,"height":72*scale,
                    })
                    page.locator("#logoBear").screenshot(path=str(stem)+"-portrait.png")
                    page.locator("#v5Pause").click()
                    print("Captured "+field+" "+label,flush=True)
            browser.close()
        finally:
            server.shutdown()
