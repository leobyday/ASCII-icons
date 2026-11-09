#!/usr/bin/env node
/**
 * Write icons/README.md: every icon in the set, described with the same spec
 * the skill uses to make new ones, so people know exactly what they download.
 *
 *   node scripts/catalog.js           write icons/README.md
 *   node scripts/catalog.js --check   exit 1 if it is out of date (used by the tests)
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ASCII3D = require("../src/ascii3d");
const catalog = require("../src/catalog.json");
require("../src/models");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "icons", "README.md");

/** App name -> model, from a manifest file. */
function manifest(file) {
  return fs
    .readFileSync(path.join(ROOT, file), "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => line.split("\t"));
}

function appsByModel() {
  const apps = {};
  for (const [file, device] of [["install/ios/icons.tsv", "iPhone"], ["install/macos/apps.tsv", "Mac"]]) {
    for (const [app, model] of manifest(file)) (apps[model] ||= new Set()).add(`${app} (${device})`);
  }
  return apps;
}

function build() {
  const names = Object.keys(ASCII3D.models).sort();
  const missing = names.filter((n) => !catalog[n]);
  if (missing.length) throw new Error(`src/catalog.json has no entry for: ${missing.join(", ")}`);
  const apps = appsByModel();

  const rows = names.map((name) => {
    const { depicts, readsAs } = catalog[name];
    const used = apps[name] ? [...apps[name]].join(", ") : "";
    return `| <img src="svg/${name}.svg" width="72" alt="${depicts}"> | \`${name}\` | ${depicts} | ${readsAs} | ${used} |`;
  });

  return `# The icons

Every icon in this set is defined by the same spec, the one the [skill](../skills/ascii-3d-icons/SKILL.md#the-icon-spec) uses to make new ones. Two lines change per icon; the rest is fixed.

\`\`\`
Subject   what the icon depicts: a generic object, never a logo
Reads as  the two or three parts that carry the shape
Style     fixed: 3D model, 9-character ramp .:-=+*#%@, @ outlines, light from the upper left,
          resting view -0.35 rad turn / 0.22 rad tilt, ink #141414 on #F3F2EE,
          JetBrains Mono Bold, raised keycap tile
Motion    fixed: still, or turning on its own vertical axis (one eased turn every 4.4 s)
\`\`\`

So a file here is exactly: that subject, built from those parts, in that style. Want one that isn't here? Fill in the two lines and ask the skill.

## Files

| Folder | Format |
| --- | --- |
| [\`svg/\`](svg) | Every icon, 1024 px keycap tile, characters as editable text |
| [\`ios/\`](ios) | iPhone app icons, 1024 px PNG, named by app |
| [\`macos/\`](macos) | Mac app icons, 1024 px PNG, named by app |
| [\`wallpapers/\`](wallpapers) | Mac (3456 × 2234) and iPhone (1179 × 2556) |

## Catalog

${names.length} icons. Generated from \`src/catalog.json\` by \`node scripts/catalog.js\`.

| | Model | Subject | Reads as | Used for |
| --- | --- | --- | --- | --- |
${rows.join("\n")}
`;
}

function main() {
  const text = build();
  if (process.argv.includes("--check")) {
    const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
    if (current !== text) {
      console.error("icons/README.md is out of date: run node scripts/catalog.js");
      return 1;
    }
    return 0;
  }
  fs.writeFileSync(OUT, text);
  console.log(path.relative(ROOT, OUT));
  return 0;
}

if (require.main === module) process.exitCode = main();

module.exports = { build };
