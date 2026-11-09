#!/usr/bin/env python3
"""Animate an icon and save it as MP4 or GIF, in the house motion.

Examples:
    python3 scripts/animate.py gear                          # gear.mp4: turning on its axis
    python3 scripts/animate.py gear --motion generate        # resolving out of noise as it turns
    python3 scripts/animate.py note-tile --motion build --source notes.png --out notes.gif
                                                             # the five-step build-up from a flat icon

Motions (all loop without a seam):
    turn      one eased turn on the icon's own vertical axis, 4.4 s (the default)
    generate  noise -> resolve -> hold -> dissolve while it turns once, 4.4 s
    sway      a gentle side-to-side swing, 13.2 s (only where a full turn is too busy)
    build     Today -> ASCII -> 2D -> 3D -> Motion, five 2.64 s steps (needs --source)

Needs Node 18+, Pillow and ffmpeg.
"""

from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageFilter

from build import COLS, INK, ROOT, ROWS, draw_text_art, icon_image
from flatten import flatten

LOOP = 13.2
STAGE = LOOP / 5  # each build-up step
SLOW, FAST = 0.45, 0.12  # crossfade, and the snap into 3D
NOISE_FPS = 12.5
RAMP = ".:-=+*#%@"
BUILD_COLS, BUILD_ROWS = 46, 28  # flatten.py's default grid


def frames_from_cli(model: str, motion: str, fps: float, cols: int, rows: int, seconds: float | None = None) -> list[str]:
    """Rendered art for every frame of one loop of `motion` (from src/motion.js via the CLI)."""
    cmd = ["node", str(ROOT / "src" / "cli.js"), model, "--format", "json", "--motion", motion]
    cmd += ["--fps", str(fps), "--cols", str(cols), "--rows", str(rows)]
    if seconds:
        cmd += ["--seconds", str(seconds)]
    result = subprocess.run(cmd, check=True, capture_output=True, text=True)
    return json.loads(result.stdout)[model]


def still_from_cli(model: str, cols: int, rows: int) -> str:
    cmd = ["node", str(ROOT / "src" / "cli.js"), model, "--format", "json", "--cols", str(cols), "--rows", str(rows)]
    return json.loads(subprocess.run(cmd, check=True, capture_output=True, text=True).stdout)[model]


def hash3(a: float, b: float, c: float) -> float:
    """The same deterministic noise as src/motion.js."""
    x = math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453
    return x - math.floor(x)


def clamp01(v: float) -> float:
    return max(0.0, min(1.0, v))


def window_opacity(t: float, start: float, length: float, fade_in: float, fade_out: float) -> float:
    """Opacity of a layer shown from `start` for `length` seconds, with its own fades (wraps around the loop)."""
    rel = (t - start) % LOOP
    if rel <= length:
        return min(clamp01(0.5 + rel / fade_in), clamp01(0.5 + (length - rel) / fade_out))
    return max(clamp01(0.5 - (rel - length) / fade_out), clamp01(0.5 - (LOOP - rel) / fade_in))


def standalone(art: str, size: int, opacity: float = 1.0) -> Image.Image:
    """Characters alone with the standalone drop shadow (no tile), transparent background."""
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw_text_art(layer, art, (size / 2, size / 2), size * 0.0149)
    return with_shadow(layer, size, opacity)


def with_shadow(layer: Image.Image, size: int, opacity: float) -> Image.Image:
    """Add the standalone shadow: 0 14px 14px rgba(20,20,20,0.22) at a 402 px tile, scaled."""
    k = size / 402
    alpha = layer.getchannel("A")
    shadow = Image.new("RGBA", layer.size, INK + (0,))
    shadow.putalpha(alpha.point(lambda a: round(a * 0.22)))
    shadow = shadow.filter(ImageFilter.GaussianBlur(7 * k))
    out = Image.new("RGBA", layer.size, (0, 0, 0, 0))
    out.alpha_composite(shadow, (0, round(14 * k)))
    out.alpha_composite(layer)
    if opacity < 1:
        out.putalpha(out.getchannel("A").point(lambda a: round(a * opacity)))
    return out


