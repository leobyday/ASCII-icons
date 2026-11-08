---
name: ascii-3d-icons
description: Turn anything into an icon in the ASCII 3D Icons style (3D models rendered in shaded characters): an object, an app, a product, an idea or an existing flat icon. Covers the exact visual style, turning a 2D asset into a 3D model, adding motion, and exporting PNG, SVG, HTML or video. Use for any request to create, convert or animate icons or illustrations in this style.
---

# ASCII 3D Icons

Every icon in this style is a small 3D model, written as a signed distance function (SDF), lit from one direction and drawn with nine characters. Nothing is drawn by hand. To change an icon you change its model, and the renderer draws it. Follow this skill closely: icons only look like they belong together because every one goes through the same rules.

The style works for any subject. Whatever someone asks for (an object, an app, a feature, a brand-free product shot, an existing flat icon, a whole set), the job is the same: find the object, model it, render it with these rules.

Repository: https://github.com/leobyday/ascii-icons. Clone it if it isn't on disk and work from the clone. Needs Node 18+; PNG builds and `flatten.py` also need Python 3 with Pillow.

Companion skills for design tools: `ascii-icons-figma`, `ascii-icons-paper`, `ascii-icons-pen`.

---

## 0. Start from what they asked for

| They give you | Do this |
| --- | --- |
| **An idea** ("a coffee cup", "an icon for our payments feature") | Pick the most familiar physical object for it, then model it (section 2, steps 2–5). |
| **An app or brand name** | Model what the product *does*, never its logo: a pointer for a code editor, a paper plane for messaging. |
| **A flat icon or image** | Follow section 2 from step 1: flatten it, list its parts, turn them into depth. |
| **A set** ("five onboarding icons") | Model each object, then review them side by side at the same angle and size; adjust proportions until they feel like one family (similar fill of the frame, similar detail count). |
| **Motion** ("make it spin", "animate the reveal") | Section 3. |
| **A destination** (Figma, Paper, pen.dev, a website, a phone) | Section 4, plus the matching companion skill. |

Check `node src/cli.js` first: the library already has about 50 models, and reusing one beats a near-duplicate.

---

## 1. The style

### Characters

Every icon is shaded with these nine characters, lightest to darkest:

```
.  :  -  =  +  *  #  %  @
```

