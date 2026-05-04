---
id: 012
title: npm publish and repo description
milestone: week-2
estimate: 0.5d
depends_on: [009, 010, 011]
blocks: []
type: launch
---

## Why

Week 2 day 5 of the spec: ship to npm, set the repo description to the
demo positioning, and open the v2 issues so the deferred roadmap is
visible from the moment the package is public.

## Scope

Publish the first stable version to npm, set the GitHub repo
description and topics, and confirm the install path from a clean
folder.

## Acceptance criteria

- [ ] Package published to npm under the agreed name with a real
      `README.md`, `LICENSE` (MIT), and `COMPATIBILITY.md` shipped in
      the tarball.
- [ ] `package.json` has `peerDependencies.ai` pinned to a minor range,
      `repository`, `homepage`, and `keywords` populated.
- [ ] GitHub repo description matches the one-liner from `final.md`
      ("Vercel AI SDK companion that turns tool definitions into a
      typed routing graph").
- [ ] Repo topics include `vercel-ai-sdk`, `typescript`,
      `agents`, `tool-calling`.
- [ ] Smoke test from a fresh tmp dir: `pnpm add <pkg-name>` then run
      a 10-line script using `defineTool` + `createRouterFromTools`
      and verify the runtime guard fires.
- [ ] Issue 999 (v2 deferred index) is opened on the public tracker
      so the roadmap is visible before the launch thread (011) goes
      out.

## Out of scope

- Provenance / sigstore publishing (v2 polish).
- Beta tags — this is the first stable release, not an `0.0.x` preview.

## Notes

Do not force-push or amend after publish; if a fix is needed, cut a
patch release. Treat the published version as immutable.
