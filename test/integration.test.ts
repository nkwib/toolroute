/**
 * Cross-layer integration: the inferred narrowing must agree with the
 * runtime guard about which calls are illegal.
 *
 * This is the load-bearing test for issue 005's parity claim.
 */
import { describe, it, expect } from 'vitest';
import { createRouterFromTools, ToolRouteViolation, legalNextFor } from '../src/index.js';
import { codeReviewTools } from '../examples/code-review-agent/tools.js';

describe('runtime guard ↔ narrowing parity', () => {
  it("rejecting commit-after-search at runtime is what NextTools<R,'search'> excludes", async () => {
    const r = createRouterFromTools(codeReviewTools, {
      strictMode: true,
      sdkVersion: '6.0.0',
    });
    const legal = legalNextFor(r.adjacency, 'search');
    expect(legal).toEqual(['review']);
    expect(legal).not.toContain('commit');

    const tools = r.tools as unknown as Record<
      string,
      { execute: (i: unknown, c: { toolCallId: string }) => Promise<unknown> }
    >;
    await tools['search']!.execute({ query: 'q' }, { toolCallId: 't1' });
    await expect(
      tools['commit']!.execute({ message: 'm' }, { toolCallId: 't2' }),
    ).rejects.toBeInstanceOf(ToolRouteViolation);
  });

  it('legal sequence search → review → commit completes without throwing', async () => {
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
    const out = await tools['commit']!.execute({ message: 'ok' }, { toolCallId: 't3' });
    expect(out).toMatchObject({ sha: expect.any(String) });
  });
});
