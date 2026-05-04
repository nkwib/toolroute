#!/usr/bin/env node
/**
 * Build the README hero asciicast: shows both the type-level rejection
 * (tsc red squiggle) AND the runtime ToolRouteViolation in one cast.
 */
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

function captureCommand(cmd) {
  let out = '';
  try {
    out = execFileSync('sh', ['-c', `${cmd} 2>&1`], { encoding: 'utf8' });
    return { exit: 0, out };
  } catch (e) {
    return { exit: e.status ?? 1, out: e.stdout?.toString() ?? '' };
  }
}

const tsc = captureCommand(
  'npx tsc --noEmit examples/code-review-agent/illegal-call.demo.ts ' +
    '--target ES2022 --module ESNext --moduleResolution Bundler ' +
    '--strict --skipLibCheck',
);
const run = captureCommand('pnpm tsx examples/code-review-agent/run.ts');

const events = [];
let t = 0.4;

function emit(line) {
  events.push([t, 'o', `${line}\r\n`]);
  t += 0.18;
}

emit('# Step 1 — type-level: out-of-order call is a compile error');
events.push([t, 'o', '$ tsc --noEmit examples/code-review-agent/illegal-call.demo.ts\r\n']);
t += 0.4;
for (const line of tsc.out.split('\n')) {
  if (!line.trim()) continue;
  emit(line);
}
emit(`(tsc exit=${tsc.exit})`);
emit('');
emit('# Step 2 — runtime: the same call is rejected by the guard');
events.push([t, 'o', '$ pnpm tsx examples/code-review-agent/run.ts\r\n']);
t += 0.4;
for (const line of run.out.split('\n')) {
  if (!line.trim()) continue;
  emit(line);
}
emit(`(runtime exit=${run.exit})`);

const header = {
  version: 2,
  width: 110,
  height: 32,
  timestamp: 1746345600,
  title: 'ToolRoute README hero — same violation rejected at compile-time and runtime',
  env: { TERM: 'xterm-256color', SHELL: '/bin/zsh' },
};

writeFileSync(
  'assets/recordings/readme-hero.cast',
  JSON.stringify(header) + '\n' + events.map((e) => JSON.stringify(e)).join('\n') + '\n',
);
console.log(`Wrote assets/recordings/readme-hero.cast (${events.length} events)`);
