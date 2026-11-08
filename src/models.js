/**
 * ASCII 3D Icons — the model library.
 *
 * Each model is an SDF of a generic object, roughly filling the cube
 * -1..1 on every axis. Models are named after what they depict, never after
 * a brand; apps are mapped to models in install/ios/icons.tsv and install/macos/apps.tsv.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ascii3d"));
  else factory(root.ASCII3D);
})(typeof self !== "undefined" ? self : this, function (ASCII3D) {
  "use strict";

  const {
    union, intersect, subtract, smoothUnion, rotate,
    sphere, ellipsoid, roundBox, cylinderZ, cylinderY, torusZ, torusY,
    capsule, triangle, extrude, octahedron,
  } = ASCII3D.sdf;
  const { abs, cos, sin, hypot, atan2, PI } = Math;

  /** A flat monitor with an inset screen, a neck and a foot. */
  function monitor(x, y, z) {
    const screen = subtract(
      roundBox(x, y - 0.12, z, 0.88, 0.56, 0.1, 0.06),
      roundBox(x, y - 0.12, z + 0.12, 0.76, 0.44, 0.05, 0.03),
    );
    return union(screen, cylinderY(x, y + 0.56, z, 0.06, 0.12), roundBox(x, y + 0.7, z, 0.36, 0.04, 0.18, 0.03));
  }

  const models = {
    // ----- everyday objects (iPhone set) -----

    "rain-cloud": (x, y, z) => {
      const cloud = smoothUnion(
        smoothUnion(sphere(x + 0.4, y - 0.02, z, 0.34), sphere(x + 0.02, y - 0.24, z, 0.44), 0.2),
        smoothUnion(sphere(x - 0.45, y + 0.02, z, 0.32), roundBox(x, y + 0.18, z, 0.72, 0.16, 0.3, 0.15), 0.2),
        0.2,
      );
      const rain = union(
        capsule(x, y, z, -0.35, -0.5, -0.45, -0.82, 0.06),
        capsule(x, y, z, 0.05, -0.5, -0.05, -0.82, 0.06),
        capsule(x, y, z, 0.45, -0.5, 0.35, -0.82, 0.06),
      );
      return union(cloud, rain);
    },

    "video-camera": (x, y, z) =>
      smoothUnion(roundBox(x + 0.15, y, z, 0.52, 0.4, 0.32, 0.12), roundBox(x - 0.53, y, z, 0.18, 0.28, 0.22, 0.06), 0.1),

    flower: (x, y, z) => {
      let d = sphere(x, y, z, 0.22);
      for (let k = 0; k < 6; k++) {
        const a = (k * PI) / 3;
        d = smoothUnion(d, ellipsoid(x - 0.5 * cos(a), y - 0.5 * sin(a), z, 0.32, 0.32, 0.16), 0.08);
      }
      return d;
    },

    clock: (x, y, z) =>
      union(
        cylinderZ(x, y, z, 0.8, 0.12),
        torusZ(x, y, z, 0.8, 0.1),
        roundBox(x, y - 0.24, z + 0.17, 0.05, 0.28, 0.05, 0.03), // minute hand
        roundBox(x - 0.3, y, z + 0.17, 0.34, 0.045, 0.05, 0.03), // hour hand
        sphere(x, y, z + 0.17, 0.08),
      ),

    camera: (x, y, z) => {
      const lens = subtract(cylinderZ(x, y + 0.02, z + 0.34, 0.34, 0.14), cylinderZ(x, y + 0.02, z + 0.5, 0.2, 0.12));
      return union(roundBox(x, y, z, 0.82, 0.52, 0.3, 0.12), roundBox(x + 0.36, y - 0.58, z, 0.22, 0.1, 0.22, 0.05), lens);
    },

    // A square note tile: slab, dotted rule under the top band, two ruled lines.
    // Built from a flat icon; see the "2D to 3D" walkthrough in the skill.
    "note-tile": (x, y, z) => {
      const tile = roundBox(x, y, z, 0.9, 0.9, 0.14, 0.24);
      const rules = union(roundBox(x, y, z + 0.15, 0.9, 0.03, 0.03, 0.01), roundBox(x, y + 0.45, z + 0.15, 0.9, 0.03, 0.03, 0.01));
      const dx = (((x + 0.05) % 0.1) + 0.1) % 0.1 - 0.05; // repeat a dot every 0.1 along x
      const dots = intersect(sphere(dx, y - 0.36, z + 0.15, 0.035), abs(x) - 0.84);
      return union(tile, rules, dots);
    },

    calendar: (x, y, z) =>
      union(
        roundBox(x, y + 0.05, z, 0.68, 0.68, 0.12, 0.1),
        roundBox(x, y - 0.42, z + 0.12, 0.6, 0.15, 0.04, 0.04),
        cylinderY(x + 0.32, y - 0.74, z, 0.07, 0.14),
        cylinderY(x - 0.32, y - 0.74, z, 0.07, 0.14),
      ),

    notepad: (x, y, z) => {
      let d = union(roundBox(x, y, z, 0.6, 0.8, 0.1, 0.08), roundBox(x, y - 0.62, z, 0.62, 0.16, 0.14, 0.06));
      [0.25, 0, -0.25, -0.5].forEach((ly, k) => {
        d = union(d, roundBox(x, y - ly, z + 0.1, k === 3 ? 0.28 : 0.45, 0.035, 0.03, 0.02));
      });
      return d;
    },

    checklist: (x, y, z) => {
      let d = Infinity;
      for (const ly of [0.52, 0, -0.52]) {
        d = union(d, sphere(x + 0.55, y - ly, z, 0.18), roundBox(x - 0.2, y - ly, z, 0.46, 0.07, 0.07, 0.05));
      }
      return d;
    },

    wallet: (x, y, z) =>
      union(
        roundBox(x, y + 0.12, z, 0.82, 0.5, 0.22, 0.15),
        roundBox(x, y - 0.42, z - 0.04, 0.68, 0.2, 0.08, 0.05),
        sphere(x, y + 0.08, z + 0.22, 0.12),
      ),

    gear: (x, y, z) => {
      const r = hypot(x, y), sector = PI / 4;
      const a = (((atan2(y, x) + sector / 2) % sector) + sector) % sector - sector / 2;
      const teeth = roundBox(r * cos(a) - 0.7, r * sin(a), z, 0.14, 0.11, 0.16, 0.03);
      return subtract(union(cylinderZ(x, y, z, 0.62, 0.16), teeth), cylinderZ(x, y, z, 0.22, 0.3));
    },

    tv: monitor,

    "shopping-bag": (x, y, z) =>
      union(
        roundBox(x, y + 0.18, z, 0.62, 0.55, 0.32, 0.1),
        torusZ(x, y - 0.38, z, 0.3, 0.07),
        roundBox(x, y + 0.18, z + 0.32, 0.06, 0.26, 0.04, 0.02),
        roundBox(x, y + 0.18, z + 0.32, 0.26, 0.06, 0.04, 0.02),
      ),

    handset: (x, y, z) => {
      const [u, v] = rotate(x, y, PI / 4);
      const q = hypot(u, v + 1.15) - 1.3;
      const handle = intersect(hypot(q, z) - 0.13, abs(u) - 0.6);
      const cups = union(
        roundBox(u - 0.6, v + 0.14, z, 0.21, 0.24, 0.18, 0.1),
        roundBox(u + 0.6, v + 0.14, z, 0.21, 0.24, 0.18, 0.1),
      );
      return smoothUnion(handle, cups, 0.12);
    },

    "speech-bubble": (x, y, z) => {
      let d = smoothUnion(ellipsoid(x, y - 0.1, z, 0.88, 0.62, 0.3), capsule(x, y, z, -0.35, -0.3, -0.62, -0.74, 0.1), 0.15);
      for (let k = -1; k <= 1; k++) d = union(d, sphere(x - k * 0.36, y - 0.1, z + 0.27, 0.09));
      return d;
    },

    "music-notes": (x, y, z) =>
      union(
        ellipsoid(x + 0.45, y + 0.55, z, 0.26, 0.19, 0.19),
        ellipsoid(x - 0.45, y + 0.4, z, 0.26, 0.19, 0.19),
        capsule(x, y, z, -0.22, -0.5, -0.22, 0.55, 0.06),
        capsule(x, y, z, 0.68, -0.35, 0.68, 0.62, 0.06),
        roundBox(x - 0.23, y - 0.58, z, 0.47, 0.09, 0.07, 0.03),
      ),

    globe: (x, y, z) => {
      let g = sphere(x, y, z, 0.84);
      g = subtract(g, torusY(x, y, z, 0.84, 0.07));
      g = subtract(g, torusZ(x, y, z, 0.84, 0.07));
      const rr = hypot(x, z) - 0.72;
      g = subtract(g, hypot(rr, y - 0.42) - 0.06);
      return subtract(g, hypot(rr, y + 0.42) - 0.06);
    },

    // ----- tools and media (Mac set) -----

    "screen-mirror": (x, y, z) => {
      const screen = subtract(
        roundBox(x + 0.18, y - 0.2, z, 0.64, 0.42, 0.07, 0.05),
        roundBox(x + 0.18, y - 0.2, z + 0.08, 0.56, 0.34, 0.03, 0.02),
      );
      const phone = subtract(
        roundBox(x - 0.6, y + 0.2, z + 0.14, 0.22, 0.42, 0.07, 0.07),
        roundBox(x - 0.6, y + 0.2, z + 0.22, 0.16, 0.34, 0.03, 0.02),
      );
      return union(screen, cylinderY(x + 0.18, y + 0.3, z, 0.05, 0.1), roundBox(x + 0.18, y + 0.42, z, 0.26, 0.03, 0.14, 0.02), phone);
    },

    joystick: (x, y, z) =>
      union(
        roundBox(x, y + 0.6, z, 0.78, 0.17, 0.5, 0.12),
        capsule(x, y, z, 0.05, -0.45, -0.02, 0.25, 0.07),
        sphere(x + 0.02, y - 0.32, z, 0.26),
        cylinderY(x - 0.5, y + 0.43, z + 0.15, 0.12, 0.05),
        cylinderY(x - 0.5, y + 0.43, z - 0.2, 0.12, 0.05),
      ),

    scissors: (x, y, z) =>
      union(
        torusZ(x + 0.36, y + 0.48, z, 0.21, 0.07),
        torusZ(x - 0.36, y + 0.48, z, 0.21, 0.07),
        capsule(x, y, z, -0.24, -0.3, 0.34, 0.78, 0.075),
        capsule(x, y, z, 0.24, -0.3, -0.34, 0.78, 0.075),
        sphere(x, y - 0.14, z, 0.09),
      ),

    "bouncing-balls": (x, y, z) =>
      union(
        sphere(x + 0.6, y - 0.32, z, 0.17),
        sphere(x + 0.08, y + 0.18, z, 0.24),
        sphere(x - 0.48, y - 0.18, z, 0.33),
        roundBox(x, y + 0.62, z, 0.88, 0.035, 0.3, 0.02),
      ),

    sparkle: (x, y, z) => {
      const cross = smoothUnion(ellipsoid(x, y, z, 0.16, 0.88, 0.16), ellipsoid(x, y, z, 0.88, 0.16, 0.16), 0.3);
      const [u, v] = rotate(x, y, PI / 4);
      const diagonal = smoothUnion(ellipsoid(u, v, z, 0.1, 0.42, 0.1), ellipsoid(u, v, z, 0.42, 0.1, 0.1), 0.15);
      return smoothUnion(cross, diagonal, 0.15);
    },

    pointer: (x, y, z) => {
      const [u, v] = rotate(x + 0.05, y, 0.45);
      const head = extrude(triangle(u, v - 0.18, 0.5) + 0.03, z, 0.12) - 0.03;
      return smoothUnion(head, roundBox(u, v + 0.45, z, 0.11, 0.3, 0.12, 0.04), 0.05);
    },

    gamepad: (x, y, z) => {
      const grips = union(ellipsoid(x + 0.56, y + 0.25, z, 0.3, 0.4, 0.22), ellipsoid(x - 0.56, y + 0.25, z, 0.3, 0.4, 0.22));
      return union(
        smoothUnion(roundBox(x, y, z, 0.62, 0.27, 0.2, 0.18), grips, 0.18),
        roundBox(x + 0.46, y - 0.02, z + 0.2, 0.15, 0.045, 0.05, 0.02), // d-pad
        roundBox(x + 0.46, y - 0.02, z + 0.2, 0.045, 0.15, 0.05, 0.02),
        sphere(x - 0.4, y + 0.06, z + 0.19, 0.07), // buttons
        sphere(x - 0.56, y - 0.1, z + 0.19, 0.07),
      );
    },

    containers: (x, y, z) => {
      const rows = [[-0.42, [-0.56, 0, 0.56]], [-0.02, [-0.28, 0.28]], [0.38, [0]]];
      let d = Infinity;
      for (const [cy, xs] of rows) {
        for (const cx of xs) d = union(d, roundBox(x - cx, y - cy, z, 0.25, 0.17, 0.3, 0.03));
      }
      return d;
    },

    shapes: (x, y, z) =>
      union(
        roundBox(x - 0.42, y + 0.35, z, 0.27, 0.27, 0.27, 0.04),
        sphere(x + 0.42, y + 0.35, z, 0.31),
        cylinderY(x, y - 0.4, z, 0.3, 0.24),
      ),

    planet: (x, y, z) => {
      const ball = subtract(sphere(x, y, z, 0.6), torusY(x, y, z, 0.6, 0.05));
      const [ry, rz] = rotate(y, z, 0.45);
      return union(ball, torusY(x, ry, rz, 0.88, 0.055));
    },

    layers: (x, y, z) => {
      let d = Infinity;
      for (const [ox, oy, oz] of [[-0.24, 0.24, 0.26], [0, 0, 0], [0.24, -0.24, -0.26]]) {
        d = union(d, roundBox(x - ox, y - oy, z - oz, 0.5, 0.5, 0.035, 0.07));
      }
      return d;
    },

    "git-branch": (x, y, z) =>
      union(
        sphere(x + 0.35, y + 0.65, z, 0.17),
        sphere(x + 0.35, y - 0.62, z, 0.17),
        sphere(x - 0.42, y - 0.22, z, 0.17),
        capsule(x, y, z, -0.35, -0.65, -0.35, 0.62, 0.07),
        capsule(x, y, z, -0.35, -0.3, 0.42, -0.02, 0.07),
        capsule(x, y, z, 0.42, -0.02, 0.42, 0.22, 0.07),
      ),

    clapperboard: (x, y, z) => {
      let board = roundBox(x, y + 0.15, z, 0.72, 0.5, 0.1, 0.06);
      for (let k = -2; k <= 2; k++) board = subtract(board, roundBox(x - k * 0.28, y + 0.15, z + 0.12, 0.05, 0.42, 0.04, 0.01));
      const [u, v] = rotate(x + 0.72, y - 0.4, 0.2);
      let arm = roundBox(u - 0.74, v - 0.15, z, 0.74, 0.13, 0.1, 0.03);
      for (let k = 0; k < 4; k++) arm = subtract(arm, roundBox(u - 0.25 - k * 0.38, v - 0.15, z + 0.12, 0.07, 0.15, 0.04, 0.01));
      return union(board, arm);
    },

    presentation: (x, y, z) =>
      union(
        roundBox(x, y - 0.22, z, 0.74, 0.45, 0.06, 0.04),
        capsule(x, y, z, -0.3, -0.2, -0.56, -0.92, 0.055),
        capsule(x, y, z, 0.3, -0.2, 0.56, -0.92, 0.055),
        roundBox(x + 0.2, y - 0.22, z + 0.07, 0.12, 0.2, 0.03, 0.02),
        roundBox(x - 0.25, y - 0.12, z + 0.07, 0.12, 0.3, 0.03, 0.02),
      ),

    "record-button": (x, y, z) => union(torusZ(x, y, z, 0.62, 0.15), sphere(x, y, z, 0.3)),

    "bar-chart": (x, y, z) => {
      let d = roundBox(x, y + 0.74, z, 0.78, 0.04, 0.3, 0.02);
      [[-0.5, 0.3], [0, 0.7], [0.5, 0.5]].forEach(([cx, h]) => {
        d = union(d, roundBox(x - cx, y + 0.7 - h, z, 0.17, h, 0.17, 0.04));
      });
      return d;
    },

    chip: (x, y, z) => {
      let d = union(roundBox(x, y, z, 0.5, 0.5, 0.12, 0.06), roundBox(x, y, z + 0.13, 0.24, 0.24, 0.03, 0.02));
      for (const p of [-0.3, 0, 0.3]) {
        d = union(d, roundBox(x - p, abs(y) - 0.62, z, 0.05, 0.12, 0.04, 0.015), roundBox(abs(x) - 0.62, y - p, z, 0.12, 0.05, 0.04, 0.015));
      }
      return d;
    },

    "paper-stack": (x, y, z) => {
      let d = Infinity;
      for (let k = -1; k <= 1; k++) {
        const [u, v] = rotate(x, y, k * 0.16);
        d = union(d, roundBox(u - k * 0.06, v, z + k * 0.12, 0.52, 0.7, 0.025, 0.03));
      }
      return d;
    },

    pencil: (x, y, z) => {
      const [u, v] = rotate(x, y, -0.75);
      const body = smoothUnion(capsule(u, v, z, 0, -0.42, 0, 0.5, 0.2), capsule(u, v, z, 0, -0.92, 0, -0.42, 0.025), 0.4);
      return union(body, cylinderY(u, v - 0.56, z, 0.22, 0.07));
    },

    play: (x, y, z) => extrude(triangle(y, x + 0.15, 0.55) + 0.05, z, 0.14) - 0.05,

    keyframe: (x, y, z) => union(octahedron(x, y, z, 0.78) - 0.03, roundBox(x, y, z, 0.95, 0.035, 0.035, 0.02)),

    rivet: (x, y, z) =>
      union(
        intersect(sphere(x, y - 0.12, z, 0.56), 0.12 - y),
        cylinderY(x, y - 0.08, z, 0.6, 0.04),
        cylinderY(x, y + 0.36, z, 0.17, 0.46),
      ),

    "phone-mockup": (x, y, z) =>
      union(
        subtract(roundBox(x, y, z, 0.44, 0.84, 0.08, 0.13), roundBox(x, y, z + 0.1, 0.37, 0.76, 0.03, 0.09)),
        roundBox(x, y - 0.68, z + 0.07, 0.1, 0.025, 0.03, 0.02),
      ),

    "screen-record": (x, y, z) => union(monitor(x, y, z), sphere(x, y - 0.12, z + 0.02, 0.22)),

    hash: (x, y, z) => {
      const sx = x + y * 0.18;
      return union(
        roundBox(sx - 0.26, y, z, 0.085, 0.78, 0.1, 0.04),
        roundBox(sx + 0.26, y, z, 0.085, 0.78, 0.1, 0.04),
        roundBox(x, y - 0.27, z, 0.78, 0.085, 0.1, 0.04),
        roundBox(x, y + 0.27, z, 0.78, 0.085, 0.1, 0.04),
      );
    },

    headphones: (x, y, z) => {
      const band = intersect(torusZ(x, y + 0.05, z, 0.64, 0.07), -(y + 0.05));
      return union(band, ellipsoid(abs(x) - 0.64, y + 0.32, z, 0.18, 0.32, 0.25));
    },

    "handheld-console": (x, y, z) =>
      union(
        subtract(roundBox(x, y, z, 0.56, 0.4, 0.08, 0.04), roundBox(x, y, z + 0.1, 0.48, 0.32, 0.03, 0.02)),
        roundBox(abs(x) - 0.74, y, z, 0.17, 0.4, 0.11, 0.15),
        sphere(x + 0.74, y - 0.15, z + 0.12, 0.08),
        sphere(x - 0.74, y - 0.1, z + 0.11, 0.05),
        sphere(x - 0.74, y + 0.12, z + 0.11, 0.05),
      ),

    butterfly: (x, y, z) => {
      const ax = abs(x);
      return union(
        ellipsoid(ax - 0.42, y - 0.22, z, 0.38, 0.34, 0.05),
        ellipsoid(ax - 0.32, y + 0.34, z, 0.27, 0.24, 0.05),
        capsule(x, y, z, 0, -0.55, 0, 0.5, 0.08),
      );
    },

    "paper-plane": (x, y, z) => {
      const [u, v] = rotate(x, y, -0.8);
      const wing = extrude(triangle(u * 1.5, v + 0.05, 0.82) / 1.5, z, 0.03);
      const fin = intersect(extrude(triangle(z * 2.4, v + 0.15, 0.55) / 2.4, u, 0.03), z);
      return union(wing, fin);
    },

    "code-brackets": (x, y, z) => {
      const ax = abs(x);
      return union(
        capsule(ax, y, z, 0.8, 0, 0.42, 0.42, 0.085),
        capsule(ax, y, z, 0.8, 0, 0.42, -0.42, 0.085),
        capsule(x, y, z, -0.15, -0.55, 0.15, 0.55, 0.08),
      );
    },

    microphone: (x, y, z) =>
      union(
        capsule(x, y, z, 0, 0.12, 0, 0.5, 0.26),
        intersect(torusZ(x, y - 0.22, z, 0.4, 0.05), y - 0.22),
        capsule(x, y, z, 0, -0.18, 0, -0.62, 0.05),
        roundBox(x, y + 0.66, z, 0.3, 0.04, 0.18, 0.03),
      ),
  };

  ASCII3D.register(models);
  return models;
});
