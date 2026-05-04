---
id: 003
title: defineTool typed export
milestone: week-1
estimate: 1d
depends_on: [001]
blocks: [004, 005]
type: build
---

## Why

`defineTool({ name, schema, nextAllowed })` collocates the legality graph
with the tool definition itself — the single-source-of-truth pattern
Pocock called "genuinely teachable" and the entry point users touch
first. It is the public typed surface that 004's router consumes.

## Scope

Implement `defineTool` so callers write
`defineTool({ name: 'search', schema, nextAllowed: ['review'] as const })`
and receive a value whose `name` and `nextAllowed` are preserved as
literal types for downstream narrowing.

## Acceptance criteria

- [ ] `defineTool` accepts `{ name: string, schema: ZodTypeAny,
      nextAllowed: readonly string[] }` and returns the input typed with
      literal `name` and tuple `nextAllowed`.
- [ ] The returned value is structurally compatible with the Vercel AI
      SDK `tool()` helper output (verified by a type test using
      `expectTypeOf` or `tsd`).
- [ ] Type test: `defineTool({ name: 'search', ... }).name` narrows to
      the literal `'search'`, not `string`.
- [ ] Type test: `nextAllowed` retains its tuple type, not
      `string[]`.
- [ ] Unit test: runtime shape passes through the Zod schema unchanged.
- [ ] No call sites yet — issue 004 wires this into the router.

## Out of scope

- Validating that `nextAllowed` references real tools (cross-tool
  validation lives in 004 once an array of tools is available).
- Per-step narrowing (handled in 005).

## Notes

Do not introduce a separate name registry — the `name` field on the tool
itself is the single source of truth, per the round-2 rename pivot.
