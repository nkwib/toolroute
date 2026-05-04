#!/usr/bin/env node
/**
 * Generate a deterministic asciicast v2 file from captured runner output.
 *
 * Why deterministic: the cast file is committed and embedded in the README.
 * Asciinema's `rec` command samples wall-clock time and produces non-stable
 * output across runs; we want diff-stable artefacts so PR diffs against the
 * README hero are reviewable.
 *
 * Usage:
 *   node scripts/make-cast.mjs --out assets/recordings/runtime-guard-spike.cast \
 *     --title "ToolRoute runtime-guard spike" \
 *     --command "pnpm tsx examples/code-review-agent/run.ts"
 */
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { argv, exit } from 'node:process';

function arg(name, fallback) {
  const i = argv.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const v = argv[i + 1];
  if (v === undefined) {
    console.error(`Missing value for --${name}`);
    exit(2);
  }
  return v;
}

const out = arg('out');
const title = arg('title', 'ToolRoute');
const command = arg('command');
if (!out || !command) {
  console.error('Usage: make-cast.mjs --out <path> --command "<shell-command>"');
  exit(2);
}

const captured = execFileSync('sh', ['-c', `${command} 2>&1; echo "---exit=$?"`], {
  encoding: 'utf8',
});

const lines = captured.split('\n');
const events = [];
let t = 0.4; // small initial pause after prompt
events.push([0, 'o', `$ ${command}\r\n`]);
for (const line of lines) {
  if (line.startsWith('---exit=')) {
    const code = line.slice('---exit='.length);
    events.push([t, 'o', `$ echo "exit=$?"\r\nexit=${code}\r\n`]);
    break;
  }
  events.push([t, 'o', `${line}\r\n`]);
  t += 0.18;
}

const header = {
  version: 2,
  width: 100,
  height: 28,
  timestamp: 1746345600,
  title,
  env: { TERM: 'xterm-256color', SHELL: '/bin/zsh' },
};

const body =
  JSON.stringify(header) +
  '\n' +
  events.map((e) => JSON.stringify(e)).join('\n') +
  '\n';

writeFileSync(out, body);
console.log(`Wrote ${out} (${events.length} events)`);
