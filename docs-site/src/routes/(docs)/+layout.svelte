<script>
  import Sidebar from '$lib/components/Sidebar.svelte';

  let { children } = $props();

  const sections = [
    {
      label: 'Guide',
      items: [
        { href: '/docs', label: 'Overview' },
        { href: '/docs#install', label: 'Install' },
        { href: '/docs#quickstart', label: 'Quickstart' },
        { href: '/docs#define-tool', label: 'defineTool' },
        { href: '/docs#router', label: 'createRouterFromTools' },
        { href: '/docs#per-step-narrowing', label: 'Per-step narrowing' },
        { href: '/docs#strict-mode', label: 'strictMode' },
        { href: '/docs#edge-runtime', label: 'Edge runtime' },
        { href: '/docs#renames', label: 'Renames' },
        { href: '/docs#errors', label: 'Errors' },
        { href: '/docs#non-goals', label: 'Non-goals' }
      ]
    },
    {
      label: 'Reference',
      items: [
        { href: '/api', label: 'API' },
        { href: '/compatibility', label: 'Compatibility' },
        { href: '/glossary', label: 'Glossary' },
        { href: '/changelog', label: 'Changelog' }
      ]
    },
    {
      label: 'Decisions',
      items: [
        { href: '/decisions', label: 'Overview' },
        { href: '/decisions/runtime-before-types', label: 'Runtime before types' },
        { href: '/decisions/single-source-of-truth', label: 'Single source of truth' },
        { href: '/decisions/no-playground-in-v1', label: 'No playground in v1' },
        { href: '/decisions/vercel-ai-sdk-coupling', label: 'Vercel AI SDK coupling' }
      ]
    }
  ];
</script>

<div class="docs-shell">
  <Sidebar {sections} />
  <article class="docs-article">
    {@render children()}
  </article>
</div>

<style>
  .docs-shell {
    max-width: var(--wide-max);
    margin: 0 auto;
    padding: 0 var(--sp-5);
    display: grid;
    grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
    gap: var(--sp-7);
    align-items: start;
  }

  .docs-article {
    padding: var(--sp-7) 0 var(--sp-9);
    max-width: var(--content-max);
    width: 100%;
  }

  .docs-article :global(h1) {
    font-size: var(--fs-2xl);
    margin-top: 0;
  }

  .docs-article :global(h2) {
    scroll-margin-top: calc(var(--header-h) + var(--sp-4));
  }

  .docs-article :global(h2),
  .docs-article :global(h3) {
    scroll-margin-top: calc(var(--header-h) + var(--sp-4));
  }

  @media (max-width: 960px) {
    .docs-shell {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .docs-article {
      padding: var(--sp-4) 0 var(--sp-7);
    }
  }
</style>
