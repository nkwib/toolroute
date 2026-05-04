export { defineTool } from './define-tool.js';
export type { ToolRouteDef, SDKToolFor, Infer } from './define-tool.js';

export { createRouterFromTools } from './router.js';
export type { Router, RouterOptions, SDKToolSet } from './router.js';

export { ToolRouteViolation, formatViolationMessage } from './violation.js';
export type { ToolRouteViolationFields } from './violation.js';

export { checkTransition, legalNextFor } from './guard.js';
export type { Adjacency, CheckTransitionInput } from './guard.js';

export { nextTools } from './narrow.js';
export type {
  NextTools,
  ToolByName,
  AllowedNextNames,
  EntryNames,
} from './narrow.js';

export { printRouterGraph } from './print-graph.js';

export { detectEdgeRuntime, EDGE_INIT_WARNING } from './edge.js';

export { TOOLROUTE_VERSION, buildRouterVersion } from './version.js';
