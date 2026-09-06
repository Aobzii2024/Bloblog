(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const runSiteEnhancements = () => {
    const detail = { promises: [] };
    document.dispatchEvent(new CustomEvent(events.pageReady || 'op:page-ready', { detail }));
  };

  document.addEventListener('DOMContentLoaded', runSiteEnhancements);
})();
