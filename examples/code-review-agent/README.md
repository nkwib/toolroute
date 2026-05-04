# `code-review-agent` fixture

A reusable three-tool fixture used by:

- Issue 001 — runtime-guard spike recording.
- Issue 005 — narrowing-vs-runtime parity test.
- Issue 009 — README hero recording.

## Layout

- `tools.ts` — Zod-schema tool defs (`search`, `review`, `commit`).
- `run.ts` — deterministic stub driver. No network calls. Always tries to
  call `commit` immediately after `search`, which is illegal.

## Run it

```bash
pnpm tsx examples/code-review-agent/run.ts            # strictMode: true (default) — exits 1
TOOLROUTE_STRICT=0 pnpm tsx examples/code-review-agent/run.ts   # strictMode: false — warns
```

## Why deterministic

Recording the runtime guard requires reproducible output. A real LLM is
non-deterministic; a stubbed sequence guarantees the recording shows the
exact same violation every time, with the same `routerVersion` line.
