(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const updateReadingProgress = () => {
    const progress = document.getElementById('reading-progress');
    const content = document.getElementById('post-content');

    if (!progress) {
      return;
    }

    if (!content) {
      progress.style.setProperty('--reading-progress', '0%');
      progress.hidden = true;
      return;
    }

    progress.hidden = false;

    const rect = content.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const contentHeight = Math.max(content.offsetHeight - viewportHeight * 0.45, 1);
    const traveled = Math.min(Math.max(viewportHeight * 0.3 - rect.top, 0), contentHeight);
    const percent = Math.max(0, Math.min(100, (traveled / contentHeight) * 100));

    progress.style.setProperty('--reading-progress', `${percent}%`);
  };

  const initReadingProgress = () => {
    updateReadingProgress();
  };

  document.addEventListener('DOMContentLoaded', initReadingProgress);
  document.addEventListener(events.pageReady || 'op:page-ready', initReadingProgress);
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  window.addEventListener('resize', updateReadingProgress);
})();
