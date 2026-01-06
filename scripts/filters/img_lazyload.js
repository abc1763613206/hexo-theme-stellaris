/**
 * img_lazyload.js v2 | https://github.com/abc1763613206/hexo-theme-stellaris
 *
 */

'use strict'

const fs = require('fs')
const path = require('path')
const { imageSize } = require('image-size')

function getImageSize(src, hexo) {
  let filePath = ''
  if (src.startsWith('/')) {
    // 尝试从 source_dir 解析
    filePath = path.join(hexo.source_dir, src)
    if (!fs.existsSync(filePath)) {
        // 尝试从主题 source_dir 解析
        filePath = path.join(hexo.theme_dir, 'source', src)
    }
  }

  if (filePath && fs.existsSync(filePath)) {
    try {
      const buffer = fs.readFileSync(filePath)
      return imageSize(buffer)
    } catch (e) {
      console.warn(`[Stellaris] Failed to get image size for ${src}: ${e.message}`)
    }
  }
  return null
}

function lazyProcess(htmlContent) {
  try {
    const cfg = this.theme.config.plugins.lazyload
    if (cfg == undefined || cfg.enabled != true) {
      return htmlContent
    }
    const hexo = this
    
    // 检查是否存在 TOC，仅在有目录时应用策略
    const hasToc = htmlContent.includes('class="widget-wrapper toc')
    
    return htmlContent.replace(
      /<img(.*?)src="(.*?)"(.*?)>/gi,
      function (imgTag, src_before, src_value, src_after) {
        // 可能是重复的
        if (/data-srcset/gi.test(imgTag)) {
          return imgTag
        }
        if (/src="data:image(.*?)/gi.test(imgTag)) {
          return imgTag
        }
        if (imgTag.includes('no-lazy')) {
          return imgTag
        }

        // 计算尺寸
        let width = ''
        let height = ''
        let style = ''
        let dims = null
        
        if (hasToc) {
            try {
                dims = getImageSize(src_value, hexo)
                if (dims) {
                    width = ` width="${dims.width}"`
                    height = ` height="${dims.height}"`
                    
                    // 如果可能，内联构建样式，或者是等待下方注入
                    // 我们准备样式字符串以供注入
                    style = ` style="aspect-ratio: ${dims.width} / ${dims.height}; height: auto;"`
                }
            } catch (err) {
                console.warn(`[Stellaris] Error calculating image size for ${src_value}:`, err)
            }
        }

        var newImgTag = imgTag
        if (newImgTag.includes(' class="') == false) {
          newImgTag = newImgTag.slice(0, 4) + ' class=""' + newImgTag.slice(4)
        }
        // class 中增加 lazy
        newImgTag = newImgTag.replace(
          /(.*?) class="(.*?)" (.*?)>/gi,
          function (ori, before, value, after) {
            var newClass = value
            if (newClass.length > 0) {
              newClass += ' '
            }
            newClass += 'lazy'
            if (value) {
              return ori.replace('class="' + value, 'class="' + newClass)
            } else {
              return ori.replace('class="', 'class="' + newClass)
            }
          }
        )
        
        // 仅当找到尺寸时注入 width/height（这意味着 hasToc 为真）
        if (dims && width && height) {
            if (!newImgTag.includes('width=')) {
                newImgTag = newImgTag.replace('<img', `<img${width}`)
            }
            if (!newImgTag.includes('height=')) {
                newImgTag = newImgTag.replace('<img', `<img${height}`)
            }
            // 注入 aspect-ratio 和 height: auto 样式
            if (!newImgTag.includes('style="')) {
                // 如果没有 style 属性，注入我们的
                 newImgTag = newImgTag.replace('<img', `<img${style}`)
            } else if (!newImgTag.includes('aspect-ratio')) {
                 // 追加到现有样式
                 // 我们在此使用作用域内的 dims.width/height
                 newImgTag = newImgTag.replace(/style="(.*?)"/, `style="$1; aspect-ratio: ${dims.width} / ${dims.height}; height: auto;"`)
            }
        }

        // 加载图
        const loadingImg =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAADa6r/EAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII='
        newImgTag = newImgTag.replace(
          src_value,
          loadingImg + '" data-src="' + src_value
        )
        return newImgTag
      }
    )
  } catch (e) {
    console.error('[Stellaris] Error in img_lazyload:', e)
    return htmlContent
  }
}

module.exports.processSite = function (htmlContent) {
  return lazyProcess.call(this, htmlContent)
}
