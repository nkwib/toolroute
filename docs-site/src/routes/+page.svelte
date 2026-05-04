<script>
  // Deep-link to the TS Playground with the canonical narrowing demo.
  const PLAYGROUND_URL =
    'https://www.typescriptlang.org/play/?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4AoUSWRFAOwzkQEEQEMxoBVAEz5gAvD5UBBPnHRwwJOABE4AYxgBnYJGABXTPAA2cMAFkA9DQDmuiCFDAYAGQAUAQQDeAUgC+ASkPGzlqzas2GEKHyAGSCEJTBxyAAA';
</script>

<svelte:head>
  <title>ToolRoute — typed routing graph for the Vercel AI SDK</title>
  <meta
    name="description"
    content="Vercel AI SDK companion that turns tool definitions into a typed routing graph. Compile-time narrowing plus a 50-line runtime guard reject the same illegal call from both sides."
  />
</svelte:head>

<section class="hero">
  <div class="hero-grid">
    <div class="hero-copy">
      <span class="badge">
        <span class="dot" aria-hidden="true"></span>
        v0.1 · MIT · ~340 LOC · 37 tests
      </span>
      <h1>
        Out-of-order tool calls<br />
        <span class="accent">cannot</span> reach your&nbsp;model.
      </h1>
      <p class="lede">
        <strong>ToolRoute</strong> wraps Vercel AI SDK tool definitions so each tool declares
        its legal <code>nextAllowed</code> successors. Compile-time narrowing plus a 50-line
        runtime guard reject the same illegal call from both sides.
      </p>

      <div class="cta">
        <a class="btn primary" href="/docs">Read the docs</a>
        <a class="btn ghost" href="/before-after">See before / after</a>
      </div>

      <pre class="install"><span class="prompt">$</span> pnpm add toolroute ai zod</pre>
    </div>

    <aside class="demo">
      <div class="demo-tab">
        <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
        <span class="filename">code-review-agent.ts</span>
      </div>
      <pre class="demo-code"><code><span class="kw">import</span> &lbrace; defineTool, createRouterFromTools &rbrace; <span class="kw">from</span> <span class="str">'toolroute'</span>;

<span class="kw">const</span> <span class="fn">search</span> = <span class="fn">defineTool</span>(&lbrace;
  <span class="prop">name</span>: <span class="str">'search'</span>,
  <span class="prop">nextAllowed</span>: [<span class="str">'review'</span>] <span class="kw">as const</span>,
  <span class="cmt">/* ... */</span>
&rbrace;);
<span class="cmt">// review → ['commit'], commit → []</span>

<span class="kw">const</span> <span class="fn">router</span> = <span class="fn">createRouterFromTools</span>(
  [search, review, commit] <span class="kw">as const</span>,
  &lbrace; <span class="prop">strictMode</span>: <span class="kw">true</span> &rbrace;,
);

<span class="kw">await</span> <span class="fn">streamText</span>(&lbrace; model, <span class="prop">tools</span>: router.tools, prompt &rbrace;);

<span class="cmt">// Model picks 'commit' after 'search' (illegal):</span>
<span class="err">[runner] BLOCKED: ToolRoute violation: 'commit' called after 'search';
         legal next: [review] (toolroute@0.1.0+ai-sdk@6.0.174)</span></code></pre>
    </aside>
  </div>
</section>

<section class="features">
  <div class="features-inner">
    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="5" cy="12" r="2.2" stroke="currentColor" stroke-width="1.5" />
          <circle cx="19" cy="12" r="2.2" stroke="currentColor" stroke-width="1.5" />
          <path d="M7 12h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
      <h3>One source of truth</h3>
      <p>
        <code>nextAllowed</code> lives on the tool itself. The type narrowing and the runtime
        guard read the same array — they cannot drift.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 4h16v16H4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          <path d="M8 9l3 3-3 3M14 15h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h3>Runtime before types</h3>
      <p>
        The 50-line guard shipped first, with a recorded terminal session of a real rejection.
        The narrowing matches observable behaviour, not a compile-time lie.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h3>Names derived</h3>
      <p>
        <code>createRouterFromTools</code> infers the name set from the array. Rename
        <code>review</code> once and every <code>nextAllowed</code> referencing it is a
        <code>tsc</code> error at <em>its</em> site, not yours.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l9 4-9 4-9-4 9-4z M3 12l9 4 9-4 M3 18l9 4 9-4" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
      </div>
      <h3>Loud diagnostics</h3>
      <p>
        <code>ToolRouteViolation</code> carries <code>prev</code>, <code>next</code>,
        <code>legalNext</code>, and <code>routerVersion</code> — paste the message into a
        Sentry title and you know which SDK was on the box.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h3>Edge-aware</h3>
      <p>
        <code>console.warn</code> is suppressed in Vercel Edge Functions. ToolRoute detects
        the runtime and emits a one-time init warning so violations do not vanish.
      </p>
    </div>

    <div class="feature">
      <div class="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5" />
          <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
      <h3>Calling card, not platform</h3>
      <p>
        No paid tier, no hosted dashboard, no playground in v1. ~340 LOC, 37 tests, weekly CI
        cron pinned to <code>ai@latest</code>. Zero distraction surface.
      </p>
    </div>
  </div>
