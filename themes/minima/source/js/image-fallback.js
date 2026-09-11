/* Image fallback.

Remote images can fail (CDN outage, network loss). Mark them so the CSS can
show a placeholder instead of the browser's broken-image icon, and keep the
slot from collapsing.
*/
(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const markBroken = (img) => {
    if (img.dataset.fallbackBound === '1') return;
    img.dataset.fallbackBound = '1';
    img.addEventListener('error', () => {
      img.classList.add('is-broken');
      img.removeAttribute('src');
      if (!img.alt) img.alt = '图片加载失败';
    }, { once: true });
  };

  const init = () => {
    Array.from(document.querySelectorAll('.markdown-content img'))
      .forEach(markBroken);
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener(events.pageReady || 'op:page-ready', init);
})();
