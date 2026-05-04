# Recordings

Asciinema v2 cast files used by the README and the issue-001 spike.

## Files

- `runtime-guard-spike.cast` — the load-bearing artefact for issue 001.
  Records `pnpm tsx examples/code-review-agent/run.ts` rejecting `commit`
  before `review` with `strictMode: true`. Re-generate with
  `node scripts/make-cast.mjs --out assets/recordings/runtime-guard-spike.cast \
   --title "ToolRoute runtime-guard spike (issue 001)" \
   --command "pnpm tsx examples/code-review-agent/run.ts"`.

  **Historical note (issue 001 acceptance):** the spike was recorded
  *before any type narrowing was wired in* — the rejection in this
  cast is purely runtime. The README hero recording below was
  re-recorded against the published (typed) API per issue 009's note:
  "Re-record from issue 001's fixture rather than authoring a new one
  — the recording must match the published API, not the spike API."
  Both casts reject the same call; the difference is whether the
  cast also shows the type-level rejection or only the runtime one.

- `readme-hero.cast` — the README hero artefact for issue 009. Shows BOTH
  the type-level red squiggle (via `tsc` on
  `examples/code-review-agent/illegal-call.demo.ts`) AND the runtime
  rejection in one cast. Re-generate with
  `node scripts/make-hero-cast.mjs`.

## Determinism

These cast files are deterministic — the generator scripts replay captured
output rather than recording wall-clock keystrokes, so committed casts
diff cleanly against re-runs. If the SDK version changes, regenerate the
cast and commit the diff.

## Playback

```bash
npx asciinema play assets/recordings/readme-hero.cast
```

For embedding in the README, this repo links the cast file directly. If
you want a hosted player, upload to https://asciinema.org and replace the
README link with the hosted ID.
