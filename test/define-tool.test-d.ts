import { z } from 'zod';
import { expectTypeOf } from 'vitest';
import { defineTool } from '../src/index.js';
import type { Tool } from 'ai';

const search = defineTool({
  name: 'search',
  description: 'find',
  inputSchema: z.object({ q: z.string() }),
  nextAllowed: ['review'] as const,
  execute: async ({ q }) => ({ q }),
});

// name narrows to the literal, not string
expectTypeOf(search.name).toEqualTypeOf<'search'>();

// nextAllowed retains tuple type, not string[]
expectTypeOf(search.nextAllowed).toEqualTypeOf<readonly ['review']>();

// inputSchema preserves Zod type
expectTypeOf(search.inputSchema).toMatchTypeOf<z.ZodObject<{ q: z.ZodString }>>();

// Structurally compatible with Vercel AI SDK Tool: shared description/inputSchema/execute
type DefShape = typeof search;
type Compat = Pick<DefShape, 'description' | 'inputSchema' | 'execute'>;
expectTypeOf<Compat['description']>().toMatchTypeOf<Tool['description']>();
expectTypeOf<Compat['inputSchema']>().toMatchTypeOf<Tool['inputSchema']>();
