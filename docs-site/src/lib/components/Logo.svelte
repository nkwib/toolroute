<script>
  let { size = 28 } = $props();
</script>

<span class="logo">
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    role="img"
    fill="none"
  >
    <rect
      x="3"
      y="3"
      width="26"
      height="26"
      rx="5"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linejoin="round"
    />
    <circle cx="9"  cy="16" r="1.8" fill="currentColor" />
    <circle cx="16" cy="16" r="1.8" fill="currentColor" />
    <circle cx="23" cy="16" r="1.8" fill="currentColor" />
    <line
      x1="11" y1="16" x2="14" y2="16"
      stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
    />
    <line
      x1="18" y1="16" x2="21" y2="16"
      stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
    />
  </svg>
  <span class="wordmark">toolroute</span>
</span>

<style>
  .logo {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--c-text);
    font-weight: 600;
    letter-spacing: -0.02em;
    font-size: 1.05rem;
  }

  .wordmark {
    font-family: var(--font-mono);
    font-size: 0.95rem;
  }
</style>
