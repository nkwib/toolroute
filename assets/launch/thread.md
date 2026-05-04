# ToolRoute launch thread

5–7 posts, anchored on the README hero recording. Hold publishing until
issue 012 confirms `npm install toolroute` works.

---

🧵 1/

Production agents on the Vercel AI SDK fail most often at **tool ordering** — the model calls `commit` before `review`, or `send_email` before `draft_email`. Today this is a system-prompt sentence and a Sentry alert at 3am.

Today I'm shipping ToolRoute — the same rejection at compile-time AND runtime, from the same source of truth.

[recording: assets/recordings/readme-hero.cast]

---

🧵 2/

The change at the call site is small. `nextAllowed` is the only line you add to each tool. The router is one wrapper.

```diff
- const search = tool({ description, inputSchema, execute });
+ const search = defineTool({
+   name: 'search',
+   nextAllowed: ['review'] as const,
+   description, inputSchema, execute,
+ });

- await streamText({ model, tools: { search, review, commit } });
+ const router = createRouterFromTools([search, review, commit] as const, {
+   strictMode: true,
+ });
+ await streamText({ model, tools: router.tools });
```

---

🧵 3/

`printRouterGraph(router)` is the debug view. At 7+ tools the routing graph lives across files; this is your single-screen dump. Zero deps, two minutes to implement, ships in v1:

```
commit -> (terminal)
review -> commit
search -> review
```

---

🧵 4/

Quickstart — install both peer deps and you're typing in 60 seconds:

```bash
pnpm add toolroute ai zod
```

```ts
import { defineTool, createRouterFromTools } from 'toolroute';
const search = defineTool({ name: 'search', nextAllowed: ['review'], ... });
const router = createRouterFromTools([search, ...] as const, { strictMode: true });
await streamText({ model, tools: router.tools, prompt });
```

That's it. Your agent now refuses to commit before reviewing.

---

🧵 5/

The runtime guard went in **before** the type machinery. The recorded terminal session of a real agent rejection is the load-bearing artefact — it proves the type narrowing reflects observable behaviour rather than a compile-time lie.

If the runtime check disagreed with the inferred narrowing, the README hero would catch it.

---

🧵 6/

What's NOT in v1 (deliberately):
- live Cloudflare playground (deferred to v2 — README + recording is the calling card)
- Anthropic SDK adapter (Vercel AI SDK only in v1, scope-honesty)
- hosted dashboard / paid tier (calling card, not a revenue vehicle)
- Mermaid/DOT graph renderer (text adjacency now, visualizer in v2)

---

🧵 7/

ToolRoute is MIT, ~340 LOC of source, 37 tests, weekly CI cron pinned against `ai@latest` so SDK drift becomes a public dated issue, not a 3am page.

```
npm install toolroute
```

Repo: https://github.com/nkwib/toolroute
COMPATIBILITY.md: https://github.com/nkwib/toolroute/blob/main/COMPATIBILITY.md
