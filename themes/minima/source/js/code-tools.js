(() => {
  const config = window.__minimaTheme || {};
  const events = config.events || {};

  const languageAliases = {
    js: 'javascript',
    ts: 'typescript',
    py: 'python',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    ps1: 'powershell',
    yml: 'yaml',
    md: 'markdown',
    plaintext: 'text',
    plain: 'text',
    txt: 'text'
  };

  const normalizeLanguage = (language) => {
    const value = (language || '').replace(/^lang(uage)?-/, '').toLowerCase();
    return languageAliases[value] || value || 'text';
  };

  const getLanguageFromClassName = (className) => {
    const value = String(className || '');
    const explicitMatch = value.match(/(?:^|\s)(?:lang|language)-([^\s]+)/);

    if (explicitMatch) {
      return normalizeLanguage(explicitMatch[2]);
    }

    const ignored = new Set(['highlight', 'code', 'line-numbers', 'code-tools-block']);
    const languageClass = value.split(/\s+/).find((item) => item && !ignored.has(item));
    return normalizeLanguage(languageClass);
  };

  const getLanguage = (block) => {
    const code = block.querySelector('code');
    const figureClassLanguage = getLanguageFromClassName(block.className);
    const codeClassLanguage = code ? getLanguageFromClassName(code.className) : '';
    return figureClassLanguage || codeClassLanguage || 'text';
  };

  const getCodeText = (block) => {
    const codeTable = block.querySelector('td.code');
    const codeNode = codeTable || block.querySelector('code') || block;
    return codeNode.innerText.replace(/\n$/, '');
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  };

  const bindCodeBlock = (block) => {
    if (block.dataset.codeToolsBound === '1') {
      return;
    }

    block.dataset.codeToolsBound = '1';
    block.classList.add('code-tools-block');

    const language = getLanguage(block);
    const button = document.createElement('button');
    button.className = 'code-language-copy';
    button.type = 'button';
    button.textContent = language;
    button.setAttribute('aria-label', `复制 ${language} 代码`);

    button.addEventListener('click', async () => {
      const originalText = button.textContent;

      try {
        await copyText(getCodeText(block));
        button.textContent = '已复制';
        button.classList.add('is-copied');
      } catch (error) {
        button.textContent = '复制失败';
        button.classList.add('is-failed');
      }

      window.setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('is-copied');
        button.classList.remove('is-failed');
      }, 1200);
    });

    block.appendChild(button);
  };

  const initCodeTools = () => {
    const figures = Array.from(document.querySelectorAll('.markdown-content figure.highlight'));
    const standalonePreBlocks = Array.from(document.querySelectorAll('.markdown-content pre')).filter(
      (block) => !block.closest('figure.highlight')
    );

    [...figures, ...standalonePreBlocks].forEach(bindCodeBlock);
  };

  document.addEventListener('DOMContentLoaded', initCodeTools);
  document.addEventListener(events.pageReady || 'op:page-ready', initCodeTools);
})();
