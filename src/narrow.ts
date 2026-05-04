import type { ToolRouteDef, SDKToolFor } from './define-tool.js';
import type { Router } from './router.js';

export type ToolByName<
  Tools extends readonly ToolRouteDef[],
  N extends string,
> = Extract<Tools[number], { name: N }>;

export type EntryNames<Tools extends readonly ToolRouteDef[]> = {
  [K in keyof Tools]: Tools[K] extends ToolRouteDef<
    infer Name,
    infer _S,
    infer Next,
    infer _O
  >
    ? Next extends readonly []
      ? never
      : Name
    : never;
}[number];

export type AllowedNextNames<
  Tools extends readonly ToolRouteDef[],
  Prev extends string | null,
> = [Prev] extends [null]
  ? EntryNames<Tools>
  : Prev extends string
    ? ToolByName<Tools, Prev>['nextAllowed'][number]
    : never;

export type NextTools<R, Prev extends string | null> = R extends Router<infer Tools>
  ? {
      [N in AllowedNextNames<Tools, Prev> & string]: SDKToolFor<ToolByName<Tools, N>>;
    }
  : never;

export function nextTools<R, Prev extends string | null>(
  router: R,
  prev: Prev,
): NextTools<R, Prev> {
  const r = router as unknown as {
    adjacency: Record<string, readonly string[]>;
    tools: Record<string, unknown>;
  };
  const legal =
    prev === null
      ? Object.entries(r.adjacency).filter(([, n]) => n.length > 0).map(([n]) => n)
      : (r.adjacency[prev as string] ?? []);
  const out: Record<string, unknown> = {};
  for (const name of legal) {
    const sdk = r.tools[name];
    if (sdk) out[name] = sdk;
  }
  return out as NextTools<R, Prev>;
}
