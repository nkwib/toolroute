---
id: 011
title: Pre-launch tweet thread with terminal recording
milestone: week-2
estimate: 0.5d
depends_on: [009]
blocks: [012]
type: launch
---

## Why

Theo and Rauch in round 2: distribution signal goes out before any
playground infra. The recording that anchored the README is also the
launch thread's hero — same artefact, two surfaces, no extra build.

## Scope

Draft the launch thread (5–7 posts) anchored on the recording, queue it
as a draft, and align the post timing with the npm publish in 012.

## Acceptance criteria

- [ ] Draft thread checked into `assets/launch/thread.md` (markdown,
      one post per `---` separator).
- [ ] Post 1: hook with the recording embedded.
- [ ] Post 2: the side-by-side diff snippet.
- [ ] Post 3: `printRouterGraph` output as a teaser for debug ergonomics.
- [ ] Post 4: install + 5-line quickstart.
- [ ] Final post: link to the npm package and the README.
- [ ] Thread reviewed for accuracy against the published API (no
      references to features that did not ship in v1).

## Out of scope

- Paid promotion / sponsored posts.
- Cross-posting to other platforms beyond the primary one (HN, Reddit
  can come later if the thread lands).

## Notes

Hold publishing until 012 confirms the package is live on npm — a thread
linking to a 404 burns the moment.
