#!/usr/bin/env node
/**
 * Issue 012 smoke test — verify a freshly built tarball installs and
 * runs end-to-end from a clean tmp dir, with the runtime guard firing.
 *
 *   pnpm build
 *   node scripts/smoke.mjs
 *
 * Exits 0 on success, 1 on guard not firing, 2 on install/runtime error.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const repoRoot = new URL('..', import.meta.url).pathname;
const dir = mkdtempSync(join(tmpdir(), 'toolroute-smoke-'));
console.log(`smoke: tmp=${dir}`);

try {
  // 1. Pack the local package into a tarball.
  const packOut = execFileSync('pnpm', ['pack', '--pack-destination', dir], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const tarball = packOut
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.endsWith('.tgz'))
    .pop();
  if (!tarball) {
    console.error('pnpm pack produced no .tgz');
    process.exit(2);
  }
  console.log(`smoke: tarball=${tarball}`);

  // 2. Spin a fresh consumer.
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify(
      {
        name: 'smoke-consumer',
        private: true,
        type: 'module',
        version: '0.0.0',
      },
      null,
      2,
    ),
  );

  execFileSync('npm', ['install', tarball, 'ai@latest', 'zod@latest', 'tsx@latest'], {
    cwd: dir,
    stdio: 'inherit',
  });

  // 3. Tiny end-to-end script using the published surface.
  writeFileSync(
    join(dir, 'use.ts'),
    `
import { defineTool, createRouterFromTools, ToolRouteViolation } from 'toolroute';
import { z } from 'zod';

const a = defineTool({
  name: 'a',
  inputSchema: z.object({}),
  nextAllowed: ['b'] as const,
  execute: async () => ({ ok: true }),
});
const b = defineTool({
  name: 'b',
  inputSchema: z.object({}),
  nextAllowed: [] as const,
  execute: async () => ({ ok: true }),
});

const router = createRouterFromTools([a, b] as const, { strictMode: true });
console.log('routerVersion=' + router.routerVersion);

const tools = router.tools as unknown as Record<
  string,
  { execute: (i: unknown, c: { toolCallId: string }) => Promise<unknown> }
>;
await tools.b.execute({}, { toolCallId: 't1' }).catch((e) => {
  if (e instanceof ToolRouteViolation) {
    console.log('GUARD_FIRED prev=' + e.prev + ' next=' + e.next);
    process.exit(0);
  }
  console.error('unexpected error', e);
  process.exit(2);
});
console.error('guard did NOT fire');
process.exit(1);
`.trim() + '\n',
  );

  const r = spawnSync('npx', ['tsx', 'use.ts'], { cwd: dir, encoding: 'utf8' });
  console.log(r.stdout);
  console.error(r.stderr);
  if (r.status !== 0) {
    console.error(`smoke: consumer script exited ${r.status}`);
    process.exit(r.status ?? 1);
  }
  console.log('smoke: PASS');
} finally {
  try {
    rmSync(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}
