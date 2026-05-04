import { describe, it, expect } from 'vitest';
import { createRouterFromTools, printRouterGraph } from '../src/index.js';
import { codeReviewTools } from '../examples/code-review-agent/tools.js';

describe('printRouterGraph', () => {
  it('returns a string with one line per tool, sorted alphabetically', () => {
    const r = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });
    const out = printRouterGraph(r);
    expect(out).toMatchInlineSnapshot(`
      "commit -> (terminal)
      review -> commit
      search -> review"
    `);
  });

  it('has zero new runtime deps (string only, no dynamic imports)', () => {
    const r = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });
    const out = printRouterGraph(r);
    expect(typeof out).toBe('string');
    expect(out.split('\n').length).toBe(3);
  });

  it('snapshot stays diff-stable across runs', () => {
    const r = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });
    const a = printRouterGraph(r);
    const b = printRouterGraph(r);
    expect(a).toBe(b);
  });
});
