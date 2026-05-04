/**
 * Illegal-call demo: the line marked ❌ is the red-squiggle moment for the
 * README hero recording. Type-checking this file MUST fail. CI runs
 * `pnpm tsc --noEmit` on this file and asserts exit code 2.
 *
 * Do NOT include this in the build. It's a docs/CI artefact, not source.
 */
import {
  createRouterFromTools,
  nextTools,
  type NextTools,
} from '../../src/index.js';
import { codeReviewTools } from './tools.js';

const router = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });

declare const callStreamText: <TOOLS>(opts: {
  model: unknown;
  tools: TOOLS;
}) => Promise<void>;

declare const fakeModel: unknown;

async function step1(): Promise<void> {
  await callStreamText({
    model: fakeModel,
    tools: nextTools(router, null),
  });
}

async function step2_legal(): Promise<void> {
  // After 'search', only 'review' is legal — passes type-check.
  await callStreamText({
    model: fakeModel,
    tools: nextTools(router, 'search'),
  });
}

async function step2_illegal(): Promise<void> {
  // ❌ After 'search', 'commit' is NOT legal — TS error here.
  // The red-squiggle anchor for the README hero recording lives below.
  const _illegal: NextTools<typeof router, 'search'> = {
    commit: router.tools.commit,
  };
  void _illegal;
}

void step1;
void step2_legal;
void step2_illegal;
