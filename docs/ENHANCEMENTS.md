# Bloblog 主题增强文档

> 目标：在保留 Minima 极简气质的前提下，把每个交互细节打磨到「舒服、流畅、有惊喜」。

---

## 模块清单

| # | 模块 | 文件 | 状态 |
|---|------|------|------|
| 1 | 字体策略：纯系统字体栈（消除闪变） | `custom.css` `--font-ui` | ✅ |
| 2 | 主题切换（跟随系统 + View Transition 涟漪） | `js/theme-toggle.js` | ✅ |
| 3 | 悬浮 TOC（滚动高亮 / 进度 / 移动抽屉） | `js/toc.js` | ✅ |
| 4 | 文章上一篇/下一篇 | `layout/post.ejs` | ✅ |
| 5 | 导航：悬停预取 + 进度反馈（原生） | `js/navigation-init.js` | ✅ |
| 6 | 归档搜索（计数 / 高亮 / 空态） | `js/archive-search.js` | ✅ |
| 7 | 返回顶部 | `js/back-to-top.js` | ✅ |
| 8 | 键盘快捷键 | `js/shortcuts.js` | ✅ |
| 9 | 彩蛋（标题切换 / Konami / Console） | `js/easter-eggs.js` | ✅ |
| 10 | 图片灯箱（图集/缩放/拖拽/键盘） | `js/lightbox.js` | ✅ |
| 11 | 首页打字机 | `js/typewriter.js` | ✅ |
| 13 | 导航骨架屏（消除白闪） | `js/loading-skeleton.js`, `css/loading-skeleton.css` | ✅ |
| 14 | 重复 H1 去重 | `scripts/post-polish.js` | ✅ |
| 15 | 文章结尾彩蛋「🍵 完」 | `scripts/post-polish.js` | ✅ |
| 16 | 图片 alt 自动补齐 | `scripts/alt-fix.js` | ✅ |
| 17 | 页脚图标暗色适配 + RSS 订阅 | `partial/footer.ejs` | ✅ |
| 18 | 页脚年份动态化 | `partial/footer.ejs` | ✅ |
| 19 | 外链图片失败占位 | `js/image-fallback.js` | ✅ |
| 20 | 离线支持（Service Worker） | `sw.js`, `js/sw-register.js` | ✅ |
| 21 | 部署配置修复（Vercel） | `vercel.json` | ✅ |

---

## 1. 字体策略（已改为纯系统字体栈）

**历史**：曾使用霞鹜文楷 Medium 字体分包（`pyftsubset` 切成 7 个 woff2，首屏 377KB）。
但实测发现：切换到新页面时，浏览器重新计算 `@font-face` 映射并等待分片加载，
导致「先系统字体 → 再切回霞鹜文楷」的**字体闪变**，观感很差。

**当前方案**：完全移除自定义字体与所有字体加载器，使用**原生系统字体栈**：

```css
--font-ui: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
           'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
```

- 零网络字体请求、零闪变、切换页面 100% 一致
- 移动端/桌面端自动选平台最佳系统字体
- 保留 `tools/font/subset_font.py` 脚本供未来按需启用（如需恢复自定义字体，
  建议用 `font-display: optional` + 统一预加载，避免闪变）

---

## 2. 主题切换

- **跟随系统**：无用户偏好时跟随 `prefers-color-scheme`，系统切换时实时响应。
- **智能持久化**：用户手动切换若恰好等于系统主题，则清除覆盖，让未来系统变化继续生效。
- **View Transition 涟漪**：支持 `document.startViewTransition` 的浏览器从按钮位置圆形扩散揭示新主题；降级为快速旋转；`prefers-reduced-motion` 下无动画。

---

## 3. 悬浮 TOC

- 从 `#post-content` 的 h2/h3 构建层级树（≥3 个标题才启用）。
- **桌面（≥1280px）**：右侧常驻栏，滚动高亮当前节，左侧指示条，自动滚动到可见位置。
- **窄屏**：右下角 FAB（带环形进度条），点击弹出抽屉，Esc/外点关闭。
- 头部显示整页阅读百分比。

---

## 4. 文章导航

`post.ejs` 尾部新增上一篇/下一篇卡片，边界处显示「已经是最早/最新的一篇」占位，移动端单列。

---

## 5. 导航（悬停预取 + 进度反馈）

原代码里有一段 100 多行 SPA 无刷新导航实现，但 `shouldUseNativeNavigation()` 被硬编码为 `true`，
属于**死代码**。

我尝试把它真正启用（fetch 新页面 → 替换 `#page-content` → 交换 head 资源 → 重新注入页面级脚本），
但实测出现明显问题：页面先显示未渲染的裸内容（MathJax、代码高亮、Mermaid 都是异步渲染），
随后突然跳变为渲染好的样式，视觉体验很差。

**最终决策：放弃 SPA，回归原生浏览器导航。**

