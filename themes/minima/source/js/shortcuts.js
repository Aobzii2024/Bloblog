/* Keyboard shortcuts:
     t       scroll to top
     /       focus archive search (on archive page)
     Esc     blur active element / close overlays
     ?       show a tiny shortcut hint toast
   Ignored while typing in inputs/textareas/contenteditable. */
(() => {
  const isTyping = () => {
    const el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  };

  let hintEl = null;
  let hintTimer = 0;
  const showHint = () => {
    if (!hintEl) {
      hintEl = document.createElement('div');
      hintEl.className = 'shortcut-hint';
      hintEl.innerHTML = `
        <div class="shortcut-hint-title">快捷键</div>
        <div class="shortcut-row"><kbd>t</kbd><span>回到顶部</span></div>
        <div class="shortcut-row"><kbd>/</kbd><span>聚焦搜索（归档页）</span></div>
        <div class="shortcut-row"><kbd>Esc</kbd><span>关闭浮层</span></div>
        <div class="shortcut-row"><kbd>?</kbd><span>打开/关闭本提示</span></div>`;
      document.body.appendChild(hintEl);
    }
    hintEl.classList.add('is-visible');
    clearTimeout(hintTimer);
    hintTimer = setTimeout(() => hintEl.classList.remove('is-visible'), 4000);
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hintEl && hintEl.classList.contains('is-visible')) {
      hintEl.classList.remove('is-visible');
      return;
    }
    if (isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;

    switch (e.key) {
      case 't':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case '/': {
        const input = document.getElementById('archive-search-input');
        if (input) {
          e.preventDefault();
          input.focus();
          input.select();
        }
        break;
      }
      case '?':
        showHint();
        break;
    }
  });
})();
