/* Delight layer:
   1. Title swap when tab hidden -> "早点回来 🍵"
   2. Konami code -> party mode (accent hue spins once)
   3. Console greeting
   All subtle, non-blocking, motion-safe. */
(() => {
  // 1. Tab title swap
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '早点回来 🍵';
    } else {
      document.title = originalTitle;
    }
  });

  // 2. Konami: ↑↑↓↓←→←→BA
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;
  const party = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.animate(
      [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(360deg)' }],
      { duration: 1200, easing: 'ease-in-out' }
    );
  };
  document.addEventListener('keydown', (e) => {
    pos = (e.key === KONAMI[pos]) ? pos + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (pos === KONAMI.length) { pos = 0; party(); }
  });

  // 3. Console greeting
  if (!window.__minimaConsoleGreeted) {
    window.__minimaConsoleGreeted = true;
    console.log(
      '%c🍵 Bloblog %c 丢失的茶叶蛋，在文字里找回。',
      'background:#8fcf9d;color:#1d3325;padding:2px 8px;border-radius:4px;font-weight:bold',
      'color:#8fcf9d'
    );
  }
})();
