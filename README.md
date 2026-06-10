# ToolRoute

> Vercel AI SDK companion that turns tool definitions into a typed routing graph.

**[📚 Docs site](https://toolroute.pages.dev/)** · **[Quickstart](https://toolroute.pages.dev/docs#quickstart)** · **[API reference](https://toolroute.pages.dev/api)** · **[Before / after](https://toolroute.pages.dev/before-after)** · **[Decisions](https://toolroute.pages.dev/decisions)**

Production agents fail most often at **tool ordering** — the model calls
`send_email` before `draft_email`, or `commit` before `review`. Today
that's a system-prompt sentence and a Sentry alert at 3am. ToolRoute
turns it into a compile-time error AND a runtime guard that throws.

```ts
defineTool({ name: 'commit', nextAllowed: [], ... })
```

That's it. The tool itself declares its legal successors. ToolRoute
narrows the SDK `tools` union per step so the wrong tool can't compile,
and a 50-line runtime guard catches the model when it tries anyway.

## The 60-second hero

[**▶ Watch the recording**](./assets/recordings/readme-hero.cast)
*(`assets/recordings/readme-hero.cast` — `npx asciinema play` it locally)*

The recording shows two things on the same offending call (`commit`
before `review`):

1. **Type-level rejection.** `tsc` flags the call site — `'commit' does
   not exist in type '{ review: SDKToolFor<...> }'`.
2. **Runtime rejection.** The same code, run anyway, throws
   `ToolRouteViolation: 'commit' called after 'search'; legal next:
   [review] (toolroute@0.1.0+ai-sdk@6.0.x)`.

Both layers describe the **same** rejection because both read the same
`nextAllowed` array — there is no second source of truth to drift.

## Install

```bash
pnpm add toolroute
# peer deps:
pnpm add ai zod
```

## 5-line quickstart

```ts
import { defineTool, createRouterFromTools } from 'toolroute';
import { streamText } from 'ai';
import { z } from 'zod';

const search = defineTool({
  name: 'search',
  inputSchema: z.object({ query: z.string() }),
  nextAllowed: ['review'] as const,
  execute: async ({ query }) => ({ hits: [`match for ${query}`] }),
});

const review = defineTool({
  name: 'review',
  inputSchema: z.object({ diff: z.string() }),
  nextAllowed: ['commit'] as const,
  execute: async ({ diff }) => ({ ok: true, notes: diff.slice(0, 80) }),
});

const commit = defineTool({
  name: 'commit',
  inputSchema: z.object({ message: z.string() }),
  nextAllowed: [] as const,
  execute: async ({ message }) => ({ sha: 'deadbeef', message }),
});

const router = createRouterFromTools([search, review, commit] as const, {
  strictMode: true,
});

await streamText({ model, tools: router.tools, prompt: '...' });
```

If the model decides to call `commit` before `review`, the wrapped
`execute` throws `ToolRouteViolation` with `prev: 'search'`,
`next: 'commit'`, `legalNext: ['review']`, and the `routerVersion` you
were compiled against.

## Side-by-side: raw Vercel AI SDK vs ToolRoute

```diff
  import { tool, streamText } from 'ai';
+ import { defineTool, createRouterFromTools } from 'toolroute';
  import { z } from 'zod';

- const search = tool({
+ const search = defineTool({
+   name: 'search',
+   nextAllowed: ['review'] as const,
    description: 'Search the repository for files relevant to the change.',
    inputSchema: z.object({ query: z.string() }),
    execute: async ({ query }) => ({ hits: [...] }),
  });

  // ... review, commit similarly wrapped ...

- await streamText({ model, tools: { search, review, commit }, prompt });
+ const router = createRouterFromTools([search, review, commit] as const, {
+   strictMode: true,
+ });
+ await streamText({ model, tools: router.tools, prompt });
```

The single change you make at each tool site is `nextAllowed`. The
single change you make at the call site is wrapping `tools` in a
router. Both layers — type-level narrowing and runtime guard — read
that one `nextAllowed` array.

## Per-step narrowing

If you drive the agent yourself (a manual loop instead of `streamText`'s
multi-step), `nextTools(router, prevName)` gives you the narrowed legal
subset:

```ts
import { nextTools } from 'toolroute';

await streamText({ model, tools: nextTools(router, null) });   // entry tools
await streamText({ model, tools: nextTools(router, 'search') }); // { review }
await streamText({ model, tools: nextTools(router, 'review') }); // { commit }
```

At the type level, `NextTools<typeof router, 'search'>` is exactly
`{ review: SDKToolFor<typeof review> }` — `commit` is unreachable from
the type. The red squiggle in the hero recording is that exclusion.

## Debug

```ts
import { printRouterGraph } from 'toolroute';

console.log(printRouterGraph(router));
//=> commit -> (terminal)
//   review -> commit
//   search -> review
```

Plain text, sorted, zero deps. At 7+ tools the routing graph lives
across files; this dump is your single-screen view.

## Renames

`createRouterFromTools` derives the name set from the tool array
itself, so renaming a tool in one place propagates everywhere:

```ts
// rename `review` -> `inspect` at the tool definition site:
const inspect = defineTool({ name: 'inspect', nextAllowed: ['commit'], ... });

// every other tool that listed `'review'` in nextAllowed is now a
// TypeScript error at *its* definition site, not yours.
```

There is exactly one source of truth (the `name` field on the tool).
There is no separate registry to keep in sync.

## strictMode

```ts
createRouterFromTools(tools, { strictMode: true });   // throws on violation
createRouterFromTools(tools, { strictMode: false });  // warns on violation (default)
```

Warn mode is the default because some agent flows are recoverable. Throw
mode is the production setting once you trust your graph.

### Edge runtime warning

`console.warn` is suppressed in Vercel Edge Functions and Cloudflare
Workers. ToolRoute detects this at router construction and emits a
one-time init warning:

```text
[ToolRoute] Edge runtime detected. console.warn may be suppressed;
pipe runtime logs to capture violations.
```

Pipe `warn:` to your own log sink in those environments:

```ts
createRouterFromTools(tools, {
  strictMode: false,
  warn: (msg) => myLogger.warn(msg),
});
```

## SDK compatibility

ToolRoute pins to a peer range of the Vercel AI SDK. See
[`COMPATIBILITY.md`](./COMPATIBILITY.md) for the dated row of every
version we test against — a weekly CI cron re-runs the suite against
`ai@latest` and opens an issue tagged `sdk-drift` if anything breaks.

## Errors

`ToolRouteViolation extends Error` exposes:

- `prev: string | null` — the previous tool, or `null` at start of run.
- `next: string` — the offending tool the model wanted to call.
- `legalNext: readonly string[]` — what was allowed.
- `routerVersion: string` — `toolroute@<pkg>+ai-sdk@<peer>`. Paste this
  into a Sentry title; the dashboard will tell you which SDK version
  was on the box.

The `message` is single-line so a copy-paste from a terminal lands
cleanly in an issue title.

## Pairs well with tapedeck

[`tapedeck`](https://github.com/nkwib/tapedeck) is the sibling package:
record/replay middleware for the same SDK. Guard trajectories in
production with ToolRoute, replay model calls offline in CI with
tapedeck, and assert the recorded trajectory against your router with
the `toFollowRoute()` matcher from `tapedeck/vitest`:

```typescript
import { expect } from 'vitest';
import { toFollowRoute, withCassette } from 'tapedeck/vitest';

expect.extend({ toFollowRoute });

await withCassette('checkout-flow.json', async () => {
  const result = await runAgent({ prompt: 'buy a t-shirt' });
  expect(result.steps).toFollowRoute(router);
});
```

The matcher reads the router's public `adjacency` / `routerVersion`
fields structurally, so any ToolRoute version works and neither package
depends on the other.

## Limits and v2

Things explicitly **not** in v1 — see
[`issues/999-v2-deferred.md`](./issues/999-v2-deferred.md) for the full
roadmap:

- Live Cloudflare playground.
- Anthropic SDK adapter (Vercel AI SDK only in v1).
- Mermaid/DOT routing-graph renderer.
- Hosted observability dashboard.

## License

MIT.