现在 `navigation-init.js` 保留：
- **悬停预取**：mouseover 内部链接时注入 `<link rel="prefetch">`，点击近乎瞬时
- **进度反馈**：点击内部链接时顶部进度条立即推进，`pageshow` 时归位

这个方案下浏览器自己处理加载态，没有 FOUC、没有突变，是更稳的选择。
> 保留教训：静态站点 + 异步内容渲染器，SPA 切换需要显式的渲染就绪等待（Promise.allSettled 兜底超时）才不闪。

---

## 6. 归档搜索

- 即时过滤 + `requestAnimationFrame` 防抖
- 匹配关键词 `<mark>` 高亮
- 结果计数「n / total 篇」（`aria-live` 播报）
- 空态：摇曳茶杯 🍵 + 提示文案
- Esc 清空搜索

---

## 7-8. 返回顶部 & 快捷键

| 键 | 功能 |
|----|------|
| `t` | 回顶 |
| `/` | 聚焦归档搜索 |
| `?` | 快捷键提示 toast |
| `Esc` | 关闭浮层 |

输入框聚焦时全部忽略。

---

## 9. 彩蛋

1. **标题切换**：标签页隐藏时标题变为「早点回来 🍵」
2. **Konami**：↑↑↓↓←→←→BA 触发全站色相旋转一周
3. **Console**：开发者工具里的 🍵 问候

---

## 10. 灯箱

替换简陋的 `pic.min.js`：
- 图集模式：文章内多图左右切换（按钮/方向键）
- 缩放：点击 / `+` `-` / 滚轮（1x-4x），`0` 复位
- 拖拽平移（Pointer Events）
- alt 作为说明文字、计数器、Esc/背板关闭
- 打开时锁定背景滚动

---

## 11. 打字机

首页 hero 的描述行逐字打出 + 光标闪烁，完成后光标慢闪待机。预留行高避免布局偏移，reduced-motion 直接显示全文。

---


---

## 13. 导航骨架屏

**解决的核心问题**：原生导航过程中浏览器会短暂显示空白页，视觉上像「先出现没渲染的原界面，然后突然跳变成渲染好的网页」。

导航的白屏其实分两段，各自用不同手段堵住：

**第一段：新文档存在但外部 CSS 还没到。**
在 `<head>` 最顶部内联一小段 boot 脚本，读取 `preferredTheme` / `prefers-color-scheme`
后立即把 `html` 背景与前景色写成主题色。文档一诞生就有正确的背景色，
不会先闪一下浏览器默认白底。

**第二段：DOM 已解析、样式加载中。**
点击内部链接时：
1. 旧页面立即盖上设计过的骨架屏遮罩（标题条 + 三栏卡片 + 段落条 + 呼吸圆点，主题色扫光）
2. 写 `sessionStorage` 标记「正在导航」
3. 新页面 defer 脚本启动，读到标记就恢复骨架屏（覆盖解析期）
4. 首帧稳定 240ms 后淡出

- 预取命中时加载极快，骨架屏几乎一闪而过，感知不到
- 未预取的慢加载，也能给一个「有意的等待」而不是白屏
- `prefers-reduced-motion` 下扫光/呼吸动画关闭
- 6 秒兜底自动隐藏，永不卡死

---

## 14. 重复 H1 去重

`post.ejs` 已经渲染了一个大号 `.post-title`。而 AttackLab、相遇这两篇文章的 Markdown
又用 `# 标题` 写了个一模一样的 H1，紧贴在标题下方重复一遍，视觉上像坏掉。

在构建期用 `before_post_render` 过滤器检查：**首行是一级标题且与 front-matter 的 `title`
完全一致时，整行删掉**。作者继续写普通 Markdown 即可，不用手工维护。

只处理「第一个内容行」这一种情况，避免误删文章中间的合法 H1。

---

## 15. 文章结尾彩蛋

`after_post_render` 给每篇文章末尾追加一个「🍵 完」标记，呼应站点
"丢失的茶叶蛋，在文字里找回"的主题——长文读完时是一个收束，而不是戛然而止。

杯子图标带轻微的 3.2s 摇摆动画（`prefers-reduced-motion` 下关闭）。

---

## 16. 图片 alt 自动补齐

文章里 13 张图片**全部**没有 alt（只写了 `![]()`）。读屏器只能念出「图片」两个字，
灯箱打开后 caption 也是空的。

`scripts/alt-fix.js` 挂在 `after_post_render` 上：

1. 作者写了真实 alt（比如中文描述）→ 原样保留，不覆盖。
2. 作者写了垃圾 alt（`697`、`123` 这种上传工具留下的占位数字）→ 判断为无意义，丢弃。
3. 没有 alt，或 alt 无意义 → 从 `src` 文件名推一个标签：`URL 解码 → 去扩展名 → 截断到 40 字`。
4. 文件名本身也是机器生成的（纯数字、哈希、`Pasted image ...`、`IMG0001`）→ 统一给 `图片`。

