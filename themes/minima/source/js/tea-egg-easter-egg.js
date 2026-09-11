/* Tea Egg Easter Egg - "The missing tea egg, found in writing." */
(() => {
  'use strict';

  const QUOTES = [
    '丢失的茶叶蛋，在文字里找回。',
    '每一个字符都是一颗茶叶蛋。',
    '技术是壳，思考是馅。',
    '代码如茶，越品越香。',
    '生活就像剥茶叶蛋，总有裂纹。',
    '写博客是为了记住那些容易忘记的东西。',
    '技术笔记，时间的茶叶蛋。',
    '每一次敲击键盘，都在剥开知识的壳。'
  ];

  let isEggVisible = false;
  let eggElement = null;

  const createTeaEgg = () => {
    if (eggElement) return eggElement;

    eggElement = document.createElement('div');
    eggElement.className = 'tea-egg-container';
    eggElement.innerHTML = `
      <div class="tea-egg">
        <svg viewBox="0 0 100 120" class="tea-egg-svg">
          <ellipse cx="50" cy="60" rx="35" ry="45" fill="#8B4513" />
          <path d="M30 40 Q50 30 70 40" stroke="#D2691E" stroke-width="2" fill="none" />
          <path d="M25 60 Q50 50 75 60" stroke="#D2691E" stroke-width="2" fill="none" />
          <path d="M30 80 Q50 70 70 80" stroke="#D2691E" stroke-width="2" fill="none" />
          <circle cx="35" cy="45" r="3" fill="#A0522D" />
          <circle cx="65" cy="55" r="2" fill="#A0522D" />
          <circle cx="40" cy="75" r="2.5" fill="#A0522D" />
        </svg>
      </div>
      <div class="tea-egg-text"></div>
    `;

    // 点击事件
    eggElement.querySelector('.tea-egg').addEventListener('click', () => {
      showRandomQuote();
      // Haptic feedback (如果支持)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    });

    return eggElement;
  };

  const showRandomQuote = () => {
    const textEl = eggElement.querySelector('.tea-egg-text');
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    textEl.textContent = quote;
    textEl.style.opacity = '1';
    
    // 3秒后淡出
    setTimeout(() => {
      textEl.style.opacity = '0';
    }, 3000);
  };

  const initTeaEgg = () => {
    // 只在关于页和404页显示
    const isAboutPage = window.location.pathname.includes('/about/');
    const is404Page = window.location.pathname.includes('/404.html') || 
                      window.location.pathname === '/';
    
    if (!isAboutPage && !is404Page) return;

    // 控制台彩蛋
    console.log('%c🍵 找到你了！', 'font-size: 24px; color: #8B4513;');
    console.log('%c丢失的茶叶蛋，在文字里找回。', 'font-size: 14px; color: #666;');

    // 创建茶叶蛋元素
    const container = document.body;
    const egg = createTeaEgg();
    egg.style.position = 'fixed';
    egg.style.bottom = '20px';
    egg.style.right = '20px';
    egg.style.zIndex = '9999';
    egg.style.cursor = 'pointer';
    egg.style.transition = 'opacity 0.3s ease';
    
    container.appendChild(egg);
    isEggVisible = true;

    // 点击空白处关闭
    document.addEventListener('click', (e) => {
      if (!egg.contains(e.target)) {
        egg.style.opacity = '0';
        setTimeout(() => egg.remove(), 300);
        isEggVisible = false;
      }
    });
  };

  document.addEventListener('DOMContentLoaded', initTeaEgg);
})();
