# Bloblog (Aobzii's Ramblings)

> *The missing tea egg, found in writing.*

Aobzii 的个人 Hexo 博客源码仓库。记录技术笔记、生活碎片、思考札记与长文探索。

- 🌐 **在线站点**：[ramblings.aobzii.top](https://ramblings.aobzii.top)
- 🛠️ **静态生成器**：[Hexo 7](https://hexo.io/)
- 🎨 **博客主题**：定制化 [Minima](themes/minima) 主题
- ⚡ **部署方案**：Vercel CI/CD 自动化构建

---

## 📁 目录结构 (Flat Structure)

本项目已平铺为根目录结构，方便 CI/CD 直接识别与构建：

```text
.
├── _config.yml              # Hexo 站点全局配置文件
├── package.json             # 项目依赖与 npm scripts
├── package-lock.json        # 依赖版本锁定
├── vercel.json              # Vercel 构建配置与静态资源长缓存规则
├── README.md                # 项目详细说明文档
├── .gitignore               # Git 忽略配置（忽略 node_modules、public、db.json 等）
├── source/                  # 站点内容源码
│   ├── _posts/              # 博客长篇文章 Markdown
│   ├── daily/               # 卡片式日常记录与碎碎念
│   ├── archives/            # 归档与分类页面
│   ├── about/               # 个人关于页面
│   └── 404.md               # 404 错误页面
├── themes/
│   └── minima/              # 自定义 Minima 主题（EJS 模板、CSS、前端脚本）
├── scaffolds/               # 文章创建脚手架模板 (post, page, draft)
├── scripts/                 # Hexo 扩展插件/构建辅助脚本 (图片懒加载等)
└── images/                  # 历史文章引用的配图与本地资源库
```

---

## 🚀 快速上手与本地开发

在项目根目录下直接运行以下命令即可：

### 1. 安装依赖

```bash
npm install
```

### 2. 启动本地预览

```bash
npm run server
```

启动成功后，浏览器访问 `http://localhost:4000` 即可实时预览。

### 3. 构建静态站点

```bash
npm run build
```

生成的文件将输出到 `public/` 目录下。

### 4. 清理构建缓存

```bash
npm run clean
```

### 5. 一键清理并完整验证构建

```bash
npm run verify
```

---

## ✍️ 写作与内容管理

### 博客长文 (Posts)

新建文章位于 `source/_posts/` 目录下，支持标准 Hexo Front Matter：

```markdown
---
title: 文章标题
date: 2026-05-11 20:00:00
tag:
  - 学习笔记
  - 技术探索
---

文章正文内容...
```

### 日常记录 (Daily Cards)

轻量级碎片记录位于 `source/daily/` 目录下。日常索引页面会自动聚合该目录下除 `index.md` 之外的日记文件，以时间流卡片的形式呈现。

### 图片管理

- 本地图片资源集中存放于根目录下的 `images/` 目录中。
- Markdown 文章中可通过相对路径或 jsDelivr CDN 路径进行引用与加速。

---

## 🎨 主题特性与前端架构

主题位于 `themes/minima/`，采用现代轻量级原生 JavaScript 与模块化 CSS 编写：

1. **外观与视觉**：
   - 支持**浅色/暗色模式**平滑切换，自动持久化用户偏好（`localStorage`）。
   - 中文字体深度优化，采用 **霞鹜文楷 Lite (LXGW WenKai Lite)**，代码区采用系统等宽字体。
   - 移动端与桌面端自适应排版。
2. **富文本与排版增强**：
   - **代码工具条**：支持 Prism 语法高亮、代码行号与一键快捷复制。
   - **数学公式支持**：集成 KaTeX / MathJax 公式渲染能力。
   - **流程图与时序图**：集成 Mermaid 动态渲染。
   - **阅读进度指示**：长文页面动态阅读进度条与图片渐进加载。
3. **前端解耦架构**：
   - `theme-config.js`：定义全局选择器与自定义生命周期事件。
   - `site-init.js`：页面入口与增强加载器，在页面切换后派发 `op:page-ready` 事件。
   - 各功能组件（搜索、暗黑模式切换、Mermaid）订阅全局事件按需重新初始化，实现轻量高效的无刷新式交互。

---

## ☁️ 部署说明 (Vercel)

本项目根目录已内置 `vercel.json`，配置了极速构建与静态资源最优缓存策略：

```json
{
  "installCommand": "npm ci",
  "buildCommand": "npm run build",
  "outputDirectory": "public"
}
```

将代码推送到 GitHub 仓库后，在 [Vercel](https://vercel.com/) 导入该仓库即可实现 **Push 即全自动构建与全球 CDN 发布**，无需额外配置根目录或环境变量。

---

## 📄 开源与许可

- 内容版权：© Aobzii
- 主题基础：Minima Theme (基于 MIT 协议深度定制)
