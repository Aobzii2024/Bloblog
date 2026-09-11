/* Alt fix: give every post image a meaningful alt attribute.

Images without alt are an accessibility gap (screen readers announce nothing)
and leave the lightbox caption empty. Two cases are handled:

  - author wrote a real alt -> kept untouched
  - author left a placeholder alt (bare number, hash) or wrote none ->
    replaced with a label derived from the filename, or a neutral '图片'
    when the filename is itself machine-generated

Registered on after_post_render, so authors keep writing plain Markdown.
*/
'use strict';

const IMG_ATTR = /\balt\s*=\s*["']([^"']*)["']/i;
const SRC_ATTR = /\bsrc\s*=\s*["']([^"']+)["']/i;

/* Filenames that carry no meaning for a reader: hashes, timestamp counters,
   pasted-image captures, generic Img0001 names. */
const isMeaningless = (s) => {
  const cleaned = String(s).replace(/[^0-9a-f]/gi, '');
  return /^[0-9a-f]{16,}$/i.test(cleaned) ||
    /^[0-9]+$/.test(String(s).trim()) ||
    /^pasted image/i.test(String(s)) ||
    /^img\d+$/i.test(String(s).trim());
};

const labelFromSrc = (src) => {
  let name = src.split('/').pop() || '';
  try { name = decodeURIComponent(name); } catch (e) { /* keep raw */ }
  name = name.replace(/\.(png|jpe?g|gif|webp|svg|bmp)$/i, '').trim();
  if (!name || isMeaningless(name)) return '图片';
  return name.length > 40 ? name.slice(0, 40) + '…' : name;
};

hexo.extend.filter.register('after_post_render', (data) => {
  if (typeof data.content !== 'string') return data;

  data.content = data.content.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    const srcMatch = SRC_ATTR.exec(attrs);
    const src = srcMatch ? srcMatch[1] : '';

    const authorAlt = IMG_ATTR.exec(attrs);
    if (authorAlt && authorAlt[1].trim() && !isMeaningless(authorAlt[1])) {
      return match; // respect the author
    }

    const fallback = labelFromSrc(src);
    if (authorAlt) {
      return attrs.replace(IMG_ATTR, 'alt="' + fallback + '"');
    }
    return match.replace(/(<img\b[^>]*)>/i, '$1 alt="' + fallback + '">');
  });

  return data;
});
