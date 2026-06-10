import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { TOOLROUTE_VERSION } from '../src/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(resolve(here, '..', 'package.json'), 'utf8'),
) as { version: string };

describe('TOOLROUTE_VERSION', () => {
  it('matches the version in package.json', () => {
    // Guards against the const drifting from package.json on a release.
    // The runtime routerVersion diagnostic is derived from this const, so
    // a mismatch would mislabel every ToolRouteViolation.
    expect(TOOLROUTE_VERSION).toBe(pkg.version);
  });
});