</section>

<section class="ports">
  <div class="ports-inner">
    <div class="ports-copy">
      <h2>Inspect the graph in two minutes</h2>
      <p>
        <code>printRouterGraph(router)</code> emits a deterministic plain-text adjacency
        dump. Sorted alphabetically, terminals tagged, zero runtime dependencies. At 7+
        tools your routing graph lives across files; this is your single-screen view.
      </p>
      <a class="btn ghost compact" href="/docs#define-tool">
        How nextAllowed works
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
    <pre class="ports-code"><code><span class="cmt">// printRouterGraph(router) — diff-stable, zero deps.</span>
<span class="fn">commit</span> -&gt; <span class="kw">(terminal)</span>
<span class="fn">review</span> -&gt; <span class="prop">commit</span>
<span class="fn">search</span> -&gt; <span class="prop">review</span>

<span class="cmt">// At runtime: every ToolRouteViolation carries the version</span>
<span class="cmt">// you compiled against — paste into Sentry as-is.</span>
<span class="prop">routerVersion</span>: <span class="str">"toolroute@0.1.0+ai-sdk@6.0.174"</span></code></pre>
  </div>
</section>

<section class="cta-band">
  <div class="cta-band-inner">
    <h2>Wrap an existing Vercel AI SDK agent in five minutes.</h2>
    <p>
      The 5-line quickstart in the docs is the same code as
      <code>examples/code-review-agent/</code> in the repo — the same code that produced the
      recorded rejection.
    </p>
    <div class="cta">
      <a class="btn primary" href="/docs#quickstart">Quickstart</a>
      <a class="btn ghost" href="/decisions/runtime-before-types">Why runtime first?</a>
      <a class="btn ghost" href={PLAYGROUND_URL} target="_blank" rel="noopener">
        Open in TS Playground
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 17L17 7M17 7H9M17 7V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </div>
</section>

