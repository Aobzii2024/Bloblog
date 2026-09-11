/* Navigation layer.
   Strategy: native browser navigation (reliable, no FOUC/blank-flash issues
   with async renderers like MathJax) + hover prefetch for near-instant loads.
   No overlays, no progress bars - the browser handles navigation chrome itself.
*/
(() => {
  const prefetched = new Set();

  const prefetchPage = (url) => {
    if (prefetched.has(url.href)) return;
    prefetched.add(url.href);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url.href;
    link.as = 'document';
    document.head.appendChild(link);
  };

  const initPrefetch = () => {
    if (window.__minimaPrefetchBound) return;
    window.__minimaPrefetchBound = true;
    document.addEventListener('mouseover', (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link) return;
      try {
        const url = new URL(link.href, window.location.href);
        if (url.origin === window.location.origin && !url.hash) prefetchPage(url);
      } catch (e) { /* ignore malformed URLs */ }
    }, { passive: true });
  };

  document.addEventListener('DOMContentLoaded', initPrefetch);
})();
