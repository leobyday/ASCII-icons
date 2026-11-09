# Working with ASCII 3D Icons

*A note on how to use this set well.*

Most icon sets are drawings. This one is a renderer. Every icon is a 3D model lit from one direction and drawn in nine characters, `.:-=+*#%@`. That changes how you work with it. You don't redraw an icon, you re-render it. And the system holds together because every icon goes through the same rules, not because someone was careful.

Here's how I'd think about it on a real product.

## Treat it as a system, not a sticker sheet

The value is consistency you don't have to police. One light source, one character ramp, one outline rule, one tile. If you need a new icon, model the object and let the renderer do the drawing. The moment someone hand-edits characters in Figma to "fix" a shape, you've forked the system. Fix the model instead, and every size and angle gets the fix.

## Pick objects, not logos

Each icon depicts a thing: a handset, a gear, a speech bubble. That's deliberate. It keeps the set legally clean, and it keeps it honest. An ASCII render of a brand mark is a worse brand mark. A good object reads faster than a squinted logo at 60 px. When you're choosing what to model, ask what the app *does*, then pick the most familiar physical thing that does it.

## Respect the size floor

This style is generous at 120 px and above and gets fragile below 48 px. The characters turn into texture before the silhouette goes, which is why the `@` outline exists. Use the PNGs at app-icon sizes, use the SVGs where people look closely, and don't use these as 16 px UI glyphs. For inline UI, pair the set with a simple line icon family and save the ASCII icons for moments that deserve attention: onboarding, empty states, marketing, the home screen.

## Let it be the loud thing

These icons carry a lot of texture. Put them on calm surfaces: paper `#F3F2EE`, plenty of space, one accent at most. If the background is busy too, build it from the same character ramp, like the wallpaper and the aura in the thumbnail. That way the texture reads as one material instead of two competing ones.

## Use motion with intent

Because they're real models, the icons can turn or form out of noise. Treat motion like a token with one value: icons turn on their own vertical axis, one eased turn every 4.4 s, staggered across a grid. Same motion everywhere, so the set reads as one system. Drop to a gentle sway only where a full turn would compete with text. The noise-to-icon reveal for "something was just made". Always honor reduced motion. The renderer is deterministic, so a still frame is a valid fallback, not a degraded one.

## Keep the tile intact

The keycap (white face, `#ECEBE6` falloff, ink outline, solid base) is half the recognition. Don't recolor the characters, don't swap JetBrains Mono for something "friendlier", and don't drop the base shadow to make it flatter. If you need a quieter variant, use the outlined folder treatment: border only, no fill, no depth.

## How to extend it

1. Check whether an existing model already covers it. The library is small on purpose.
2. Model the new object in `src/models.js`, preview it at two angles, and iterate until it reads at a glance.
3. Map it, build it, run the tests. In Figma, Paper or pen.dev, let the skills place it for you so the output matches the source.
4. Review new icons the way you'd review type: side by side with their neighbors, at the smallest size they'll ship.

The best compliment for an icon in this set is that nobody notices it's new.
