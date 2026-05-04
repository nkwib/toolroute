<script>
  /**
   * Renders a small SVG visualisation of the canonical search → review → commit
   * routing graph. Mirrors what `printRouterGraph(router)` would print.
   *
   * @type {{ highlight?: 'legal' | 'illegal' | null }}
   */
  let { highlight = null } = $props();
</script>

<div class="graph" role="img" aria-label="Routing graph: search → review → commit">
  <svg viewBox="0 0 360 120" width="100%" height="auto" preserveAspectRatio="xMidYMid meet">
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
      </marker>
      <marker id="arrow-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--c-code-deleted)" />
      </marker>
    </defs>

    <!-- nodes -->
    <g class="node">
      <circle cx="50" cy="60" r="26" fill="var(--c-surface)" stroke="currentColor" stroke-width="1.6" />
      <text x="50" y="64" text-anchor="middle" font-family="var(--font-mono)" font-size="13">search</text>
    </g>
    <g class="node">
      <circle cx="180" cy="60" r="26" fill="var(--c-surface)" stroke="currentColor" stroke-width="1.6" />
      <text x="180" y="64" text-anchor="middle" font-family="var(--font-mono)" font-size="13">review</text>
    </g>
    <g class="node">
      <circle cx="310" cy="60" r="26" fill="var(--c-surface)" stroke="currentColor" stroke-width="1.6" />
      <text x="310" y="64" text-anchor="middle" font-family="var(--font-mono)" font-size="13">commit</text>
    </g>

    <!-- legal edges -->
    <line
      x1="78" y1="60" x2="152" y2="60"
      stroke={highlight === 'legal' ? 'var(--c-accent)' : 'currentColor'}
      stroke-width={highlight === 'legal' ? 2.2 : 1.6}
      marker-end={highlight === 'legal' ? 'url(#arrow)' : 'url(#arrow)'}
    />
    <line
      x1="208" y1="60" x2="282" y2="60"
      stroke={highlight === 'legal' ? 'var(--c-accent)' : 'currentColor'}
      stroke-width={highlight === 'legal' ? 2.2 : 1.6}
      marker-end="url(#arrow)"
    />

    <!-- illegal edge -->
    {#if highlight === 'illegal'}
      <path
        d="M78 38 Q180 -18 282 38"
        fill="none"
        stroke="var(--c-code-deleted)"
        stroke-width="2.2"
        stroke-dasharray="5 4"
        marker-end="url(#arrow-bad)"
      />
      <line
        x1="170" y1="2" x2="190" y2="20"
        stroke="var(--c-code-deleted)" stroke-width="2.4" stroke-linecap="round"
      />
      <text x="180" y="116" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="var(--c-code-deleted)">
        ✗ search → commit (illegal)
      </text>
    {/if}
  </svg>
</div>

<style>
  .graph {
    color: var(--c-text-muted);
    margin: var(--sp-5) 0;
    padding: var(--sp-4) var(--sp-5);
    background: var(--c-bg-alt);
    border: 1px solid var(--c-border);
    border-radius: var(--r-md);
  }

  .node text {
    fill: var(--c-text);
  }
</style>
