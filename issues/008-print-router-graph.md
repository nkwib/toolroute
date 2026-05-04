---
id: 008
title: printRouterGraph debug export
milestone: week-1
estimate: 0.5d
depends_on: [004]
blocks: []
type: build
---

## Why

Patches the "scattered `nextAllowed` readability gap" Pocock and Theo
flagged: at 7+ tools the graph lives across many files. A plain-text
adjacency dump makes the graph inspectable without running the agent
and without pulling in any deps.

## Scope

Implement `printRouterGraph(router): string` returning a deterministic
plain-text adjacency list, and re-export it from the package root.

## Acceptance criteria

- [ ] Exports `printRouterGraph(router): string` (returns string, does
      not write to stdout itself — caller decides).
- [ ] Output format: one line per tool, `name -> next1, next2` with
      tools sorted alphabetically and `nextAllowed` sorted within each
      line, so output is diff-stable.
- [ ] Tools with empty `nextAllowed` print as `name -> (terminal)`.
- [ ] Zero new runtime dependencies (verified by checking the bundled
      dependency graph in the test).
- [ ] Unit test: snapshot of the `code-review-agent` fixture's graph
      output stays stable across runs.
- [ ] README documents it under a "Debug" sub-heading once issue 009
      lands.

## Out of scope

- Mermaid/DOT/visual rendering — text only.
- A CLI binary — caller does `console.log(printRouterGraph(router))`.

## Notes

Two-minute implementation per the spec; do not gold-plate.
