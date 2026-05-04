export function detectEdgeRuntime(): boolean {
  try {
    const g = globalThis as Record<string, unknown>;
    if (g['EdgeRuntime']) return true;
    if (typeof process !== 'undefined' && process.env?.['NEXT_RUNTIME'] === 'edge') {
      return true;
    }
    if ('WebSocketPair' in g) return true;
    return false;
  } catch {
    return false;
  }
}

export const EDGE_INIT_WARNING =
  '[ToolRoute] Edge runtime detected. console.warn may be suppressed; pipe runtime logs to capture violations.';
