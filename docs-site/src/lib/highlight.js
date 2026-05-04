import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');

loadLanguages(['markup', 'css', 'clike', 'javascript', 'typescript', 'tsx', 'json', 'bash', 'diff', 'yaml']);

const ALIASES = { ts: 'typescript', js: 'javascript', sh: 'bash' };

export function highlight(code, lang) {
  const language = ALIASES[lang] || lang || 'plain';
  const grammar = Prism.languages[language];
  return grammar ? Prism.highlight(code, grammar, language) : Prism.util.encode(code).toString();
}
