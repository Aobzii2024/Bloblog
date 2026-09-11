/* Typewriter effect for the home hero description line.
   Runs once on first paint, respects reduced-motion, no layout shift
   (height reserved via CSS min-height on .home-hero-copy .typewriter-line). */
(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const init = () => {
    const hero = document.querySelector('.home-hero-copy');
    if (!hero || hero.dataset.typewriterDone === '1') return;
    hero.dataset.typewriterDone = '1';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Use the last paragraph (theme.desc) as the typewriter line
    const paras = hero.querySelectorAll('p:not(.eyebrow)');
    if (!paras.length) return;
    const target = paras[paras.length - 1];
    const fullText = target.textContent;
    if (!fullText || fullText.length < 4) return;

    target.classList.add('typewriter-line');
    target.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '▍';
    target.appendChild(cursor);

    let i = 0;
    const tick = () => {
      if (i < fullText.length) {
        target.insertBefore(document.createTextNode(fullText[i]), cursor);
        i++;
        setTimeout(tick, 60 + Math.random() * 40);
      } else {
        setTimeout(() => cursor.classList.add('is-idle'), 800);
      }
    };
    setTimeout(tick, 350);
  };

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener(events.pageReady || 'op:page-ready', init);
})();
