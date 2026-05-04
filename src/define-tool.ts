import type { FlexibleSchema, InferSchema, Tool } from 'ai';

type AnySchema = FlexibleSchema<unknown>;

export type Infer<S> = S extends FlexibleSchema<infer T> ? T : never;

export interface ToolRouteDef<
  Name extends string = string,
  Schema extends AnySchema = AnySchema,
  Next extends readonly string[] = readonly string[],
  Output = unknown,
> {
  name: Name;
  description?: string;
  inputSchema: Schema;
  nextAllowed: Next;
  execute: (
    input: InferSchema<Schema>,
    options: { toolCallId: string; messages?: unknown },
  ) => Output | Promise<Output>;
}

export function defineTool<
  const Name extends string,
  Schema extends AnySchema,
  const Next extends readonly string[],
  Output = unknown,
>(
  def: ToolRouteDef<Name, Schema, Next, Output>,
): ToolRouteDef<Name, Schema, Next, Output> {
  if (typeof def.name !== 'string' || def.name.length === 0) {
    throw new Error('[ToolRoute] defineTool: `name` must be a non-empty string.');
  }
  if (!Array.isArray(def.nextAllowed)) {
    throw new Error(
      `[ToolRoute] defineTool('${def.name}'): \`nextAllowed\` must be a readonly array.`,
    );
  }
  if (typeof def.execute !== 'function') {
    throw new Error(
      `[ToolRoute] defineTool('${def.name}'): \`execute\` must be a function.`,
    );
  }
  return def;
}

export type SDKToolFor<T extends ToolRouteDef> = Tool<
  Infer<T['inputSchema']>,
  T extends ToolRouteDef<infer _N, infer _S, infer _A, infer O> ? O : unknown
>;
