import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import {
  defineTool,
  createRouterFromTools,
  legalNextFor,
  nextTools,
  ToolRouteViolation,
} from '../src/index.js';
import { codeReviewTools } from '../examples/code-review-agent/tools.js';

describe('createRouterFromTools', () => {
  it('exposes routerVersion built from package + sdk version', () => {
    const r = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });
    expect(r.routerVersion).toBe('toolroute@0.1.0+ai-sdk@6.0.0');
  });

  it('throws on unknown nextAllowed reference at construction', () => {
    const bad = defineTool({
      name: 'a',
      inputSchema: z.object({}),
      nextAllowed: ['ghost'] as const,
      execute: async () => undefined,
    });
    expect(() => createRouterFromTools([bad])).toThrow(/unknown tool 'ghost'/);
  });

  it('throws on duplicate tool names', () => {
    const a = defineTool({
      name: 'dup',
      inputSchema: z.object({}),
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    const b = defineTool({
      name: 'dup',
      inputSchema: z.object({}),
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    expect(() => createRouterFromTools([a, b])).toThrow(/Duplicate tool name/);
  });

  it('throws on empty tool array', () => {
    expect(() => createRouterFromTools([] as never)).toThrow(/non-empty/);
  });

  it('exposes tools record keyed by tool name', () => {
    const r = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });
    expect(Object.keys(r.tools).sort()).toEqual(['commit', 'review', 'search']);
  });

  it('strictMode true throws ToolRouteViolation on illegal call', async () => {
    const r = createRouterFromTools(codeReviewTools, {
      strictMode: true,
      sdkVersion: '6.0.0',
    });
    const tools = r.tools as unknown as Record<
      string,
      { execute: (i: unknown, c: { toolCallId: string }) => Promise<unknown> }
    >;
    await tools['search']!.execute({ query: 'q' }, { toolCallId: 't1' });
    await expect(
      tools['commit']!.execute({ message: 'm' }, { toolCallId: 't2' }),
    ).rejects.toBeInstanceOf(ToolRouteViolation);
  });

  it('strictMode true error fields populate correctly', async () => {
    const r = createRouterFromTools(codeReviewTools, {
      strictMode: true,
      sdkVersion: '6.0.0',
    });
    const tools = r.tools as unknown as Record<
      string,
      { execute: (i: unknown, c: { toolCallId: string }) => Promise<unknown> }
    >;
    await tools['search']!.execute({ query: 'q' }, { toolCallId: 't1' });
    try {
      await tools['commit']!.execute({ message: 'm' }, { toolCallId: 't2' });
      throw new Error('unreachable');
    } catch (err) {
      const e = err as ToolRouteViolation;
      expect(e.prev).toBe('search');
      expect(e.next).toBe('commit');
      expect(e.legalNext).toEqual(['review']);
      expect(e.routerVersion).toBeTruthy();
    }
  });

  it('reset clears prev state', async () => {
    const r = createRouterFromTools(codeReviewTools, {
      strictMode: true,
      sdkVersion: '6.0.0',
    });
    const tools = r.tools as unknown as Record<
      string,
      { execute: (i: unknown, c: { toolCallId: string }) => Promise<unknown> }
    >;
    await tools['search']!.execute({ query: 'q' }, { toolCallId: 't1' });
    await tools['review']!.execute({ diff: 'd' }, { toolCallId: 't2' });
    r.reset();
    // Now search must be legal as an entry tool
    await expect(
      tools['search']!.execute({ query: 'q2' }, { toolCallId: 't3' }),
    ).resolves.toBeDefined();
  });

  it('throws when no tool has any nextAllowed (router has no entry tools)', () => {
    const dead1 = defineTool({
      name: 'dead1',
      inputSchema: z.object({}),
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    const dead2 = defineTool({
      name: 'dead2',
      inputSchema: z.object({}),
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    expect(() => createRouterFromTools([dead1, dead2])).toThrow(/no entry tools/);
  });

  it('de-duplicates nextAllowed at construction', () => {
    const a = defineTool({
      name: 'a',
      inputSchema: z.object({}),
      nextAllowed: ['b', 'b', 'c', 'b'] as const,
      execute: async () => undefined,
    });
    const b = defineTool({
      name: 'b',
      inputSchema: z.object({}),
      nextAllowed: ['c'] as const,
      execute: async () => undefined,
    });
    const c = defineTool({
      name: 'c',
      inputSchema: z.object({}),
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    const r = createRouterFromTools([a, b, c]);
    expect(r.adjacency['a']).toEqual(['b', 'c']);
  });

  it('legalNextFor(null) and nextTools(router, null) agree on entry-tool order (insertion order)', () => {
    // Multiple entry tools defined in non-alphabetical insertion order.
    const zeta = defineTool({
      name: 'zeta',
      inputSchema: z.object({}),
      nextAllowed: ['mid'] as const,
      execute: async () => undefined,
    });
    const alpha = defineTool({
      name: 'alpha',
      inputSchema: z.object({}),
      nextAllowed: ['mid'] as const,
      execute: async () => undefined,
    });
    const mid = defineTool({
      name: 'mid',
      inputSchema: z.object({}),
      nextAllowed: ['end'] as const,
      execute: async () => undefined,
    });
    const end = defineTool({
      name: 'end',
      inputSchema: z.object({}),
      nextAllowed: [] as const,
      execute: async () => undefined,
    });
    const r = createRouterFromTools([zeta, alpha, mid, end]);
    const fromGuard = legalNextFor(r.adjacency, null);
    const fromNarrow = Object.keys(nextTools(r, null));
    expect(fromGuard).toEqual(['zeta', 'alpha', 'mid']);
    expect(fromNarrow).toEqual(fromGuard);
  });

  it('warn mode emits console.warn instead of throwing', async () => {
    const warn = vi.fn();
    const r = createRouterFromTools(codeReviewTools, {
      strictMode: false,
      warn,
      sdkVersion: '6.0.0',
    });
    const tools = r.tools as unknown as Record<
      string,
      { execute: (i: unknown, c: { toolCallId: string }) => Promise<unknown> }
    >;
    await tools['search']!.execute({ query: 'q' }, { toolCallId: 't1' });
    await tools['commit']!.execute({ message: 'm' }, { toolCallId: 't2' });
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
