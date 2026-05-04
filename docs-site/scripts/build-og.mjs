#!/usr/bin/env node
/**
 * Rasterise static/og.svg → static/og.png for social-card embeds.
 * Mirrors the tprompt build-og pattern but with embedded fonts removed
 * to keep the build dep-light. If you want pixel-perfect typography,
 * install @fontsource/inter and uncomment the font block below.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const svgPath = resolve(root, 'static/og.svg');
const pngPath = resolve(root, 'static/og.png');

const svg = readFileSync(svgPath, 'utf8');
const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { loadSystemFonts: true }
});
const png = resvg.render().asPng();
writeFileSync(pngPath, png);
console.log(`Wrote ${pngPath} (${png.length} bytes)`);
