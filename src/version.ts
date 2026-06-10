import { createRequire } from 'node:module';

export const TOOLROUTE_VERSION = '0.2.0';

export function readPeerSdkVersion(): string {
  try {
    if (typeof process === 'undefined') return 'unknown';
    const fromUrl =
      typeof import.meta !== 'undefined' && typeof import.meta.url === 'string'
        ? import.meta.url
        : 'file:///';
    const req = createRequire(fromUrl);
    const pkg = req('ai/package.json') as { version?: unknown };
    if (pkg && typeof pkg.version === 'string') return pkg.version;
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

export function buildRouterVersion(opts: {
  packageVersion?: string;
  sdkVersion?: string;
}): string {
  const pkg = opts.packageVersion ?? TOOLROUTE_VERSION;
  const sdk = opts.sdkVersion ?? readPeerSdkVersion();
  return `toolroute@${pkg}+ai-sdk@${sdk}`;
}
