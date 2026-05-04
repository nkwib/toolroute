# ToolRoute — Kickoff

## What this project is

OSS TypeScript npm package, ~550 LOC. Wraps Vercel AI SDK tool definitions so each tool declares its legal `nextAllowed` successors. Compile-time narrowing of the per-step tools union, plus a 50-line runtime guard that throws (or warns) on out-of-order calls. Day-one launch artefact: a recorded terminal session showing the red squiggle when a three-tool code-review agent (`search`, `review`, `commit`) tries to call `commit` before `review`.

**Target ship: 2 weeks. Solo. OSS. No paid tier in v1.**

## Where to look first

```
context/
  final.md              # spec + week-by-week plan — start here
  proposals.json        # full p3 (ToolRoute) scope, plus p1/p2 for adjacent context
  topic.md              # original constraints from the roundtable
  round-1/, round-2/    # persona feedback on p3 only — open if final.md is ambiguous
issues/
  001 … 012             # 12 starter issues, milestone-tagged week-1 / week-2
  999-v2-deferred.md    # explicit non-goals (Cloudflare playground, paid tier, Anthropic adapter)
```

## First action

Open `issues/001-runtime-guard-spike.md` and start there. The runtime-guard-before-types ordering is non-negotiable per `final.md`: the recorded terminal session of a real agent rejection is the load-bearing artefact for the README hero (issue 009) and for proving the type narrowing reflects observable behaviour rather than a compile-time lie.

Issue dependency chain at a glance:

```
001 (runtime guard spike)
 └─► 002 (toy agent fixture)
      └─► 003 (defineTool)
           └─► 004 (createRouterFromTools)
                └─► 005 (per-step narrowing)
                     ├─► 006 (strictMode throw)
                     ├─► 007 (warn + edge detection)
                     └─► 008 (printRouterGraph)
                          └─► 009 (README hero)
                               ├─► 010 (COMPATIBILITY.md + CI)
                               ├─► 011 (launch thread)
                               └─► 012 (npm publish)
```

## Issue generation note

These issues were generated automatically from `context/final.md`. The build plan in `final.md` was already crystallized after two roundtable rounds — no upstream design-clarification skill was needed. If a decision feels under-specified mid-implementation, prefer reading the relevant persona feedback in `context/round-2/p3.*.md` over restarting design from scratch.

## Guardrails (non-negotiable)

- **Solo-shippable in ≤ 2 weeks.** If a ticket grows past its estimate, cut scope inside the ticket — do not spawn follow-on tickets that push the ship date.
- **No `/compat` subpaths.** ESM-first; CJS interop only via standard package.json `exports`. The user's ADR style refuses tooling-workaround subpaths.
- **No tests-as-separate-tickets.** Tests live inside each build issue's acceptance criteria.
- **No hosted dashboards, no telemetry, no paid tier.** All in `999-v2-deferred.md` for a reason.
- **Legal-clean, no PII.** Trivially satisfied — this is a library, not a service.

## What success looks like

- `npm install toolroute` works.
- README hero is the recorded red-squiggle terminal session, not prose.
- A solo dev can wrap an existing Vercel AI SDK tool array and get the narrowing in under 5 minutes (the "time-to-first-squiggle" benchmark in `final.md`).
- `COMPATIBILITY.md` exists from day one with a CI cron pinned to the latest Vercel AI SDK release.
