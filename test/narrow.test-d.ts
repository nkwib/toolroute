import { expectTypeOf } from 'vitest';
import {
  createRouterFromTools,
  type NextTools,
} from '../src/index.js';
import { codeReviewTools } from '../examples/code-review-agent/tools.js';

const router = createRouterFromTools(codeReviewTools, { sdkVersion: '6.0.0' });
type R = typeof router;

// After 'search', only 'review' is legal
type AfterSearch = NextTools<R, 'search'>;
expectTypeOf<keyof AfterSearch>().toEqualTypeOf<'review'>();

// After 'review', only 'commit' is legal
type AfterReview = NextTools<R, 'review'>;
expectTypeOf<keyof AfterReview>().toEqualTypeOf<'commit'>();

// After 'commit' (terminal), legal set is empty
type AfterCommit = NextTools<R, 'commit'>;
expectTypeOf<keyof AfterCommit>().toEqualTypeOf<never>();

// Start of run (prev=null): entry tools = those with non-empty nextAllowed
type AtStart = NextTools<R, null>;
expectTypeOf<keyof AtStart>().toEqualTypeOf<'search' | 'review'>();
