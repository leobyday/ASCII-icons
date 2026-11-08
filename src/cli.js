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
 */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const ASCII3D = require("./ascii3d");
const { toSVG, toHTML } = require("./export");
require("./models");

const FORMATS = ["text", "svg", "html", "json"];
const NUMBER_OPTIONS = ["--cols", "--rows", "--angle", "--tilt", "--size"];
const USAGE = `usage: node src/cli.js [model ...] [--all] [--format ${FORMATS.join("|")}] [--out DIR]
                      [--cols N] [--rows N] [--angle RAD] [--tilt RAD] [--size PX]`;

function parseArgs(argv) {
  const opts = { names: [], format: "text", out: null, all: false, help: false, render: {}, size: undefined };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") opts.help = true;
    else if (arg === "--all") opts.all = true;
    else if (arg === "--format") opts.format = argv[++i];
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
      if (arg === "--size") opts.size = value;
      else opts.render[arg.slice(2)] = value;
    } else if (arg.startsWith("-")) throw new Error(`unknown option ${arg}`);
    else opts.names.push(arg);
  }
  if (!FORMATS.includes(opts.format)) throw new Error(`--format must be one of ${FORMATS.join(", ")}`);
  if (opts.out && !["svg", "html", "text"].includes(opts.format)) throw new Error("--out works with svg, html or text");
  return opts;
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
    for (const name of names) out[name] = ASCII3D.render(name, opts.render);
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
