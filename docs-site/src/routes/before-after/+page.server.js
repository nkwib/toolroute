import { highlight } from "$lib/highlight.js";

export const prerender = true;

const beforeCode = `import { streamText, tool } from 'ai';
import { z } from 'zod';

// Three tools, each with their own inputSchema and execute.
const search = tool({
  description: 'Search the repository for files relevant to the change.',
  inputSchema: z.object({ query: z.string() }),
  execute: async ({ query }) => ({ hits: [] }),
});

const review = tool({
  description: 'Review the proposed diff.',
  inputSchema: z.object({ diff: z.string() }),
  execute: async ({ diff }) => ({ ok: true }),
});

const commit = tool({
  description: 'Commit the reviewed change.',
  inputSchema: z.object({ message: z.string() }),
  execute: async ({ message }) => ({ sha: 'deadbeef' }),
});

// Tool ordering lives in the system prompt — and in your prayers.
await streamText({
  model,
  tools: { search, review, commit },
  system: 'Always call review before commit. Never call commit first.',
  prompt: 'Ship the login fix.',
});

// At 3am the model decides the diff "looks fine" and calls commit
// straight after search. Sentry pages.`;

const afterCode = `import { streamText } from 'ai';
import { defineTool, createRouterFromTools } from 'toolroute';
import { z } from 'zod';

// Same tools — plus one inline declaration of legal successors.
const search = defineTool({
  name: 'search',
  description: 'Search the repository for files relevant to the change.',
  inputSchema: z.object({ query: z.string() }),
  nextAllowed: ['review'] as const,
  execute: async ({ query }) => ({ hits: [] }),
});

const review = defineTool({
  name: 'review',
  description: 'Review the proposed diff.',
  inputSchema: z.object({ diff: z.string() }),
  nextAllowed: ['commit'] as const,
  execute: async ({ diff }) => ({ ok: true }),
});

const commit = defineTool({
  name: 'commit',
  description: 'Commit the reviewed change.',
  inputSchema: z.object({ message: z.string() }),
  nextAllowed: [] as const,
  execute: async ({ message }) => ({ sha: 'deadbeef' }),
});

// Names are derived from the array; no separate registry.
const router = createRouterFromTools([search, review, commit] as const, {
  strictMode: true,
});

await streamText({
  model,
  tools: router.tools,
  prompt: 'Ship the login fix.',
});

// If the model picks 'commit' after 'search', the wrapped execute throws:
// ToolRouteViolation: 'commit' called after 'search'; legal next: [review]
//                     (toolroute@0.2.0+ai-sdk@6.0.174)`;

const diffCode = `- const search = tool({ description, inputSchema, execute });
+ const search = defineTool({
+   name: 'search',
+   nextAllowed: ['review'] as const,
+   description, inputSchema, execute,
+ });

- await streamText({ model, tools: { search, review, commit }, prompt });
+ const router = createRouterFromTools([search, review, commit] as const, {
+   strictMode: true,
+ });
+ await streamText({ model, tools: router.tools, prompt });`;

export function load() {
  return {
    before: highlight(beforeCode, "typescript"),
    after: highlight(afterCode, "typescript"),
    diff: highlight(diffCode, "diff"),
  };
}
