import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  target: 'es2022',
  // Keep `node:` import prefixes intact. tsup/esbuild strips them by
  // default, which rewrites `node:module` to bare `module` and breaks
  // Cloudflare Workers `nodejs_compat` (which only resolves the prefixed
  // form).
  removeNodeProtocol: false,
});
