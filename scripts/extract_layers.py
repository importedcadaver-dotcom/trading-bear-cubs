#!/usr/bin/env python3
"""Recover inspectable v2–v5 layer sources from the preserved single-file build.

Each extracted layer is a historical source snapshot; it is NOT intended to run
independently, because later layers reference globals from earlier layers.
The self-contained production entry point remains root index.html.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "index.html").read_text(encoding="utf-8")
markers = [
    ("v2", "/* LITTLE TRADING POST v2: additive expansion"),
    ("v3", "/* The Little Trading Post v3: additive world-and-agency expansion."),
    ("v4", "/* LITTLE TRADING POST v4: Living Woodland update."),
    ("v5", "/* THE LITTLE TRADING POST v5 — Living World & Playfeel overhaul."),
]
start_script = html.find("<script>")
end_script = html.rfind("</script>")
if start_script < 0 or end_script < start_script:
    raise SystemExit("Source has no extractable script.")
script = html[start_script + len("<script>"):end_script]
positions = []
for version, marker in markers:
    pos = script.find(marker)
    if pos < 0:
        raise SystemExit(f"Cannot locate layer {version}: {marker}")
    positions.append((version, pos))
if positions != sorted(positions, key=lambda item: item[1]):
    raise SystemExit("Layer markers are out of source order.")
target = ROOT / "src" / "legacy"
target.mkdir(parents=True, exist_ok=True)
for i, (version, pos) in enumerate(positions):
    end = positions[i + 1][1] if i + 1 < len(positions) else len(script)
    layer = script[pos:end].strip() + "\n"
    out = (ROOT / "src" / "v5-extension.js") if version == "v5" else (target / f"{version}-extension.js")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(layer, encoding="utf-8")
    print(f"Extracted {version}: {len(layer)} chars → {out.relative_to(ROOT)}")
