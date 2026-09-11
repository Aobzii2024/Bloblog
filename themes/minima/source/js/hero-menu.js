(() => {
  'use strict';

  const initHeroMenu = () => {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('heroMenu');
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

    // 按钮点击：切换菜单
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // 点击菜单内部：不关闭（让链接正常跳转）
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      // 点击后自动关闭
      if (e.target.closest('a')) {
        setTimeout(closeMenu, 100);
      }
    });

    // 点击外部：关闭菜单
    document.addEventListener('click', () => {
      if (isOpen) closeMenu();
    });

    // ESC 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // 主题切换
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn && !themeBtn.dataset.bound) {
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
    }
  };

  document.addEventListener('DOMContentLoaded', initHeroMenu);
})();
