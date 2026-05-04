<script>
  import '../styles/global.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  />
  <script>
    // Apply stored theme before paint to avoid FOUC.
    (function () {
      try {
        var stored = localStorage.getItem('toolroute-theme');
        var theme =
          stored === 'light' || stored === 'dark'
            ? stored
            : window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light';
        document.documentElement.dataset.theme = theme;
      } catch (_) {}
    })();
  </script>
</svelte:head>

<div class="page-shell">
  <Header />
  <div class="page-content">
    {@render children()}
  </div>
  <Footer />
</div>

<style>
  .page-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .page-content {
    flex: 1;
  }
</style>
