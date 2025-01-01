/**
 * icon.js v1.1 | https://github.com/xaoxuu/hexo-theme-stellar/
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 *
 * {% icon key text [color:color] [style:css] [height:1.75em] %}
 * 为保证兼容性，style 请不要和 height 同时使用，后者会覆盖前者
 *
 */

'use strict'

module.exports = (ctx) =>
  function (args) {
    args = ctx.args.map(args, ['color', 'style', 'height'], ['key', 'text'])
    if (args.color == null) {
      args.color = ctx.theme.config.tag_plugins.icon.default_color
    }
    var el = ''
    if (args.text) {
      el += `<div class="tag-plugin icon-wrap">`
    }
    el += `<span class="tag-plugin icon colorful" ${ctx.args.joinTags(args, ['color']).join(' ')}>`
    var more = ''
    if (args.height) {
      more += `style="height:${args.height}"` // 兼容旧版写法
    } else if (args.style) {
      more += `style="${args.style}"`
    }
    el += ctx.utils.icon(args.key, more)
    el += `</span>`
    if (args.text) {
      el += `<span class="text">${args.text}</span>`
      el += '</div>'
    }
    return el
  }
