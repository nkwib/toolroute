---
id: 005
title: Per-step narrowing of the SDK tools object
milestone: week-1
estimate: 2d
depends_on: [004]
blocks: [009]
type: build
---

## Why

Without per-step narrowing the package is just a runtime checker. The
spec calls out "the union of permitted tools narrows per step based on
the prior tool call" as the core type-level promise — this is what
produces the red squiggle in the README hero recording.

## Scope

Layer type narrowing on top of `createRouterFromTools` so that, given a
prior tool call, the type of the next legal `tools` subset is the
intersection of the SDK shape and the `nextAllowed` of the prior tool.

## Acceptance criteria

- [ ] Helper type `NextTools<Router, PrevName>` resolves to the subset
      of `Router['tools']` whose keys are in
      `Tool<PrevName>['nextAllowed']`.
- [ ] Type test: with prev=`'search'` and `nextAllowed: ['review']`,
      attempting to call `commit` is a type error at the call site.
- [ ] Type test: with prev=`'review'`, calling `commit` typechecks.
- [ ] Type test: with no prior call (start of run), the legal set is
      every tool whose `nextAllowed` is non-empty (i.e. every entry
      tool) — verify with a snapshot type test.
- [ ] Inferred narrowing exactly matches what 001's runtime guard
      rejects on the `code-review-agent` fixture (verified by a single
      test that runs the fixture and asserts both layers reject the
      same call).

## Out of scope

- Strict-mode and warn-mode error payloads (006/007).
- Graph printing (008).

## Notes

Do NOT introduce a `/compat` subpath or sidecar wrapper — narrowing must
ride on the standard `tools` object the SDK already accepts. If the SDK
shape forces a workaround, raise it as a comment on this issue rather
than papering over with a subpath export.
