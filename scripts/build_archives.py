#!/usr/bin/env python3
"""Reproducible GitHub download ZIPs for The Little Trading Post.

These are new portable archives built from preserved source files and docs.
They are not claimed to be byte-for-byte copies of the original ChatGPT ZIPs.
Uses only Python standard library.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "archives"
OUT.mkdir(exist_ok=True)


def write_zip(name, entries):
    target = OUT / name
    with ZipFile(target, "w", ZIP_DEFLATED, compresslevel=9) as z:
        for source, member in entries:
            if source.is_file():
                z.write(source, str(member).replace("\\", "/"))
    digest = hashlib.sha256(target.read_bytes()).hexdigest()
    print(f"{name}: {target.stat().st_size} bytes SHA256={digest}")
    return {"file": name, "bytes": target.stat().st_size, "sha256": digest}


manifest = []
for version in range(1, 6):
    version_id = f"v{version}"
    game = ROOT / f"versions/{version_id}/index.html"
    if not game.exists():
        print(f"Missing {game}; skipping")
        continue
    entries = [(game, Path("index.html"))]
    docs = ROOT / "docs" / version_id
    if docs.is_dir():
        entries += [(p, Path("docs") / p.relative_to(docs)) for p in sorted(docs.rglob("*")) if p.is_file()]
    canon = ROOT / "docs" / "canon" / "Bear_Drugs_Encyclopedia_Edition_1.0_FROZEN.md"
    if version >= 4 and canon.is_file():
        entries.append((canon, Path("docs") / "canon" / canon.name))
    manifest.append(write_zip(f"Little_Trading_Post_{version_id}.zip", entries))

# The root game is v5.1+, distinct from the archived original v5 source.
vfile = ROOT / "VERSION"
if vfile.is_file():
    current = vfile.read_text(encoding="utf-8").strip()
    if current and (ROOT / "index.html").is_file():
        manifest.append(write_zip(f"Little_Trading_Post_v{current}.zip",
            [(ROOT / "index.html", Path("index.html")),
             (ROOT / "README.md", Path("README.md"))]))

selected = []
excluded_dirs = {".git", "archives", "__pycache__", ".venv", "node_modules"}
for p in ROOT.rglob("*"):
    if not p.is_file() or any(part in excluded_dirs for part in p.relative_to(ROOT).parts):
        continue
    if p.stat().st_size > 5_000_000:
        continue
    selected.append((p, p.relative_to(ROOT)))
manifest.append(write_zip("Little_Trading_Post_COMPLETE_SOURCE.zip", sorted(selected)))

(OUT / "MANIFEST.json").write_text(json.dumps({
    "note": "Reconstructed, playable source archives; not byte-identical historical ZIPs",
    "archives": manifest,
}, indent=2) + "\n", encoding="utf-8")
