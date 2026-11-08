/**
 * ASCII 3D Icons — export rendered art as a finished icon.
 *
 * toSVG and toHTML wrap ASCII art (from ASCII3D.render) in the raised
 * keycap tile, so the result can go straight into Figma, Paper, pen.dev or a
 * web page. SVG text stays editable: each run of characters is its own
 * <text> element in JetBrains Mono.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ASCII3DExport = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const COLORS = {
    ink: "#141414",
    faceTop: "#FFFFFF",
    faceBottom: "#ECEBE6",
    bevel: "#DCDBD5",
  };
  const FONT_FAMILY = "'JetBrains Mono', ui-monospace, Menlo, monospace";
  const CELL_ASPECT = 0.6; // JetBrains Mono advance width / font size

  /** Tile geometry for a square icon of `size` px (matches the PNG build). */
  function tileGeometry(size) {
    const k = size / 1024;
    return {
      x: 100 * k, y: 84 * k, w: 824 * k, h: 812 * k,
      radius: 184 * k, border: 12 * k, depth: 30 * k, bevel: 26 * k,
    };
  }

  /** Font size that fits the art inside the tile face with a margin. */
  function fitFontSize(lines, geom) {
    const cols = Math.max(...lines.map((l) => l.length));
    const byWidth = (geom.w * 0.78) / (cols * CELL_ASPECT);
    const byHeight = (geom.h * 0.78) / lines.length;
    return Math.min(byWidth, byHeight);
  }

  const round = (n) => Math.round(n * 100) / 100;
  const escapeXml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /**
   * Wrap ASCII art in the keycap tile as an SVG document.
   * @param {string} art  Output of ASCII3D.render.
   * @param {object} [options]
   * @param {number} [options.size=1024]  Width and height in px.
   * @param {string} [options.title]  Accessible title.
   */
  function toSVG(art, options = {}) {
    const { size = 1024, title = "ASCII 3D icon" } = options;
    const g = tileGeometry(size);
    const lines = art.split("\n");
    const fontSize = fitFontSize(lines, g);
    const cellW = fontSize * CELL_ASPECT;
    const cols = Math.max(...lines.map((l) => l.length));
    const left = g.x + g.w / 2 - (cols * cellW) / 2;
    const top = g.y + g.h / 2 - (lines.length * fontSize) / 2;

    const runs = [];
    lines.forEach((line, j) => {
      for (const match of line.matchAll(/\S+/g)) {
        const x = round(left + match.index * cellW);
        const y = round(top + (j + 0.8) * fontSize);
        runs.push(`<text x="${x}" y="${y}">${escapeXml(match[0])}</text>`);
      }
    });

    const inner = { x: g.x + g.border, y: g.y + g.border, w: g.w - 2 * g.border, h: g.h - 2 * g.border, r: g.radius - g.border };
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img">`,
      `<title>${escapeXml(title)}</title>`,
      "<defs>",
      `<linearGradient id="face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COLORS.faceTop}"/><stop offset="1" stop-color="${COLORS.faceBottom}"/></linearGradient>`,
      `<clipPath id="face-clip"><rect x="${round(inner.x)}" y="${round(inner.y)}" width="${round(inner.w)}" height="${round(inner.h)}" rx="${round(inner.r)}"/></clipPath>`,
      "</defs>",
      `<rect x="${round(g.x)}" y="${round(g.y + g.depth)}" width="${round(g.w)}" height="${round(g.h)}" rx="${round(g.radius)}" fill="${COLORS.ink}"/>`,
      `<rect x="${round(g.x)}" y="${round(g.y)}" width="${round(g.w)}" height="${round(g.h)}" rx="${round(g.radius)}" fill="${COLORS.ink}"/>`,
      `<rect x="${round(inner.x)}" y="${round(inner.y)}" width="${round(inner.w)}" height="${round(inner.h)}" rx="${round(inner.r)}" fill="url(#face)"/>`,
      `<rect x="${round(inner.x)}" y="${round(inner.y + inner.h - g.bevel)}" width="${round(inner.w)}" height="${round(g.bevel)}" fill="${COLORS.bevel}" clip-path="url(#face-clip)"/>`,
      `<g font-family="${FONT_FAMILY}" font-weight="700" font-size="${round(fontSize)}" fill="${COLORS.ink}">`,
      ...runs,
      "</g>",
      "</svg>",
    ].join("\n");
  }

  /**
   * Wrap ASCII art in the keycap tile as an HTML fragment (inline styles only).
   * @param {string} art  Output of ASCII3D.render.
   * @param {object} [options]
   * @param {number} [options.size=180]  Tile width and height in px.
   */
  function toHTML(art, options = {}) {
    const { size = 180 } = options;
    const lines = art.split("\n");
    const border = Math.max(1.5, round(size * 0.014));
    const face = size - 2 * border;
    const fontSize = round(Math.min((face * 0.8) / (Math.max(...lines.map((l) => l.length)) * CELL_ASPECT), (face * 0.8) / lines.length));
    const tile = [
      `width:${size}px`, `height:${size}px`, "box-sizing:border-box",
      `border-radius:${round(size * 0.225)}px`, `border:${border}px solid ${COLORS.ink}`,
      `background:linear-gradient(180deg,${COLORS.faceTop},${COLORS.faceBottom})`,
      `box-shadow:inset 0 ${round(size * 0.012)}px 0 ${COLORS.faceTop},inset 0 -${round(size * 0.028)}px 0 ${COLORS.bevel},0 ${round(size * 0.04)}px 0 ${COLORS.ink}`,
      "display:flex", "align-items:center", "justify-content:center",
    ].join(";");
    const pre = [
      "margin:0", "white-space:pre", `color:${COLORS.ink}`,
      `font-family:${FONT_FAMILY.replace(/'/g, "")}`, "font-weight:700",
      `font-size:${fontSize}px`, `line-height:${fontSize}px`,
    ].join(";");
    return `<div style="${tile}"><pre aria-hidden="true" style="${pre}">${escapeXml(art)}</pre></div>`;
  }

  return { toSVG, toHTML };
});
