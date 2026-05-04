<script>
  import RouterGraph from '$lib/components/RouterGraph.svelte';

  let { data } = $props();

  // Deep-link to the TS Playground prefilled with the canonical
  // narrowing demo. The encoded program is the same shape as
  // illegal-call.demo.ts in the package.
  const PLAYGROUND_URL =
    'https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4AoUSWRFAOwzkQEEQEMxoBVAEz5gAvD5UBBPnHRwwJOABE4AYxgBnYJGABXTPAA2cMAFkA9DQDmuiCFDAYAGQAUAQQDeAUgC+ASkPGzlqzas2GEKHyAGSCEJTBxyAAA';
</script>

<svelte:head>
  <title>ToolRoute — before / after</title>
  <meta
    name="description"
    content="A real three-tool agent on the Vercel AI SDK. Same data flow, same model call. The only difference is when the out-of-order tool call gets caught."
  />
</svelte:head>

<div class="ba-page">
  <header class="ba-hero">
    <a href="/" class="back-link">← Back to home</a>
    <h1>Before / after — Vercel AI SDK</h1>
    <p class="lede">
      A real three-tool agent: <code>search</code> → <code>review</code> →
      <code>commit</code>. Same model call, same SDK. The only difference is
      when an out-of-order tool call gets caught.
    </p>
  </header>

  <RouterGraph highlight="illegal" />

  <div class="comparison">
    <div class="col before">
      <div class="col-header">
        <span class="tag bad">Before</span>
        <span class="title">Vercel AI SDK · system prompt</span>
      </div>
      <pre class="code-block language-typescript" data-lang="typescript"><code class="language-typescript">{@html data.before}</code></pre>
      <p class="caption">
        The legality (<em>review must precede commit</em>) lives in a
        sentence inside the system prompt. The runtime accepts whatever
        order the model picks. When it picks wrong at 3am, you find out
        from Sentry — not from the editor.
      </p>
    </div>

    <div class="col after">
      <div class="col-header">
        <span class="tag good">After</span>
        <span class="title">ToolRoute · <code>nextAllowed</code> on each tool</span>
      </div>
      <pre class="code-block language-typescript" data-lang="typescript"><code class="language-typescript">{@html data.after}</code></pre>
      <p class="caption">
        <code>nextAllowed</code> on each tool is the single source of truth.
        Type narrowing reads it. The runtime guard reads it. They cannot drift.
        An out-of-order call is a <code>tsc</code> error <em>and</em> a
        thrown <code>ToolRouteViolation</code>.
      </p>
    </div>
  </div>

  <section class="diff-callout">
    <h2>The wedge, in a few lines of diff</h2>
    <pre class="code-block language-diff" data-lang="diff"><code class="language-diff">{@html data.diff}</code></pre>
  </section>

  <section class="cta-band">
    <h2>Try it</h2>
    <p>
      The TS Playground link below has the narrowing demo prefilled — type
      <code>commit</code> into a step where only <code>review</code> is legal
      and watch the red squiggle appear in your editor.
    </p>
    <div class="cta">
      <a class="btn primary" href={PLAYGROUND_URL} target="_blank" rel="noopener">
        Open in TS Playground
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M7 17L17 7M17 7H9M17 7V15"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
      <a class="btn ghost" href="/docs#per-step-narrowing">Per-step narrowing</a>
    </div>
  </section>
</div>

<style>
  .ba-page {
    max-width: var(--wide-max);
    margin: 0 auto;
    padding: var(--sp-7) var(--sp-5) var(--sp-9);
  }

  .ba-hero {
    max-width: 50rem;
    margin: 0 auto var(--sp-6);
    text-align: center;
  }

  .back-link {
    display: inline-block;
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    text-decoration: none;
    margin-bottom: var(--sp-4);
  }

  .back-link:hover {
    color: var(--c-text);
    text-decoration: underline;
  }

  h1 {
    font-size: clamp(2rem, 4.5vw, var(--fs-3xl));
    margin-bottom: var(--sp-3);
    margin-top: 0;
    letter-spacing: -0.03em;
  }

  .lede {
    color: var(--c-text-muted);
    font-size: var(--fs-md);
    margin: 0;
  }

  .comparison {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--sp-5);
    margin: var(--sp-6) 0 var(--sp-7);
    align-items: stretch;
  }

  .col {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    padding: var(--sp-5);
    box-shadow: var(--sh-sm);
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .col.before {
    border-left: 3px solid var(--c-code-deleted);
  }

  .col.after {
    border-left: 3px solid var(--c-good);
  }

  .col-header {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin-bottom: var(--sp-2);
    flex-wrap: wrap;
  }

  .tag {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 3px 8px;
    border-radius: var(--r-sm);
    font-weight: 600;
  }

  .tag.bad {
    background: color-mix(in srgb, var(--c-code-deleted) 15%, transparent);
    color: var(--c-code-deleted);
  }

  .tag.good {
    background: var(--c-good-soft);
    color: var(--c-good);
  }

  .title {
    font-weight: 600;
    color: var(--c-text);
    font-size: var(--fs-md);
  }

  .col pre.code-block {
    margin: var(--sp-3) 0;
    flex: 1;
  }

  .caption {
    color: var(--c-text-muted);
    font-size: var(--fs-sm);
    margin: var(--sp-2) 0 0;
  }

  .diff-callout {
    background: var(--c-bg-alt);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    padding: var(--sp-5) var(--sp-6);
    margin-bottom: var(--sp-7);
  }

  .diff-callout h2 {
    margin: 0 0 var(--sp-3);
    font-size: var(--fs-lg);
    letter-spacing: -0.02em;
  }

  .diff-callout pre.code-block {
    margin-bottom: 0;
  }

  .cta-band {
    text-align: center;
    padding: var(--sp-5) 0 0;
    max-width: 42rem;
    margin: 0 auto;
  }

  .cta-band h2 {
    font-size: var(--fs-xl);
    margin-bottom: var(--sp-2);
    margin-top: 0;
  }

  .cta-band p {
    color: var(--c-text-muted);
    margin-bottom: var(--sp-4);
  }

  .cta {
    display: inline-flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    justify-content: center;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    padding: 0.65rem 1.1rem;
    border-radius: var(--r-md);
    font-size: var(--fs-sm);
    font-weight: 500;
    text-decoration: none;
    border: 1px solid transparent;
    transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
  }

  .btn.primary {
    background: var(--c-accent);
    color: var(--c-accent-fg);
    border-color: var(--c-accent);
  }

  .btn.primary:hover {
    background: color-mix(in srgb, var(--c-accent) 88%, black);
    border-color: color-mix(in srgb, var(--c-accent) 88%, black);
  }

  .btn.ghost {
    background: transparent;
    color: var(--c-text);
    border-color: var(--c-border);
  }

  .btn.ghost:hover {
    background: var(--c-bg-alt);
    border-color: var(--c-border-strong);
  }

  @media (max-width: 960px) {
    .comparison {
      grid-template-columns: 1fr;
    }
  }
</style>