def build_frames(model: str, source: Path, size: int, fps: float) -> list[Image.Image]:
    """The five-step build-up: Today -> ASCII -> 2D -> 3D -> Motion."""
    original = Image.open(source).convert("RGBA")
    side = round(size * 0.418)
    original = original.resize((side, round(side * original.height / original.width)), Image.LANCZOS)
    original_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    original_layer.alpha_composite(original, ((size - original.width) // 2, (size - original.height) // 2))

    flat = flatten(str(source), BUILD_COLS, BUILD_ROWS).split("\n")
    still = still_from_cli(model, BUILD_COLS, BUILD_ROWS)
    spin = frames_from_cli(model, "spin", fps, BUILD_COLS, BUILD_ROWS, seconds=STAGE)

    frames = []
    for k in range(round(LOOP * fps)):
        t = k / fps
        noise_frame = math.floor(t * NOISE_FPS)
        reveal = 0.0 if t < STAGE else clamp01((t - STAGE) / (STAGE * 0.8))
        flat_art = "\n".join(
            "".join(
                ch if ch == " " or hash3(i, j, 11) < reveal else RAMP[math.floor(hash3(j, i, noise_frame) * 9)] for i, ch in enumerate(row)
            )
            for j, row in enumerate(flat)
        )
        in_motion = t - 4 * STAGE
        solid_art = spin[min(len(spin) - 1, math.floor(in_motion * fps))] if in_motion >= 0 else still

        o_original = clamp01(window_opacity(t, 0, STAGE, SLOW, SLOW) + window_opacity(t, STAGE, STAGE, SLOW, SLOW) * (1 - reveal))
        o_flat = window_opacity(t, STAGE, 2 * STAGE, SLOW, FAST)
        o_solid = window_opacity(t, 3 * STAGE, 2 * STAGE, FAST, SLOW)

        frame = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        if o_original > 0:
            frame.alpha_composite(with_shadow(original_layer, size, o_original))
        if o_flat > 0:
            frame.alpha_composite(standalone(flat_art, size, o_flat))
        if o_solid > 0:
            frame.alpha_composite(standalone(solid_art, size, o_solid))
        frames.append(frame)
    return frames


def tile_frames(model: str, motion: str, size: int, fps: float) -> list[Image.Image]:
    """Keycap-tile frames for turn, generate or sway."""
    frames = []
    for art in frames_from_cli(model, motion, fps, COLS, ROWS):
        img = Image.new("RGBA", (1024, 1024), (243, 242, 238, 255))
        img.alpha_composite(icon_image(art))
        frames.append(img.resize((size, size), Image.LANCZOS) if size != 1024 else img)
    return frames


def encode(frames: list[Image.Image], out: Path, fps: float) -> None:
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg is needed to write video and GIFs (brew install ffmpeg)")
    with tempfile.TemporaryDirectory() as tmp:
        for k, frame in enumerate(frames):
            frame.convert("RGB").save(Path(tmp) / f"f{k:04d}.png")
        pattern = str(Path(tmp) / "f%04d.png")
        if out.suffix == ".gif":
            # 12.5 fps, no dithering: characters stay crisp and the file stays small.
            gif_fps = min(fps, NOISE_FPS)
            palette = "split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle"
            graph = f"fps={gif_fps},{palette}"
            cmd = ["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(fps), "-i", pattern, "-vf", graph, str(out)]
        else:
            cmd = ["ffmpeg", "-loglevel", "error", "-y", "-framerate", str(fps), "-i", pattern]
            cmd += ["-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)]
        subprocess.run(cmd, check=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("model", help="a model name (node src/cli.js lists them)")
    parser.add_argument("--motion", choices=["turn", "generate", "sway", "build"], default="turn")
    parser.add_argument("--source", type=Path, help="the original flat icon (PNG), for --motion build")
    parser.add_argument("--size", type=int, default=720, help="width and height in px (default 720)")
    parser.add_argument("--fps", type=float, default=25)
    parser.add_argument("--out", type=Path, help="output .mp4 or .gif (default <model>-<motion>.mp4)")
    args = parser.parse_args()

    if args.motion == "build" and not args.source:
        parser.error("--motion build needs --source, the flat icon it starts from")
    if args.size % 2:
        parser.error("--size must be even (video encoders need even sizes)")
    out = args.out or Path(f"{args.model}-{args.motion}.mp4")
    if out.suffix not in (".mp4", ".gif"):
        parser.error("--out must end in .mp4 or .gif")

    if args.motion == "build":
        frames = build_frames(args.model, args.source, args.size, args.fps)
    else:
        frames = tile_frames(args.model, args.motion, args.size, args.fps)
    encode(frames, out, args.fps)
    print(out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
