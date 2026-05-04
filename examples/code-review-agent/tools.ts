import { z } from 'zod';
import { defineTool } from '../../src/index.js';

export const search = defineTool({
  name: 'search',
  description: 'Search the repository for files relevant to the change.',
  inputSchema: z.object({ query: z.string().min(1) }),
  nextAllowed: ['review'] as const,
  execute: async ({ query }) => {
    return { hits: [`src/login.ts`, `test/login.test.ts`], query };
  },
});

export const review = defineTool({
  name: 'review',
  description: 'Review the proposed diff for correctness and style.',
  inputSchema: z.object({ diff: z.string().min(1) }),
  nextAllowed: ['commit'] as const,
  execute: async ({ diff }) => {
    return { ok: true, notes: `Reviewed ${diff.length} chars.` };
  },
});

export const commit = defineTool({
  name: 'commit',
  description: 'Commit the reviewed change.',
  inputSchema: z.object({ message: z.string().min(1) }),
  nextAllowed: [] as const,
  execute: async ({ message }) => {
    return { sha: 'deadbeef', message };
  },
});

export const codeReviewTools = [search, review, commit] as const;
