(() => {
  const selectors = {
    pageContent: '#page-content',
    archiveSearchInput: '#archive-search-input',
    archiveItem: '.archive-item',
    archiveGroup: '.archive-group',
    themeToggle: '#themeToggle',
    markdownParagraph: '.markdown-content p',
    markdownMathNode: '.markdown-content p, .markdown-content div',
    image: 'img',
    mermaidCode: 'pre code.language-mermaid, pre code.lang-mermaid',
    mermaidPlaintextFigure: 'figure.highlight.plaintext',
    mermaidPlaintextCode: 'td.code pre'
  };

  const events = {
    pageReady: 'op:page-ready',
    contentReady: 'op:content-ready'
  };

  const attributes = {
    bound: 'data-bound',
    darkIcon: 'data-dark-icon',
    lightIcon: 'data-light-icon'
  };

  const state = {
    navigationBound: '__opNavigationFeedbackBound'
  };

  window.__minimaTheme = {
    selectors,
    events,
    attributes,
    state
  };
})();
