---
id: 002
title: Three-tool code-review agent fixture (search, review, commit)
milestone: week-1
estimate: 0.5d
depends_on: []
blocks: [001, 009]
type: build
---

## Why

The `search → review → commit` agent is the spec's canonical example used
both for the runtime guard recording and the README hero. Building it once
as a reusable fixture keeps the recording, type tests, and the README
example in lockstep so a rename or schema change updates one place.

## Scope

Author a single `examples/code-review-agent/` fixture with the three tool
schemas, a tiny `streamText` driver script, and stub model output that
deterministically attempts an out-of-order `commit` call so recordings
are reproducible.

## Acceptance criteria

- [ ] Three tool schemas declared with Zod: `search(query)`,
      `review(diff)`, `commit(message)`.
- [ ] Driver script `examples/code-review-agent/run.ts` invokes
      `streamText` with a stubbed model that emits a fixed tool-call
      sequence ending in an illegal `commit` before `review`.
- [ ] Running `pnpm tsx examples/code-review-agent/run.ts` exits non-zero
      with a guard violation in `strictMode: true`.
- [ ] No network calls — model is mocked; CI must run it offline.
- [ ] Fixture re-exported from a single entry so issues 001 and 009 both
      import it instead of duplicating schemas.

## Out of scope

- Real LLM calls (deterministic stubbed output only).
- Any UI or web surface.
- Additional example agents — one fixture only.

## Notes

Pin the Vercel AI SDK version in this folder's `package.json` and surface
that version on stdout when the script runs, so the recording timestamp
matches the `routerVersion` diagnostic later.
