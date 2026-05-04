# Type-safe agent state machine — Round Table Final

**Date:** 2026-05-03
**Roster:** matt-pocock, addy-osmani, theo-browne, guillermo-rauch
**Tribe:** devtools
**Rounds run:** 2

---

## TL;DR

**Ship ToolRoute (`createRouterFromTools`) — a 2-week, ~550 LOC OSS package that wraps Vercel AI SDK tool definitions so each tool declares its legal `nextAllowed` successors, enforced at compile time AND at runtime with a loud 50-line guard.** Round-2 mean 8.5 with all four personas saying "yes, share this" — the highest mean in the session, the largest round-over-round gain (+1.5), and four-persona unanimity on the playground cut. The session over-delivered: TraceState (p1) also closed at 8.0 with the same convergence shape and is recommended as a coordinated follow-on (see "Runner-up worth shipping too" below). This is a dual-promote outcome — not a horse race — because p1 and p3 sit at orthogonal layers of the same agent stack (state-machine semantics vs tool-call routing) rather than competing for the same audience.

## Ranked proposals

| Rank | Title | Mean score | Weeks-to-MVP | OSS / paid | Killer concern |
|------|-------|------------|--------------|------------|----------------|
| 1 | ToolRoute (`createRouterFromTools`) | 8.5 | 2 | OSS | Vercel AI SDK coupling — SDK tool-call shape has changed twice in 12 months; a minor upstream API change could snap the narrowing silently (3-persona overlap: Pocock, Theo, Rauch) |
| 2 | TraceState | 8.0 | 4 | OSS | Scope-honesty risk — `defineAgent` core + runtime executor + `wrapLegacyLoop` + CLI + `createStates` + comparison table + 2 SDK adapters is not 3 weeks of solo work without explicit stubs (Pocock) |
| 3 | AgentGraph | 7.25 | 5 | OSS | Rauch's hosted-first dissent persists at 5 vs the others' 8 — local-only CLI is invisible, "I'm sharing a library, not a moment"; structural disagreement preserved, not averaged |

## Runner-up worth shipping too

**TraceState (p1)** closed at 8.0 with a tight 0-deviation cluster (8/8/8/8) and is **promote-grade**, not just iterate-grade. It is not in competition with ToolRoute — it is a complementary primitive at a different layer:

- **ToolRoute** narrows the *next-tool union* turn-by-turn within a single agent run.
- **TraceState** narrows the *state-transition union* across the agent's phases (`planning → tool_call → reflect`).

A team building a production agent on Vercel AI SDK could import both: ToolRoute decides which tool fires next; TraceState decides which phase the agent is in. Pocock independently scored TraceState 9/10 in round 1 with a quote — "the `step(state, event)` narrowing story is inherently teachable" — that signals it is workshop-quality material on its own merits. The recommendation is to **ship ToolRoute first** (2 weeks, the calling card) and then ship TraceState (4 weeks, the deeper primitive) as a coordinated follow-on. See Open Questions for the "shared package vs independent libraries" decision the user must make.

## Winning proposal — deep dive

### Problem

Production agents on Vercel AI SDK fail most often at **tool ordering** — the agent calls `send_email` before `draft_email`, or `commit` before `review`. Today this is encoded in a system prompt and prayed over. The Vercel AI SDK gives you typed tools but no type-level way to express "after `search`, the only legal next tools are `read` or `finish`." That gap is filled today by a system-prompt sentence and a Sentry alert at 3am when the model ignores it.

### MVP scope (cut to the bone)

- `defineTool({ name, schema, nextAllowed: ['toolB', 'toolC'] as const })` — collocates the legality graph with the tool definition itself.
- `createRouterFromTools([toolA, toolB])` — tool names are derived from the const tool array itself, so there is one single source of truth and renames cannot drift. This is the single-source-of-truth pivot that drove Pocock and Rauch to 9/10.
- 50-line runtime guard, **built and recorded first** before any type code is written. `strictMode: true` throws with a clear error including the offending tool, the previous tool, the legal next set, AND the SDK version the router was compiled against (`routerVersion` diagnostic field).
- `strictMode: false` warns with an edge-runtime detection check that surfaces a one-time initialization warning explaining `console.warn` suppression in edge runtimes.
- `printRouterGraph(router)` debug export emits a plain-text adjacency list to stdout — zero deps, two minutes to implement, makes the routing graph inspectable without running the agent.
- Day-one README centerpiece: a complete three-tool code-review agent example (`search`, `review`, `commit`) with a recorded terminal session showing the red squiggle when you try to call `commit` before `review`, plus a side-by-side diff of raw Vercel AI SDK tool definition vs ToolRoute-wrapped version.
- `COMPATIBILITY.md` from day one — a public changelog of which Vercel AI SDK versions were tested, with a CI test against the latest SDK drop.
- **No live Cloudflare playground** in v1. All four personas independently converged on cutting it — recovered as a v2 distraction-free milestone.
- **No paid tier** in v1 — focused OSS calling card.

