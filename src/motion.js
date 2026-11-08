/**
 * ASCII 3D Icons — motion helpers.
 *
 * Everything here is a pure function of time, so any frame can be rendered
 * on its own and animations loop without seams when their periods divide
 * the loop length.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./ascii3d"));
  else root.ASCII3DMotion = factory(root.ASCII3D);
})(typeof self !== "undefined" ? self : this, function (ASCII3D) {
  "use strict";

  const TAU = Math.PI * 2;
  /** Default loop length in seconds. */
  const LOOP = 13.2;
  /** The resting view angle for every icon. */
  const REST_ANGLE = -0.35;

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  /** Ease in and out (smoothstep). */
  const smooth = (p) => p * p * (3 - 2 * p);

  /** Angular frequency that repeats exactly `cycles` times per loop. */
  function loopFrequency(cycles, loop = LOOP) {
    return (TAU * cycles) / loop;
  }

  /**
   * Gentle side-to-side turn that keeps the front readable.
   * @param {number} t  Seconds.
   * @param {object} [o]  amplitude (rad), cycles per loop, phase (rad), loop (s).
   */
  function sway(t, o = {}) {
    const { amplitude = 0.5, cycles = 2, phase = 0, loop = LOOP } = o;
    return REST_ANGLE + 0.15 + amplitude * Math.sin(t * loopFrequency(cycles, loop) + phase);
  }

  /** One full turn over progress 0..1, eased, starting and ending at rest. */
  function spin(progress) {
    return REST_ANGLE + TAU * smooth(clamp01(progress));
  }

  /** Deterministic noise in [0, 1). */
  function hash(a, b, c) {
    const x = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453;
    return x - Math.floor(x);
  }

  /**
   * Resolve art out of character noise, like an image model generating it.
   * @param {string} art  Rendered art.
   * @param {number} progress  0 = pure noise, 1 = finished art.
   * @param {object} [o]  seed (per icon, fixes which cells resolve first), frame (changes the noise).
   */
  function reveal(art, progress, o = {}) {
    const { seed = 0, frame = 0 } = o;
    const ramp = ASCII3D.RAMP;
    const p = clamp01(progress);
    return art
      .split("\n")
      .map((line, j) =>
        [...line]
          .map((ch, i) => {
            if (hash(i, j, seed) < p) return ch;
            if (ch === " ") return hash(i, j, frame + seed * 97) < (1 - p) * 0.6 ? ramp.charAt(Math.floor(hash(j, i, frame) * 6)) : " ";
            const target = ramp.indexOf(ch), noise = Math.floor(hash(j, i, frame + 7) * ramp.length);
            return ramp.charAt(Math.round(noise + (target - noise) * p));
          })
          .join(""),
      )
      .join("\n");
  }

  /** Progress through a reveal that eases out, for u = 0..1 of its duration. */
  const revealEase = (u) => 1 - Math.pow(1 - clamp01(u), 2.2);

  return { LOOP, REST_ANGLE, loopFrequency, sway, spin, reveal, revealEase, smooth, hash };
});
