#!/usr/bin/env python3
"""Build the Acácia logo SVGs (direction A · Restinga).

Every file in ../ is generated from the geometry below, so the symbol, the
wordmark and the favicon always stay in sync. The wordmark is converted to
outlines from Young Serif (SIL OFL 1.1); the font is NOT shipped in the
output, only the outlines.

Usage:
    python3 -I build_logo.py --font /path/to/YoungSerif-Regular.ttf

Font source: https://github.com/google/fonts/tree/main/ofl/youngserif
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

# Palette: direction A · Restinga (exact hex, see docs/brand/directions.md)
CONCHA = "#EEF1EA"
RESTINGA = "#1F3B2D"
FOLHA = "#4A6450"
MAR_RASO = "#D3E5DD"
ACACIA = "#E8B42C"

WORD = "Acácia"

# --------------------------------------------------------------------------
# Small geometry helpers
# --------------------------------------------------------------------------

Point = tuple[float, float]


def cubic(p0: Point, p1: Point, p2: Point, p3: Point, t: float) -> Point:
    u = 1 - t
    return (
        u**3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t**3 * p3[0],
        u**3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t**3 * p3[1],
    )


def cubic_tangent(p0: Point, p1: Point, p2: Point, p3: Point, t: float) -> Point:
    u = 1 - t
    dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0])
    dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1])
    n = math.hypot(dx, dy) or 1
    return dx / n, dy / n


def rotate(v: Point, deg: float) -> Point:
    a = math.radians(deg)
    return v[0] * math.cos(a) - v[1] * math.sin(a), v[0] * math.sin(a) + v[1] * math.cos(a)


def f(v: float) -> str:
    """Compact number formatting for path data."""
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def pt(p: Point) -> str:
    return f"{f(p[0])} {f(p[1])}"


def curve_d(c: tuple[Point, Point, Point, Point]) -> str:
    return f"M{pt(c[0])} C{pt(c[1])} {pt(c[2])} {pt(c[3])}"


def lens_d(base: Point, tip: Point, width: float, bias: float = 0.0) -> str:
    """Closed leaf/lens shape from base to tip. `bias` makes one side fuller."""
    dx, dy = tip[0] - base[0], tip[1] - base[1]
    length = math.hypot(dx, dy)
    ux, uy = dx / length, dy / length
    nx, ny = -uy, ux
    w1 = width * (0.5 + bias) * 1.33
    w2 = width * (0.5 - bias) * 1.33
    a1 = (base[0] + dx * 0.25 + nx * w1, base[1] + dy * 0.25 + ny * w1)
    a2 = (base[0] + dx * 0.70 + nx * w1, base[1] + dy * 0.70 + ny * w1)
    b2 = (base[0] + dx * 0.70 - nx * w2, base[1] + dy * 0.70 - ny * w2)
    b1 = (base[0] + dx * 0.25 - nx * w2, base[1] + dy * 0.25 - ny * w2)
    return f"M{pt(base)} C{pt(a1)} {pt(a2)} {pt(tip)} C{pt(b2)} {pt(b1)} {pt(base)}Z"


# --------------------------------------------------------------------------
# Symbol: acacia sprig with three pompom flowers (100 × 100 grid)
# --------------------------------------------------------------------------

STEM = ((30.0, 83.0), (38.0, 71.0), (47.0, 57.0), (63.0, 40.0))
FLOWER_BIG = ((67.5, 31.5), 13.0)
FLOWER_MID = ((39.5, 28.5), 8.8)
FLOWER_SMALL = ((74.0, 63.0), 7.4)


def stem_at(t: float) -> Point:
    return cubic(*STEM, t)


def pedicels() -> list[tuple[Point, Point, Point, Point]]:
    m0 = stem_at(0.56)
    s0 = stem_at(0.74)
    mid = (m0, (m0[0] - 0.5, m0[1] - 8), (FLOWER_MID[0][0] + 4, FLOWER_MID[0][1] + 10), FLOWER_MID[0])
    small = (s0, (s0[0] + 7, s0[1] + 0.5), (FLOWER_SMALL[0][0] - 4, FLOWER_SMALL[0][1] - 9), FLOWER_SMALL[0])
    return [mid, small]


def rachis() -> tuple[Point, Point, Point, Point]:
    r0 = stem_at(0.30)
    return (r0, (r0[0] - 9, r0[1] - 4), (21.0, 57.0), (13.5, 45.0))


def leaf_ticks(width: float) -> list[str]:
    """Leaflets as short strokes: they echo the ticks of the 50 m ruler."""
    r = rachis()
    out = []
    for i, t in enumerate((0.24, 0.42, 0.60, 0.78, 0.94)):
        p = cubic(*r, t)
        tan = cubic_tangent(*r, t)
        length = 8.4 - i * 0.85
        for side in (-1, 1):
            d = rotate(tan, side * 52)
            q = (p[0] + d[0] * length, p[1] + d[1] * length)
            out.append(f"M{pt(p)} L{pt(q)}")
    return out


def leaf_feather() -> str:
    """Leaf as one solid pinnate silhouette; notches between leaflets."""
    r = rachis()
    stations = [0.14, 0.34, 0.54, 0.74, 0.92]
    span = 0.10

    def side_points(side: int) -> list[str]:
        cmds = []
        for i, t in enumerate(stations):
            a_t, b_t = max(t - span, 0.0), min(t + span, 1.0)
            a = offset(r, a_t, side, 1.2)
            b = offset(r, b_t, side, 1.2)
            tan = cubic_tangent(*r, t)
            p = cubic(*r, t)
            length = 8.2 - i * 0.95
            d = rotate(tan, side * 60)
            tip = (p[0] + d[0] * length, p[1] + d[1] * length)
            ctrl = (2 * tip[0] - (a[0] + b[0]) / 2, 2 * tip[1] - (a[1] + b[1]) / 2)
            cmds.append((a, ctrl, b))
        return cmds

    left = side_points(-1)
    right = side_points(1)
    out = [f"M{pt(cubic(*r, 0.0))}"]
    for a, c, b in left:
        out.append(f"L{pt(a)} Q{pt(c)} {pt(b)}")
    out.append(f"L{pt(cubic(*r, 1.0))}")
    for a, c, b in reversed(right):
        out.append(f"L{pt(b)} Q{pt(c)} {pt(a)}")
    out.append("Z")
    return " ".join(out)


def offset(curve, t: float, side: int, dist: float) -> Point:
    p = cubic(*curve, t)
    tan = cubic_tangent(*curve, t)
    n = rotate(tan, side * 90)
    return p[0] + n[0] * dist, p[1] + n[1] * dist


def symbol_group(stem_color: str, flower_color: str, variant: str = "ramo") -> str:
    """Return the symbol drawing (no background) on the 100 × 100 grid."""
    lines = []
    lines.append(f'<g fill="none" stroke="{stem_color}" stroke-linecap="round" stroke-linejoin="round">')
    lines.append(f'  <path d="{curve_d(STEM)}" stroke-width="5.2"/>')
    for p in pedicels():
        lines.append(f'  <path d="{curve_d(p)}" stroke-width="3.6"/>')
    lines.append(f'  <path d="{curve_d(rachis())}" stroke-width="3.4"/>')
    if variant == "ramo":
        lines.append(f'  <path d="{" ".join(leaf_ticks(3.0))}" stroke-width="3"/>')
    lines.append("</g>")
    if variant == "pena":
        lines.append(f'<path d="{leaf_feather()}" fill="{stem_color}"/>')
    lines.append(f'<g fill="{flower_color}">')
    for (c, r) in (FLOWER_BIG, FLOWER_MID, FLOWER_SMALL):
        lines.append(f'  <circle cx="{f(c[0])}" cy="{f(c[1])}" r="{f(r)}"/>')
    lines.append("</g>")
    return "\n".join(lines)


def favicon_group(stem_color: str, flower_color: str) -> str:
    """Reduced symbol for 16–32 px: thick stem, three pompoms, one leaf."""
    stem = ((27.0, 84.0), (36.0, 70.0), (46.0, 56.0), (62.0, 41.0))
    leaf = lens_d(cubic(*stem, 0.30), (13.0, 50.0), 9.5, bias=0.0)
    return "\n".join(
        [
            f'<path d="{curve_d(stem)}" fill="none" stroke="{stem_color}" stroke-width="9" stroke-linecap="round"/>',
            f'<path d="{leaf}" fill="{stem_color}"/>',
            f'<g fill="{flower_color}">',
            '  <circle cx="66" cy="32" r="18"/>',
            '  <circle cx="33" cy="25" r="12"/>',
            '  <circle cx="76" cy="66" r="10.5"/>',
            "</g>",
        ]
    )


# --------------------------------------------------------------------------
# Wordmark: "Acácia" in Young Serif, converted to outlines
# --------------------------------------------------------------------------


def kerning_table(font: TTFont):
    gpos = font["GPOS"].table
    pair_lookups = []
    for fr in gpos.FeatureList.FeatureRecord:
        if fr.FeatureTag == "kern":
            for idx in fr.Feature.LookupListIndex:
                pair_lookups.append(gpos.LookupList.Lookup[idx])

    def class_of(class_def, glyph):
        return class_def.classDefs.get(glyph, 0) if class_def else 0

    def kern(left: str, right: str) -> int:
        for lookup in pair_lookups:
            for st in lookup.SubTable:
                if st.Format == 1:
                    cov = st.Coverage.glyphs
                    if left not in cov:
                        continue
                    pset = st.PairSet[cov.index(left)]
                    for rec in pset.PairValueRecord:
                        if rec.SecondGlyph == right:
                            v = rec.Value1
                            return getattr(v, "XAdvance", 0) or 0
                elif st.Format == 2:
                    if left not in st.Coverage.glyphs:
                        continue
                    c1 = class_of(st.ClassDef1, left)
                    c2 = class_of(st.ClassDef2, right)
                    rec = st.Class1Record[c1].Class2Record[c2]
                    v = rec.Value1
                    x = getattr(v, "XAdvance", 0) or 0
                    if x:
                        return x
        return 0

    return kern


def leaf_accent_units(font: TTFont) -> str:
    """A leaflet replacing the acute accent, in font units (y-up)."""
    # acutecomb bounds inside aacute: x 215–429, y 557–772 (font units)
    base = (226.0, 566.0)
    tip = (448.0, 812.0)
    return lens_d(base, tip, 92.0, bias=-0.06)


def wordmark(font: TTFont, accent: str, cap_px: float):
    """Return (path_d, width_px, top_px, bottom_px). Baseline at y = 0."""
    gs = font.getGlyphSet()
    cmap = font.getBestCmap()
    kern = kerning_table(font)
    scale = cap_px / font["OS/2"].sCapHeight
    names = [cmap[ord(ch)] for ch in WORD]
    pen = SVGPathPen(gs, ntos=f)
    bounds = BoundsPen(gs)
    x = 0.0
    for i, name in enumerate(names):
        glyph_name = name
        if accent == "leaf" and name == "aacute":
            glyph_name = "a"
        tp = TransformPen(pen, (scale, 0, 0, -scale, x * scale, 0))
        gs[glyph_name].draw(tp)
        bp = TransformPen(bounds, (scale, 0, 0, -scale, x * scale, 0))
        gs[glyph_name].draw(bp)
        if accent == "leaf" and name == "aacute":
            leaf_svg = leaf_accent_units(font)
            leaf_offset = x
        adv = gs[name].width
        if i + 1 < len(names):
            adv += kern(name, names[i + 1])
        x += adv
    d = pen.getCommands()
    if accent == "leaf":
        d += " " + transform_path(leaf_svg, scale, leaf_offset)
    xmin, ymin, xmax, ymax = bounds.bounds
    top = ymin
    if accent == "leaf":
        top = min(top, -812 * scale)
    return d, xmax, top, ymax, xmin


def transform_path(d: str, scale: float, x_offset_units: float) -> str:
    """Transform an absolute M/C/Z path from font units (y-up) to px (y-down)."""
    out = []
    tokens = d.replace("M", " M ").replace("C", " C ").replace("Z", " Z ").split()
    nums: list[float] = []
    cmd = None

    def flush():
        pts = []
        for i in range(0, len(nums), 2):
            X = (nums[i] + x_offset_units) * scale
            Y = -nums[i + 1] * scale
            pts.append(f"{f(X)} {f(Y)}")
        return " ".join(pts)

    for tok in tokens:
        if tok in ("M", "C", "Z"):
            if cmd and nums:
                out.append(cmd + flush())
            nums = []
            cmd = tok
            if tok == "Z":
                out.append("Z")
                cmd = None
        else:
            nums.append(float(tok))
    if cmd and nums:
        out.append(cmd + flush())
    return "".join(out)


# --------------------------------------------------------------------------
# File writers
# --------------------------------------------------------------------------

SYMBOL_BOX = (7.5, 15.5, 87.5, 88.5)  # tight visual bounds of the symbol (100 grid)


def svg_doc(viewbox: str, title: str, body: str, w: float | None = None, h: float | None = None) -> str:
    size = f' width="{f(w)}" height="{f(h)}"' if w and h else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}"{size} role="img" aria-label="{title}">\n'
        f"<title>{title}</title>\n{body}\n</svg>\n"
    )


def horizontal(font: TTFont, dark: bool, accent: str, variant: str) -> str:
    fg = CONCHA if dark else RESTINGA
    cap = 36.0
    d, wm_w, wm_top, wm_bottom, wm_left = wordmark(font, accent, cap)
    sym_scale = 0.86  # symbol box 100 → 86 px
    sx0, sy0, sx1, sy1 = (v * sym_scale for v in SYMBOL_BOX)
    sym_h = sy1 - sy0
    # Vertical: center the symbol on the cap height band (baseline y=0, cap at -cap)
    sym_center_y = -cap / 2 - 2
    sym_ty = sym_center_y - (sy0 + sym_h / 2)
    gap = 14.0
    sym_tx = -sx0
    wm_tx = (sx1 - sx0) + gap - wm_left
    top = min(sym_ty + sy0, wm_top)
    bottom = max(sym_ty + sy1, wm_bottom)
    pad = 8.0
    vb_x, vb_y = -pad, top - pad
    vb_w = wm_tx + wm_w + pad * 2
    vb_h = (bottom - top) + pad * 2
    body = (
        f'<g transform="translate({f(sym_tx)} {f(sym_ty)}) scale({sym_scale})">\n'
        f"{symbol_group(fg, ACACIA, variant)}\n</g>\n"
        f'<path transform="translate({f(wm_tx)} 0)" fill="{fg}" d="{d}"/>'
    )
    vb = f"{f(vb_x)} {f(vb_y)} {f(vb_w)} {f(vb_h)}"
    return svg_doc(vb, "Acácia", body, vb_w * 2, vb_h * 2)


def square(dark: bool, variant: str) -> str:
    bg = RESTINGA if dark else CONCHA
    fg = CONCHA if dark else RESTINGA
    # Full-bleed square; the drawing sits inside the inscribed circle so the
    # WhatsApp/Instagram circular crop never cuts it.
    cx = (SYMBOL_BOX[0] + SYMBOL_BOX[2]) / 2
    cy = (SYMBOL_BOX[1] + SYMBOL_BOX[3]) / 2
    s = 0.90
    tx = 50 - cx * s
    ty = 50 - cy * s
    body = (
        f'<rect width="100" height="100" fill="{bg}"/>\n'
        f'<g transform="translate({f(tx)} {f(ty)}) scale({s})">\n{symbol_group(fg, ACACIA, variant)}\n</g>'
    )
    return svg_doc("0 0 100 100", "Acácia", body, 512, 512)


def favicon(full_bleed: bool = False) -> str:
    shape = (
        f'<rect width="100" height="100" fill="{RESTINGA}"/>'
        if full_bleed
        else f'<rect width="100" height="100" rx="22" fill="{RESTINGA}"/>'
    )
    body = f"{shape}\n<g transform=\"translate(4 3) scale(0.92)\">\n{favicon_group(CONCHA, ACACIA)}\n</g>"
    return svg_doc("0 0 100 100", "Acácia", body, 32 if not full_bleed else 512, 32 if not full_bleed else 512)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--out", default=str(Path(__file__).resolve().parent.parent))
    args = ap.parse_args()
    font = TTFont(args.font)
    out = Path(args.out)
    var = out / "variants"
    var.mkdir(parents=True, exist_ok=True)

    main_accent, main_variant = "leaf", "ramo"
    files = {
        out / "logo-horizontal-light.svg": horizontal(font, False, main_accent, main_variant),
        out / "logo-horizontal-dark.svg": horizontal(font, True, main_accent, main_variant),
        out / "logo-square-light.svg": square(False, main_variant),
        out / "logo-square-dark.svg": square(True, main_variant),
        out / "favicon.svg": favicon(),
        # Alternatives for the approval round
        var / "logo-horizontal-light-acute.svg": horizontal(font, False, "acute", main_variant),
        var / "logo-horizontal-dark-acute.svg": horizontal(font, True, "acute", main_variant),
        var / "logo-horizontal-light-pena.svg": horizontal(font, False, main_accent, "pena"),
        var / "logo-square-light-pena.svg": square(False, "pena"),
        var / "logo-square-dark-pena.svg": square(True, "pena"),
        # Source for the 180/512 PNGs (iOS and the manifest mask the corners themselves)
        out / "source" / "icon-full-bleed.svg": square(True, main_variant),
    }
    for path, content in files.items():
        path.write_text(content, encoding="utf-8")
        print("wrote", path.relative_to(out))


if __name__ == "__main__":
    main()
