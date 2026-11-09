#!/usr/bin/env python3
"""Build the icon PNGs and wallpapers from the 3D models.

Examples:
    python3 scripts/build.py                  # everything (PNGs, SVGs, wallpapers)
    python3 scripts/build.py --set macos      # just the Mac icons
    python3 scripts/build.py --only Slack     # one app
    python3 scripts/build.py --gallery        # also write docs/media/preview.png

Needs Node 18+ (to run the renderer) and Pillow (pip3 install pillow).
"""

from __future__ import annotations

import argparse
import json
import math
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "scripts" / "fonts" / "JetBrainsMono-Bold.ttf"
MANIFESTS = {"ios": ROOT / "install" / "ios" / "icons.tsv", "macos": ROOT / "install" / "macos" / "apps.tsv"}

INK = (20, 20, 20)
PAPER = (243, 242, 238)
FACE_TOP = (255, 255, 255)
FACE_BOTTOM = (236, 235, 230)
BEVEL = (220, 219, 213)
WALLPAPER_INK = (168, 167, 159)

ICON_SIZE = 1024
COLS, ROWS = 50, 30
WALLPAPERS = {"macos": (3456, 2234), "ios": (1179, 2556)}


def slug(name: str) -> str:
    """'Visual Studio Code' -> 'visual-studio-code'."""
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def read_manifest(path: Path) -> list[tuple[str, str]]:
    """Return (app name, model) pairs from a tab-separated manifest."""
    pairs = []
    for line in path.read_text().splitlines():
        if not line.strip() or line.startswith("#"):
            continue
        name, model = line.split("\t")
        pairs.append((name, model))
    return pairs


def render_ascii(models: list[str]) -> dict[str, str]:
    """Render models with the JS engine; returns {model: ascii art}."""
    cmd = ["node", str(ROOT / "src" / "cli.js"), "--format", "json", "--cols", str(COLS), "--rows", str(ROWS), *models]
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)


def rounded_layer(box: tuple[int, int, int, int], radius: int, fill: tuple) -> Image.Image:
    layer = Image.new("RGBA", (ICON_SIZE, ICON_SIZE), (0, 0, 0, 0))
    ImageDraw.Draw(layer).rounded_rectangle(box, radius=radius, fill=fill)
    return layer


def rounded_mask(box: tuple[int, int, int, int], radius: int) -> Image.Image:
    mask = Image.new("L", (ICON_SIZE, ICON_SIZE), 0)
    ImageDraw.Draw(mask).rounded_rectangle(box, radius=radius, fill=255)
    return mask


def vertical_gradient(top: tuple, bottom: tuple, y0: int, y1: int) -> Image.Image:
    grad = Image.new("RGBA", (ICON_SIZE, ICON_SIZE))
    draw = ImageDraw.Draw(grad)
    for y in range(ICON_SIZE):
        t = min(max((y - y0) / (y1 - y0), 0), 1)
        color = tuple(int(a + (b - a) * t) for a, b in zip(top, bottom, strict=True))
        draw.line([(0, y), (ICON_SIZE, y)], fill=color + (255,))
    return grad


def draw_icon(art: str, path: Path) -> None:
    """Draw ASCII art on a raised keycap tile and save a 1024px PNG."""
    x0, y0, x1, y1, radius, border = 100, 84, 924, 896, 184, 12
    size = (ICON_SIZE, ICON_SIZE)
    img = Image.new("RGBA", size, (0, 0, 0, 0))

    shadow = rounded_layer((x0 + 20, y0 + 70, x1 - 20, y1 + 40), radius, INK + (90,))
    img = Image.alpha_composite(img, shadow.filter(ImageFilter.GaussianBlur(28)))
    img = Image.alpha_composite(img, rounded_layer((x0, y0 + 30, x1, y1 + 30), radius, INK + (255,)))  # base
    img = Image.alpha_composite(img, rounded_layer((x0, y0, x1, y1), radius, INK + (255,)))  # outline

    face = rounded_mask((x0 + border, y0 + border, x1 - border, y1 - border), radius - border)
    img.paste(vertical_gradient(FACE_TOP, FACE_BOTTOM, y0, y1), (0, 0), face)

    # A darker strip along the bottom edge of the face reads as a bevel.
    bevel_height = 26
    upper = rounded_mask((x0 + border, y0 + border, x1 - border, y1 - border - bevel_height), radius - border)
    band = Image.new("L", size, 0)
    ImageDraw.Draw(band).rectangle((0, y1 - border - bevel_height, ICON_SIZE, ICON_SIZE), fill=255)
    bevel = ImageChops.multiply(ImageChops.subtract(face, upper), band)
    img.paste(Image.new("RGBA", size, BEVEL + (255,)), (0, 0), bevel)

    font_size = 22
    font = ImageFont.truetype(str(FONT), font_size)
    cell_w, line_h = font_size * 0.6, font_size
    lines = art.split("\n")
    left = (x0 + x1) / 2 - COLS * cell_w / 2
    top = (y0 + y1) / 2 - len(lines) * line_h / 2
    draw = ImageDraw.Draw(img)
    for j, line in enumerate(lines):
        for i, ch in enumerate(line):
            if ch != " ":
                draw.text((left + i * cell_w, top + j * line_h), ch, font=font, fill=INK + (255,))
    img.save(path)


