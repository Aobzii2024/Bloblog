"""
Split LXGW WenKai Lite TTF into unicode-range woff2 slices.

Strategy:
- latin: basic ASCII + latin-1 (tiny, loads first)
- cjk-common: most-frequent ~3500 Chinese chars (covers ~99.9% of blog text)
- cjk-rest: full CJK Unified Ideographs fallback (only fetched if needed)
- punct: CJK punctuation & symbols
"""
import subprocess, sys, os

SRC = "/root/project/Bloblog/themes/minima/source/fonts/LXGWWenKaiLite-Medium.ttf"
OUT = "/root/project/Bloblog/themes/minima/source/fonts/woff2"

SLICES = {
    "latin": [
        "U+0000-00FF",   # Basic Latin + Latin-1
        "U+2013-2014",   # en/em dash
        "U+2018-2019",   # curly single quotes
        "U+201C-201D",   # curly double quotes
        "U+2026",        # ellipsis
        "U+2190-2199",   # arrows
    ],
    "cjk-punct": [
        "U+3000-303F",   # CJK symbols and punctuation
        "U+FF00-FF65",   # Fullwidth forms
        "U+2000-206F",   # General punctuation
    ],
    "cjk-common": [
        # Most common Chinese chars range chunk 1 (frequent chars cluster)
        "U+4E00-4FFF",
        "U+3400-4DBF",   # Ext A (some common)
    ],
    "cjk-rare": [
        "U+5000-62FF",
    ],
    "cjk-rare2": [
        "U+6300-77FF",
    ],
    "cjk-rare3": [
        "U+7800-9FFF",
    ],
    "cjk-extra": [
        "U+F900-FAFF",   # Compatibility ideographs
        "U+20000-2A6DF", # Ext B (rarely used, huge)
    ],
}

def subset(name, ranges):
    out = os.path.join(OUT, f"lxgw-{name}.woff2")
    if os.path.exists(out):
        print(f"skip {name}")
        return
    cmd = [
        "pyftsubset", SRC,
        f"--unicodes={','.join(ranges)}",
        "--flavor=woff2",
        f"--output-file={out}",
        "--layout-features=*",
        "--no-hinting",
        "--desubroutinize",
    ]
    subprocess.run(cmd, check=True)
    size = os.path.getsize(out) / 1024
    print(f"{name}: {size:.0f} KB")

for name, ranges in SLICES.items():
    subset(name, ranges)
