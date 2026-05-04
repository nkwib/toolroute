import { describe, it, expect, afterEach, vi } from 'vitest';
import { detectEdgeRuntime, EDGE_INIT_WARNING, createRouterFromTools } from '../src/index.js';
import { codeReviewTools } from '../examples/code-review-agent/tools.js';

describe('detectEdgeRuntime', () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>)['EdgeRuntime'];
    delete process.env['NEXT_RUNTIME'];
  });

  it('returns false in plain Node test env', () => {
    expect(detectEdgeRuntime()).toBe(false);
  });

  it("returns true when globalThis.EdgeRuntime is set", () => {
    (globalThis as Record<string, unknown>)['EdgeRuntime'] = 'edge';
    expect(detectEdgeRuntime()).toBe(true);
  });

  it("returns true when NEXT_RUNTIME=edge", () => {
    process.env['NEXT_RUNTIME'] = 'edge';
    expect(detectEdgeRuntime()).toBe(true);
  });
});

describe('edge init warning', () => {
  it('fires exactly once per router on detection', () => {
    const warn = vi.fn();
    createRouterFromTools(codeReviewTools, {
      sdkVersion: '6.0.0',
      warn,
      detectEdgeRuntime: () => true,
    });
    const initLines = warn.mock.calls.filter(([m]) => (m as string) === EDGE_INIT_WARNING);
    expect(initLines).toHaveLength(1);
  });

  it('two routers each warn exactly once (no shared static state)', () => {
    const warn = vi.fn();
    createRouterFromTools(codeReviewTools, {
      sdkVersion: '6.0.0',
      warn,
      detectEdgeRuntime: () => true,
    });
    createRouterFromTools(codeReviewTools, {
      sdkVersion: '6.0.0',
      warn,
      detectEdgeRuntime: () => true,
    });
    const initLines = warn.mock.calls.filter(([m]) => (m as string) === EDGE_INIT_WARNING);
    expect(initLines).toHaveLength(2);
  });

  it('does not fire in non-edge env', () => {
    const warn = vi.fn();
    createRouterFromTools(codeReviewTools, {
      sdkVersion: '6.0.0',
      warn,
      detectEdgeRuntime: () => false,
    });
    const initLines = warn.mock.calls.filter(([m]) => (m as string) === EDGE_INIT_WARNING);
    expect(initLines).toHaveLength(0);
  });
});
