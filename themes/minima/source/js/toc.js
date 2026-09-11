/* Floating table of contents for long posts.
   - Builds a hierarchical tree from h2/h3 inside #post-content
   - Scroll-spy via IntersectionObserver, highlights current section
   - Shows per-item progress dot; whole widget shows overall %
   - Desktop: right-side floating rail; Mobile (<1100px): bottom FAB + drawer
*/
(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  // Scroll listener + current spy callback live at module scope so repeated
  // initToc() calls (DOMContentLoaded AND op:page-ready, both fired on first
  // paint) never stack duplicate scroll handlers.
  let scrollBound = false;
  let scrollHandler = null;
  let spyHandler = null;

  const ensureScrollBound = () => {
    if (scrollBound) return;
    scrollBound = true;
    let ticking = false;
    scrollHandler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { if (spyHandler) spyHandler(); ticking = false; });
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
  };

  const buildTree = (headings) => {
    const root = [];
    const stack = [{ children: root, level: 1 }];
    headings.forEach((h) => {
      const level = Number(h.tagName.slice(1));
      const node = { el: h, level, children: [], title: h.textContent.trim(), id: h.id };
      while (stack.length > 1 && stack[stack.length - 1].level >= level) stack.pop();
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    });
    return root;
  };

  const renderTree = (nodes, container) => {
    const list = document.createElement('ol');
    list.className = 'toc-list';
    nodes.forEach((node) => {
      const item = document.createElement('li');
      item.className = `toc-item toc-level-${node.level}`;
      const link = document.createElement('a');
      link.className = 'toc-link';
      link.href = `#${node.id}`;
      link.textContent = node.title;
      link.dataset.targetId = node.id;
      item.appendChild(link);
      if (node.children.length) {
        renderTree(node.children, item);
      }
      container === null ? null : list.appendChild(item);
    });
    container.appendChild(list);
  };

  const initToc = () => {
    // Clean up previous instance (SPA navigation)
    const old = document.getElementById('toc-root');
    if (old) old.remove();

    const content = document.getElementById('post-content');
    if (!content) return;

    const headings = Array.from(content.querySelectorAll('h2, h3')).filter((h) => h.id);
    if (headings.length < 3) return; // not worth it for short posts

    const root = document.createElement('nav');
    root.id = 'toc-root';
    root.setAttribute('aria-label', '文章目录');
    root.innerHTML = `
      <button class="toc-fab" type="button" aria-label="打开目录" aria-expanded="false">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="15" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="11" y2="18"/>
        </svg>
        <span class="toc-fab-progress"></span>
      </button>
      <div class="toc-panel">
        <div class="toc-head">
          <span class="toc-title">目录</span>
          <span class="toc-percent" aria-hidden="true"></span>
        </div>
        <div class="toc-body"></div>
      </div>
    `;
    document.body.appendChild(root);

    const body = root.querySelector('.toc-body');
    renderTree(buildTree(headings), body);

    const links = Array.from(body.querySelectorAll('.toc-link'));
    const linkById = new Map(links.map((l) => [l.dataset.targetId, l]));
    const percentEl = root.querySelector('.toc-percent');
    const fab = root.querySelector('.toc-fab');
    const fabProgress = root.querySelector('.toc-fab-progress');

    // Smooth scroll on click (respect anchor offset for headerlink icons)
    body.addEventListener('click', (e) => {
      const link = e.target.closest('.toc-link');
      if (!link) return;
      e.preventDefault();
      const target = document.getElementById(link.dataset.targetId);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });
      history.replaceState(null, '', `#${link.dataset.targetId}`);
      if (root.classList.contains('toc-open')) toggleDrawer(false);
    });

    // Scroll spy: mark active link at the heading nearest to viewport top
    let activeId = null;
    const setActive = (id) => {
      if (id === activeId) return;
      activeId = id;
      links.forEach((l) => l.classList.toggle('is-active', l.dataset.targetId === id));
      const active = linkById.get(id);
      if (active) {
        // keep active link visible inside scrollable toc body
        const ar = active.getBoundingClientRect();
        const br = body.getBoundingClientRect();
        if (ar.top < br.top || ar.bottom > br.bottom) {
          active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    };

    const onScrollSpy = () => {
      const fromTop = window.scrollY + 96;
      let current = headings[0];
      for (const h of headings) {
        if (h.offsetTop <= fromTop) current = h;
        else break;
      }
      if (current) setActive(current.id);

      // overall progress
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 100;
      percentEl.textContent = `${pct}%`;
      fabProgress.style.setProperty('--toc-pct', `${pct}%`);
    };

    spyHandler = onScrollSpy;
    ensureScrollBound();
    onScrollSpy();

    // Mobile drawer toggle
    const toggleDrawer = (open) => {
      root.classList.toggle('toc-open', open);
      fab.setAttribute('aria-expanded', String(open));
    };
    fab.addEventListener('click', () => toggleDrawer(!root.classList.contains('toc-open')));

    // Close drawer on outside click
    document.addEventListener('click', (e) => {
      if (root.classList.contains('toc-open') && !root.contains(e.target)) toggleDrawer(false);
    });

    // ESC closes
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && root.classList.contains('toc-open')) toggleDrawer(false);
    });
  };

  document.addEventListener('DOMContentLoaded', initToc);
  document.addEventListener(events.pageReady || 'op:page-ready', initToc);
})();
