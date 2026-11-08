---
name: ascii-3d-icons
description: Make app icons in the ASCII 3D Icons style (3D models rendered in shaded characters on keycap tiles), export them as PNG, SVG or HTML, and install them on macOS or iPhone. Use when someone asks for ASCII icons, new icons in this set, or help theming a Mac or iPhone with it.
---

# ASCII 3D Icons

Every icon is a small 3D model, written as a signed distance function (SDF) and rendered in characters from light to shadow: `.:-=+*#%@`. A final pass outlines silhouettes and raised details with `@`.

Repository: https://github.com/leobyday/ascii-icons. If it isn't already on disk, clone it and work from the clone. Needs Node 18+; PNG builds also need Python 3 with Pillow.

For placing icons in a design tool, use the companion skills: `ascii-icons-figma`, `ascii-icons-paper`, `ascii-icons-pen`.

## Repository map

- `src/ascii3d.js`: renderer and SDF building blocks (Node and browser)
- `src/models.js`: the model library, named after objects (`gear`, `handset`, `speech-bubble`)
- `src/export.js`: wraps rendered art in the keycap tile as SVG or HTML
- `src/cli.js`: everything from the terminal (see below)
- `install/ios/icons.tsv`, `install/macos/apps.tsv`: which app gets which model
- `scripts/build.py`: PNGs, SVGs, wallpapers (into `icons/`)
- `install/macos/install.sh`, `install/macos/uninstall.sh`: apply or undo the Mac theme
- `install/ios/README.md`: the iPhone steps (Shortcuts)
- `docs/demo/index.html`: live rotating gallery

## CLI

```sh
node src/cli.js                                   # list models
node src/cli.js gear                              # preview as text
node src/cli.js gear --angle 0.5 --cols 70 --rows 40
node src/cli.js gear --format svg > gear.svg      # keycap icon, editable text
node src/cli.js gear --format html --size 180     # keycap tile as an HTML fragment
node src/cli.js --all --format svg --out out/     # one file per model
```

## Style rules (keep these)

- One generic object per icon. Never redraw a company's logo; choose the object the app is about (a pointer for a code editor, headphones for music).
- Light from the upper left. Lit faces use `. : -`, shadow fills toward `# %`, `@` is only for outlines.
- Raised keycap tile: white to `#ECEBE6` face, `#141414` outline and solid base, `#DCDBD5` bevel. Paper `#F3F2EE`, ink `#141414`, JetBrains Mono Bold.
- Default view: angle `-0.35`, tilt `0.22`. For motion, sway about ±0.5 rad so the front stays readable.

## Adding a model

1. Check the existing models first; reuse one if it fits.
2. Add an entry to `models` in `src/models.js`, named after the object:
   - Fill roughly -0.9..0.9 on x and y.
   - x is right, y is up, the viewer looks along +z: a detail in front of a surface uses `z + d` (clock hands sit at `z + 0.17`).
   - Build with `roundBox`, `sphere`, `ellipsoid`, `cylinderZ/Y`, `torusZ/Y`, `capsule`, `triangle` + `extrude`, `octahedron`; combine with `union`, `subtract`, `intersect`, `smoothUnion`; turn parts with `rotate`.
   - Parts thinner than about 0.05 vanish at icon size; gaps under about 0.1 close up.
3. Preview at the default angle and at `--angle 0.5`. Iterate until it reads at a glance and every distinct part has a clean `@` outline.
4. Map apps in `install/macos/apps.tsv` (exact name from `/Applications`, without `.app`) or `install/ios/icons.tsv`.
5. `python3 scripts/build.py --only "App Name"` for the PNG, `python3 scripts/build.py` to refresh everything, then `npm test`.

## Installing

- **Mac:** `install/macos/install.sh --dry-run`, then `install/macos/install.sh`. Admin password once for App Store apps; Apple's own apps can't change. `install/macos/uninstall.sh` reverts.
- **iPhone:** follow `install/ios/README.md`. iOS has no theme support: icons are Shortcuts that open each app, without badges and without animation.
