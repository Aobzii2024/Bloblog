(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};
  const attributes = config.attributes || {};

  const initArchiveSearch = () => {
    const input = document.querySelector(selectors.archiveSearchInput || '#archive-search-input');

    if (!input) {
      return;
    }

    if (input.getAttribute(attributes.bound || 'data-bound') === '1') {
      return;
    }

    input.setAttribute(attributes.bound || 'data-bound', '1');

    const items = Array.from(document.querySelectorAll(selectors.archiveItem || '.archive-item')).map((item) => ({
      element: item,
      text: item.getAttribute('data-search') || ''
    }));
    const groups = Array.from(document.querySelectorAll(selectors.archiveGroup || '.archive-group'));
    let searchFrame = 0;

    const syncGroups = () => {
      groups.forEach((group) => {
        const visibleItems = Array.from(group.querySelectorAll(selectors.archiveItem || '.archive-item')).filter(
          (item) => item.style.display !== 'none'
        );
        group.style.display = visibleItems.length ? '' : 'none';
      });
    };

    const filterItems = () => {
      const keyword = (input.value || '').trim().toLowerCase();

      items.forEach(({ element, text }) => {
        element.style.display = !keyword || text.includes(keyword) ? '' : 'none';
      });

      syncGroups();
    };

    input.addEventListener('input', () => {
      if (searchFrame) {
        window.cancelAnimationFrame(searchFrame);
      }

      searchFrame = window.requestAnimationFrame(() => {
        searchFrame = 0;
        filterItems();
      });
    });

    syncGroups();
  };

  document.addEventListener('DOMContentLoaded', initArchiveSearch);
  document.addEventListener(events.pageReady || 'op:page-ready', initArchiveSearch);
})();
