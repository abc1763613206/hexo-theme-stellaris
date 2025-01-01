# 📑 Stellaris - 强大、优雅、现代的 Hexo 主题

这是由 [@abc1763613206](https://github.com/abc1763613206) 修改的 [hexo-theme-stellaris](https://github.com/chiyuki0325/hexo-theme-stellaris) 版本，目前作为 [blog.hanlin.press](https://blog.hanlin.press) 的主题使用。

**由于该主题重构后与上游的差异较大，因此之后的上游同步更新将通过 cherry-pick 拉取，并不再提供直接的无缝迁移兼容支持，请关注 `_config.yml` 的变更。**

主要修改：

- 迁移部分静态资源到本地
- 同步部分 stellar 上游特性
- **添加新标签特性**

对于本主题的安装方式，请在 clone 环节参考如下命令：

```bash
git submodule add https://github.com/abc1763613206/hexo-theme-stellaris.git themes/stellaris
cd themes/stellaris
# 由于引入了第三方库为子模块，需要进一步初始化主题中的子模块
git submodule update --init --recursive
```

如果您博客的主要读者群体为中国大陆用户，请在**自己博客根目录的**主题配置文件（即 `_config.stellaris.yml` ）中参考 [\_config.cn.yml](./_config.cn.yml) 进行以 [npmmirror](https://npmmirror.com) 为主体的镜像源配置。请注意该配置文件仅为差分配置，请勿直接用其替换原配置文件（即 `_config.yml`）。

因为本主题自用性质较强，因此不会过度考虑跨版本兼容性的问题，如您在追版本更新时发现错误，请自检是否发生了配置文件变更。

---

hexo-theme-stellaris 分叉自 [hexo-theme-stellar](https://github.com/xaoxuu/hexo-theme-stellar)，基于[hexo-renderer-jsx](https://github.com/hexojs/hexo-renderer-jsx)，支持丰富的标签和动态数据组件。

本主题目前已不再活跃维护，并不再同步 Stellar 的新功能特性。如对追新有需求，请使用上游 Stellar 主题，或在 [issue](https://github.com/chiyuki0325/hexo-theme-stellaris/issues/6) 中提交需要使用的新功能。

### 安装

- 环境需求
  ```
  Hexo: 5.4.0 ~ 6.3.0
  hexo-cli: 4.3.0 ~ latest
  node.js: 14.17.3 ~ 18.12.0
  npm: 6.14.13 ~ 8.19.2
  ```

#### 使用 Git 安装

- 安装依赖
  ```bash
  npm install react react-dom hexo-renderer-jsx html-react-parser --save
  ```
  ```bash
  npm install node-fetch@2 --save
  // bilicard 插件所需
  ```
- 将主题安装为子模块

  ```bash
  git submodule add https://github.com/chiyuki0325/hexo-theme-stellaris.git themes/stellaris
  ```

#### 使用 npm 安装

```bash
npm install hexo-theme-stellaris --save
```

安装好后，在 `config.yml` 中添加 `theme: stellaris`。

### 更新

#### 使用 Git

```bash
git submodule update --remote --merge
```

#### 使用 npm

```bash
npm update hexo-theme-stellaris
```

### 文档

[点此查看](https://blog.chyk.ink/wiki/stellaris/) Stellaris 主题文档。

也可以适当参考 [原主题文档](https://xaoxuu.com/wiki/stellar/)，或对照配置文件的注释。

#### 相关文章推荐

要启用此功能，请先安装 `hexo-related-popular-posts`，之后在配置文件中启用 `article.related_posts`。

```yaml
article:
  related_posts:
    enable: true
    max_count: 5
```

#### 配置的变更

- 预加载插件改为 InstantClick。

  ```yaml
  plugins:
    instant_click:
      js: https://cdn.bootcdn.net/ajax/libs/instantclick/3.1.0/instantclick.min.js
  ```

- 颜色配置部分进行了一些修改，详见配置文件。

- 支持自定义字体，详见配置文件。

- 增加了文章过期提示功能。

  ```yaml
  article:
    outdate_month: 2
  ```

  > 发布于 3 个月前，更新于 3 个月前，文章内容可能已经过时

- MathJax 增加了 `per_page` 选项，开启后无需在每个页面的 front-matter 处添加 `mathjax: true` 即可开启 MathJax。

  ```yaml
  plugins:
    # MathJax
    # 需在 Markdown 文件开头加入 mathjax: true
    # 推荐使用 Pandoc: npm uninstall hexo-renderer-marked --save & npm install hexo-renderer-pandoc --save
    mathjax:
      enable: false
      per_page: false # 启用后无需在文章开头加 mathjax: true 即可启用
      cdn: https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js # 请使用 3.x 以上版本的 mathjax
  ```

- 本主题没有移植原主题的一些功能（因为我没有用到，比如时间线，友链朋友圈和赫蹏），如有需要请在 issue 中提出，我会进行移植。

#### 标签插件

- 原主题更名数次的 [ablock](https://xaoxuu.com/wiki/stellar/tag-plugins/container/#ablock-%E6%99%AE%E9%80%9A%E5%9D%97%E5%AE%B9%E5%99%A8) 容器标签被改回了 border。

  ```jinja2
  {% border [color:color] [child:codeblock/tabs] title %}
  body
  {% endborder %}
  ```

- 新增了行内图片标签 icon。

  ```jinja2
  {% icon source [height:1.75em] %}
  ```

- 新增了 Bilibili 视频卡片插件 bilicard。

  ```jinja2
  {% bilicard BVID %}
  ```

#### Telegram Instant View

本主题编写了模板以适配 Telegram Instant View。

你可以在此[获取模板](https://blog.chyk.ink/2023/07/15/stellaris-instant-view-template/)，并且查阅[官方文档](https://instantview.telegram.org/)以了解如何在你的博客中使用。
