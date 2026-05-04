---
id: 009
title: README hero — three-tool example, recording, side-by-side diff
milestone: week-2
estimate: 2d
depends_on: [001, 002, 005, 006, 007]
blocks: [012]
type: docs
---

## Why

The README is the calling card. The spec mandates a complete three-tool
agent example, a recorded terminal showing the red squiggle on
out-of-order `commit`, AND a side-by-side raw-SDK vs ToolRoute diff.
Without this artefact the package has no distribution moment.

## Scope

Write the production README centred on the `code-review-agent` fixture,
embed a fresh terminal recording that shows BOTH the editor red
squiggle and the runtime guard rejecting at execution time, and paste
the side-by-side raw-SDK vs ToolRoute-wrapped diff with the narrowed
`nextAllowed` union called out.

## Acceptance criteria

- [ ] README opens with a 60-second value proposition and the embedded
      terminal recording (asciicast or mp4 in `assets/recordings/`).
- [ ] Recording shows: (a) editor red squiggle on `commit` before
      `review`, (b) `streamText` run throwing `ToolRouteViolation`
      with the diagnostic payload visible.
- [ ] Side-by-side fenced diff: left column raw Vercel AI SDK tool
      definition, right column the ToolRoute-wrapped version, with
      the `nextAllowed` line highlighted.
- [ ] Includes a "Debug" section showing `printRouterGraph` output for
      the example.
- [ ] Includes a short "Renames" note explaining that renaming a tool
      automatically updates the union (single source of truth).
- [ ] All code blocks compile against the published package — verified
      by a docs test that extracts and typechecks fenced TS blocks.

## Out of scope

- Cloudflare playground link (deferred to v2 — see 999).
- Comparison tables vs other libraries.
- Anthropic example.

## Notes

Re-record from issue 001's fixture rather than authoring a new one — the
recording must match the published API, not the spike API.
