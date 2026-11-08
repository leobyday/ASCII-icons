---
name: ascii-icons-pen
description: Create ASCII 3D Icons (3D models drawn in shaded characters on keycap tiles) inside pen.dev (formerly Pencil), as frames and text layers in a .pen document. Use when someone wants these icons, or new ones in this style, in pen.dev.
---

# ASCII 3D Icons in pen.dev

pen.dev documents (`.pen`) are edited by agents through pen.dev's MCP server (named `pencil`). The icons go in as a keycap frame with the characters as text layers, or as a pasted SVG.

## 1. Render the icon

Work from a clone of https://github.com/leobyday/ascii-icons (the `ascii-3d-icons` skill covers the repo and how to model a new object).

```sh
node src/cli.js                                    # pick a model, or add one to src/models.js
node src/cli.js handset                            # plain text art, 50 × 30 characters
node src/cli.js handset --format svg > handset.svg # finished icon as SVG
```

## 2. Place it in pen.dev

pen.dev must be running with a document open, and its MCP integration turned on (Settings → MCP).

1. Call `get_app_state` to confirm which document is active.
2. Call `read_skill` and follow pen.dev's own instructions for creating frames and text; the operations change between versions, so don't guess them.
3. With `execute`, build the icon:
   - A frame, 1024 × 1024 (or the size the user wants), named `ascii/<model>`.
   - Inside it, the keycap: a rectangle 824 × 812 at (100, 84), corner radius 184, fill `#141414` (outline), a second one 30 px lower as the solid base behind it, and the face inset by 12 px with a vertical gradient `#FFFFFF` → `#ECEBE6` and a 26 px `#DCDBD5` strip along its bottom edge.
   - The characters: one text layer per line of the text art (keep leading spaces), JetBrains Mono Bold, size 22, line height 22, letter spacing 0, color `#141414`, centered on the face. Alternatively, one text layer with all lines and line height equal to the font size.
   - If pen.dev's tools can import SVG, placing `handset.svg` is simpler and gives the same result.
4. Call `save` if the document should be saved, then screenshot or describe the result for the user.

Without the MCP server, copy the SVG file's contents and paste it onto the pen.dev canvas.

## Keep the style

Monospace alignment is everything: never change the font size of single characters or use a proportional font. New objects follow the modeling rules in the `ascii-3d-icons` skill: generic objects, never company logos.
