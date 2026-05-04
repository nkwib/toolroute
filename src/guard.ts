import { ToolRouteViolation, formatViolationMessage } from './violation.js';

export type Adjacency = Readonly<Record<string, readonly string[]>>;

export interface CheckTransitionInput {
  prev: string | null;
  next: string;
  adjacency: Adjacency;
  strictMode: boolean;
  routerVersion: string;
  warn?: (msg: string) => void;
}

export function legalNextFor(
  adjacency: Adjacency,
  prev: string | null,
): readonly string[] {
  if (prev === null) {
    return Object.entries(adjacency)
      .filter(([, next]) => next.length > 0)
      .map(([name]) => name)
      .sort();
  }
  return adjacency[prev] ?? [];
}

export function checkTransition(input: CheckTransitionInput): void {
  const { prev, next, adjacency, strictMode, routerVersion } = input;
  const warn = input.warn ?? ((m) => console.warn(m));
  const legalNext = legalNextFor(adjacency, prev);
  if (legalNext.includes(next)) return;

  const violation = new ToolRouteViolation({ prev, next, legalNext, routerVersion });
  if (strictMode) throw violation;
  warn(formatViolationMessage(violation));
}
