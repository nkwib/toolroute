import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages([
  'markup',
  'css',
  'clike',
  'javascript',
  'typescript',
  'tsx',
  'json',
  'bash',
  'diff',
  'yaml'
]);

const ALIASES = {
  ts: 'typescript',
  js: 'javascript',
  sh: 'bash',
  shell: 'bash',
  console: 'bash',
  text: 'plain'
};

function highlighter(code, lang) {
  const language = ALIASES[lang] || lang || 'plain';
  const grammar = Prism.languages[language];
  const html = grammar
    ? Prism.highlight(code, grammar, language)
    : Prism.util.encode(code).toString();
  return `<pre class="code-block language-${language}" data-lang="${language}"><code class="language-${language}">${escapeSvelte(html)}</code></pre>`;
}

/** @type {import('@sveltejs/kit').Config} */
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.svx'],
      smartypants: false,
      highlight: { highlighter }
    })
  ],
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    })
  }
};
