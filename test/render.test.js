"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ASCII3D = require("../src/ascii3d");
require("../src/models");

const ROOT = path.join(__dirname, "..");
const names = Object.keys(ASCII3D.models);

function manifest(file) {
  return fs
    .readFileSync(path.join(ROOT, file), "utf8")
    .split("\n")
    .filter((line) => line.trim() && !line.startsWith("#"))
    .map((line) => line.split("\t"));
}

test("every model renders a filled, outlined shape of the requested size", () => {
  for (const name of names) {
    const art = ASCII3D.render(name, { cols: 50, rows: 30 });
    const lines = art.split("\n");
    assert.equal(lines.length, 30, name);
    assert.ok(lines.every((line) => line.length === 50), `${name}: line width`);
    const ink = art.replace(/[\s]/g, "");
    assert.ok(ink.length > 80, `${name}: too little drawn (${ink.length})`);
    assert.ok(ink.includes("@"), `${name}: no outline`);
    assert.match(ink, /[.:\-=+*#%]/, `${name}: no shading`);
  }
});

test("only ramp characters are used", () => {
  const allowed = new Set([" ", ...ASCII3D.RAMP]);
  for (const name of names) {
    for (const ch of ASCII3D.render(name).replace(/\n/g, "")) assert.ok(allowed.has(ch), `${name}: "${ch}"`);
  }
});

test("rendering is deterministic", () => {
  assert.equal(ASCII3D.render("gear", { angle: 0.3 }), ASCII3D.render("gear", { angle: 0.3 }));
});

test("custom SDF functions render too", () => {
  const art = ASCII3D.render((x, y, z) => ASCII3D.sdf.sphere(x, y, z, 0.6));
  assert.ok(art.includes("@"));
});

test("unknown models throw", () => {
  assert.throws(() => ASCII3D.render("not-a-model"), /Unknown model/);
});

test("every manifest entry points at a real model", () => {
  for (const file of ["ios/icons.tsv", "macos/apps.tsv"]) {
    for (const [app, model] of manifest(file)) {
      assert.ok(model in ASCII3D.models, `${file}: ${app} -> ${model}`);
    }
  }
});

test("every manifest entry has a built icon", () => {
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  for (const [file, dir] of [["ios/icons.tsv", "icons/ios"], ["macos/apps.tsv", "icons/macos"]]) {
    for (const [app] of manifest(file)) {
      assert.ok(fs.existsSync(path.join(ROOT, dir, `${slug(app)}.png`)), `${dir}: missing ${app}`);
    }
  }
});
