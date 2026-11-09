#!/usr/bin/env node
/**
 * Render models from the terminal.
 *
 *   node src/cli.js                            list every model
 *   node src/cli.js gear                       print one model as text
 *   node src/cli.js gear --angle 0.4 --cols 70 --rows 40
 *   node src/cli.js gear --format svg > gear.svg
 *   node src/cli.js gear globe --format html   keycap tiles for a web page
 *   node src/cli.js --all --format svg --out icons/svg
 *   node src/cli.js gear globe --format json   { model: art } (used by the build)
 *   node src/cli.js gear --motion turn --fps 25    { model: [frames] } for one loop of a motion
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ASCII3D = require("./ascii3d");
const Motion = require("./motion");
const { toSVG, toHTML } = require("./export");
require("./models");

const FORMATS = ["text", "svg", "html", "json"];
const NUMBER_OPTIONS = ["--cols", "--rows", "--angle", "--tilt", "--size", "--fps", "--seconds"];
const MOTIONS = ["turn", "spin", "sway", "generate"];
const USAGE = `usage: node src/cli.js [model ...] [--all] [--format ${FORMATS.join("|")}] [--out DIR]
                      [--cols N] [--rows N] [--angle RAD] [--tilt RAD] [--size PX]
                      [--motion ${MOTIONS.join("|")}] [--fps N] [--seconds S]`;

function parseArgs(argv) {
  const opts = { names: [], format: "text", out: null, all: false, help: false, render: {}, size: undefined, motion: null, fps: 25, seconds: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") opts.help = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--format") opts.format = argv[++i];
    else if (arg === "--motion") opts.motion = argv[++i];
    else if (arg === "--out") {
      opts.out = argv[++i];
      if (!opts.out) throw new Error("--out needs a directory");
    }
    else if (NUMBER_OPTIONS.includes(arg)) {
      const value = Number(argv[++i]);
      if (!Number.isFinite(value)) throw new Error(`${arg} needs a number`);
      if (["--cols", "--rows", "--size"].includes(arg) && !(Number.isInteger(value) && value > 0)) {
        throw new Error(`${arg} needs a positive whole number`);
      }
      if (["--fps", "--seconds"].includes(arg) && !(value > 0)) throw new Error(`${arg} needs a positive number`);
      if (arg === "--size") opts.size = value;
      else if (arg === "--fps") opts.fps = value;
      else if (arg === "--seconds") opts.seconds = value;
      else opts.render[arg.slice(2)] = value;
    } else if (arg.startsWith("-")) throw new Error(`unknown option ${arg}`);
    else opts.names.push(arg);
  }
  if (!FORMATS.includes(opts.format)) throw new Error(`--format must be one of ${FORMATS.join(", ")}`);
  if (opts.out && !["svg", "html", "text"].includes(opts.format)) throw new Error("--out works with svg, html or text");
  if (opts.motion !== null) {
    if (!MOTIONS.includes(opts.motion)) throw new Error(`--motion must be one of ${MOTIONS.join(", ")}`);
    if (opts.format !== "json") throw new Error("--motion writes frames as JSON: add --format json");
  }
  return opts;
}

/** Default length of one seamless loop of each motion, in seconds. */
const MOTION_SECONDS = { turn: Motion.TURN_PERIOD, spin: Motion.TURN_PERIOD, sway: Motion.LOOP, generate: Motion.GENERATE_CYCLE };

/** Every frame of one loop of a motion, as rendered art. */
function motionFrames(name, opts, index) {
  const seconds = opts.seconds ?? MOTION_SECONDS[opts.motion];
  const count = Math.round(seconds * opts.fps);
  const frames = [];
  for (let k = 0; k < count; k++) {
    const t = k / opts.fps;
    if (opts.motion === "generate") {
      const g = Motion.generate(t);
      const art = ASCII3D.render(name, { ...opts.render, angle: g.angle });
      frames.push(Motion.reveal(art, g.progress, { seed: index, frame: g.frame }));
      continue;
    }
    const angle = opts.motion === "turn" ? Motion.turn(t, { period: seconds }) : opts.motion === "spin" ? Motion.spin(t / seconds) : Motion.sway(t, { loop: seconds });
    frames.push(ASCII3D.render(name, { ...opts.render, angle }));
  }
  return frames;
}

/** Turn rendered art into the requested format. */
function formatArt(name, art, opts) {
  if (opts.format === "svg") return toSVG(art, { size: opts.size, title: name });
  if (opts.format === "html") return toHTML(art, { size: opts.size, title: name });
  return art;
}

function run(opts) {
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }
  const names = opts.all ? Object.keys(ASCII3D.models).sort() : opts.names;
  if (!names.length) {
    console.log(Object.keys(ASCII3D.models).sort().join("\n"));
    return 0;
  }
  const unknown = names.filter((n) => !(n in ASCII3D.models));
  if (unknown.length) {
    console.error(`unknown model: ${unknown.join(", ")} (run without arguments to list models)`);
    return 1;
  }

  if (opts.format === "json") {
    const out = {};
    names.forEach((name, i) => {
      out[name] = opts.motion ? motionFrames(name, opts, i) : ASCII3D.render(name, opts.render);
    });
    process.stdout.write(JSON.stringify(out));
    return 0;
  }

  if (opts.out) {
    fs.mkdirSync(opts.out, { recursive: true });
    const ext = opts.format === "text" ? "txt" : opts.format;
    for (const name of names) {
      const file = path.join(opts.out, `${name}.${ext}`);
      fs.writeFileSync(file, formatArt(name, ASCII3D.render(name, opts.render), opts) + "\n");
      console.log(file);
    }
    return 0;
  }

  const blocks = names.map((name) => {
    const body = formatArt(name, ASCII3D.render(name, opts.render), opts);
    return opts.format === "text" ? `${name}\n${body}\n` : body;
  });
  console.log(blocks.join("\n"));
  return 0;
}

function main(argv = process.argv.slice(2)) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    console.error(`${err.message}\n${USAGE}`);
    return 2;
  }
  return run(opts);
}

if (require.main === module) process.exitCode = main();

module.exports = { parseArgs, main };
