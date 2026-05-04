import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { defineTool } from '../src/index.js';

describe('defineTool', () => {
  it('returns the input pass-through', () => {
    const def = defineTool({
      name: 'search',
      description: 'd',
      inputSchema: z.object({ q: z.string() }),
      nextAllowed: ['review'] as const,
      execute: async () => ({ ok: true }),
    });
    expect(def.name).toBe('search');
    expect(def.nextAllowed).toEqual(['review']);
    expect(typeof def.execute).toBe('function');
  });

  it('throws on empty name', () => {
    expect(() =>
      defineTool({
        name: '' as 'x',
        inputSchema: z.object({}),
        nextAllowed: [] as const,
        execute: async () => undefined,
      }),
    ).toThrow(/non-empty/);
  });

  it('throws on non-array nextAllowed', () => {
    expect(() =>
      defineTool({
        name: 'a',
        inputSchema: z.object({}),
        nextAllowed: 'review' as unknown as readonly string[],
        execute: async () => undefined,
      }),
    ).toThrow(/nextAllowed/);
  });

  it('throws on non-function execute', () => {
    expect(() =>
      defineTool({
        name: 'a',
        inputSchema: z.object({}),
        nextAllowed: [] as const,
        execute: 'oops' as unknown as () => unknown,
      }),
    ).toThrow(/execute/);
  });

  it('zod schema passes through unchanged', () => {
    const schema = z.object({ q: z.string() });
    const def = defineTool({
      name: 'a',
      inputSchema: schema,
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    expect(def.inputSchema).toBe(schema);
    expect(def.inputSchema.parse({ q: 'hi' })).toEqual({ q: 'hi' });
  });
});
