import type { ToolRouteDef, SDKToolFor } from './define-tool.js';
import { checkTransition, type Adjacency } from './guard.js';
import { detectEdgeRuntime, EDGE_INIT_WARNING } from './edge.js';
import { buildRouterVersion } from './version.js';

export type SDKToolSet<Tools extends readonly ToolRouteDef[]> = {
  [K in Tools[number] as K['name']]: SDKToolFor<K>;
};

export interface Router<Tools extends readonly ToolRouteDef[]> {
  tools: SDKToolSet<Tools>;
  adjacency: Adjacency;
  routerVersion: string;
  strictMode: boolean;
  reset(): void;
}

export interface RouterOptions {
  strictMode?: boolean;
  warn?: (msg: string) => void;
  sdkVersion?: string;
  detectEdgeRuntime?: () => boolean;
}

export function createRouterFromTools<
  const Tools extends readonly ToolRouteDef[],
>(tools: Tools, options: RouterOptions = {}): Router<Tools> {
  if (!Array.isArray(tools) || tools.length === 0) {
    throw new Error('[ToolRoute] createRouterFromTools requires a non-empty tool array.');
  }

  const names = new Set<string>();
  for (const t of tools) {
    if (names.has(t.name)) {
      throw new Error(`[ToolRoute] Duplicate tool name: '${t.name}'.`);
    }
    names.add(t.name);
  }

  const adjacency: Record<string, readonly string[]> = {};
  for (const t of tools) {
    const seen = new Set<string>();
    const deduped: string[] = [];
    for (const n of t.nextAllowed) {
      if (!names.has(n)) {
        throw new Error(
          `[ToolRoute] Tool '${t.name}' references unknown tool '${n}' in nextAllowed. Legal: [${[...names].join(', ')}]`,
        );
      }
      if (seen.has(n)) continue;
      seen.add(n);
      deduped.push(n);
    }
    adjacency[t.name] = Object.freeze(deduped);
  }
  Object.freeze(adjacency);

  const hasEntry = tools.some((t) => adjacency[t.name]!.length > 0);
  if (!hasEntry) {
    throw new Error(
      '[ToolRoute] Router has no entry tools: every tool has an empty `nextAllowed`, so no call can ever be legal. At least one tool must list a successor.',
    );
  }

  const routerVersion = buildRouterVersion({ sdkVersion: options.sdkVersion });
  const strictMode = options.strictMode ?? false;
  const warn = options.warn ?? ((m) => console.warn(m));
  const isEdge = (options.detectEdgeRuntime ?? detectEdgeRuntime)();
  if (isEdge) warn(EDGE_INIT_WARNING);

  const state = { prev: null as string | null };
  const sdkTools: Record<string, unknown> = {};
  for (const def of tools) {
    sdkTools[def.name] = {
      description: def.description,
      inputSchema: def.inputSchema,
      execute: async (input: unknown, ctx: { toolCallId: string }) => {
        checkTransition({
          prev: state.prev,
          next: def.name,
          adjacency,
          strictMode,
          routerVersion,
          warn,
        });
        state.prev = def.name;
        return await def.execute(input as Parameters<typeof def.execute>[0], ctx);
      },
    };
  }

  return {
    tools: sdkTools as SDKToolSet<Tools>,
    adjacency,
    routerVersion,
    strictMode,
    reset() {
      state.prev = null;
    },
  };
}
