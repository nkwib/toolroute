/**
 * Compile-time fence for the README's fenced TS examples.
 *
 * Issue 009 acceptance criterion: "All code blocks compile against the
 * published package — verified by a docs test that extracts and
 * typechecks fenced TS blocks." Rather than dynamic extraction, the
 * canonical examples are mirrored here verbatim and `pnpm typecheck`
 * fails if any of them rot.
 */
import { z } from 'zod';
import {
  defineTool,
  createRouterFromTools,
  nextTools,
  printRouterGraph,
  type NextTools,
} from '../src/index.js';

// === README block: defining tools ===
const search = defineTool({
  name: 'search',
  description: 'Search the repository for files relevant to the change.',
  inputSchema: z.object({ query: z.string() }),
  nextAllowed: ['review'] as const,
  execute: async ({ query }) => ({ hits: [`match for ${query}`] }),
});

const review = defineTool({
  name: 'review',
  description: 'Review the proposed diff.',
  inputSchema: z.object({ diff: z.string() }),
  nextAllowed: ['commit'] as const,
  execute: async ({ diff }) => ({ ok: true, notes: `${diff.length} chars reviewed` }),
});

const commit = defineTool({
  name: 'commit',
  description: 'Commit the reviewed change.',
  inputSchema: z.object({ message: z.string() }),
  nextAllowed: [] as const,
  execute: async ({ message }) => ({ sha: 'deadbeef', message }),
});

// === README block: building the router ===
const router = createRouterFromTools([search, review, commit] as const, {
  strictMode: true,
});

// === README block: per-step narrowing ===
type Step1 = NextTools<typeof router, null>;
type Step2 = NextTools<typeof router, 'search'>;
type Step3 = NextTools<typeof router, 'review'>;
type StepTerminal = NextTools<typeof router, 'commit'>;

declare const _step1: keyof Step1;
declare const _step2: keyof Step2;
declare const _step3: keyof Step3;
declare const _stepT: keyof StepTerminal;

// Type-level checks
const _check1: 'search' | 'review' = _step1;
const _check2: 'review' = _step2;
const _check3: 'commit' = _step3;
const _checkT: never = _stepT;
void _check1;
void _check2;
void _check3;
void _checkT;

// === README block: per-step usage ===
declare const fakeModel: unknown;
declare const callStreamText: <TOOLS>(opts: { model: unknown; tools: TOOLS }) => Promise<{
  lastTool: keyof TOOLS;
}>;

async function runAgent(): Promise<void> {
  await callStreamText({ model: fakeModel, tools: nextTools(router, null) });
  await callStreamText({ model: fakeModel, tools: nextTools(router, 'search') });
  await callStreamText({ model: fakeModel, tools: nextTools(router, 'review') });
}

// === README block: debug printer ===
declare const _logger: { log: (s: string) => void };
function debug(): void {
  _logger.log(printRouterGraph(router));
}

void runAgent;
void debug;
void router.routerVersion;
