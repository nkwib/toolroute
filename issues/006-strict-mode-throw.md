---
id: 006
title: strictMode true throws with full diagnostic payload
milestone: week-1
estimate: 0.5d
depends_on: [004]
blocks: [009]
type: build
---

## Why

When the model violates the routing graph the developer must get a loud,
self-contained error with everything support will ask for first —
offending tool, previous tool, legal next set, and `routerVersion`.
This is what makes the runtime guarantee operational, not decorative.

## Scope

Promote 001's spike guard to a public `strictMode: true` path that
throws a typed `ToolRouteViolation` error from the router-instrumented
`tools` callbacks.

## Acceptance criteria

- [ ] `ToolRouteViolation extends Error` with public readonly fields
      `prev: string | null`, `next: string`,
      `legalNext: readonly string[]`, `routerVersion: string`.
- [ ] Error `message` is a single line containing all four fields,
      formatted so a copy-paste from a terminal lands in a Sentry
      issue title cleanly.
- [ ] Unit test: running the `code-review-agent` fixture with
      `strictMode: true` throws `ToolRouteViolation` with `prev:
      'search'`, `next: 'commit'`, `legalNext: ['review']`,
      `routerVersion` non-empty.
- [ ] Unit test: first-tool violation has `prev: null` and the error
      message handles that case without printing `"null"`.
- [ ] Error class is exported from the package root.

## Out of scope

- Warn path / edge-runtime detection (007).
- Wrapping the SDK's own thrown errors — only ToolRoute-detected
  violations.

## Notes

`routerVersion` is sourced from 004; do not recompute it here.
