"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");

const ASCII3D = require("../src/ascii3d");
const Motion = require("../src/motion");
require("../src/models");

const close = (a, b) => Math.abs(a - b) < 1e-9;

test("sway and spin loop without a seam", () => {
  assert.ok(close(Motion.sway(0), Motion.sway(Motion.LOOP)));
  assert.ok(close(Motion.spin(0), Motion.REST_ANGLE));
  assert.ok(close(Motion.spin(1), Motion.REST_ANGLE + Math.PI * 2));
});

test("reveal goes from noise to the finished art", () => {
  const art = ASCII3D.render("gear");
  assert.equal(Motion.reveal(art, 1, { seed: 3 }), art);
  const noisy = Motion.reveal(art, 0, { seed: 3, frame: 1 });
  assert.notEqual(noisy, art);
  assert.equal(noisy.split("\n").length, art.split("\n").length);
  assert.ok(noisy.split("\n").every((line) => line.length === 50));
});

test("reveal is deterministic for a frame", () => {
  const art = ASCII3D.render("handset");
  assert.equal(Motion.reveal(art, 0.4, { seed: 2, frame: 9 }), Motion.reveal(art, 0.4, { seed: 2, frame: 9 }));
});

test("sway centers on SWAY_CENTER", () => {
  assert.ok(close(Motion.sway(0), Motion.SWAY_CENTER));
});
