/* Post polish: two small content-level fixes applied at build time.

1. Drop the leading H1 when it duplicates the front-matter title.
   post.ejs already renders a large .post-title, so a second identical heading
   directly beneath it looks broken. Two of the current posts start with
   '# Title' for exactly the same string.

2. Append a closing mark at the end of every post, echoing the site's
   'tea egg' motif so a long read ends on a note instead of a cliff.

Both hooks are registered against Hexo's post render pipeline, so authors keep
writing plain Markdown and the fixes happen automatically.
*/
'use strict';

hexo.extend.filter.register('before_post_render', (data) => {
  const title = String(data.title || '').trim();
  if (!title || typeof data.content !== 'string') return data;

  const lines = data.content.split('\n');
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;

  if (i < lines.length) {
    const m = /^#\s+(.+?)\s*$/.exec(lines[i]);
    if (m && m[1].trim().toLowerCase() === title.toLowerCase()) {
      lines.splice(i, 1);
      data.content = lines.join('\n');
    }
  }

  return data;
});

hexo.extend.filter.register('after_post_render', (data) => {
  if (typeof data.content !== 'string') return data;
  data.content += '\n<div class="post-end-mark" aria-hidden="true">'
    + '<span class="post-end-mark-icon">\uD83C\uDFB5</span>'
    + '<span class="post-end-mark-text">完</span></div>\n';
  return data;
});
