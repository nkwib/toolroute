/**
 * Deterministic, offline-only driver for the code-review-agent fixture.
 *
 * Drives Vercel AI SDK `streamText` with a `MockLanguageModelV3` from
 * `ai/test` that emits a fixed tool-call sequence — search, then commit.
 * The second call is illegal (commit is only allowed after review), so
 * the wrapped `execute` throws `ToolRouteViolation`.
 *
 * No network calls. CI runs this offline.
 */
import { streamText, stepCountIs, simulateReadableStream } from 'ai';
import { MockLanguageModelV3 } from 'ai/test';
import {
  createRouterFromTools,
  ToolRouteViolation,
} from '../../src/index.js';
import { codeReviewTools } from './tools.js';

type StreamPart =
  | { type: 'stream-start'; warnings: unknown[] }
  | {
      type: 'tool-call';
      toolCallId: string;
      toolName: string;
      input: string;
    }
  | {
      type: 'finish';
      finishReason: string;
      usage: { inputTokens: number; outputTokens: number; totalTokens: number };
    };

function streamPartsForToolCall(
  toolName: 'search' | 'review' | 'commit',
  inputJson: string,
): StreamPart[] {
  return [
    { type: 'stream-start', warnings: [] },
    {
      type: 'tool-call',
      toolCallId: `call-${toolName}-${Math.random().toString(36).slice(2, 8)}`,
      toolName,
      input: inputJson,
    },
    {
      type: 'finish',
      finishReason: 'tool-calls',
      usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
    },
  ];
}

async function main(): Promise<void> {
  const strictMode = process.env['TOOLROUTE_STRICT'] !== '0';
  const router = createRouterFromTools(codeReviewTools, { strictMode });

  console.log(`[runner] router=${router.routerVersion}`);
  console.log(`[runner] strictMode=${strictMode}`);
  console.log(`[runner] planned calls: search -> commit\n`);

  const scripted: Array<{ tool: 'search' | 'review' | 'commit'; input: unknown }> = [
    { tool: 'search', input: { query: 'login' } },
    { tool: 'commit', input: { message: 'fix login' } },
  ];
  let stepIndex = 0;
  const doStream = (async () => {
    const step = scripted[stepIndex++];
    if (!step) {
      return {
        stream: simulateReadableStream({
          chunks: [
            { type: 'stream-start', warnings: [] },
            {
              type: 'finish',
              finishReason: 'stop',
              usage: { inputTokens: 0, outputTokens: 0, totalTokens: 0 },
            },
          ],
          initialDelayInMs: null,
          chunkDelayInMs: null,
        }),
      };
    }
    return {
      stream: simulateReadableStream({
        chunks: streamPartsForToolCall(step.tool, JSON.stringify(step.input)),
        initialDelayInMs: null,
        chunkDelayInMs: null,
      }),
    };
  }) as unknown as NonNullable<
    NonNullable<ConstructorParameters<typeof MockLanguageModelV3>[0]>['doStream']
  >;

  const model = new MockLanguageModelV3({ doStream });

  const result = streamText({
    model,
    tools: router.tools,
    prompt: 'Find and ship the fix.',
    stopWhen: stepCountIs(3),
  });

  try {
    for await (const part of result.fullStream) {
      if (part.type === 'tool-call') {
        console.log(`[runner] tool-call: ${part.toolName}`);
      } else if (part.type === 'tool-result') {
        const out = JSON.stringify((part as { output: unknown }).output);
        console.log(`[runner] tool-result: ${part.toolName} -> ${out}`);
      } else if (part.type === 'tool-error') {
        const err = (part as { error: unknown }).error;
        if (err instanceof ToolRouteViolation) {
          console.error(`[runner] BLOCKED: ${err.message}`);
          console.error(
            `[runner] prev=${err.prev} next=${err.next} legalNext=[${err.legalNext.join(', ')}] router=${err.routerVersion}`,
          );
          process.exit(1);
        }
        throw err;
      } else if (part.type === 'error') {
        const err = (part as { error: unknown }).error;
        if (err instanceof ToolRouteViolation) {
          console.error(`[runner] BLOCKED: ${err.message}`);
          console.error(
            `[runner] prev=${err.prev} next=${err.next} legalNext=[${err.legalNext.join(', ')}] router=${err.routerVersion}`,
          );
          process.exit(1);
        }
        throw err;
      }
    }
  } catch (err) {
    if (err instanceof ToolRouteViolation) {
      console.error(`[runner] BLOCKED: ${err.message}`);
      console.error(
        `[runner] prev=${err.prev} next=${err.next} legalNext=[${err.legalNext.join(', ')}] router=${err.routerVersion}`,
      );
      process.exit(1);
    }
    throw err;
  }

  console.error('[runner] expected a violation, none fired.');
  process.exit(2);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
