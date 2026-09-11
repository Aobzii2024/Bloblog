(() => {
  'use strict';

  const setupDropdown = (btnId, menuId) => {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    let isOpen = false;

    const openMenu = () => {
      menu.removeAttribute('hidden');
      btn.setAttribute('aria-expanded', 'true');
      isOpen = true;
    };

    const closeMenu = () => {
      menu.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', 'false');
      isOpen = false;
    };

    const toggleMenu = () => {
      if (isOpen) closeMenu();
      else openMenu();
    };

    // Toggle on button click
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Handle clicks inside menu
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('a')) {
        setTimeout(closeMenu, 100);
      }
    });

    // Click outside to close
    document.addEventListener('click', () => {
      if (isOpen) closeMenu();
    });

    // ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });
  };

  const initHeroMenu = () => {
    setupDropdown('hamburgerBtn', 'heroMenu');
    setupDropdown('topbarHamburgerBtn', 'topbarMenu');

    // Theme toggle buttons across all menus
    const themeButtons = document.querySelectorAll('.theme-toggle-btn');
    themeButtons.forEach((themeBtn) => {
      if (themeBtn.dataset.bound) return;
      themeBtn.dataset.bound = '1';
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isDark = document.documentElement.classList.toggle('darkmode');
        document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
        if (document.body) document.body.classList.toggle('darkmode', isDark);
        try {
          const sysMatch = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (sysMatch === isDark) localStorage.removeItem('preferredTheme');
          else localStorage.setItem('preferredTheme', isDark ? 'dark' : 'light');
        } catch (err) {}
      });
    });
  };

  document.addEventListener('DOMContentLoaded', initHeroMenu);
})();
