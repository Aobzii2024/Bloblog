hexo.extend.filter.register('after_render:html', (html) => html.replace(/<img\b([^>]*?)>/gi, (match, attrs) => {
  if (/\bloading=/i.test(attrs)) {
    return match;
  }

  const normalizedAttrs = attrs.trim();
  const baseAttrs = normalizedAttrs ? ` ${normalizedAttrs}` : '';

  return `<img${baseAttrs} loading="lazy" decoding="async">`;
}));
