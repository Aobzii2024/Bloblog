(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};
  const state = config.state || {};

  const navigationStateKey = state.navigationBound || '__opNavigationFeedbackBound';

  const emitPageReady = async () => {
    const detail = { promises: [] };
    document.dispatchEvent(new CustomEvent(events.pageReady || 'op:page-ready', { detail }));

    if (detail.promises.length) {
      await Promise.race([
        Promise.allSettled(detail.promises),
        new Promise((resolve) => window.setTimeout(resolve, 1800))
      ]);
    }

    document.dispatchEvent(new CustomEvent(events.contentReady || 'op:content-ready'));
  };

  const shouldUseNativeNavigation = () => {
    return true;
  };

  const loadPage = async (url, options = {}) => {
    const currentContent = document.querySelector(selectors.pageContent || '#page-content');
    if (!currentContent || shouldUseNativeNavigation()) {
      window.location.href = url.href;
      return;
    }

      document.documentElement.classList.remove('is-loading');
      document.documentElement.classList.add('is-navigating');

    try {
      const response = await fetch(url.href, {
        headers: { 'X-Requested-With': 'fetch' }
      });

      if (!response.ok) {
        throw new Error('Navigation request failed');
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const nextContent = doc.querySelector(selectors.pageContent || '#page-content');

      if (!nextContent) {
        throw new Error('Missing page content');
      }

      document.title = doc.title;
      document.documentElement.classList.add('is-rendering');
      currentContent.replaceWith(nextContent);
      const nextLanguage = doc.documentElement.getAttribute('lang');
      if (nextLanguage) {
        document.documentElement.setAttribute('lang', nextLanguage);
      }

      const currentHead = document.head;
      const nextHead = doc.head;
      const preservedSelectors = [
        'meta[charset]',
        'meta[name="viewport"]',
        'script[src="/js/theme-config.js"]',
        'script[src="/js/navigation-init.js"]',
        'script[src="/js/media-init.js"]',
        'script[src="/js/math-init.js"]',
        'script[src="/js/mermaid-init.js"]',
        'script[src="/js/theme-toggle.js"]',
        'script[src="/js/site-init.js"]'
      ];

      const currentScripts = Array.from(currentHead.querySelectorAll('script[src], link[rel="stylesheet"], link[rel="preconnect"], link[rel="dns-prefetch"]'));
      currentScripts.forEach((node) => {
        if (preservedSelectors.some((selector) => node.matches(selector))) {
          return;
        }
        node.remove();
      });

      Array.from(nextHead.children).forEach((node) => {
        if (
          node.tagName === 'TITLE' ||
          node.matches('meta[charset], meta[name="viewport"]') ||
          node.matches('script[src="/js/theme-config.js"], script[src="/js/navigation-init.js"], script[src="/js/media-init.js"], script[src="/js/math-init.js"], script[src="/js/mermaid-init.js"], script[src="/js/theme-toggle.js"], script[src="/js/site-init.js"]')
        ) {
          return;
        }

        if (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet') {
          currentHead.appendChild(node.cloneNode(true));
          return;
        }

        if (node.tagName === 'LINK' && (node.getAttribute('rel') === 'preconnect' || node.getAttribute('rel') === 'dns-prefetch')) {
          currentHead.appendChild(node.cloneNode(true));
        }
      });

      if (options.replace) {
        window.history.replaceState({}, doc.title, url.href);
      } else {
        window.history.pushState({}, doc.title, url.href);
      }

      window.scrollTo(0, 0);
      await emitPageReady();
    } catch (error) {
      window.location.href = url.href;
    } finally {
      document.documentElement.classList.remove('is-rendering');
      document.documentElement.classList.add('is-loaded');
      window.setTimeout(() => {
        document.documentElement.classList.remove('is-navigating');
        document.documentElement.classList.remove('is-loaded');
      }, 120);
    }
  };

  const initNavigationEnhancements = () => {
    if (window[navigationStateKey]) {
      return;
    }

    window[navigationStateKey] = true;

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === '_blank' ||
        link.hasAttribute('download')
      ) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const isSameOrigin = url.origin === window.location.origin;
      const isSamePageHash =
        url.pathname === window.location.pathname &&
        url.search === window.location.search &&
        url.hash;

      if (!isSameOrigin || isSamePageHash || shouldUseNativeNavigation()) {
        return;
      }

      event.preventDefault();
      loadPage(url);
    });

    window.addEventListener('popstate', () => {
      loadPage(new URL(window.location.href), { replace: true });
    });

    window.addEventListener('pageshow', () => {
      document.documentElement.classList.remove('is-navigating');
    });
  };

  document.addEventListener('DOMContentLoaded', initNavigationEnhancements);
})();
