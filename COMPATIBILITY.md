# Compatibility

ToolRoute pins to a peer range of the Vercel AI SDK. The structural
ceiling on the project's lifetime is the SDK's tool-call shape — it has
changed twice in the last 12 months — so this file is the public,
dated changelog of what we test against.

A weekly CI cron (Mondays at 09:00 UTC, see
`.github/workflows/sdk-compat.yml`) re-runs the suite against the
latest published `ai` version. On failure the workflow opens an issue
tagged `sdk-drift` so the break is visible.

## Tested versions

| SDK (`ai`) | Date tested | ToolRoute | Status | Notes |
|------------|-------------|-----------|--------|-------|
| 7.0.107 | 2026-09-19 | 0.2.2 | ✅ pass | `LanguageModelV3` requires the raw model stream's `finish` part to carry `finishReason: { unified, raw }` instead of a bare string. Router/guard code (`src/guard.ts`, `src/router.ts`, `src/narrow.ts`) is unaffected; only the hand-rolled mock in `examples/code-review-agent/run.ts` needed the new shape. |
| 6.0.193 | 2026-06-01 | 0.2.0 | ✅ pass | Weekly cron. |
| 6.0.174    | 2026-05-04  | 0.1.0     | ✅ pass | Launch row. Tool-set shape: `inputSchema: FlexibleSchema<INPUT>`, `execute: ToolExecuteFunction<INPUT, OUTPUT>` (optional). |

## How to add a row

The CI workflow appends rows automatically on green. If branch
protection blocks the bot commit, paste the workflow's summary line
into the table by hand and merge as a docs PR.

## What "pass" means

A row is `✅ pass` when:

1. `pnpm typecheck` succeeds against the SDK version.
2. `pnpm test` is green (40 tests including type tests).
3. `pnpm tsx examples/code-review-agent/run.ts` exits non-zero with a
   `ToolRouteViolation` containing the SDK version in `routerVersion`.

A row is `⚠️ partial` when the suite passes but a known shape change
required a documented workaround (linked in Notes).

A row is `❌ fail` when the suite breaks. The `sdk-drift` issue is the
authoritative place for the diagnosis.

## Pinned peer range

`package.json#peerDependencies.ai`:

```json
{ "ai": ">=6.0.0 <8" }
```

Bumping the major requires a ToolRoute major; the
`routerVersion` diagnostic field on every `ToolRouteViolation` makes
that boundary loud at runtime.
