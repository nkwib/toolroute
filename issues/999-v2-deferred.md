---
id: 999
title: v2 deferred index — do NOT pull into v1
milestone: v2
estimate: 0.5d
depends_on: []
blocks: []
type: docs
---

## Why

`final.md` cuts several items from v1 by unanimous persona agreement.
Capturing them in a single visible index prevents quiet scope creep
back into the 2-week window and signals to early users which roadmap
items are real but not yet built.

## Scope

Maintain this issue as a living index of items deliberately deferred
to v2 of ToolRoute. Closing it requires a v2 milestone; new deferrals
discovered during v1 are appended here, not turned into separate
v1 issues.

## Acceptance criteria

- [ ] Index lists each deferred item with: short name, one-line
      rationale citing the persona/round it was cut in, and an
      "unblocks v2 if" trigger.
- [ ] Live Cloudflare playground listed (cut UNANIMOUSLY by all four
      personas in round 2; replaced by recorded terminal + side-by-side
      diff).
- [ ] Paid tier listed (Rauch round 2: "router is a calling card, not
      a revenue vehicle"; v2 monetisation sketches: hosted violation
      dashboard or playground Pro tier).
- [ ] Anthropic SDK adapter listed (kept narrow on Vercel AI SDK in v1
      to keep the calling card focused; explicitly demoted in README
      hierarchy).
- [ ] Visualiser mode for the routing graph listed (text adjacency in
      v1 via `printRouterGraph`; Mermaid/DOT renderer is v2).
- [ ] Hosted observability platform spawn (Open Question 1 in
      `final.md`) noted as out of scope for THIS package — it would
      be a separate roundtable, not a v2 of ToolRoute.

## Out of scope

- Building any of the deferred items.
- Picking a v2 start date — that gates on adoption signal, not
  calendar.

## Notes

If a v1 ticket starts pulling on a deferred item ("we just need a
small dashboard..."), the discussion belongs here, not on the v1
ticket. Treat that as a smell.
