# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed

- `createRouterFromTools` now throws `[ToolRoute] Tool '<name>' lists '<successor>'
  more than once in nextAllowed.` instead of silently deduping. A duplicate
  successor was the one malformed input that was accepted at construction
  while every other bad shape (unknown tool, duplicate tool name) already
  threw; this is a behavior change for any config that relied on the old
  silent dedup.
- `nextTools(router, null)` now calls `legalNextFor(router.adjacency, null)`
  instead of recomputing the entry-tool set with a second copy of the same
  filter. No observable output changed; this removes the risk of the two
  functions drifting apart.

## 0.2.2

### Fixed

- Widened `peerDependencies.ai` to `>=6.0.0 <8`. Verified the full suite
  against both the locked `ai@6.0.174` and `ai@7.0.107`: `LanguageModelV3`
  requires the raw stream's `finish` part to carry
  `finishReason: { unified, raw }` instead of a bare string. The router and
  guard (`src/guard.ts`, `src/router.ts`, `src/narrow.ts`) never touch that
  shape and needed no change; only the hand-rolled mock in
  `examples/code-review-agent/run.ts` did. Closes #6, #7, #8, #9.
- `.github/workflows/sdk-compat.yml`: the weekly test step had
  `continue-on-error: true`, so every run since 2026-08-24 filed an
  `sdk-drift` issue while still reporting green. The test step now fails
  the job for real; the issue-filing step runs on `if: failure()`.

## 0.2.1

Audit hardening pass. No public API changes.

### Fixed

- `TOOLROUTE_VERSION` was still `'0.1.0'` while the package shipped as
  `0.2.0`, so every runtime `routerVersion` diagnostic mislabelled the
  version. It is now kept in lockstep with `package.json` (a unit test
  asserts the const matches) so a release can no longer drift it.
- `tsup` no longer strips the `node:` import prefix (`removeNodeProtocol: false`).
  The previous build rewrote `node:module` to bare `module`, which breaks
  Cloudflare Workers `nodejs_compat`.
- `package.json#repository.url` now uses the canonical
  `git+https://github.com/nkwib/toolroute.git` form.

### Changed

- CI now runs `pnpm smoke` (the dist-tarball consumer test) after build.
- Documented two known limitations in the README: a router instance holds
  one `state.prev` (use one router per concurrent run, or `reset()` between
  sequential runs), and entry tools are those with a non-empty
  `nextAllowed` (a terminal tool can never be the first call, by design).
- Docs site: version badges are now generated from the root `package.json`,
  the changelog and compatibility tables carry the `0.2.0` rows, and stale
  `toolroute@0.1.0` example output was refreshed to `0.2.0`.

## 0.2.0 — 2026-05-06

### Changed

- `createRouterFromTools` now throws at construction when no tool is reachable as
  an entry point (every tool listed under another tool's `nextAllowed`). The
  previous behaviour silently produced a router that would throw on every call.
- Adjacency entries with duplicate names in `nextAllowed` are now de-duplicated
  (preserving first-seen order). `printRouterGraph` no longer emits duplicates.
- `legalNextFor(null)` now returns entry tools in insertion order, matching
  `nextTools(router, null)`.

### Fixed

- Replaced `as never` cast in `router.ts` with a properly typed cast.
- `.gitignore` now ignores `.env` / `.env.*` (with `!.env.example`).

## 0.1.0 — 2026-05-04

Initial public release. Treated as a pre-1.0 calling card; a 1.0.0 cut
will follow once the API has been used in anger.

- `defineTool({ name, inputSchema, nextAllowed, execute })` — collocates
  the legality graph with the tool itself.
- `createRouterFromTools(tools, options)` — derives the name set from
  the tool array; one source of truth.
- Per-step narrowing helper `nextTools(router, prevName)` and the
  underlying `NextTools<R, Prev>` type.
- `ToolRouteViolation` with `prev` / `next` / `legalNext` /
  `routerVersion` diagnostic fields. `strictMode: true` throws,
  `strictMode: false` warns.
- Edge-runtime detection (Vercel Edge, Cloudflare Workers,
  `NEXT_RUNTIME=edge`) with a one-time init warning.
- `printRouterGraph(router)` — deterministic plain-text adjacency dump,
  zero deps.
- `COMPATIBILITY.md` row stamped against `ai@6.0.174`. Weekly CI cron
  runs the suite against `ai@latest`; failures open an issue tagged
  `sdk-drift`.
- Static demo terminals on the docs site showing both type-level red
  squiggle and runtime `ToolRouteViolation` for the same offending call.
  Cast files committed at `assets/recordings/` for `npx asciinema play`.