### Stack mapping

- **Frontend:** None for v1. The README hosts a recorded terminal GIF and a static side-by-side diff. Cloudflare playground deferred to v2.
- **Backend / data:** None. Pure types + 50-line runtime guard. No ingest endpoint, no hosted surface, no data retention.
- **AI layer:** Vercel AI SDK as the explicit primary target (peer-dep, version-pinned to a minor range with `COMPATIBILITY.md`). Anthropic SDK is adjacent scope for v2 only — explicitly not in v1 to keep the calling card narrow.
- **Auth / payments:** None. OSS MIT, no monetization surface.

### Week-by-week plan

Two weeks total. Daily-ish granularity since the scope is so tight:

- **Week 1, days 1–2:** Build the 50-line runtime guard. Wire it into a three-tool toy agent (`search`, `review`, `commit`). Record the terminal session showing `strictMode` rejecting `commit` before `review` — this is the proof-before-types artifact.
- **Week 1, days 3–4:** Layer the type machinery on top of the proven runtime. `defineTool`, `createRouterFromTools`, the per-turn union narrowing. Confirm the inferred union matches what the runtime guard rejects.
- **Week 1, day 5:** `printRouterGraph` debug export. Edge-runtime detection check + one-time init warning. `routerVersion` field on violation errors.
- **Week 2, days 1–2:** README hero — embed the recorded terminal GIF, paste the side-by-side raw-SDK vs ToolRoute-wrapped diff, write the three-tool example end-to-end.
- **Week 2, day 3:** `COMPATIBILITY.md` with the first row stamped against the current Vercel AI SDK version. CI workflow that re-runs the test suite against the latest SDK drop on a weekly cron.
- **Week 2, day 4:** Rename-handling note in README. Pre-launch tweet thread with the terminal recording (per Theo and Rauch — distribution signal before any playground infra).
- **Week 2, day 5:** Ship to npm. Post the terminal recording. Open issues for the deferred items (Cloudflare playground, Anthropic adapter) so the v2 roadmap is visible.

### OSS vs paid

OSS is the right call and all four personas confirmed it in both rounds. Quoting Rauch round 2: "the router is a calling card, not a revenue vehicle — monetization is a hosted violation dashboard or a Pro tier on the playground, both documented as v2." Theo round 2: "paid tier would be a distraction at this stage and the audience (solo devs, small teams) needs to trust it first." Monetization sketch is intentionally omitted from this final per the proposal's `oss_or_paid: oss` field.

## Persona quotes (verbatim)

> "Right — so the insight here is that `createRouterFromTools` makes the array the single source of truth, which means the type system and the runtime guard are describing the *same* thing, not two separate bets on what the developer remembered to keep in sync." — matt-pocock (round 2, ToolRoute, 9/10)

> "What if the Vercel AI SDK already knew which tool was allowed to fire next — not from a system prompt, but from the type signature itself?" — guillermo-rauch (round 2, ToolRoute, 9/10)

> "OK so here's the thing — the runtime guard going in before the types is not a minor detail, that IS the idea, and without it you're just shipping vibes.ts." — theo-browne (round 2, ToolRoute, 8/10)

> "In practice, the recorded terminal session showing the rejection fires before a single type annotation is written — that sequencing tells me the runtime guarantee is real, not just a well-intentioned compile-time lie." — addy-osmani (round 2, ToolRoute, 8/10)

> "Right — so what makes TraceState interesting isn't the state machine, it's that `.step(state, event)` genuinely *can't* compile if the transition is illegal, which means you've pushed an entire category of 3am production bug left into your editor, and that's the kind of thing I actually want to write a course around." — matt-pocock (round 1, TraceState, 9/10) — included to honor the runner-up

