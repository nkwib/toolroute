import { describe, it, expect } from 'vitest';
import { ToolRouteViolation, formatViolationMessage } from '../src/index.js';

describe('ToolRouteViolation', () => {
  const fields = {
    prev: 'search',
    next: 'commit',
    legalNext: ['review'] as const,
    routerVersion: 'toolroute@0.1.0+ai-sdk@6.0.0',
  };

  it('exposes all four diagnostic fields as readonly', () => {
    const e = new ToolRouteViolation(fields);
    expect(e.prev).toBe('search');
    expect(e.next).toBe('commit');
    expect(e.legalNext).toEqual(['review']);
    expect(e.routerVersion).toBe('toolroute@0.1.0+ai-sdk@6.0.0');
  });

  it('is instanceof Error and has correct name', () => {
    const e = new ToolRouteViolation(fields);
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(ToolRouteViolation);
    expect(e.name).toBe('ToolRouteViolation');
  });

  it('message is single-line and contains all four fields', () => {
    const e = new ToolRouteViolation(fields);
    expect(e.message).not.toContain('\n');
    expect(e.message).toContain('search');
    expect(e.message).toContain('commit');
    expect(e.message).toContain('review');
    expect(e.message).toContain('toolroute@0.1.0+ai-sdk@6.0.0');
  });

  it("first-tool violation prints '<start>' instead of 'null'", () => {
    const msg = formatViolationMessage({ ...fields, prev: null });
    expect(msg).not.toContain('null');
    expect(msg).toContain('<start>');
  });

  it('terminal legal set prints <terminal>', () => {
    const msg = formatViolationMessage({ ...fields, legalNext: [] });
    expect(msg).toContain('<terminal>');
  });
});
