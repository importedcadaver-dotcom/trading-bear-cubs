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
MODULES=[
    ("barter-rules", "SharedBarterRules", ("normalizedGoods","isNullBarter","transferDelta","canPay","applyDelta")),
    ("inventory-rules", "SharedInventoryRules", ("count","quantity","add","canPay","spend","exchange")),
    ("collision-rules", "SharedCollisionRules", ("isBlocked",)),
    ("save-migrations", "SharedSaveMigrations", ("prepareImportedSave",)),
]
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
    "10-playable-day.js",
]
MARKER="<!--LTP_GAME_BUNDLE-->"
AUTHORITATIVE_ENTRIES=(
    "drawScene","render","negotiate","itemAction","fresh","load",
    "npcWorldAction","npcTrade","bumpSocial","tick","newDay","notify",
    "capacity","travel","openBackpack","openModal","closeModal","v53NpcFrame",
)
RETIRED_MOUNTS=("v4TopTools","v4Subbar","travelNav","bagGrid","inventoryActions","v4AvatarPreview")


def verify_runtime_entries(template, layers):
    for name in AUTHORITATIVE_ENTRIES:
        declarations=re.findall(rf"\bfunction\s+{name}\s*\(",layers)
        if len(declarations)!=1 or re.search(rf"\b{name}\s*=(?!=|>)",layers):
            raise ValueError(f"Expected one authoritative runtime entry for {name}")
    for name in RETIRED_MOUNTS:
        if re.search(rf"\bid\s*=\s*['\x22]{name}['\x22]",template+layers):
            raise ValueError(f"Superseded production mount returned: {name}")


def inline_module(filename, namespace, exports):
    path=ROOT/"src/lib"/f"{filename}.mjs"
    source=path.read_text(encoding="utf-8")
    stripped=re.sub(r"\bexport\s+(?=function |const )","",source)
    if re.search(r"\b(?:import|export)\s+",stripped):
        raise ValueError(f"Unsupported module syntax in {path}")
    return (f"\n/* Inlined from src/lib/{filename}.mjs. */\n"
            f"const {namespace}=(function(){{\n{stripped}\n"
            f"return {{{','.join(exports)}}};\n}})();\n")


def compile_game():
    template=TEMPLATE.read_text(encoding="utf-8")
    assert template.count(MARKER)==1,"Standalone template must contain exactly one bundle slot"
    libraries="".join(inline_module(*module) for module in MODULES)
    layers="".join((ROOT/"src/runtime/layers"/name).read_text(encoding="utf-8") for name in PARTS)
    verify_runtime_entries(template,layers)
    assert layers.count("(() => {")==1, "Exactly one original game closure is expected"
    assert layers.rstrip().endswith("})();"),"Game closure is incomplete"
    return template.replace(MARKER,"<script>"+libraries+layers+"</script>")


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
        print(f"PASS: index.html matches {len(PARTS)} source layers and {len(MODULES)} shared modules ({len(actual)} characters)")
    else:
        OUT.write_text(expected,encoding="utf-8")
        print(f"Wrote {OUT} from {len(PARTS)} layers and {len(MODULES)} shared modules")

if __name__=="__main__":
    main()
