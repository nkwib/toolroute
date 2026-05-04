---
id: 010
title: COMPATIBILITY.md and weekly CI test against latest Vercel AI SDK
milestone: week-2
estimate: 1d
depends_on: [005, 006]
blocks: [012]
type: infra
---

## Why

Three personas flagged Vercel AI SDK coupling as the structural ceiling
on the project's lifetime — the SDK tool-call shape changed twice in 12
months. `COMPATIBILITY.md` plus a weekly CI run against the latest SDK
drop turns a silent break into a public, dated row in a changelog.

## Scope

Author `COMPATIBILITY.md` with the first row stamped, and add a GitHub
Actions workflow that on a weekly cron installs the latest Vercel AI
SDK, runs the test suite (including 002's fixture and 005's narrowing
tests), and opens an issue automatically on failure.

## Acceptance criteria

- [ ] `COMPATIBILITY.md` at repo root with columns: SDK version, date
      tested, ToolRoute version, status (pass/fail), notes.
- [ ] First row populated with the SDK version pinned at launch.
- [ ] `.github/workflows/sdk-compat.yml` runs on `cron: '0 9 * * 1'`
      (Monday 09:00 UTC) and on manual dispatch.
- [ ] Workflow installs `ai@latest`, runs `pnpm test`, runs the
      `code-review-agent` fixture.
- [ ] On test failure the workflow opens a GitHub issue tagged
      `sdk-drift` with the failing SDK version in the title.
- [ ] On success the workflow appends a row to `COMPATIBILITY.md` via a
      bot commit (or PR if branch protection requires it).

## Out of scope

- Anthropic SDK testing (v2 only).
- Multi-version matrix beyond `latest` and the pinned peer range.
- Auto-bumping the peer range.

## Notes

The bot append is a nice-to-have; if branch protection makes it noisy,
fall back to having the workflow output a ready-to-paste row in its
summary and update the file by hand on green.
