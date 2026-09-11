/* Back-to-top pill: appears after scrolling past one viewport,
   shows scroll %, single click returns smoothly. */
(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const init = () => {
    let btn = document.getElementById('back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'back-to-top';
      btn.type = 'button';
      btn.setAttribute('aria-label', '回到顶部');
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
        </svg>`;
      document.body.appendChild(btn);

      btn.addEventListener('click', () => {
        // Focus body for screen readers after scroll
    document.body.setAttribute('tabindex', '-1');
    document.body.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (btn.dataset.bound === '1') return;
    btn.dataset.bound = '1';

    let ticking = false;
    const update = () => {
      const show = window.scrollY > window.innerHeight * 0.8;
      btn.classList.toggle('is-visible', show);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener(events.pageReady || 'op:page-ready', init);
})();
