(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};
  let mathJaxLoadingPromise = null;

  const normalizeDisplayMathBlocks = () => {
    const paragraphs = document.querySelectorAll(selectors.markdownParagraph || '.markdown-content p');

    paragraphs.forEach((paragraph) => {
      const raw = (paragraph.textContent || '').trim();
      const isDisplayMath = raw.startsWith('$$') && raw.endsWith('$$') && raw.length > 4;
      const hasInlineMath = /\$[^\n]+\$/.test(raw);

      if (!isDisplayMath && !hasInlineMath) {
        return;
      }

      paragraph.classList.add('math-pending');

      if (isDisplayMath) {
        const block = document.createElement('div');
        block.className = 'math-pending';
        block.textContent = raw;
        paragraph.replaceWith(block);
      }
    });
  };

  const revealMath = () => {
    document.querySelectorAll('.math-pending').forEach((node) => {
      node.classList.remove('math-pending');
    });
  };

  const hasMathContent = () => Array.from(
    document.querySelectorAll(selectors.markdownMathNode || '.markdown-content p, .markdown-content div')
  ).some((node) => {
    const text = (node.textContent || '').trim();
    return text.includes('$$') || /\$[^\n]+\$/.test(text);
  });

  const typesetMath = () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      return window.MathJax.typesetPromise();
    }

    return Promise.resolve();
  };

  const loadMathJax = () => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      return typesetMath();
    }

    if (mathJaxLoadingPromise) {
      return mathJaxLoadingPromise.then(typesetMath);
    }

    const script = document.createElement('script');
    script.src = '/js/tex-svg.js';
    script.defer = true;
    script.dataset.mathjaxLoader = '1';
    mathJaxLoadingPromise = new Promise((resolve) => {
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', resolve, { once: true });
    });
    document.head.appendChild(script);

    return mathJaxLoadingPromise.then(typesetMath);
  };

  const waitForMathJaxReady = () => new Promise((resolve) => {
    const poll = () => {
      if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
        window.MathJax.startup.promise.then(resolve).catch(resolve);
        return;
      }

      resolve();
    };

    poll();
  });

  const initMathEnhancements = () => {
    normalizeDisplayMathBlocks();

    if (!hasMathContent()) {
      return Promise.resolve();
    }

    return Promise.resolve(loadMathJax()).then(waitForMathJaxReady).then(typesetMath).finally(revealMath);
  };

  document.addEventListener('DOMContentLoaded', initMathEnhancements);
  document.addEventListener(events.pageReady || 'op:page-ready', (event) => {
    const promise = initMathEnhancements();
    if (event.detail && Array.isArray(event.detail.promises)) {
      event.detail.promises.push(promise);
    }
  });
})();
