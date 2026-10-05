"""
Builds the site's static font files from the Anek Bangla variable font.

Why this exists
---------------
The design uses up to three cuts of one family: text (width 100, weight
400), strong (width 100, weight 600) and display (width 125, weight 800).
Bangla pages ship only display; their reading text uses the system's
Bengali font (see src/lib/fonts-bn.ts for why).

next/font/google cannot ask for a fixed width. Requesting the width axis
returns the whole variable range, and the Bengali file grows from 152 KB to
437 KB. Requesting two weights also returns the full variable file. So the
cuts are made here, once, and served with next/font/local:

    Bengali plus ASCII for the Bangla site (about 60 KB), Latin for the
    English site (about 15 KB per cut), each a static instance.

Anek Bangla is licensed under the SIL Open Font License 1.1 (src/fonts/OFL.txt),
which permits bundling and modification. The family name inside the files is
changed, as the licence's Reserved Font Name clause asks for modified
versions.

Run (needs fontTools and brotli, e.g. in a venv):

    pip install fonttools brotli
    curl -L -o AnekBangla-VF.ttf \
      "https://github.com/google/fonts/raw/main/ofl/anekbangla/AnekBangla%5Bwdth%2Cwght%5D.ttf"
    python scripts/build-fonts.py AnekBangla-VF.ttf
"""

import sys
from pathlib import Path

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

OUT = Path(__file__).resolve().parent.parent / "src" / "fonts"

# Typographic punctuation the copy actually uses.
SHARED = [0x20, 0xA0, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026]
ASCII = list(range(0x21, 0x7F))

BANGLA = (
    list(range(0x0980, 0x0A00))      # Bengali block, including ৳ and the digits
    + [0x0964, 0x0965]               # danda, double danda
    + [0x200C, 0x200D]               # ZWNJ, ZWJ: required for correct conjuncts
    + [0x25CC]                       # dotted circle, used by the shaper
    # The Latin alphabet costs about 8 KB per cut. Bangla pages set car
    # names, "WhatsApp" and the email address, so without it a second font
    # would download on most of them, late, and swap in after first paint.
    + ASCII
    + SHARED
)
LATIN = ASCII + list(range(0xA1, 0x100)) + [0x09F3] + SHARED  # ৳ for English prices

CUTS = {
    "text-400": {"wght": 400, "wdth": 100},
    "strong-600": {"wght": 600, "wdth": 100},
    # 800 is the weight axis's own master. Any value between masters is
    # interpolated and compresses worse: 760 and 780 both measure 69-71 KB
    # for Bengali, 800 measures 61 KB, and the difference is not visible.
    "display-800": {"wght": 800, "wdth": 125},
}
SCRIPTS = {"bn": BANGLA, "en": LATIN}

# Which cuts each site actually ships. Bangla reading text uses the phone's
# own Bengali font (see src/lib/fonts-bn.ts), so only the display cut is
# built for Bangla.
SHIPPED = {"bn": ["display-800"], "en": ["text-400", "strong-600", "display-800"]}

# Every feature Bengali shaping needs, plus kerning and tabular figures.
# Left out: Latin typesetting extras the site never uses (fractions,
# ordinals, superiors, slashed zero, alternates), about 2 KB per cut.
FEATURES = [
    "ccmp", "locl", "nukt", "akhn", "rphf", "blwf", "half", "pstf", "vatu",
    "cjct", "init", "pres", "abvs", "blws", "psts", "haln", "calt", "clig",
    "liga", "rlig", "rvrn", "dist", "abvm", "blwm", "mark", "mkmk", "kern",
    "curs", "tnum",
]


def build(source: Path) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for cut, axes in CUTS.items():
        for script, unicodes in SCRIPTS.items():
            if cut not in SHIPPED[script]:
                continue
            font = TTFont(source)
            instantiateVariableFont(font, axes, inplace=True, updateFontNames=False)

            options = Options()
            options.layout_features = FEATURES
            options.name_IDs = ["*"]
            options.hinting = False           # screens at these sizes don't need it
            options.desubroutinize = True
            options.notdef_outline = True
            options.flavor = "woff2"

            subsetter = Subsetter(options=options)
            subsetter.populate(unicodes=unicodes)
            subsetter.subset(font)

            # Reserved Font Name: a modified version must not reuse "Anek".
            for record in font["name"].names:
                if record.nameID in (1, 4, 6, 16, 21):
                    text = record.toUnicode().replace("Anek Bangla", "RRC Sans").replace("AnekBangla", "RRCSans")
                    record.string = text

            path = OUT / f"rrc-{script}-{cut}.woff2"
            font.flavor = "woff2"
            font.save(path)
            print(f"  {path.name:<30} {path.stat().st_size / 1024:6.1f} KB")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python scripts/build-fonts.py AnekBangla-VF.ttf")
    build(Path(sys.argv[1]))
