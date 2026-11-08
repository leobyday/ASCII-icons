/**
 * ASCII 3D Icons — renderer.
 *
 * Every icon is a signed distance function (SDF): a function of (x, y, z)
 * that returns the distance to the surface of a small 3D model. The renderer
 * ray-marches one ray per character cell, lights the surface from the upper
 * left, and picks a character from the ramp ".:-=+*#%@" (light to shadow).
 * A final pass traces silhouettes and raised details with "@" so the shapes
 * stay readable at small sizes.
 *
 * Coordinates: x points right, y points up, and the viewer looks along +z,
 * so a feature that sits in front of a surface has a smaller z
 * (write `z + 0.17` to place a detail 0.17 in front of the origin).
 *
 * Works in Node (require) and in the browser (window.ASCII3D).
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ASCII3D = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /** Characters from lightest to darkest. */
  const RAMP = ".:-=+*#%@";
  const OUTLINE = "@";

  // Camera and lighting.
  const VIEW_SPAN = 0.96;       // half-height of the view, in model units
  const VIEW_BOUND_SQ = 1.9;    // rays outside this radius² can't hit anything
  const RAY_START = -1.6;
  const RAY_END = 1.6;
  const MAX_STEPS = 64;
  const HIT_EPSILON = 0.003;
  const STEP_SCALE = 0.7;       // under-step for SDFs that aren't exact
  const NORMAL_EPSILON = 0.01;
  const LIGHT = normalize([-0.45, 0.62, -0.64]);

  // Outline detection: a depth jump bigger than a smooth slope explains.
  const EDGE_JUMP = 0.06;
  const EDGE_EXCESS = 0.08;

  // ---------------------------------------------------------------------------
  // SDF building blocks
  // ---------------------------------------------------------------------------

  const { abs, cos, sin, sqrt, max, min, sign } = Math;

  function normalize(v) {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  const length3 = (x, y, z) => sqrt(x * x + y * y + z * z);

  /** Combine shapes. */
  const union = Math.min;
  const intersect = Math.max;
  const subtract = (a, b) => max(a, -b);
  /** Union with a rounded blend of radius k. */
  function smoothUnion(a, b, k) {
    const h = max(k - abs(a - b), 0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  /** Rotate the point (x, y) by -angle; returns [x', y']. */
  function rotate(x, y, angle) {
    const c = cos(angle), s = sin(angle);
    return [x * c + y * s, -x * s + y * c];
  }

  const sphere = (x, y, z, r) => length3(x, y, z) - r;

  function ellipsoid(x, y, z, a, b, c) {
    return (length3(x / a, y / b, z / c) - 1) * min(a, b, c);
  }

  /** Box with half-sizes (bx, by, bz) and corner radius r. */
  function roundBox(x, y, z, bx, by, bz, r) {
    const qx = abs(x) - bx + r, qy = abs(y) - by + r, qz = abs(z) - bz + r;
    return length3(max(qx, 0), max(qy, 0), max(qz, 0)) + min(max(qx, qy, qz), 0) - r;
  }

  /** Cylinder along z with radius r and half-height h. */
  function cylinderZ(x, y, z, r, h) {
    const dx = Math.hypot(x, y) - r, dz = abs(z) - h;
    return min(max(dx, dz), 0) + Math.hypot(max(dx, 0), max(dz, 0));
  }

  /** Cylinder along y with radius r and half-height h. */
  const cylinderY = (x, y, z, r, h) => cylinderZ(x, z, y, r, h);

  /** Ring in the xy plane: major radius R, tube radius r. */
  function torusZ(x, y, z, R, r) {
    const q = Math.hypot(x, y) - R;
    return Math.hypot(q, z) - r;
  }

  /** Ring in the xz plane. */
  const torusY = (x, y, z, R, r) => torusZ(x, z, y, R, r);

  /** Rounded segment from (ax, ay) to (bx, by) in the z = 0 plane. */
  function capsule(x, y, z, ax, ay, bx, by, r) {
    const px = x - ax, py = y - ay, ex = bx - ax, ey = by - ay;
    const h = max(0, min(1, (px * ex + py * ey) / (ex * ex + ey * ey)));
    return length3(px - ex * h, py - ey * h, z) - r;
  }

  /** 2D equilateral triangle, apex pointing +y, circumradius-ish size r. */
  function triangle(px, py, r) {
    const k = sqrt(3);
    px = abs(px) - r;
    py = py + r / k;
    if (px + k * py > 0) {
      const t = px;
      px = (px - k * py) / 2;
      py = (-k * t - py) / 2;
    }
    px -= max(-2 * r, min(px, 0));
    return -Math.hypot(px, py) * sign(py);
  }

  /** Give a 2D distance d a thickness of 2h along z. */
  function extrude(d, z, h) {
    const w = abs(z) - h;
    return min(max(d, w), 0) + Math.hypot(max(d, 0), max(w, 0));
  }

  const octahedron = (x, y, z, s) => (abs(x) + abs(y) + abs(z) - s) * 0.57735;

  const sdf = {
    union, intersect, subtract, smoothUnion, rotate,
    sphere, ellipsoid, roundBox, cylinderZ, cylinderY, torusZ, torusY,
    capsule, triangle, extrude, octahedron,
  };

  // ---------------------------------------------------------------------------
  // Models
  // ---------------------------------------------------------------------------

  const models = {};

  /** Add models: an object of name -> SDF function. */
  function register(newModels) {
    for (const [name, field] of Object.entries(newModels)) {
      if (typeof field !== "function") throw new TypeError(`Model "${name}" must be an SDF function`);
      models[name] = field;
    }
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  /** Spin the model by `angle` around y and tip it toward the viewer by `tilt`. */
  function orient(field, angle, tilt) {
    const ca = cos(angle), sa = sin(angle), ct = cos(tilt), st = sin(tilt);
    return (x, y, z) => {
      const y1 = y * ct + z * st, z1 = -y * st + z * ct;
      return field(x * ca - z1 * sa, y1, x * sa + z1 * ca);
    };
  }

  /** Depth of the first surface hit along the ray through (u, v), or null. */
  function march(field, u, v) {
    let z = RAY_START;
    for (let step = 0; step < MAX_STEPS; step++) {
      const d = field(u, v, z);
      if (d < HIT_EPSILON) return z;
      z += d * STEP_SCALE;
      if (z > RAY_END) break;
    }
    return null;
  }

  /** Brightness at a surface point, 0 (dark) to 1 (lit). */
  function brightness(field, u, v, z) {
    const e = NORMAL_EPSILON;
    const a1 = field(u + e, v - e, z - e), a2 = field(u - e, v - e, z + e);
    const a3 = field(u - e, v + e, z - e), a4 = field(u + e, v + e, z + e);
    const nx = a1 - a2 - a3 + a4, ny = -a1 - a2 + a3 + a4, nz = -a1 + a2 - a3 + a4;
    const len = Math.hypot(nx, ny, nz) || 1;
    const diffuse = max(0, (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / len);
    return 0.02 + 0.82 * Math.pow(diffuse, 1.4);
  }

  function shadeChar(b) {
    // The darkest ramp character is reserved for outlines.
    return RAMP.charAt(min(RAMP.length - 2, max(0, Math.floor((1 - b) * 8.999))));
  }

  /**
   * Render a model to ASCII.
   *
   * @param {string|Function} model  A registered model name or an SDF function.
   * @param {object} [options]
   * @param {number} [options.cols=50]  Characters per line.
   * @param {number} [options.rows=30]  Lines.
   * @param {number} [options.angle=-0.35]  Turn around the vertical axis, radians.
   * @param {number} [options.tilt=0.22]  Tip toward the viewer, radians.
   * @param {number} [options.cellAspect=0.6]  Character width / line height.
   * @returns {string} `rows` lines of `cols` characters, joined with "\n".
   */
  function render(model, options = {}) {
    const field = typeof model === "function" ? model : models[model];
    if (!field) throw new Error(`Unknown model "${model}"`);
    const { cols = 50, rows = 30, angle = -0.35, tilt = 0.22, cellAspect = 0.6 } = options;
    for (const [key, value] of [["cols", cols], ["rows", rows]]) {
      if (!Number.isInteger(value) || value < 1) throw new RangeError(`${key} must be a positive integer, got ${value}`);
    }
    for (const [key, value] of [["angle", angle], ["tilt", tilt], ["cellAspect", cellAspect]]) {
      if (!Number.isFinite(value)) throw new RangeError(`${key} must be a finite number, got ${value}`);
    }
    const oriented = orient(field, angle, tilt);
    const aspect = (cols * cellAspect) / rows;

    const depth = [], shade = [];
    for (let j = 0; j < rows; j++) {
      const v = (1 - ((j + 0.5) / rows) * 2) * VIEW_SPAN;
      const depthRow = new Array(cols).fill(Infinity);
      const shadeRow = new Array(cols).fill(" ");
      for (let i = 0; i < cols; i++) {
        const u = (((i + 0.5) / cols) * 2 - 1) * VIEW_SPAN * aspect;
        if (u * u + v * v > VIEW_BOUND_SQ) continue;
        const z = march(oriented, u, v);
        if (z === null) continue;
        depthRow[i] = z;
        shadeRow[i] = shadeChar(brightness(oriented, u, v, z));
      }
      depth.push(depthRow);
      shade.push(shadeRow);
    }

    const at = (j, i) => (j < 0 || i < 0 || j >= rows || i >= cols ? Infinity : depth[j][i]);
    const isEdge = (j, i) => {
      const z0 = depth[j][i];
      for (const [dj, di] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const zn = at(j + dj, i + di);
        if (zn === Infinity) return true;
        const zo = at(j - dj, i - di);
        const slope = zo === Infinity ? 0 : z0 - zo;
        if (zn - z0 > EDGE_JUMP && zn - z0 - slope > EDGE_EXCESS) return true;
      }
      return false;
    };

    const lines = [];
    for (let j = 0; j < rows; j++) {
      let line = "";
      for (let i = 0; i < cols; i++) {
        if (depth[j][i] === Infinity) line += " ";
        else line += isEdge(j, i) ? OUTLINE : shade[j][i];
      }
      lines.push(line);
    }
    return lines.join("\n");
  }

  return { RAMP, render, register, models, sdf };
});