- **Ink means shadow.** A surface facing the light gets sparse characters (`.` `:` `-`); a surface turned away fills toward `#` `%`.
- **`@` is reserved for outlines.** It traces every silhouette and every raised detail: a cell becomes `@` where the depth jumps (a part sitting in front of another, or the object's edge). Never use `@` for shading. The outline is what keeps icons readable at small sizes.
- Spaces are empty; nothing else may appear in an icon.

### Light and camera

- One light, from the upper left and slightly in front: direction `(-0.45, 0.62, -0.64)`. Brightness = `0.02 + 0.82 × diffuse^1.4`.
- Resting view: turned `-0.35` rad around the vertical axis, tipped `0.22` rad toward the viewer. Every still icon uses this view.
- Default grid: 50 × 30 characters. A character cell is 0.6 as wide as it is tall, so `cols × 0.6 ≈ rows` keeps square things square.

### Color

- **Monochrome.** Ink `#141414` on paper `#F3F2EE` (white `#FFFFFF` is fine inside tiles and white tiles). Secondary text `#5E5D58`, faint `#A3A29C`.
- Color from a source icon never carries over. It turns into **density** (a colored band becomes dense `%` characters) or into **relief** (a raised or inset part with its own outline).
- The only place color is allowed is a "before" image that shows the original icon a design was made from.

### Type

JetBrains Mono, Bold for icon characters. Never a proportional font, never mixed sizes inside one icon: alignment is everything.

### The keycap tile

Icons sit on a raised keycap. At 1024 px:

| Part | Value |
| --- | --- |
| Tile | 824 × 812 at (100, 84), corner radius 184 |
| Outline | 12 px, ink `#141414` |
| Face | vertical gradient `#FFFFFF` → `#ECEBE6` |
| Bevel | 26 px strip of `#DCDBD5` along the bottom of the face |
| Base | solid ink, the tile shape offset 30 px down |
| Shadow | soft, `rgba(20,20,20,0.35)`, blurred about 28 px |

Scale proportionally for other sizes (corner radius ≈ 22.5% of the tile, base ≈ 4%). The SVG and HTML exporters and the PNG build already do this.

- **Folders:** outline only (no fill, no base, no shadow). The folder's app names cycle upward inside: the current one bold with a `> ` prefix, the rest fading out.
- **Standalone icons** (no tile, for hero moments): the characters alone on white, with a soft drop shadow `0 14px 14px rgba(20,20,20,0.22)`.

### Subjects

- One **generic object** per icon: what the thing is *about*, never a logo. A pointer for a code editor, headphones for music, a handset for calls.
- Name models after the object (`handset`, `speech-bubble`), never after an app or brand. If the icons are for specific apps, map apps to models separately (the example theme does this in `install/ios/icons.tsv` and `install/macos/apps.tsv`).

### Sizes

Comfortable at 120 px and up, fragile below 48 px. Don't use these as small UI glyphs.

---

## 2. From a 2D asset to a 3D model

Use this when someone gives you a flat icon, an illustration or a sketch and wants it in this style. For an idea with no image, start at step 2 and picture the object's simplest silhouette. The worked example turns a flat note icon (square tile, colored top band, dotted rule, two ruled lines) into the `note-tile` model in `src/models.js`.

### Step 1: Read the asset and flatten it

Before modeling, look at what actually carries the shape:

```sh
python3 scripts/flatten.py icon.png            # flat ASCII in the house style
```

`flatten.py` maps the image to characters: transparent → space, silhouette → `@`, colored areas → `%`, dark areas → `#`, thin rules → `=`, light areas → `.`. (Export SVGs to PNG first.) This flat ASCII is also the "2D" frame when you animate the build-up (section 3).

Then list the parts, at most five or six. For the note icon:

1. a rounded square slab (the tile)
2. a colored top band (top 25% of the tile)
3. a dotted rule under the band
4. two horizontal ruled lines

### Step 2: Decide what is depth

Characters only encode light, so every part must differ by **shape or depth**, not color:

- **The base** is a slab: `roundBox` with half-depth 0.12–0.16.
- **Details that should read** become raised relief in front of the base: offset `z + 0.15` (in front, because the viewer looks along +z), with a half-thickness of about 0.03. They get their own `@` outline.
- **Cut-outs** (screens, holes, slots) use `subtract`.
- **Colored areas** either become a raised or inset layer, or stay flush and are handled as density when you style the frame. In `note-tile` the band stays flush: in the 3D frames its rows are drawn denser, and the dotted rule beneath it marks the boundary in relief.

### Step 3: Map 2D coordinates to model space

Fill roughly -0.9..0.9 on x and y. For an asset of width W and height H:

```
x_model = (x / W × 2 − 1) × 0.9
y_model = (1 − y / H × 2) × 0.9       (y flips: up is positive)
```

For the 120 px note icon: band edge at y = 30 → `+0.45`; dotted rule at y ≈ 36 → `+0.36`; ruled lines at y = 60 → `0` and y = 90 → `−0.45`. In the SDF, a part centered at `y = c` is written with `y - c` (so `y + 0.45` places the lower line at −0.45).

### Step 4: Write the SDF

Building blocks (from `ASCII3D.sdf`): `roundBox`, `sphere`, `ellipsoid`, `cylinderZ`/`cylinderY`, `torusZ`/`torusY`, `capsule`, `triangle` + `extrude`, `octahedron`. Combine with `union`, `subtract`, `intersect`, `smoothUnion`. Turn parts with `rotate`. Patterns:

- **Repeat** a detail along x: `dx = ((x + s/2) % s + s) % s - s/2`, then clip the run with `intersect(…, abs(x) - halfWidth)`. This makes the note tile's dotted rule.
- **Mirror** with `abs(x)` (headphone cups, code brackets).
- **Blend** organic shapes with `smoothUnion(a, b, 0.1–0.3)` (clouds, speech bubbles).

```js
"note-tile": (x, y, z) => {
  const tile = roundBox(x, y, z, 0.9, 0.9, 0.14, 0.24);
  const rules = union(roundBox(x, y, z + 0.15, 0.9, 0.03, 0.03, 0.01),
                      roundBox(x, y + 0.45, z + 0.15, 0.9, 0.03, 0.03, 0.01));
  const dx = (((x + 0.05) % 0.1) + 0.1) % 0.1 - 0.05;
  const dots = intersect(sphere(dx, y - 0.36, z + 0.15, 0.035), abs(x) - 0.84);
  return union(tile, rules, dots);
},
```

Size limits at 50 × 30: parts thinner than about 0.05 vanish, gaps narrower than about 0.1 close up, and a detail needs about 0.03 of relief to earn an outline.

### Step 5: Check it from every side

```sh
node src/cli.js note-tile                    # resting view
node src/cli.js note-tile --angle 0.5        # turned the other way
node src/cli.js note-tile --angle 1.2        # nearly edge-on
node src/cli.js note-tile --angle 2.8        # the back
```

It passes when the object reads at a glance at rest, every distinct part has a clean `@` outline, nothing disappears when turned, and the back isn't broken. If it fails, fix the model, never the characters.

### Step 6: Export

Export the model in whatever format the person needs (section 4). If it belongs to the example app theme, also map it in `install/macos/apps.tsv` or `install/ios/icons.tsv` and run `python3 scripts/build.py`. Run `npm test` after changing `src/models.js`.

---

## 3. Adding motion

All motion is a pure function of time (`src/motion.js`), so any frame renders on its own and loops are exact.

### Loop rule

Pick a loop length (default **13.2 s**) and make every periodic motion repeat a whole number of times in it: `ω = 2π × k / 13.2`. `Motion.loopFrequency(k)` returns that. Stepped motion (cycling names, changing icons) must divide the loop too, for example 7 folder names every 13.2 / 7 s. Then the last frame flows into the first.

### Recipes

| Motion | Use for | Recipe |
| --- | --- | --- |
| **Sway** | Ambient life on home screens and grids | `Motion.sway(t, { amplitude: 0.5, cycles: 2, phase: i * 0.7 })`, centered at −0.2 rad. Stagger the phase per icon so they never move in lockstep. |
| **Full spin** | Hero moments, the last step of a build-up | `Motion.spin(p)` for p = 0..1: one eased turn that starts and ends at rest. About 2.5–3 s per turn. |
| **Generate from noise** | "Something was just made", icon reveals | `Motion.reveal(art, Motion.revealEase(u), { seed: iconIndex, frame })`. Hold pure noise for about 0.35 s, resolve over about 2 s, hold, then dissolve over about 0.6 s. |
| **Crossfade** | Between steps of a sequence | 0.45 s. |
| **Snap** | The moment something becomes 3D | 0.12 s, so the change reads as a beat. |

Update characters at about 12.5 frames per second; faster looks like flicker, slower looks broken.

### The build-up sequence

To show how any icon is made (great for case studies and launches), in five equal steps of 2.64 s (one 13.2 s loop), every step on white with the standalone drop shadow:

1. **Today:** the original icon, in color (the only color in the piece).
2. **ASCII:** the original fades while the flat ASCII resolves out of noise over it.
3. **2D:** the flat ASCII from `flatten.py`, held, monochrome.
4. **3D:** snap (0.12 s) to the model at the resting view.
5. **Motion:** one full eased spin, ending at rest, then crossfade back to step 1.

Label the steps along the bottom (`01 Today · 02 ASCII · 03 2D · 04 3D · 05 Motion`) with the current one bold.

### Accessibility

Honor `prefers-reduced-motion`: show the resting frame. Because frames are deterministic, a still is a complete version, not a degraded one.

---

## 4. Exporting

```sh
node src/cli.js gear --format svg > gear.svg       # keycap icon, editable text
node src/cli.js gear --format html --size 180      # keycap tile as an HTML fragment
node src/cli.js --all --format svg --out out/      # one file per model
python3 scripts/build.py                           # all PNGs, SVGs and wallpapers
```

For video, render frames with the motion helpers in a browser (load `src/ascii3d.js`, `src/models.js`, `src/motion.js`), capture at 25 fps for exactly one loop, then:

- **MP4** (best for social): `ffmpeg -framerate 25 -i f%04d.png -c:v libx264 -crf 18 -pix_fmt yuv420p -movflags +faststart out.mp4`
- **GIF** (READMEs, social posts; keep under 5 MB): 10–12.5 fps, a palette of 64–128 colors, no dithering (`palettegen=stats_mode=diff` → `paletteuse=dither=none`).

Never put personal details (real locations, calendar events) in public assets; use neutral text.

---

## 5. Theming a Mac or iPhone (optional)

The repo includes an example theme built with this style.

- **Mac:** `install/macos/install.sh --dry-run`, then `install/macos/install.sh`. Admin password once for App Store apps; Apple's own apps in `/System/Applications` can't change. `install/macos/uninstall.sh` reverts.
- **iPhone:** follow `install/ios/README.md`. iOS has no theme support: each icon is a Shortcut that opens its app, without badges or animation.

---

## Review checklist

- [ ] One generic object, named after the object, no logo
- [ ] Reads at a glance at the resting view and at `--angle 0.5`
- [ ] Clean `@` outline around every part; `@` used for nothing else
- [ ] Monochrome; source colors became density or relief
- [ ] On the keycap tile (or standalone with the drop shadow) with exact colors
- [ ] Motion loops: every period divides the loop length
- [ ] `npm test` passes
