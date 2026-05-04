---
id: 001
title: Runtime guard spike — recorded terminal session
milestone: week-1
estimate: 2d
depends_on: []
blocks: [003, 004, 005, 006, 007, 009]
type: build
---

## Why

`final.md` is explicit: "the runtime guard going in before the types is not
a minor detail, that IS the idea, and without it you're just shipping
vibes.ts." The runtime rejection must be observable on a real agent run
before any type code is written, so the narrowing reflects observable
behaviour rather than a compile-time lie.

## Scope

Implement the ~50-line runtime guard and prove it with a recorded terminal
session of `strictMode: true` rejecting `commit` before `review` on the
toy three-tool agent — no type narrowing, no public API yet, just the
guard plus enough glue to run.

## Acceptance criteria

- [ ] Guard module under 60 LOC that takes `(prevToolName, nextToolName,
      adjacency)` and throws or warns based on `strictMode`.
- [ ] Throw path includes `prev`, `next`, `legalNext`, and `routerVersion`
      fields on the error object (asserted in a unit test).
- [ ] Warn path emits a single line via `console.warn` (asserted in a
      unit test that captures stdio).
- [ ] Adjacency map is a plain `Record<string, readonly string[]>` —
      no class, no builder yet.
- [ ] Recorded terminal session (asciicast or mp4) committed at
      `assets/recordings/runtime-guard-spike.cast` showing a real
      `streamText` run rejecting `commit` before `review`.
- [ ] README of the spike folder links to the recording and states
      "types not yet wired" explicitly.

## Out of scope

- `defineTool` / `createRouterFromTools` public API (handled in 003/004).
- Type narrowing of any kind.
- Edge-runtime detection (handled in 007).

## Notes

The recording is the load-bearing artefact for issue 009's README hero;
keep the toy agent script reusable so the same fixture can be reused
once the typed API lands.
