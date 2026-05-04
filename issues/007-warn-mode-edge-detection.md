---
id: 007
title: strictMode false warn path with edge-runtime detection
milestone: week-1
estimate: 1d
depends_on: [004]
blocks: [009]
type: build
---

## Why

Addy's round-2 concern: `console.warn` is suppressed in Vercel Edge
Functions, so a silent warn-mode would lose violations exactly where
they matter. The spec mandates a one-time init warning surfacing the
suppression caveat at startup.

## Scope

Implement `strictMode: false` warn path and an edge-runtime detection
check that emits a single one-time initialisation warning when the
router is constructed in a detected edge runtime.

## Acceptance criteria

- [ ] `strictMode: false` (default) emits one `console.warn` per
      violation containing the same fields as 006's error message.
- [ ] Edge-runtime detection: probe for
      `globalThis.EdgeRuntime` / `process.env.NEXT_RUNTIME === 'edge'`
      / Cloudflare worker globals.
- [ ] On detection, exactly one `console.warn` at router construction
      explains: `console.warn` may be suppressed in this runtime,
      pipe runtime logs to capture violations.
- [ ] The init warning fires at most once per router instance (asserted
      with a test that constructs two routers and counts warn calls).
- [ ] Unit test: detection returns false in a plain Node test env, true
      with `globalThis.EdgeRuntime` mocked, true with `NEXT_RUNTIME`
      env mocked.

## Out of scope

- Auto-piping logs anywhere (out of scope per spec — this is a warning,
  not a fix).
- Per-violation deduplication (each violation warns).

## Notes

Detection must not crash in any runtime — wrap globalThis access in a
try/catch and fail open (skip warning) rather than throw.