## Preserved dissent (cross-session pattern)

> "We built the type safety. We shipped the local replay. Now we have a library that works in silence — and in 2026, invisible tools don't compound." — guillermo-rauch (round 2, AgentGraph, 5/10)

Rauch's hosted-first dissent on AgentGraph held at 5 vs the other three personas at 8 — a 3-point structural spread, deliberately preserved rather than averaged away. The cross-session pattern note from the round-2 synthesis flags this as a stable axis (visibility-as-platform-leverage vs library-as-primitive) that has appeared in prior sessions too. The user should read this as a real design choice, not a flaw in p2. See Open Questions.

## Risks & legal flags

- **Vercel AI SDK coupling (3-persona overlap, both rounds).** SDK tool-call shape has changed mid-minor before. Mitigated by `COMPATIBILITY.md` from day one + CI test against the latest SDK drop + `routerVersion` diagnostic field on violation errors. Still the structural ceiling on the project's lifetime.
- **`strictMode: false` warn-path swallowing in edge runtimes (Addy round 2).** `console.warn` is suppressed in Vercel Edge Functions. Mitigated by an edge-runtime detection check that surfaces a one-time initialization warning at startup explaining the suppression. Not a blocker but documented explicitly.
- **Scattered `nextAllowed` readability gap (Pocock + Theo round 2).** At 7+ tools, the routing graph lives across many files. Mitigated by `printRouterGraph(router)` adjacency-list dump. Visualizer mode deferred to v2.
- **Legal/compliance:** clean across all 4 personas in both rounds. Pure OSS wrapper around a public SDK, no data retention, no third-party calls, no PII surface, no hosted ingest.

## What we killed and why

Nothing was killed in this session. All three proposals retained `status: active`:

- **p1 TraceState** — promoted at 8.0, recommended as runner-up follow-on.
- **p2 AgentGraph** — iterate at 7.25 with Rauch's structural dissent preserved at 5; deferred rather than killed because the disagreement is on direction (hosted vs local-only), not on the underlying primitive.
- **p3 ToolRoute** — promoted at 8.5, the winner.

This session over-delivered relative to the prior eval-tooling session: two clean promotes plus one deliberate iterate, no kills, four-persona agreement on the playground cut, and tribe-matching validated as a strategy (the devtools tribe shares enough technical vocabulary that pivots compose without contradiction).

## Open questions for the user

1. **Hosted observability spawn?** Rauch's hosted-first dissent on p2 mirrors the same dynamic that surfaced in Session A (and was flagged by the round-2 synthesizer as a stable cross-session axis). Does the user want to spawn a separate "hosted observability platform for AI agents" round-table from this dissent, framed explicitly as the visibility-as-platform-leverage hypothesis? It would not compete with p3 — it would compete with LangSmith / Langfuse / Helicone.
2. **Coordinated suite vs independent libraries.** Should p1 TraceState and p3 ToolRoute ship as a coordinated suite (shared `@agentstate/types` package, joint launch, cross-linked READMEs) or as independent libraries that can interop later? The convergence in the synthesis suggests they are complementary primitives, but co-launching adds scope to the 2-week ToolRoute window. A reasonable default: ship ToolRoute alone in 2 weeks, then layer TraceState on top using lessons learned, then decide on a shared package only if both have GitHub-stars-worth of pull.
3. **Vercel AI SDK lock-in posture.** 4+ personas across rounds called out the SDK coupling as a structural risk. Does the user pin to Vercel AI SDK as the primary distribution surface (current p3 default), or treat Anthropic as co-equal from day one (current p1 stance, with Anthropic-as-peer)? The current proposals are internally coherent but the user should pick the cross-portfolio posture deliberately. If Vercel-primary, the calling card is p3 and the audience is Vercel users. If Anthropic co-equal, both p1 and p3 need second-class adapters in v1, which adds scope.
4. **Trajectory discriminated union conflict (carry-over from prior session).** The previous session flagged a `Trajectory` discriminated union conflict between `@trajectory-diff/types` and `@agentassert/types`. ToolRoute will introduce a third type-import surface (`@toolroute/types` or similar) covering tool-call routing graphs. When does the user pull these into a single shared `@agentstate/types` package? Doing it before three libraries exist is premature; doing it after five exist is a breaking-change migration. The natural pull-point is when ToolRoute and TraceState are both shipped (2-3 months from now).
