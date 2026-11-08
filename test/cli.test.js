"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const { parseArgs } = require("../src/cli");

const CLI = path.join(__dirname, "..", "src", "cli.js");
const run = (...args) => spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8" });

test("lists models with no arguments", () => {
  const { status, stdout } = run();
  assert.equal(status, 0);
  assert.ok(stdout.split("\n").includes("gear"));
});

test("renders an SVG icon", () => {
  const { status, stdout } = run("gear", "--format", "svg", "--size", "256");
  assert.equal(status, 0);
  assert.match(stdout, /^<svg [^>]*width="256"/);
  assert.match(stdout, /<title id="a3d-gear-256-title">gear<\/title>/);
});

test("JSON output maps names to art", () => {
  const out = JSON.parse(run("gear", "globe", "--format", "json", "--cols", "20", "--rows", "12").stdout);
  assert.deepEqual(Object.keys(out), ["gear", "globe"]);
  assert.equal(out.gear.split("\n").length, 12);
});

test("unknown models exit 1, bad options exit 2", () => {
  assert.equal(run("not-a-model").status, 1);
  assert.equal(run("gear", "--format", "gif").status, 2);
  assert.equal(run("gear", "--cols", "0").status, 2);
  assert.equal(run("gear", "--bogus").status, 2);
});

test("parses options without running anything", () => {
  const opts = parseArgs(["gear", "--angle", "-0.5", "--format", "html", "--size", "120"]);
  assert.deepEqual(opts.names, ["gear"]);
  assert.equal(opts.render.angle, -0.5);
  assert.equal(opts.size, 120);
  assert.throws(() => parseArgs(["--out"]), /directory/);
});
