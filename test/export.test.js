"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ASCII3D = require("../src/ascii3d");
const { toSVG, toHTML } = require("../src/export");
require("../src/models");

const art = ASCII3D.render("gear");

test("SVG export is a complete keycap icon with text runs", () => {
  const svg = toSVG(art, { title: "gear" });
  assert.match(svg, /^<svg [^>]*viewBox="0 0 1024 1024"/);
  assert.match(svg, /<title>gear<\/title>/);
  assert.match(svg, /<\/svg>$/);
  const runs = svg.match(/<text /g) || [];
  const expected = art.split("\n").reduce((n, line) => n + (line.match(/\S+/g) || []).length, 0);
  assert.equal(runs.length, expected);
});

test("SVG export scales with size", () => {
  assert.match(toSVG(art, { size: 180 }), /width="180" height="180"/);
});

test("HTML export keeps the art verbatim", () => {
  const html = toHTML(art, { size: 120 });
  assert.match(html, /^<div style="width:120px;height:120px;/);
  assert.ok(html.includes(art), "art should appear unchanged inside <pre>");
});

test("text is escaped for XML", () => {
  assert.ok(toSVG("<&>").includes("&lt;&amp;&gt;"));
  assert.ok(toHTML("<&>").includes("&lt;&amp;&gt;"));
});

test("every model has a built SVG", () => {
  const dir = path.join(__dirname, "..", "icons", "svg");
  for (const name of Object.keys(ASCII3D.models)) {
    assert.ok(fs.existsSync(path.join(dir, `${name}.svg`)), `missing icons/svg/${name}.svg`);
  }
});
