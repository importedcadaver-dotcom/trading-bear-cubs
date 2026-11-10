#!/usr/bin/env python3
"""Generate the exact offline playable HTML from maintained JavaScript source.

No npm, backend, internet, minifier or third-party Python dependencies.
Use --check in CI; any source change must be built and committed together.
"""
from pathlib import Path
import re
import sys
from difflib import unified_diff

ROOT=Path(__file__).resolve().parents[1]
TEMPLATE=ROOT/"src/runtime/standalone-template.html"
LIB=ROOT/"src/lib/barter-rules.mjs"
OUT=ROOT/"index.html"
PARTS=[
    "01-trading-core.js",
    "02-family-care.js",
    "03-world-scenes.js",
    "04-movement-and-3d-style.js",
    "05-mouse-hitboxes.js",
    "06-v5-expansion.js",
    "07-actor-travel.js",
    "09-physical-encounters.js",
    "08-mobile-and-saves.js",
]
MARKER="<!--LTP_GAME_BUNDLE-->"


def compile_game():
    template=TEMPLATE.read_text(encoding="utf-8")
    assert template.count(MARKER)==1,"Standalone template must contain exactly one bundle slot"
    source=LIB.read_text(encoding="utf-8")
    stripped=re.sub(r"\bexport\s+(?=function |const )","",source)
    assert not re.search(r"\b(?:import|export)\s+",stripped),"Unsupported import/export in inlined library"
    library=(
        "\n/* Generated from src/lib/barter-rules.mjs; runtime and Vitest share this authoritative code. */\n"
        "const SharedBarterRules=(function(){\n"
        +stripped+
        "\nreturn { normalizedGoods,isNullBarter,transferDelta,canPay,applyDelta };\n})();\n"
    )
    layers="".join((ROOT/"src/runtime/layers"/name).read_text(encoding="utf-8") for name in PARTS)
    assert layers.count("(() => {")==1, "Exactly one original game closure is expected"
    assert layers.rstrip().endswith("})();"),"Game closure is incomplete"
    return template.replace(MARKER,"<script>"+library+layers+"</script>")


def main():
    expected=compile_game()
    if "--check" in sys.argv:
        actual=OUT.read_text(encoding="utf-8")
        if actual!=expected:
            print("ERROR: index.html is stale. Run python scripts/build_standalone.py",file=sys.stderr)
            for line in list(unified_diff(actual.splitlines(),expected.splitlines(),fromfile="index.html",
                                          tofile="generated",lineterm=""))[:45]:
                print(line[:300],file=sys.stderr)
            raise SystemExit(1)
        print(f"PASS: index.html matches {len(PARTS)} source layers and tested barter module ({len(actual)} characters)")
    else:
        OUT.write_text(expected,encoding="utf-8")
        print(f"Wrote {OUT} from {len(PARTS)} layers and src/lib/barter-rules.mjs")

if __name__=="__main__":
    main()
