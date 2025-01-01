/**
 * music.js v1 | https://github.com/abc1763613206/hexo-theme-stellaris
 * 格式与官方标签插件一致使用空格分隔，中括号内的是可选参数（中括号不需要写出来）
 * MetingJS Required
 * 务必参考 https://github.com/metowolf/MetingJS
 * # 自动链接检测，支持 netease, tencent，loop 为循环参数，支持 all, one, none
 * # lrc 为是否显示歌词，支持 true, false, 默认为 true
 * # width 为播放器宽度 max-width，默认为 100%
 * {% music auto:https://music.163.com/#/song?id=18520488 [loop:all/one/none] [lrc:true/false] [width:80%] %}
 * # server、type、id 为必填项，请根据 https://github.com/metowolf/MetingJS 进行替换
 * {% music server:type:id [loop:all/one/none] %}
 * 示例： {% music netease:song:18520488 loop:all width:100% %}
 *
 * 引入 url 时为自托管音频，支持范围参考 APlayer
 * fixed mode 与 mini mode 暂时不受支持
 * {% music url:https://xxxx.com/Never-Gonna-Give-You-Up.mp3 [name:"Never Gonna Give You Up "] [artist:"Rick Astley"] [cover:https://xxx/xxx.jpg] [loop:all/one/none] %}
 */

'use strict'

module.exports = (ctx) => (args) => {
  args = ctx.args.map(
    args,
    [
      'name',
      'artist',
      'cover',
      'loop',
      'auto',
      'server',
      'type',
      'id',
      'url',
      'lrc',
      'width',
    ],
    ['external']
  )

  let metingArgs = ``

  if (args.auto) {
    metingArgs += ` auto="${args.auto}"`
  } else if (args.url) {
    metingArgs += ` url="${args.url}"`
    if (args.name) metingArgs += ` name="${args.name}"`
    if (args.artist) metingArgs += ` artist="${args.artist}"`
    if (args.cover) metingArgs += ` cover="${args.cover}"`
  } else {
    const [server, type, id] = args.external.split(':')
    metingArgs = `server="${server}" type="${type}" id="${id}"`
  }
  if (args.loop) {
    metingArgs += ` loop="${args.loop}"`
  }
  if (ctx.theme.config.data_services.music.api) {
    metingArgs += ` api="${ctx.theme.config.data_services.music.api}"`
  }

  let style = ``
  if (args.width) {
    style = `max-width:${args.width};`
  }
  if (args.lrc && args.lrc === 'false') {
    style += ` --lrc-display:none;`
  } else {
    style += ` --lrc-display:block;`
  }
  return `<div class="tag-plugin ds-music" style="${style}" metingargs="${Buffer.from(metingArgs).toString('base64')}"></div>`
}
