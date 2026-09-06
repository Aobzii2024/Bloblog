(() => {
  const config = window.__minimaTheme || {};
  const selectors = config.selectors || {};
  const events = config.events || {};
  const attributes = config.attributes || {};

  const applyTheme = (isDark) => {
    document.documentElement.classList.toggle('darkmode', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    if (document.body) {
      document.body.classList.toggle('darkmode', isDark);
    }
  };

  const initThemeToggle = () => {
    const toggle = document.querySelector(selectors.themeToggle || '#themeToggle');

    if (!toggle) {
      applyTheme(localStorage.getItem('preferredTheme') === 'dark');
      return;
    }

    const setDarkMode = (isDark, options = {}) => {
      const darkIcon = toggle.getAttribute(attributes.darkIcon || 'data-dark-icon') || 'Dark';
      const lightIcon = toggle.getAttribute(attributes.lightIcon || 'data-light-icon') || 'Light';

      if (options.animate) {
        document.documentElement.classList.add('theme-switching');
      }

      applyTheme(isDark);
      toggle.textContent = isDark ? lightIcon : darkIcon;
      toggle.setAttribute('aria-pressed', String(isDark));

      if (isDark) {
        localStorage.setItem('preferredTheme', 'dark');
      } else {
        localStorage.removeItem('preferredTheme');
      }

      if (options.animate) {
        window.setTimeout(() => {
          document.documentElement.classList.remove('theme-switching');
        }, 180);
      }
    };

    if (toggle.getAttribute(attributes.bound || 'data-bound') === '1') {
      setDarkMode(localStorage.getItem('preferredTheme') === 'dark');
      return;
    }

    toggle.addEventListener('click', () => {
      setDarkMode(!document.documentElement.classList.contains('darkmode'), { animate: true });
    });
    toggle.setAttribute(attributes.bound || 'data-bound', '1');

    setDarkMode(localStorage.getItem('preferredTheme') === 'dark');
  };

  document.addEventListener('DOMContentLoaded', initThemeToggle);
  document.addEventListener(events.pageReady || 'op:page-ready', initThemeToggle);
})();