def draw_wallpaper(path: Path, width: int, height: int) -> None:
    """A field of light characters, densest along two diagonal swooshes."""
    img = Image.new("RGB", (width, height), PAPER)
    draw = ImageDraw.Draw(img)
    font_size = 18
    font = ImageFont.truetype(str(FONT), font_size)
    cell_w, line_h = font_size * 0.6, font_size * 1.25
    cols, rows = int(width / cell_w) + 1, int(height / line_h) + 1
    ramp = " .:-=+*#"
    for j in range(rows):
        y = j / (rows - 1)
        for i in range(cols):
            x = i / (cols - 1)
            curve = 0.80 - 0.74 * x + 0.12 * math.sin(math.pi * x)
            second = curve + 0.20 + 0.05 * math.sin(2 * math.pi * x)
            edge = math.exp(-(((y - curve) / 0.045) ** 2))
            glow = 0.7 * math.exp(-(((y - second) / 0.09) ** 2))
            fill = 0.14 + 0.22 * (y - curve) if y > curve else 0.03
            noise = abs(math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % 1
            value = max(edge, glow, fill) + (noise - 0.5) * 0.16
            ch = ramp[max(0, min(len(ramp) - 1, int(value * len(ramp))))]
            if ch != " ":
                draw.text((i * cell_w, j * line_h), ch, font=font, fill=WALLPAPER_INK)
    img.save(path)


def draw_gallery(path: Path, icons: list[Path], columns: int = 10, cell: int = 180) -> None:
    rows = math.ceil(len(icons) / columns)
    sheet = Image.new("RGB", (columns * cell + 60, rows * cell + 60), PAPER)
    for k, icon_path in enumerate(icons):
        icon = Image.open(icon_path).resize((cell - 8, cell - 8), Image.LANCZOS)
        sheet.paste(icon, (34 + (k % columns) * cell, 34 + (k // columns) * cell), icon)
    sheet.save(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--set", choices=sorted(MANIFESTS), action="append", help="icon set to build (default: all)")
    parser.add_argument("--only", action="append", metavar="APP", help="build only these apps")
    parser.add_argument("--no-wallpaper", action="store_true", help="skip the wallpapers")
    parser.add_argument("--gallery", action="store_true", help="write docs/media/preview.png")
    args = parser.parse_args()

    sets = args.set or sorted(MANIFESTS)
    jobs = []
    for icon_set in sets:
        for name, model in read_manifest(MANIFESTS[icon_set]):
            if not args.only or name in args.only:
                jobs.append((icon_set, name, model))
    if args.only and not jobs:
        print(f"No app named {', '.join(args.only)} in the manifests.", file=sys.stderr)
        return 1

    art = render_ascii(sorted({model for _, _, model in jobs}))
    written = []
    for icon_set, name, model in jobs:
        out = ROOT / "icons" / icon_set / f"{slug(name)}.png"
        out.parent.mkdir(parents=True, exist_ok=True)
        draw_icon(art[model], out)
        written.append(out)
        print(f"icon       {out.relative_to(ROOT)}")

    if not args.only:
        svg_dir = ROOT / "icons" / "svg"
        cmd = ["node", str(ROOT / "src" / "cli.js"), "--all", "--format", "svg", "--out", str(svg_dir)]
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"svg        {svg_dir.relative_to(ROOT)}/ (every model)")
        subprocess.run(["node", str(ROOT / "scripts" / "catalog.js")], check=True, capture_output=True)
        print("catalog    icons/README.md")

    if not args.only and not args.no_wallpaper:
        for icon_set in sets:
            width, height = WALLPAPERS[icon_set]
            out = ROOT / "icons" / "wallpapers" / f"{icon_set}.png"
            out.parent.mkdir(parents=True, exist_ok=True)
            draw_wallpaper(out, width, height)
            print(f"wallpaper  {out.relative_to(ROOT)}")

    if args.gallery:
        out = ROOT / "docs" / "media" / "preview.png"
        out.parent.mkdir(parents=True, exist_ok=True)
        unique = {}
        for icon_set in sorted(MANIFESTS):
            for name, model in read_manifest(MANIFESTS[icon_set]):
                unique.setdefault(model, ROOT / "icons" / icon_set / f"{slug(name)}.png")
        draw_gallery(out, [p for p in unique.values() if p.exists()])
        print(f"gallery    {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
