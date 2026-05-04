export interface ToolRouteViolationFields {
  prev: string | null;
  next: string;
  legalNext: readonly string[];
  routerVersion: string;
}

export class ToolRouteViolation extends Error {
  override readonly name = 'ToolRouteViolation' as const;
  readonly prev: string | null;
  readonly next: string;
  readonly legalNext: readonly string[];
  readonly routerVersion: string;

  constructor(fields: ToolRouteViolationFields) {
    super(formatViolationMessage(fields));
    this.prev = fields.prev;
    this.next = fields.next;
    this.legalNext = fields.legalNext;
    this.routerVersion = fields.routerVersion;
    Object.setPrototypeOf(this, ToolRouteViolation.prototype);
  }
}

export function formatViolationMessage(f: ToolRouteViolationFields): string {
  const prev = f.prev === null ? '<start>' : f.prev;
  const legal = f.legalNext.length === 0 ? '<terminal>' : f.legalNext.join(', ');
  return `ToolRoute violation: '${f.next}' called after '${prev}'; legal next: [${legal}] (${f.routerVersion})`;
}
