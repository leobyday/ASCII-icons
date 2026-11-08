---
name: ascii-icons-figma
description: Create ASCII 3D Icons (3D models drawn in shaded characters on keycap tiles) inside a Figma file, as editable layers or components. Use when someone wants these icons, or new ones in this style, in Figma.
---

# ASCII 3D Icons in Figma

The icons are rendered by code, then placed in Figma as SVG. The characters come in as real text layers in JetBrains Mono, so they stay editable.

## 1. Render the icon

Work from a clone of https://github.com/leobyday/ascii-icons (the `ascii-3d-icons` skill covers the repo and how to model a new object).

```sh
node src/cli.js                                  # pick a model, or add one to src/models.js
node src/cli.js handset --format svg > handset.svg
node src/cli.js --all --format svg --out svg/    # the whole set
```

Ready-made SVGs for every model are already in `icons/svg/`.

## 2. Place it in Figma

### With the Figma MCP server (preferred)

1. Load the Figma server's `figma-use` skill before the first `use_figma` call, and start a session for the target file as its instructions say.
2. Read the SVG file's text, then run Plugin API code like this through `use_figma`, passing the SVG as a string:

```js
await figma.loadFontAsync({ family: "JetBrains Mono", style: "Bold" });
const node = figma.createNodeFromSvg(svg);          // svg = contents of handset.svg
node.name = "ascii/handset";
const component = figma.createComponentFromNode(node);
component.x = 0;                                     // lay icons out in a row: x = index * 1104
component.y = 0;
figma.currentPage.appendChild(component);
```

3. For a full set, place one component per model in a grid (1024 px icons, 80 px gaps) and combine them with `figma.combineAsVariants` if the user wants a single icon component with a `name` property.
4. Check the result with a screenshot of the new nodes. If characters fall back to another font, JetBrains Mono wasn't loaded: load it and rebuild.

### Without the MCP server

Drag the `.svg` files onto the Figma canvas, or open one in a text editor, copy it and paste it into Figma. Each becomes a frame with editable text.

## Sizes

The SVG is 1024 × 1024. Scale the component in Figma (hold ⇧ with the Scale tool, K) rather than resizing the text, so the character grid stays aligned. For a 180 px app-size tile, `--size 180` produces a smaller SVG directly.

## Keep the style

Don't recolor the characters or swap the font; the look depends on JetBrains Mono, ink `#141414` and the keycap face `#FFFFFF` to `#ECEBE6`. New objects follow the modeling rules in the `ascii-3d-icons` skill: generic objects, never company logos.
