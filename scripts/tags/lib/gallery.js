/**
 * gallery.js v2.1.fix | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 * 
 * 为规避和 parse_markdown 冲突，直接输入图片地址，不再支持 markdown 语法
 * {% gallery [layout:grid/flow] [size:mix/s/m/l/xl] [ratio:origin/square] %}
 * https://xxx/xxx.png
 * {% endgallery %}
 *
 * layout:grid 网格布局，支持通过 size/ratio 设置尺寸和长宽比
 * layout:flow 瀑布流布局，竖排，适合图片量大的时候使用（体验不佳请慎用）
 */

"use strict";

var index = 0;

function img(src) {
  let img = "";
  img += `<img src="${src}" fancybox="true"`;
  img += `/>`;
  return img;
}

module.exports = (ctx) =>
  function (args, content) {
    args = ctx.args.map(args, ["layout", "size", "ratio"]);
    if (args.size == null) {
      args.size = ctx.theme.config.tag_plugins.gallery.size;
    }
    if (args.ratio == null) {
      args.ratio = ctx.theme.config.tag_plugins.gallery.ratio;
    }
    var el = "";
    var layoutType = "grid";
    if (args.layout == "flow") {
      layoutType = "flow";
    }
    index += 1;
    el += `<div class="tag-plugin gallery ${layoutType}-box" ${ctx.args
      .joinTags(args, ["size", "ratio"])
      .join(" ")}>`;
    const imgs = content
      .split("\n")
      .filter((item) => item.trim().length > 0);
    for (let link of imgs) {
      el += `<div class="${layoutType}-cell">${img(link)}</div>`;
    }
    el += `</div>`;
    return el;
  };
