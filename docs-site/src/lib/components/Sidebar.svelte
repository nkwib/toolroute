<script>
  import { page } from '$app/stores';

  /** @type {{ sections: { label: string, items: { href: string, label: string }[] }[] }} */
  let { sections } = $props();

  function isActive(href) {
    const pathname = $page.url.pathname;
    const hash = $page.url.hash;
    if (href.includes('#')) {
      const [base, h] = href.split('#');
      return pathname === base && hash === '#' + h;
    }
    return pathname === href || pathname.startsWith(href + '/');
  }
</script>

<aside class="sidebar" aria-label="Section navigation">
  <nav>
    {#each sections as section (section.label)}
      <div class="group">
        <div class="group-label">{section.label}</div>
        <ul>
          {#each section.items as item (item.href)}
            <li>
              <a class="item" class:active={isActive(item.href)} href={item.href}>
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
</aside>

<style>
  .sidebar {
    position: sticky;
    top: var(--header-h);
    align-self: start;
    max-height: calc(100vh - var(--header-h));
    overflow-y: auto;
    padding: var(--sp-6) var(--sp-3) var(--sp-7);
  }

  .group + .group {
    margin-top: var(--sp-5);
  }

  .group-label {
    font-family: var(--font-mono);
    font-size: var(--fs-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--c-text-subtle);
    padding: 0 var(--sp-3);
    margin-bottom: var(--sp-2);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0;
  }

  .item {
    display: block;
    padding: 6px var(--sp-3);
    color: var(--c-text-muted);
    text-decoration: none;
    font-size: var(--fs-sm);
    border-radius: var(--r-md);
    border-left: 2px solid transparent;
    transition: color 120ms ease, background 120ms ease, border-color 120ms ease;
    line-height: 1.4;
  }

  .item:hover {
    color: var(--c-text);
    background: var(--c-bg-alt);
    text-decoration: none;
  }

  .item.active {
    color: var(--c-accent);
    background: var(--c-bg-alt);
    font-weight: 500;
  }

  @media (max-width: 960px) {
    .sidebar {
      position: static;
      max-height: none;
      border-bottom: 1px solid var(--c-border);
      padding: var(--sp-4) 0;
      margin-bottom: var(--sp-5);
    }

    nav {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sp-3);
    }

    .group {
      flex: 1 1 240px;
    }

    .group + .group {
      margin-top: 0;
    }
  }
</style>
