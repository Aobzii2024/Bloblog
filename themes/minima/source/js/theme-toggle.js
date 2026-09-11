/* Theme Toggle - Modern SVG Icons */
(() => {
  'use strict';

  const STORAGE_KEY = 'preferredTheme';
  const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /** Determine current theme state. */
  const currentIsDark = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return systemQuery.matches;
  };

  /** Apply theme class to document and body. */
  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('darkmode', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    if (document.body) {
      document.body.classList.toggle('darkmode', isDark);
    }
  };

  /** Circular ripple reveal via View Transition API. */
  const transitionTheme = (isDark, originEl) => {
    const x = originEl
      ? originEl.getBoundingClientRect().left + originEl.offsetWidth / 2
      : window.innerWidth / 2;
    const y = originEl
      ? originEl.getBoundingClientRect().top + originEl.offsetHeight / 2
      : 0;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const vt = document.startViewTransition(() => applyTheme(isDark));
      vt.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 520,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)'
          }
        );
      }).catch(() => {});
      return;
    }

    document.documentElement.classList.add('theme-switching');
    applyTheme(isDark);
    setTimeout(() => {
      document.documentElement.classList.remove('theme-switching');
    }, 220);
  };

  /** Update toggle button icon based on current theme. */
  const updateToggleIcon = (isDark) => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    // CSS handles the icon switching via ::before pseudo-element
    // Just ensure aria-label is correct
    toggle.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
  };

  const initThemeToggle = () => {
    const toggle = document.getElementById('themeToggle');
    applyTheme(currentIsDark());
    updateToggleIcon(currentIsDark());

    if (!toggle) return;

    const setDarkMode = (isDark, { animate = false, persist = true } = {}) => {
      if (animate) {
        transitionTheme(isDark, toggle);
      } else {
        applyTheme(isDark);
      }
      updateToggleIcon(isDark);

      if (persist) {
        if (systemQuery.matches === isDark) {
          localStorage.removeItem(STORAGE_KEY);
        } else {
          localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
        }
      }
    };

    if (toggle.dataset.bound !== '1') {
      toggle.addEventListener('click', () => {
        setDarkMode(!document.documentElement.classList.contains('darkmode'), { animate: true });
      });
      toggle.dataset.bound = '1';
    }

    // Follow OS changes while user hasn't explicitly overridden.
    if (!window.__minimaThemeSystemListener) {
      window.__minimaThemeSystemListener = true;
      systemQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem(STORAGE_KEY)) {
          setDarkMode(e.matches, { animate: false, persist: false });
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', initThemeToggle);
})();
