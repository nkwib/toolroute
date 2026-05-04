import type { Adjacency } from './guard.js';

export function printRouterGraph(router: { adjacency: Adjacency }): string {
  const adjacency = router.adjacency;
  const sortedNames = Object.keys(adjacency).slice().sort();
  const lines = sortedNames.map((name) => {
    const next = adjacency[name];
    if (!next || next.length === 0) return `${name} -> (terminal)`;
    const sortedNext = next.slice().sort().join(', ');
    return `${name} -> ${sortedNext}`;
  });
  return lines.join('\n');
}
