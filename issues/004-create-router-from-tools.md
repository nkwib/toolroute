---
id: 004
title: createRouterFromTools with name derivation
milestone: week-1
estimate: 1d
depends_on: [003]
blocks: [005, 006, 008]
type: build
---

## Why

`createRouterFromTools([toolA, toolB])` derives tool names from the const
tool array itself — one source of truth, renames cannot drift. This is
the pivot that drove Pocock and Rauch to 9/10 in round 2 and the
conceptual centre of the package.

## Scope

Build the router constructor: takes a const tuple of `defineTool` outputs,
derives the name set from the array, validates `nextAllowed` references,
and returns a router object exposing the standard Vercel AI SDK `tools`
shape plus internal adjacency state for the runtime guard.

## Acceptance criteria

- [ ] `createRouterFromTools` accepts a readonly array of tools and
      infers the union of names from `tools[number]['name']`.
- [ ] Build-time check: every `nextAllowed` entry must match a known
      tool name; mismatch is a TypeScript error AND a thrown error at
      runtime when the router is constructed.
- [ ] Returned `router.tools` matches the Vercel AI SDK `streamText`
      `tools` parameter shape (verified by passing it to `streamText`
      in a test without a type error).
- [ ] Router exposes a `routerVersion` string built from the SDK peer
      version + the package version, used by 006's diagnostics.
- [ ] Unit test: a tool referencing an unknown name in `nextAllowed`
      throws at construction with the unknown name and the legal set.
- [ ] Type test: the inferred name union is the literal union, not
      `string`.

## Out of scope

- Per-step narrowing of `router.tools` (handled in 005).
- The runtime guard call site inside `streamText` integration (already
  spiked in 001; wired in 005/006).

## Notes

`routerVersion` format suggestion: `"toolroute@<pkg>+ai-sdk@<peer>"`.
Pin it in one place; 006 reads it.