<style>
  .hero {
    padding: var(--sp-9) var(--sp-5) var(--sp-8);
    background:
      radial-gradient(circle at 80% -10%, var(--c-accent-soft), transparent 50%),
      radial-gradient(circle at 0% 100%, var(--c-bg-alt), transparent 60%),
      var(--c-bg);
    border-bottom: 1px solid var(--c-border);
  }

  .hero-grid {
    max-width: var(--wide-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: var(--sp-7);
    align-items: center;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--sp-2);
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    color: var(--c-text-muted);
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 4px 10px;
    border-radius: 999px;
    box-shadow: var(--sh-sm);
    margin-bottom: var(--sp-5);
  }

  .badge .dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--c-good);
    border-radius: 999px;
  }

  .hero h1 {
    font-size: clamp(2.25rem, 4.5vw, var(--fs-4xl));
    line-height: 1.05;
    letter-spacing: -0.04em;
    margin-bottom: var(--sp-5);
  }

  .accent {
    color: var(--c-accent);
    font-style: italic;
    font-weight: 700;
  }

  .lede {
    font-size: var(--fs-md);
    color: var(--c-text-muted);
    max-width: 42ch;
    margin-bottom: var(--sp-6);
  }

  .lede strong {
    color: var(--c-text);
    font-weight: 600;
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-3);
    margin-bottom: var(--sp-5);
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
    transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
  }

  .btn.primary {
    background: var(--c-text);
    color: var(--c-bg);
    border-color: var(--c-text);
  }

  .btn.primary:hover {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: var(--c-accent-fg);
    text-decoration: none;
  }

  .btn.ghost {
    background: transparent;
    color: var(--c-text);
    border-color: var(--c-border-strong);
  }

  .btn.ghost:hover {
    background: var(--c-bg-alt);
    text-decoration: none;
  }

  .btn.compact {
    padding: 0.5rem 0.85rem;
    font-size: var(--fs-sm);
  }

  .install {
    display: inline-block;
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    padding: var(--sp-2) var(--sp-4);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    color: var(--c-text);
    box-shadow: var(--sh-sm);
    margin: 0;
  }

  .install .prompt {
    color: var(--c-text-subtle);
    margin-right: var(--sp-2);
    user-select: none;
  }

  .demo {
    background: var(--c-code-bg);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    box-shadow: var(--sh-lg);
    overflow: hidden;
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
  }

  .demo-tab {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    padding: var(--sp-3) var(--sp-4);
    border-bottom: 1px solid var(--c-border);
    background: var(--c-bg-alt);
    color: var(--c-text-subtle);
    font-size: var(--fs-xs);
  }

  .dots { display: inline-flex; gap: 6px; }
  .dots i { width: 10px; height: 10px; border-radius: 999px; background: var(--c-border-strong); display: inline-block; }
  .dots i:nth-child(1) { background: var(--c-accent); opacity: 0.55; }
  .dots i:nth-child(2) { background: #f59e0b; opacity: 0.55; }
  .dots i:nth-child(3) { background: var(--c-good); opacity: 0.55; }

  .filename { font-family: var(--font-mono); }

  .demo-code {
    margin: 0;
    padding: var(--sp-5);
    background: transparent;
    color: var(--c-code-text);
    overflow-x: auto;
    font-size: var(--fs-sm);
    line-height: 1.7;
    font-family: var(--font-mono);
  }

  .demo-code code { background: transparent; border: 0; padding: 0; color: inherit; font-family: var(--font-mono); font-size: inherit; }
  .demo-code .kw   { color: var(--c-code-keyword); }
  .demo-code .str  { color: var(--c-code-string); }
  .demo-code .fn   { color: var(--c-code-fn); }
  .demo-code .cmt  { color: var(--c-code-comment); font-style: italic; }
  .demo-code .prop { color: var(--c-code-prop); }
  .demo-code .err  { color: var(--c-code-deleted); display: block; margin-top: var(--sp-3); white-space: pre-wrap; }

  .features {
    padding: var(--sp-9) var(--sp-5);
  }

  .features-inner {
    max-width: var(--wide-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--sp-5);
  }

  .feature {
    background: var(--c-surface);
    border: 1px solid var(--c-border);
    padding: var(--sp-5);
    border-radius: var(--r-lg);
  }

  .feature-icon {
    width: 36px; height: 36px;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--c-bg-alt); border: 1px solid var(--c-border);
    border-radius: var(--r-md); color: var(--c-accent);
    margin-bottom: var(--sp-4);
  }

  .feature-icon svg { width: 18px; height: 18px; }

  .feature h3 { font-size: var(--fs-md); margin: 0 0 var(--sp-2); letter-spacing: -0.02em; }
  .feature p { color: var(--c-text-muted); margin: 0; font-size: var(--fs-sm); line-height: 1.65; }

  .ports {
    padding: var(--sp-8) var(--sp-5);
    background: var(--c-bg-alt);
    border-top: 1px solid var(--c-border);
    border-bottom: 1px solid var(--c-border);
  }

  .ports-inner {
    max-width: var(--wide-max);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: var(--sp-7);
    align-items: center;
  }

  .ports-copy h2 { margin: 0 0 var(--sp-3); font-size: var(--fs-2xl); letter-spacing: -0.03em; }
  .ports-copy p { color: var(--c-text-muted); margin-bottom: var(--sp-5); font-size: var(--fs-md); }

  .ports-code {
    margin: 0;
    background: var(--c-code-bg);
    border: 1px solid var(--c-border);
    border-radius: var(--r-lg);
    padding: var(--sp-5);
    overflow-x: auto;
    color: var(--c-code-text);
    font-family: var(--font-mono);
    font-size: var(--fs-sm);
    line-height: 1.65;
    box-shadow: var(--sh-md);
  }

  .ports-code code { background: transparent; border: 0; padding: 0; color: inherit; font-family: var(--font-mono); }
  .ports-code .kw   { color: var(--c-code-keyword); }
  .ports-code .str  { color: var(--c-code-string); }
  .ports-code .fn   { color: var(--c-code-fn); }
  .ports-code .cmt  { color: var(--c-code-comment); font-style: italic; }
  .ports-code .prop { color: var(--c-code-prop); }

  .cta-band {
    padding: var(--sp-9) var(--sp-5);
    text-align: center;
  }

  .cta-band-inner {
    max-width: 44rem;
    margin: 0 auto;
  }

  .cta-band h2 { font-size: var(--fs-2xl); margin-bottom: var(--sp-2); letter-spacing: -0.03em; }
  .cta-band p { color: var(--c-text-muted); margin-bottom: var(--sp-5); font-size: var(--fs-md); }
  .cta-band .cta { justify-content: center; }

  @media (max-width: 960px) {
    .hero { padding: var(--sp-7) var(--sp-5) var(--sp-7); }
    .hero-grid { grid-template-columns: 1fr; gap: var(--sp-6); }
    .features-inner { grid-template-columns: 1fr 1fr; }
    .ports-inner { grid-template-columns: 1fr; }
  }

  @media (max-width: 720px) {
    .hero h1 { font-size: clamp(2rem, 8vw, 2.6rem); }
    .features-inner { grid-template-columns: 1fr; }
  }
</style>
