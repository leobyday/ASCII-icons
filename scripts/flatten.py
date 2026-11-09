#!/usr/bin/env python3
"""Turn a flat 2D icon (PNG, JPG or WebP) into flat ASCII in the house style.

This is the "2D" step between an existing icon and its 3D model: it shows
which parts of the artwork carry the shape, before you model them.

Examples:
    python3 scripts/flatten.py icon.png
    python3 scripts/flatten.py icon.png --treatment character > icon.txt

Mapping (dark ink on light paper, monochrome):
    transparent     -> space
    silhouette edge -> @
    colored areas   -> %   (color becomes density; the set has no color)
    dark areas      -> #
    thin rules      -> =
    light areas     -> .
"""

from __future__ import annotations

import argparse
import sys

from PIL import Image

SUPERSAMPLE = 4
ALPHA_CUTOFF = 0.35
TREATMENTS = {"3d": (50, 30), "character": (26, 15)}  # cols, rows; matches src/ascii3d.js


def sample(path: str, cols: int, rows: int) -> list[list[tuple[float, float, float, float]]]:
    """Average RGBA per character cell."""
    img = Image.open(path).convert("RGBA").resize((cols * SUPERSAMPLE, rows * SUPERSAMPLE), Image.LANCZOS)
    px = img.load()
    grid = []
    for j in range(rows):
        row = []
        for i in range(cols):
            total = [0.0, 0.0, 0.0, 0.0]
            for y in range(SUPERSAMPLE):
                for x in range(SUPERSAMPLE):
                    for k, v in enumerate(px[i * SUPERSAMPLE + x, j * SUPERSAMPLE + y]):
                        total[k] += v
            n = SUPERSAMPLE * SUPERSAMPLE
            row.append((total[0] / n, total[1] / n, total[2] / n, total[3] / n / 255))
        grid.append(row)
    return grid


def classify(grid: list[list[tuple[float, float, float, float]]], j: int, i: int) -> str:
    r, g, b, a = grid[j][i]
    if a < ALPHA_CUTOFF:
        return " "
    for dj, di in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        jj, ii = j + dj, i + di
        if not (0 <= jj < len(grid) and 0 <= ii < len(grid[0])) or grid[jj][ii][3] < ALPHA_CUTOFF:
            return "@"
    saturation = max(r, g, b) - min(r, g, b)
    lightness = (r + g + b) / 3
    if saturation > 50:
        return "%"
    if lightness < 120:
        return "#"
    if lightness < 246:
        return "="
    return "."


def flatten(path: str, cols: int, rows: int) -> str:
    grid = sample(path, cols, rows)
    return "\n".join("".join(classify(grid, j, i) for i in range(cols)) for j in range(rows))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("image", help="flat icon image (PNG, JPG or WebP; export SVGs to PNG first)")
    parser.add_argument("--treatment", choices=sorted(TREATMENTS), default="3d", help="grid: 3d (50 x 30, default) or character (26 x 15)")
    parser.add_argument("--cols", type=int, help="characters per line (overrides the treatment)")
    parser.add_argument("--rows", type=int, help="lines (overrides the treatment; cols x 0.6 = rows keeps a square icon square)")
    args = parser.parse_args()
    cols, rows = TREATMENTS[args.treatment]
    print(flatten(args.image, args.cols or cols, args.rows or rows))
    return 0


if __name__ == "__main__":
    sys.exit(main())
