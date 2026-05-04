import { z } from 'zod';
import { expectTypeOf } from 'vitest';
import { defineTool, createRouterFromTools } from '../src/index.js';
import { codeReviewTools } from '../examples/code-review-agent/tools.js';

const router = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });

// Inferred name keys are the literal union, not string
type Keys = keyof typeof router.tools;
expectTypeOf<Keys>().toEqualTypeOf<'search' | 'review' | 'commit'>();

// Adjacency type is broad string record (runtime), but routerVersion is string
expectTypeOf(router.routerVersion).toBeString();
expectTypeOf(router.strictMode).toBeBoolean();

// Construction with an unknown nextAllowed should fail at *runtime* (test in router.test.ts)
// but at the type level the literal union of tool names should not include strangers
const a = defineTool({
  name: 'a',
  inputSchema: z.object({}),
  nextAllowed: [] as const,
  execute: async () => undefined,
});
const single = createRouterFromTools([a]);
type SingleKeys = keyof typeof single.tools;
expectTypeOf<SingleKeys>().toEqualTypeOf<'a'>();
