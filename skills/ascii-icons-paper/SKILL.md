---
name: ascii-icons-paper
description: Create ASCII 3D Icons (3D models drawn in shaded characters on keycap tiles) inside Paper (paper.design), as artboards with live, editable HTML. Use when someone wants these icons, or new ones in this style, in Paper.
---

# ASCII 3D Icons in Paper

Paper builds designs from HTML, so the icons go in as a small HTML fragment: a keycap tile with the characters in a `<pre>`, all inline styles.

## 1. Render the icon

Work from a clone of https://github.com/leobyday/ascii-icons (the `ascii-3d-icons` skill covers the repo and how to model a new object).

```sh
node src/cli.js                                        # pick a model, or add one to src/models.js
node src/cli.js handset --format html --size 180       # one tile, 180 px
node src/cli.js handset gear globe --format html       # several tiles
```

Each tile is one `<div>` with a nested `<pre>`. Use `--size` for the tile size in px (default 180).

## 2. Place it in Paper

With the Paper MCP server:

1. Read Paper's own guide first (its `get_guide` tool) and follow it for how artboards, HTML writing and fonts work in the current version.
2. Open or create the file, then create an artboard sized to the content: one tile is `size × size` plus room for its 4% base shadow; for a set, lay tiles in a grid with 40 px gaps on a `#F3F2EE` background.
3. Write the HTML from step 1 into the artboard. For a grid, wrap the tiles in
   `<div style="display:grid;grid-template-columns:repeat(4,180px);gap:40px;padding:40px;background:#F3F2EE">…</div>`.
4. Make sure JetBrains Mono is available in Paper (check with its font tools). If it isn't, any monospace font keeps the grid aligned, but tell the user the look changes.
5. Take a screenshot of the artboard to check every tile, then export (PNG or SVG) if the user wants files.

Without the MCP server, paste the HTML into a Paper HTML/code layer, or import `icons/svg/<model>.svg` as an image.

## Keep the style

Keep the inline styles as generated: JetBrains Mono Bold, ink `#141414`, the white-to-`#ECEBE6` face, the `#DCDBD5` bevel and the solid ink base. New objects follow the modeling rules in the `ascii-3d-icons` skill (generic objects for the shared set; a logo only when it's the person's own or they have rights to it).
