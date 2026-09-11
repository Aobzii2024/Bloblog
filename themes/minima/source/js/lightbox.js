/* Full-featured image lightbox:
   - click any content image to open
   - gallery navigation (prev/next/arrow keys) across post images
   - zoom in/out (click / +/- / wheel), drag to pan
   - Esc / backdrop click to close, loading spinner, caption from alt
   - respects prefers-reduced-motion */
(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  let lb = null;
  let img = null;
  let caption = null;
  let counter = null;
  let images = [];
  let index = 0;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const build = () => {
    if (lb) return;
    lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', '图片查看');
    lb.innerHTML = `
      <button class="lb-close" type="button" aria-label="关闭">×</button>
      <button class="lb-nav lb-prev" type="button" aria-label="上一张">‹</button>
      <button class="lb-nav lb-next" type="button" aria-label="下一张">›</button>
      <div class="lb-stage"><img alt=""></div>
      <div class="lb-caption"></div>
      <div class="lb-counter"></div>
      <div class="lb-hint">滚轮缩放 · 拖拽平移 · Esc 关闭</div>
    `;
    document.body.appendChild(lb);
    img = lb.querySelector('img');
    caption = lb.querySelector('.lb-caption');
    counter = lb.querySelector('.lb-counter');

    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => step(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => step(1));
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb-stage')) close();
      else if (e.target === img) toggleZoom();
    });

    // wheel zoom
    lb.addEventListener('wheel', (e) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      applyScale(scale * factor);
    }, { passive: false });

    // drag to pan (skip if reduced motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Loading state life cycle
    img.addEventListener('load', () => img.classList.remove('is-loading'), { once: true });
    img.addEventListener('error', () => img.classList.remove('is-loading'), { once: true });

    if (!prefersReducedMotion) {
      const stage = lb.querySelector('.lb-stage');
      stage.addEventListener('pointerdown', (e) => {
        if (scale <= 1) return;
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        stage.setPointerCapture(e.pointerId);
      });
      stage.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        tx += e.clientX - lastX;
        ty += e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        applyTransform();
      });
      stage.addEventListener('pointerup', () => { dragging = false; });
      stage.addEventListener('pointercancel', () => { dragging = false; });
    }
  };

  const applyScale = (next) => {
    scale = Math.min(4, Math.max(1, next));
    if (scale === 1) { tx = 0; ty = 0; }
    applyTransform();
  };

  const applyTransform = () => {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    img.classList.toggle('is-zoomed', scale > 1);
  };

  const resetZoom = () => { scale = 1; tx = 0; ty = 0; applyTransform(); };
  const toggleZoom = () => applyScale(scale > 1 ? 1 : 2);

  const show = (i) => {
    index = (i + images.length) % images.length;
    const src = images[index].currentSrc || images[index].src;
    const alt = images[index].alt || '';
    resetZoom();
    img.classList.add('is-loading');
    img.src = src;
    caption.textContent = alt;
    caption.hidden = !alt;
    counter.textContent = images.length > 1 ? `${index + 1} / ${images.length}` : '';
    const showPrevNext = images.length > 1;
    lb.querySelector('.lb-prev').hidden = !showPrevNext;
    lb.querySelector('.lb-next').hidden = !showPrevNext;
  };

  const open = (target) => {
    build();
    const content = document.getElementById('post-content') || document.body;
    images = Array.from(content.querySelectorAll('img'));
    index = Math.max(0, images.indexOf(target));
    document.body.style.overflow = 'hidden';
    lb.classList.add('is-open');
    show(index);
  };

  const close = () => {
    if (!lb) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    resetZoom();
  };

  const step = (dir) => show(index + dir);

  const initLightbox = () => {
    // Guard: runs on both DOMContentLoaded and op:page-ready (dispatched by
    // site-init at DOMContentLoaded). Bind document-level listeners only once.
    if (window.__minimaLightboxInit) return;
    window.__minimaLightboxInit = true;

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest && t.closest('.markdown-content') && t.tagName === 'IMG') {
        e.preventDefault();
        open(t);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!lb || !lb.classList.contains('is-open')) return;
      switch (e.key) {
        case 'Escape': close(); break;
        case 'ArrowLeft': e.preventDefault(); step(-1); break;
        case 'ArrowRight': e.preventDefault(); step(1); break;
        case '+': case '=': e.preventDefault(); applyScale(scale * 1.25); break;
        case '-': e.preventDefault(); applyScale(scale / 1.25); break;
        case '0': e.preventDefault(); resetZoom(); break;
      }
    });
  };

  document.addEventListener('DOMContentLoaded', initLightbox);
  document.addEventListener(events.pageReady || 'op:page-ready', initLightbox);
})();
