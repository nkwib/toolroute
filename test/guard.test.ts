import { describe, it, expect, vi } from 'vitest';
import { checkTransition, legalNextFor, ToolRouteViolation } from '../src/index.js';

const adjacency = {
  search: ['review'],
  review: ['commit'],
  commit: [],
} as const;

const routerVersion = 'toolroute@test+ai-sdk@test';

describe('checkTransition', () => {
  it('strictMode throws ToolRouteViolation on illegal hop', () => {
    expect(() =>
      checkTransition({
        prev: 'search',
        next: 'commit',
        adjacency,
        strictMode: true,
        routerVersion,
      }),
    ).toThrow(ToolRouteViolation);
  });

  it('strictMode does not throw on legal hop', () => {
    expect(() =>
      checkTransition({
        prev: 'search',
        next: 'review',
        adjacency,
        strictMode: true,
        routerVersion,
      }),
    ).not.toThrow();
  });

  it('warn mode emits one console.warn line', () => {
    const warn = vi.fn();
    checkTransition({
      prev: 'search',
      next: 'commit',
      adjacency,
      strictMode: false,
      routerVersion,
      warn,
    });
    expect(warn).toHaveBeenCalledTimes(1);
    const msg = warn.mock.calls[0]?.[0] as string;
    expect(msg).toContain('search');
    expect(msg).toContain('commit');
    expect(msg).toContain('review');
  });

  it('error fields populate correctly', () => {
    try {
      checkTransition({
        prev: 'search',
        next: 'commit',
        adjacency,
        strictMode: true,
        routerVersion,
      });
      throw new Error('unreachable');
    } catch (err) {
      const e = err as ToolRouteViolation;
      expect(e.prev).toBe('search');
      expect(e.next).toBe('commit');
      expect(e.legalNext).toEqual(['review']);
      expect(e.routerVersion).toBe(routerVersion);
    }
  });

  it('first-tool violation has prev=null', () => {
    try {
      checkTransition({
        prev: null,
        next: 'commit',
        adjacency,
        strictMode: true,
        routerVersion,
      });
      throw new Error('unreachable');
    } catch (err) {
      const e = err as ToolRouteViolation;
      expect(e.prev).toBeNull();
    }
  });
});

describe('legalNextFor', () => {
  it('with prev=null returns entry tools sorted (those with non-empty nextAllowed)', () => {
    expect(legalNextFor(adjacency, null)).toEqual(['review', 'search']);
  });

  it('with prev=name returns its nextAllowed', () => {
    expect(legalNextFor(adjacency, 'search')).toEqual(['review']);
    expect(legalNextFor(adjacency, 'review')).toEqual(['commit']);
    expect(legalNextFor(adjacency, 'commit')).toEqual([]);
  });
});
