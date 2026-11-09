# Contributing

Thanks for helping the set grow.

## Adding a model

1. Add an SDF to `models` in `src/models.js`. Name it after the object it depicts (`microphone`), not after an app or brand.
2. Write its spec in `src/catalog.json`: what it depicts and the two or three parts it reads as (see [the icon spec](skills/ascii-3d-icons/SKILL.md#the-icon-spec)). Keep it generic: no company logos in the shared set, since they're trademarks.
3. Preview it with `node src/cli.js <model>` and `node src/cli.js <model> --angle 0.5`. It should read clearly at a glance from both angles.
4. If it's for an app, map the app in `install/macos/apps.tsv` or `install/ios/icons.tsv`.
5. Run `python3 scripts/build.py` to rebuild the PNGs, SVGs, wallpapers and the catalog (`icons/README.md`), then `npm test`.

The [skill](skills/ascii-3d-icons/SKILL.md) and the [walkthrough](docs/walkthrough.md) have modeling tips and the style rules.

## Code style

- JavaScript: plain ES2017+, no dependencies. `src/` must keep working in both Node and the browser.
- Python: standard library plus Pillow, checked with `ruff`.
- Shell: bash 3.2 compatible (the version macOS ships), checked with `shellcheck`.

## Pull requests

Include a screenshot of the new icon, or the terminal preview, in the description.