效果：`屏幕截图 2026-05-11 194740` 变成有意义的描述；`Pasted image 20260423164117` 这类
变成中性的「图片」而不是暴露哈希串。作者不用改任何 Markdown。

---

## 17. 页脚图标暗色适配 + RSS 订阅

两个问题一起解决：

- **对比度**：页脚的 GitHub / Outlook / 网易云 / Telegram 图标都没有显式 `fill`，
  直接继承 SVG 默认黑色。暗色模式下黑图标落在深灰背景上几乎看不见。
  现在统一 `fill: currentColor`，让图标跟着文字颜色走。
- **键盘焦点**：`.footer-link:focus-visible` 加了 `--accent-soft` 描边圈，
  不再是浏览器默认的蓝色 outline，视觉上跟主题一致。
- **RSS**：页脚新增 Atom 订阅入口（`config.root + 'atom.xml'`），主题色高亮，
  让订阅入口不再只存在于浏览器地址栏的自动发现里。

---

## 18. 页脚年份动态化

原来是写死的 `© 2024`。现在用 `<%= date(Date.now(), "YYYY") %>`，
每次构建自动取当前年份，不需要每年手动改一次。

---

## 19. 外链图片失败占位

文章的 13 张图全部挂在 `cdn.jsdelivr.net`（一个 GitHub 仓库做静态源）。源仓库删了、
CDN 抽风、或者用户网络断了，图片会塌成浏览器默认的破碎图标，整篇排版跟着错位。

`js/image-fallback.js` 监听图片 `error` 事件，失败时加上 `.is-broken` 类：

- 固定 `6.5rem` 高度 + 虚线框 + 主题灰底，占住原来的位置，不让后文跳版
- 填上 `图片加载失败` 的 alt，读屏器能感知
- 清除 `src`，避免浏览器反复重试浪费流量

同时给所有内容图加了 `min-height` 占位底色，慢速加载时也不会闪成空白条。

> 治本方案是把图片迁移到本站 `source/images/`，然后重写 CDN 前缀。
> 那属于内容变更，涉及 13 个文件的手动确认，这次没动。

---

## 20. 离线支持（Service Worker）

静态博客很适合加 SW——没有用户数据、没有鉴权，纯静态资源缓存风险低。

策略刻意保守（站点文件名不带哈希，激进缓存会在更新后长期提供旧版 CSS/JS）：

| 资源 | 策略 | 原因 |
|------|------|------|
| 页面导航 | network-first → 缓存兜底 | 内容永远要新的，断网时读缓存 |
| 字体 woff2 | cache-first | 内容寻址、不变 |
| css/js/图片 | stale-while-revalidate | 立即出缓存，后台更新 |

- 安装阶段**不预缓存任何东西**，避免部署后新旧资源混搭
- `skipWaiting` + `clients.claim`，新 SW 立即接管
- 仅在 `window.isSecureContext`（HTTPS/localhost）下注册，其余环境静默跳过
- `sw.js` 在 Vercel 上强制 `no-cache`（见下）

---

## 21. 部署配置修复（Vercel）

在给 SW 配置缓存头时发现并修复了**两个会导致线上故障的隐患**：

1. **404 rewrite 是全站杀手**。
   之前 `vercel.json` 里有一条 `rewrites`，把「不匹配静态资源后缀的路径」全重写到 `/404.html`。
   但 Vercel 的 rewrites 是**无条件**的——`/`、`/about/`、每篇文章、`/atom.xml`
   全部命中规则被重写成 404 页面，等于整站 404。
   **修复**：删除 rewrites，改用 Vercel 官方 `404` 配置项（只作用于真正 404 的请求）。

2. **sw.js 被 immutale 缓存**。
   通用规则 `/(.*)\.js` 给了 1 年 `immutable`，把 Service Worker 也套进去了——
   SW 一旦被浏览器长缓存，后续更新永远不生效。
   **修复**：在规则列表最前面加 `/sw.js` 专属 `no-cache, no-transform`。

3. 顺带明确 `cleanUrls: false` + `trailingSlash: false`，
   `/about` 与 `/about/` 都能正确落到 `about/index.html`，不强制重定向。

---

## 设计原则

1. **渐进增强**：所有 JS 失败时页面仍是完整可用的静态站
2. **reduced-motion 全局尊重**
3. **暗色模式全覆盖**（新组件都走 CSS 变量）
4. **幂等初始化**：所有模块监听 `op:page-ready` 并用 `data-bound` 标记 / 先清旧实例，方便未来接回 SPA
5. **零依赖**：全部原生 API，无 npm 包

## 已知边界

- AttackLab 这类长文只有 1 个 `#` 标题、其余全是列表/代码块，没有 h2/h3，因此 TOC 按设计（≥3 个标题才启用）不显示——这是内容结构问题，非代码 bug。要启用需作者给文章补小标题。
- TOC 依赖 `_config.yml` 里 `marked.headerIds: true`（已开启）才会给标题生成锚点 id。
