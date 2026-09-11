/* Archive search: instant filter + match highlight + result count + empty state. */
  'use strict';
(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};
  const attributes = config.attributes || {};

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const initArchiveSearch = () => {
    const input = document.querySelector(selectors.archiveSearchInput || '#archive-search-input');
    if (!input) return;
    if (input.getAttribute(attributes.bound || 'data-bound') === '1') return;
    input.setAttribute(attributes.bound || 'data-bound', '1');

    const itemSelector = selectors.archiveItem || '.archive-item';
    const groupSelector = selectors.archiveGroup || '.archive-group';
    const items = Array.from(document.querySelectorAll(itemSelector));
    const groups = Array.from(document.querySelectorAll(groupSelector));

    // Result counter + empty state, inserted right after the input wrap
    const status = document.createElement('div');
    status.className = 'archive-search-status';
    status.setAttribute('aria-live', 'polite');
    input.parentElement.insertAdjacentElement('afterend', status);

    const emptyState = document.createElement('div');
    emptyState.className = 'archive-search-empty';
    emptyState.innerHTML = '<span class="archive-search-empty-icon">🍵</span><p>没有找到匹配的文章，换个关键词试试？</p>';
    emptyState.hidden = true;
    status.insertAdjacentElement('afterend', emptyState);

    const total = items.length;
    let searchFrame = 0;

    const highlightTitle = (el, keyword) => {
      const titleLink = el.querySelector('.archive-item-title-row a, .archive-item-main a');
      if (!titleLink) return;
      if (!titleLink.dataset.originalText) {
        titleLink.dataset.originalText = titleLink.textContent;
      }
      const original = titleLink.dataset.originalText;
      if (!keyword) {
        titleLink.textContent = original;
        return;
      }
      const re = new RegExp(`(${escapeRegExp(keyword)})`, 'gi');
      if (!re.test(original)) {
        titleLink.textContent = original;
        return;
      }
      titleLink.innerHTML = original.replace(re, '<mark>$1</mark>');
    };

    const filterItems = () => {
      const keyword = (input.value || '').trim().toLowerCase();
      let visible = 0;

      items.forEach((el) => {
        const text = (el.getAttribute('data-search') || '').toLowerCase();
        const hit = !keyword || text.includes(keyword);
        el.style.display = hit ? '' : 'none';
        if (hit) visible++;
        highlightTitle(el, keyword);
      });

      groups.forEach((group) => {
        const anyVisible = Array.from(group.querySelectorAll(itemSelector))
          .some((item) => item.style.display !== 'none');
        group.style.display = anyVisible ? '' : 'none';
      });

      status.textContent = keyword ? `${visible} / ${total} 篇` : '';
      status.classList.toggle('is-active', Boolean(keyword));
      emptyState.hidden = !(keyword && visible === 0);
    };

    input.addEventListener('input', () => {
      if (searchFrame) window.cancelAnimationFrame(searchFrame);
      searchFrame = window.requestAnimationFrame(() => {
        searchFrame = 0;
        filterItems();
      });
    });

    // Esc clears the search
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && input.value) {
        input.value = '';
        filterItems();
        e.stopPropagation();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', initArchiveSearch);
  document.addEventListener(events.pageReady || 'op:page-ready', initArchiveSearch);
})();
