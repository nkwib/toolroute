<script>
  /**
   * Renders the header of an API reference section: anchored heading with a
   * kind badge (function / class / type / const) and a monospace signature.
   *
   * @type {{ id: string, name: string, kind: 'function' | 'class' | 'type' | 'const', signature: string }}
   */
  let { id, name, kind, signature } = $props();
</script>

<header class="api-sig" id={id}>
  <a class="anchor" href={`#${id}`} aria-label={`Permalink to ${name}`}>#</a>
  <span class={`badge badge-${kind}`}>{kind}</span>
  <code class="name">{name}</code>
</header>
<pre class="sig"><code>{signature}</code></pre>

<style>
  .api-sig {
    display: flex;
    align-items: center;
    gap: var(--sp-3);
    margin: var(--sp-7) 0 var(--sp-3);
    padding-top: var(--sp-4);
    border-top: 1px solid var(--c-border);
    flex-wrap: wrap;
    scroll-margin-top: calc(var(--header-h) + var(--sp-4));
  }

  .anchor {
    color: var(--c-text-subtle);
    font-family: var(--font-mono);
    font-size: var(--fs-md);
    text-decoration: none;
    width: 1ch;
  }

  .anchor:hover {
    color: var(--c-accent);
  }

  .name {
    font-family: var(--font-mono);
    font-size: var(--fs-lg);
    color: var(--c-text);
    background: transparent;
    border: 0;
    padding: 0;
  }

  .badge {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 8px;
    border-radius: var(--r-sm);
    border: 1px solid var(--c-border);
    color: var(--c-text-muted);
    background: var(--c-bg-alt);
  }

  .badge-function {
    border-color: color-mix(in srgb, var(--c-accent) 35%, var(--c-border));
    color: var(--c-accent);
  }

  .badge-class {
    border-color: color-mix(in srgb, var(--c-code-deleted) 35%, var(--c-border));
    color: var(--c-code-deleted);
  }

  .badge-type {
    border-color: color-mix(in srgb, var(--c-code-prop) 35%, var(--c-border));
    color: var(--c-code-prop);
  }

  .badge-const {
    border-color: color-mix(in srgb, var(--c-code-num) 35%, var(--c-border));
    color: var(--c-code-num);
  }

  .sig {
    background: var(--c-code-bg);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
    padding: var(--sp-3) var(--sp-4);
    margin: 0 0 var(--sp-4);
    font-size: var(--fs-sm);
    overflow-x: auto;
  }

  .sig code {
    font-family: var(--font-mono);
    color: var(--c-code-text);
    background: transparent;
    border: 0;
    padding: 0;
    white-space: pre;
  }
</style>
