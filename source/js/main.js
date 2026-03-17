// welcome
(() => {
  if (window.stellaris) {
    return
  }

  console.log(
    `\n %c Hexo theme Stellaris %c ${stellar.github || ''} %c \n \n`,
    'color: #eff4f9; background: #030307; padding: 5px; border-radius: 4px 0 0 4px;',
    'background: #eff4f9; padding: 5px; border-radius: 0 4px 4px 0;',
    ''
  )
  console.log('By Kirikaze Chiyuki')

  // utils
  const util = {
    // https://github.com/jerryc127/hexo-theme-butterfly
    diffDate: (d, more = false) => {
      const dateNow = new Date()
      const datePost = new Date(d)
      const dateDiff = dateNow.getTime() - datePost.getTime()
      const minute = 1000 * 60
      const hour = minute * 60
      const day = hour * 24
      const month = day * 30

      let result
      if (more) {
        const monthCount = dateDiff / month
        const dayCount = dateDiff / day
        const hourCount = dateDiff / hour
        const minuteCount = dateDiff / minute

        if (monthCount > 12) {
          result = null
        } else if (monthCount >= 1) {
          result = parseInt(monthCount) + ' ' + stellar.config.date_suffix.month
        } else if (dayCount >= 1) {
          result = parseInt(dayCount) + ' ' + stellar.config.date_suffix.day
        } else if (hourCount >= 1) {
          result = parseInt(hourCount) + ' ' + stellar.config.date_suffix.hour
        } else if (minuteCount >= 1) {
          result = parseInt(minuteCount) + ' ' + stellar.config.date_suffix.min
        } else {
          result = stellar.config.date_suffix.just
        }
      } else {
        result = parseInt(dateDiff / day)
      }
      return result
    },

    copy: (id, msg) => {
      const el = document.getElementById(id)
      if (el) {
        if (typeof el.select === 'function') {
          el.select()
        }
        const value = 'value' in el ? el.value : el.textContent || ''
        if (!navigator.clipboard) {
          document.execCommand('Copy')
          if (msg && msg.length > 0) {
            hud.toast(msg)
          }
        } else {
          navigator.clipboard.writeText(value).then(() => {
            if (msg && msg.length > 0) {
              hud.toast(msg)
            }
          })
        }
      }
    },

    toggle: (id) => {
      const el = document.getElementById(id)
      if (el) {
        el.classList.toggle('display')
      }
    },
  }
  window.util = util;

  const hud = {
    toast: (msg, duration) => {
      duration = isNaN(duration) ? 2000 : duration
      var el = document.createElement('div')
      el.classList.add('toast')
      el.textContent = msg == null ? '' : String(msg)
      document.body.appendChild(el)
      setTimeout(function () {
        var d = 0.5
        el.style.webkitTransition =
          '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
        el.style.opacity = '0'
        setTimeout(function () {
          document.body.removeChild(el)
        }, d * 1000)
      }, duration)
    },
  }
  window.hud = hud;

  const sidebar = {
    toggle: () => {
      const l_body = document.querySelector('.l_body')
      if (l_body) {
        l_body.classList.add('mobile')
        l_body.classList.toggle('sidebar')
      }
    },
  }
  window.sidebar = sidebar;

  const stellaris = {
    themePlugins: {},
    registerThemePlugin: function (selector, plugin) {
      this.themePlugins[selector] = plugin
      stellaris.jQuery(() =>
        $(() => {
          plugin.init()
        })
      )
    },
    safeCall: (label, fn) => {
      try {
        return fn()
      } catch (e) {
        console.warn(`[stellaris] ${label} failed`, e)
      }
    },
    pluginsConfig: {
      fancyBoxSelector: '',
      scrollRevealPromise: null,
      scrollRevealMode: 'animate',
      lastPageKey: null,
      pendingHistoryNavigation: false,
      lazyLoadListenerBound: false,
    },
    jQuery(fn) {
      const { status } = stellaris.jQueryState
      if (typeof window.jQuery !== 'undefined' || status === 'loaded') {
        fn()
      } else if (status === 'loading') {
        stellaris.jQueryState.promise.then(fn)
      } else {
        stellaris.jQueryState.status = 'loading'
        stellaris.jQueryState.promise = stellar
          .loadScript(stellar.plugins.jQuery)
          .then(() => {
            stellaris.jQueryState.status = 'loaded'
          })
          .then(fn)
      }
    },
    jQueryState: {
      status: 'none',
      promise: null,
    },
    loadCSS: {
      fancyBox: () => {
        if (stellar.plugins.fancybox)
          stellar.loadCSS(stellar.plugins.fancybox.css)
      },
      swiper: () => {
        if (stellar.plugins.swiper) stellar.loadCSS(stellar.plugins.swiper.css)
      },
    },
    load: {
      swiper: () => {
        if (stellar.plugins.swiper) {
          const swiper_api = document.getElementById('swiper-api')
          if (swiper_api != undefined) {
            stellar.loadCSS(stellar.plugins.swiper.css)
            stellar
              .loadScript(stellar.plugins.swiper.js, { defer: true })
              .then(stellaris.init.swiper)
              .catch((e) => {
                console.warn('[stellaris] Swiper failed to load', e)
              })
          }
        }
      },
      scrollReveal: () => {
        if (stellar.plugins.scrollreveal) {
          if (stellaris.pluginsConfig.scrollRevealMode === 'bypass') {
            enableImmediateRevealMode()
            return Promise.resolve()
          }
          if ('ScrollReveal' in window) {
            return Promise.resolve().then(() => stellaris.init.scrollReveal())
          }
          if (stellaris.pluginsConfig.scrollRevealPromise) {
            return stellaris.pluginsConfig.scrollRevealPromise
          }
          stellaris.pluginsConfig.scrollRevealPromise = stellar
            .loadScript(stellar.plugins.scrollreveal.js)
            .then(() => {
              if (!('ScrollReveal' in window)) {
                throw new Error('ScrollReveal API unavailable after script load')
              }
              return stellaris.init.scrollReveal()
            })
            .catch((e) => {
              stellaris.pluginsConfig.scrollRevealPromise = null
              // ScrollReveal 加载失败时，强制显示所有元素
              console.warn('ScrollReveal failed to load, forcing reveal', e)
              stellaris.forceRevealAll()
            })
          return stellaris.pluginsConfig.scrollRevealPromise
        }
      },
      lazyLoad: () => {
        if (stellar.plugins.lazyload) {
          // https://www.npmjs.com/package/vanilla-lazyload
          // Set the options globally
          // to make LazyLoad self-initialize
          window.lazyLoadOptions = {
            elements_selector: '.lazy',
          }
          if (!stellaris.pluginsConfig.lazyLoadListenerBound) {
            stellaris.pluginsConfig.lazyLoadListenerBound = true
            // Listen to the initialization event
            // and get the instance of LazyLoad
            window.addEventListener(
              'LazyLoad::Initialized',
              (event) => {
                window.lazyLoadInstance = event.detail.instance
                stellaris.safeCall('init.lazyLoad.refresh', () => stellaris.init.lazyLoad())
              },
              false
            )
          }
          if (!('LazyLoad' in window) && !('lazyLoadInstance' in window)) {
            stellar
              .loadScript(stellar.plugins.lazyload.js, { defer: true })
              .catch((e) => {
                console.warn('[stellaris] LazyLoad failed to load', e)
              })
          }
          stellaris.init.lazyLoad()
        }
      },
      fancyBox: () => {
        if (stellar.plugins.fancybox) {
          let selector = 'img[fancybox]:not(.error)'
          if (stellar.plugins.fancybox.selector) {
            selector += `, ${stellar.plugins.fancybox.selector}`
          }
          stellaris.pluginsConfig.fancyBoxSelector = selector
          stellar.loadCSS(stellar.plugins.fancybox.css)
          stellar
            .loadScript(stellar.plugins.fancybox.js, { defer: true })
            .then(stellaris.init.fancyBox)
            .catch((e) => {
              console.warn('[stellaris] FancyBox failed to load', e)
            })
        }
      },
      search: () => {
        if (stellar.search.service && stellar.search.service == 'local_search') {
          stellar
            .loadScript(stellar.search.js, { defer: true })
            .then(stellaris.init.search)
            .catch((e) => {
              console.warn('[stellaris] Search failed to load', e)
            })
        }
      },
      copyCode: () => {
        if (stellar.plugins.copycode) {
          stellar
            .loadScript(stellar.plugins.copycode.js, { defer: true })
            .catch((e) => {
              console.warn('[stellaris] CopyCode failed to load', e)
            })
        }
      },
      themePlugins: () => {
        if (stellar.plugins.data_services) {
          for (let id of Object.keys(stellar.plugins.data_services)) {
            const plugin = stellar.plugins.data_services[id]
            const els = document.getElementsByClassName(`ds-${id}`)
            if (els != undefined && els.length > 0) {
              if (plugin.ext) {
                for (let extjs of Object.values(plugin.ext)) {
                  stellar.loadScript(extjs, { defer: true }).catch(() => {})
                }
              }
              if (plugin.css) {
                for (let css of Object.values(plugin.css)) {
                  stellar.loadCSS(css)
                }
              }
              if (plugin.js) {
                stellar.loadScript(plugin.js, { defer: true }).catch(() => {})
              }
            }
          }
        }
      },
    },
    loadNeededCSS: () => {
      ;['fancyBox', 'swiper'].forEach((css) => {
        stellaris.loadCSS[css]()
      })
    },
    loadAllPlugins: (options = {}) => {
      const skipPlugins = new Set(options.skip || [])
      ;[
        'scrollReveal',
        'lazyLoad',
        'fancyBox',
        'swiper',
        'search',
        'copyCode',
        'themePlugins',
      ].forEach((plugin) => {
        if (skipPlugins.has(plugin)) return
        stellaris.load[plugin]()
      })
    },
    loadNeededPlugins: (options = {}) => {
      const skipPlugins = new Set(options.skip || [])
      ;['lazyLoad', 'fancyBox', 'swiper'].forEach((plugin) => {
        if (skipPlugins.has(plugin)) return
        stellaris.load[plugin]()
      })
    },
    init: {
      toc: () => {
        stellaris.jQuery(() => {
          const scrollOffset = 32
          const buildSegs = () => $('article.md-text :header').toArray()
          let segs = buildSegs()
          // 避免 InstantClick 切页后重复绑定
          $(window)
            .off('scroll.stellaris.toc')
            .on('scroll.stellaris.toc', function () {
              var scrollTop = $(this).scrollTop()
            var topSeg = null
            for (let i = 0; i < segs.length; i++) {
              var seg = $(segs[i])
              const segOffset = seg.offset && seg.offset()
              if (!segOffset) continue
              if (segOffset.top > scrollTop + scrollOffset) {
                continue
              }
              if (!topSeg) {
                topSeg = seg
              } else {
                const topOffset = topSeg.offset && topSeg.offset()
                if (topOffset && segOffset.top >= topOffset.top) {
                topSeg = seg
                }
              }
            }
            if (topSeg) {
              $('.toc#toc a.toc-link').removeClass('active')
              var link = '#' + topSeg.attr('id')

              if (link != '#undefined') {
                const highlightSelector =
                  '.toc#toc a.toc-link[href="' + encodeURI(link) + '"]'
                const highlightItem = $(highlightSelector)
                if (highlightItem.length > 0) {
                  highlightItem.addClass('active')
                  const e0 = document.querySelector('.widgets')
                  const e1 = document.querySelector(highlightSelector)
                  if (!e0 || !e1) return
                  const offsetBottom =
                    e1.getBoundingClientRect().bottom -
                    e0.getBoundingClientRect().bottom +
                    200
                  const offsetTop =
                    e1.getBoundingClientRect().top -
                    e0.getBoundingClientRect().top -
                    64
                  if (offsetTop < 0) {
                    e0.scrollBy(0, offsetTop)
                  } else if (offsetBottom > 0) {
                    e0.scrollBy(0, offsetBottom)
                  }
                }
              } else {
                $('.toc#toc a.toc-link:first').addClass('active')
              }
            }
            })

          // 初次执行一次，且在切页后重建 segs
          segs = buildSegs()
          $(window).triggerHandler('scroll.stellaris.toc')
        })
      },
      sidebar: () => {
        stellaris.jQuery(() => {
          // 委托绑定，避免 InstantClick 切页后重复绑定
          $(document)
            .off('click.stellaris.tocjump', '.toc#toc a.toc-link')
            .on('click.stellaris.tocjump', '.toc#toc a.toc-link', function (e) {
              e.preventDefault()
              const l_body = document.querySelector('.l_body')
              if (l_body) l_body.classList.remove('sidebar')
              const targetId = decodeURI($(this).attr('href'))
              const targetEl = document.querySelector(targetId)
              if (targetEl) {
                const top = $(targetEl).offset().top - 32 // 32px offset
                $('html, body').animate({ scrollTop: top }, 300)
              }
              // 触发一次 scroll，让 ScrollReveal 能在跳转后及时计算并 reveal。
              // 不要 forceRevealAll，否则会导致动画直接“瞬间完成/全量提前显示”。
              setTimeout(() => {
                window.dispatchEvent(new Event('scroll'))
              }, 350)
            })
        })
      },
      clickEvents: () => {
        stellaris.jQuery(() => {
          const elements = $('.on-click-event')
          elements.each((e) => {
            const el = $(elements[e])
            el.attr('onclick', el.attr('data-on-click'))
            el.removeAttr('data-on-click')
          })
        })
      },
      relativeDate: () => {
        document.querySelectorAll('#post-meta time').forEach((item) => {
          const $this = item
          const timeVal = $this.getAttribute('datetime')
          let relativeValue = util.diffDate(timeVal, true)
          if (relativeValue) {
            $this.innerText = relativeValue
          }
        })
      },
      /**
       * Tabs tag listener (without twitter bootstrap).
       */
      registerTabsTag: function () {
        // 使用事件委托避免重复绑定，并确保 InstantClick 切页后的新增 tab 也可用。
        if (!stellaris.pluginsConfig._tabsDelegated) {
          stellaris.pluginsConfig._tabsDelegated = true
          document.addEventListener('click', (event) => {
            const rawTarget = event.target
            const target = rawTarget instanceof Element ? rawTarget : null
            if (!target) return

            const element = target.closest('.tabs .nav-tabs .tab')
            if (!element) return

            event.preventDefault()
            if (element.classList.contains('active')) return

            const nav = element.parentNode
            if (!nav) return
            ;[...nav.children].forEach((t) => {
              t.classList.toggle('active', t === element)
            })

            const a = element.querySelector('a')
            if (!a) return
            const href = a.getAttribute('href')
            if (!href) return
            const id = href.replace('#', '')
            const tActive = document.getElementById(id)
            if (!tActive || !tActive.parentNode) return
            ;[...tActive.parentNode.children].forEach((t) => {
              t.classList.toggle('active', t === tActive)
            })
            tActive.dispatchEvent(
              new Event('tabs:click', {
                bubbles: true,
              })
            )
          })
        }

        window.dispatchEvent(new Event('tabs:register'))
      },
      outdatedCheck: () => {
        if (stellar.article.outdate_month == 0) return
        const outdatedEl = document.getElementById('outdated')
        if (!outdatedEl) return

        const judgeOutdated = (postDate, nowDate) => {
          //判断这两个日期是否相差三个月以上
          if (nowDate.getFullYear() - postDate.getFullYear() > 0) {
            return true
          } else {
            return (
              nowDate.getMonth() - postDate.getMonth() >
              stellar.article.outdate_month
            )
          }
        }

        const postMeta = document.getElementById('post-meta')
        if (!postMeta) return
        const postMetaTimes = postMeta.getElementsByTagName('time')
        if (!postMetaTimes || postMetaTimes.length === 0) return
        if (outdatedEl !== null) {
          if (
            judgeOutdated(
              new Date(postMetaTimes[postMetaTimes.length - 1].dateTime), // postDate
              new Date() // nowDate
            )
          ) {
            outdatedEl.innerText = '，文章内容可能已经过时'
          }
        }
      },
      search: () => {
        if (stellar.search.service && stellar.search.service == 'local_search') {
          stellaris.jQuery(() => {
            const $inputArea = $('input#search-input')
            if ($inputArea.length == 0) {
              return
            }
            // 避免 InstantClick 切页后重复绑定
            $inputArea.off('.stellaris.search')
            $inputArea.on('focus.stellaris.search', function () {
              let path
              if (stellar.search.service in stellar.search) {
                path = stellar.search[stellar.search.service].path
              } else {
                path = '/search.json'
              }
              if (!path.startsWith('/')) {
                path = '/' + path
              }
              const filter = $inputArea.attr('data-filter') || ''
              searchFunc(path, filter, 'search-input', 'search-result')
            })
            $inputArea.on('keydown.stellaris.search', function (e) {
              if (e.which == 13) {
                e.preventDefault()
              }
            })

            const resultEl = document.querySelector('div#search-result')
            if (!resultEl) return
            if (stellaris.pluginsConfig._searchObserver) {
              stellaris.pluginsConfig._searchObserver.disconnect()
            }
            stellaris.pluginsConfig._searchObserver = new MutationObserver(
              function (mutationsList) {
                if (mutationsList.length == 1) {
                  if (mutationsList[0].addedNodes.length) {
                    $('.search-wrapper').removeClass('noresult')
                  } else if (mutationsList[0].removedNodes.length) {
                    $('.search-wrapper').addClass('noresult')
                  }
                }
              }
            )
            stellaris.pluginsConfig._searchObserver.observe(resultEl, {
              childList: true,
            })
          })
        }
      },
      swiper: () => {
        if (stellar.plugins.swiper && 'Swiper' in window) {
          const swiper_api = document.getElementById('swiper-api')
          if (!swiper_api) return
          const effect = swiper_api.getAttribute('effect') || ''
          window.swiper = new Swiper('.swiper#swiper-api', {
            slidesPerView: 'auto',
            spaceBetween: 8,
            centeredSlides: true,
            effect: effect,
            loop: true,
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            },
          })
        }
      },
      scrollReveal: () => {
        if (!stellar.plugins.scrollreveal) return
        if (stellaris.pluginsConfig.scrollRevealMode === 'bypass') {
          enableImmediateRevealMode()
          return
        }
        // InstantClick 可能在 window load 之前触发 change，此时库还没加载。
        if (!('ScrollReveal' in window)) {
          stellaris.load.scrollReveal()
          return
        }

        const selector = 'body .reveal'
        const elements = document.querySelectorAll(selector)
        if (elements.length === 0) {
          disableImmediateRevealMode()
          document.documentElement.classList.remove('sr-loaded')
          return
        }

        let sr
        try {
          sr = stellaris.pluginsConfig._scrollRevealInstance || window.ScrollReveal()
          stellaris.pluginsConfig._scrollRevealInstance = sr
          if (typeof sr.destroy === 'function') sr.destroy()
        } catch (e) {
          console.warn('ScrollReveal init failed, forcing reveal', e)
          stellaris.forceRevealAll()
          return
        }

        // 清理可能残留的内联样式，避免切页后一直处于 hidden/transform 状态
        elements.forEach(clearRevealInlineStyles)

        const { distance, duration, interval, scale } = stellar.plugins.scrollreveal

        const revealNow = () => {
          try {
            // 仅在真正开始 reveal 之前再禁用 CSS fallback，避免“永远 hidden”
            disableImmediateRevealMode()
            document.documentElement.classList.add('sr-loaded')
            sr.reveal(selector, {
              distance,
              duration,
              interval,
              scale,
              easing: 'ease-out',
              afterReveal: (el) => {
                el.style.visibility = 'visible'
                el.style.opacity = '1'
                el.style.transform = 'none'
              },
            })
            // 温和兜底：仅修复仍被 visibility:hidden 卡住的元素，避免覆盖 SR 的动画效果
            setTimeout(forceRevealVisibleElements, 800)
          } catch (e) {
            console.warn('ScrollReveal reveal failed, forcing reveal', e)
            stellaris.forceRevealAll()
          }
        }

        if ('requestAnimationFrame' in window) {
          requestAnimationFrame(() => requestAnimationFrame(revealNow))
        } else {
          setTimeout(revealNow, 0)
        }
      },
      lazyLoad: () => {
        if (stellar.plugins.lazyload && 'lazyLoadInstance' in window) {
          window.lazyLoadInstance.update()
        }
      },
      fancyBox: () => {
        if (stellar.plugins.fancybox && 'Fancybox' in window) {
          const selector = stellaris.pluginsConfig.fancyBoxSelector
          if (document.querySelectorAll(selector).length !== 0) {
            Fancybox.bind(selector, {
              groupAll: true,
              hideScrollbar: false,
              Thumbs: {
                autoStart: false,
              },
              caption: function (fancybox, carousel, slide) {
                return slide.$trigger.alt || null
              },
            })
          }
        }
      },
      themePlugins: () => {
        if (stellar.plugins.data_services) {
          Object.keys(stellaris.themePlugins).forEach((selector) => {
            const els = document.querySelectorAll(selector)
            if (els != undefined && els.length > 0) {
              stellaris.jQuery(() =>
                $(() => {
                  stellaris.themePlugins[selector].init()
                })
              )
            }
          })
        }
      },
    },
    initPageComponents: () => {
      ;[
        'toc',
        'sidebar',
        'clickEvents',
        'relativeDate',
        'registerTabsTag',
        'outdatedCheck',
      ].forEach((component) => {
        stellaris.safeCall(`init.${component}`, () => stellaris.init[component]())
      })
    },
    initPlugins: (options = {}) => {
      const skipPlugins = new Set(options.skip || [])
      ;[
        'scrollReveal',
        'lazyLoad',
        'fancyBox',
        'swiper',
        'search',
        'themePlugins',
      ].forEach((plugin) => {
        if (skipPlugins.has(plugin)) return
        stellaris.safeCall(`init.${plugin}`, () => stellaris.init[plugin]())
      })
    },
    armScrollRevealFallback: (mode) => prepareRevealForLifecycle(mode),
    initOnFirstLoad: () => pageLifecycle.boot(),
    initOnPageChange: () => pageLifecycle.onInstantChange(),
    // 强制显示所有元素（兜底方法）
    forceRevealAll: () => {
      enableImmediateRevealMode()
      document.querySelectorAll('body .reveal').forEach((el) => {
        revealElementImmediately(el)
      })
    },
  }
  window.stellaris = stellaris;

  const normalizePagePath = (pathname = '/') => {
    const normalizedPath = pathname.replace(/\/index\.html?$/i, '/')
    if (normalizedPath === '/') return '/'
    return normalizedPath.replace(/\/+$/, '') || '/'
  }

  const historyNavigationHintKey = '__stellaris_history_navigation__'

  const getCurrentPageKey = () => {
    return `${normalizePagePath(window.location.pathname)}${window.location.search || ''}`
  }

  const syncCurrentPageKey = () => {
    const pageKey = getCurrentPageKey()
    stellaris.pluginsConfig.lastPageKey = pageKey
    return pageKey
  }

  const SCROLL_REVEAL_MODE = Object.freeze({
    ANIMATE: 'animate',
    BYPASS: 'bypass',
  })
  const scrollRevealBypassClass = 'sr-bypass'
  const PAGE_LIFECYCLE = Object.freeze({
    BOOT: 'boot',
    NAVIGATE: 'navigate',
    HISTORY: 'history',
    BFCACHE: 'bfcache',
    SAME_PAGE: 'same-page',
  })

  const getCurrentPageRouteLink = (event) => {
    if (event.defaultPrevented) return false
    if (event.button !== 0) return false
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return false
    }

    const rawTarget = event.target
    const target =
      rawTarget instanceof Element ? rawTarget.closest('a[href]') : null
    if (!target) return false
    if (target.target && target.target !== '_self') return false
    if (target.hasAttribute('download')) return false

    const href = target.getAttribute('href')
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    ) {
      return false
    }

    let targetUrl
    try {
      targetUrl = new URL(target.href, window.location.href)
    } catch (e) {
      return false
    }

    if (targetUrl.origin !== window.location.origin) return false
    if (targetUrl.hash) return false

    const targetPageKey = `${normalizePagePath(targetUrl.pathname)}${targetUrl.search || ''}`
    return targetPageKey === getCurrentPageKey() ? target : null
  }

  const getNavigationType = () => {
    const entries =
      typeof performance !== 'undefined' &&
      typeof performance.getEntriesByType === 'function'
        ? performance.getEntriesByType('navigation')
        : []
    if (entries && entries.length > 0 && entries[0].type) {
      return entries[0].type
    }

    if (
      typeof performance !== 'undefined' &&
      performance.navigation &&
      typeof performance.navigation.type === 'number'
    ) {
      switch (performance.navigation.type) {
        case 1:
          return 'reload'
        case 2:
          return 'back_forward'
        default:
          return 'navigate'
      }
    }

    return 'navigate'
  }

  const markHistoryNavigationHint = () => {
    try {
      window.sessionStorage.setItem(historyNavigationHintKey, '1')
    } catch (e) {}
    window.__stellarisHistoryNavigation = true
  }

  const clearHistoryNavigationHint = () => {
    try {
      window.sessionStorage.removeItem(historyNavigationHintKey)
    } catch (e) {}
    window.__stellarisHistoryNavigation = false
  }

  const consumeHistoryNavigationHint = () => {
    const hinted = window.__stellarisHistoryNavigation === true
    clearHistoryNavigationHint()
    return hinted
  }

  const setScrollRevealMode = (mode = SCROLL_REVEAL_MODE.ANIMATE) => {
    stellaris.pluginsConfig.scrollRevealMode = mode
    const html = document.documentElement
    const bypass = mode === SCROLL_REVEAL_MODE.BYPASS
    html.classList.toggle(scrollRevealBypassClass, bypass)
    if (bypass) {
      html.classList.add('sr-loaded')
    }
  }

  const enableImmediateRevealMode = () =>
    setScrollRevealMode(SCROLL_REVEAL_MODE.BYPASS)
  const disableImmediateRevealMode = () =>
    setScrollRevealMode(SCROLL_REVEAL_MODE.ANIMATE)

  const consumePendingNavigationMode = () => {
    const pending = stellaris.pluginsConfig.pendingHistoryNavigation
      ? PAGE_LIFECYCLE.HISTORY
      : null
    stellaris.pluginsConfig.pendingHistoryNavigation = false
    return pending
  }

  const isScrollRevealManaged = (el) => {
    // ScrollReveal v4 会给元素打 data-sr-id；有它就不要手动改写显示状态
    return el && el.hasAttribute && el.hasAttribute('data-sr-id')
  }

  const clearRevealInlineStyles = (el) => {
    if (!el) return
    ;[
      'opacity',
      'transform',
      'visibility',
      'transition',
      'webkitTransition',
    ].forEach((prop) => {
      el.style[prop] = null
    })
  }

  const revealElementImmediately = (el) => {
    if (!el) return
    clearRevealInlineStyles(el)
    el.style.visibility = 'visible'
    el.style.opacity = '1'
    el.style.transform = 'none'
  }

  // 滚动保护逻辑：确保快速滚动或点击 TOC 时元素能正常显示
  const forceRevealVisibleElements = (options = {}) => {
    const { includeManaged = false } = options
    const viewportHeight = window.innerHeight
    document.querySelectorAll('body .reveal').forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < viewportHeight + 200 && rect.bottom > -100) {
        // ScrollReveal 正常工作时不要干预它管理的元素，否则会导致动画“瞬间完成/抢跑”。
        const srReady = 'ScrollReveal' in window
        if (!includeManaged && srReady && isScrollRevealManaged(el)) return

        const computed = window.getComputedStyle(el)
        const isBlocked =
          computed.visibility === 'hidden' || computed.opacity === '0'
        if (!isBlocked) return

        revealElementImmediately(el)
      }
    })
  }

  const runAfterPaint = (fn) => {
    if ('requestAnimationFrame' in window) {
      requestAnimationFrame(() => requestAnimationFrame(fn))
    } else {
      setTimeout(fn, 16)
    }
  }

  const prepareRevealForRestoredPage = () => {
    enableImmediateRevealMode()
  }

  const prepareRevealForFreshNavigation = () => {
    disableImmediateRevealMode()
    if (isScrollRevealConfigured()) {
      document.documentElement.classList.remove('sr-loaded')
    }
  }

  const prepareRevealForSamePage = () => {
    return
  }

  const prepareRevealForLifecycle = (mode = PAGE_LIFECYCLE.NAVIGATE) => {
    if (mode === PAGE_LIFECYCLE.SAME_PAGE) {
      prepareRevealForSamePage()
      return {
        loadAssets: false,
        skipLoads: [],
        skipPlugins: [],
      }
    }

    if (mode === PAGE_LIFECYCLE.HISTORY) {
      prepareRevealForRestoredPage()
      return {
        loadAssets: true,
        skipLoads: ['scrollReveal'],
        skipPlugins: ['scrollReveal'],
      }
    }

    if (mode === PAGE_LIFECYCLE.BFCACHE) {
      prepareRevealForRestoredPage()
      return {
        loadAssets: false,
        skipLoads: ['scrollReveal'],
        skipPlugins: ['scrollReveal'],
      }
    }

    prepareRevealForFreshNavigation()
    return {
      loadAssets: true,
      skipLoads: [],
      skipPlugins: [],
    }
  }
  
  let scrollProtectionHandler = null
  let scrollProtectionTimeout = null

  const isScrollRevealConfigured = () => {
    // 主题只在启用时注入 stellar.plugins.scrollreveal
    return !!(stellar.plugins && stellar.plugins.scrollreveal)
  }
  
  const setupScrollProtection = () => {
    // 移除之前的监听器（如果存在）
    if (scrollProtectionHandler) {
      window.removeEventListener('scroll', scrollProtectionHandler)
    }
    clearTimeout(scrollProtectionTimeout)

    // 若启用了 ScrollReveal，让它接管动画；滚动保护会导致元素提前变为 visible，从而动画“过快/跳过”。
    // 仅在 SR 未启用或库没加载（可能被拦截）时，短暂启用滚动保护避免白屏。
    if (stellaris.pluginsConfig.scrollRevealMode === SCROLL_REVEAL_MODE.BYPASS) {
      return
    }
    if (isScrollRevealConfigured() && 'ScrollReveal' in window) {
      return
    }

    scrollProtectionHandler = () => {
      clearTimeout(scrollProtectionTimeout)
      scrollProtectionTimeout = setTimeout(forceRevealVisibleElements, 50)
    }

    window.addEventListener('scroll', scrollProtectionHandler, { passive: true })

    setTimeout(() => {
      if (scrollProtectionHandler) {
        window.removeEventListener('scroll', scrollProtectionHandler)
        scrollProtectionHandler = null
      }
    }, 3000)
  }

  const runPluginLifecycle = (skipPlugins = []) => {
    if (skipPlugins.length > 0) {
      stellaris.safeCall('initPlugins.skip', () =>
        stellaris.initPlugins({ skip: skipPlugins })
      )
    } else {
      stellaris.safeCall('initPlugins', stellaris.initPlugins)
    }
  }

  const refreshPageAfterSetup = () => {
    const refresh = () => {
      stellaris.safeCall('init.lazyLoad.refresh', () => stellaris.init.lazyLoad())
      window.dispatchEvent(new Event('scroll'))
    }
    runAfterPaint(refresh)
    setTimeout(refresh, 120)
  }

  const runPageSetup = ({
    mode,
    loadAssets,
    skipLoads = [],
    skipPlugins = [],
    fullLoad = false,
  }) => {
    if (fullLoad) {
      stellaris.safeCall('loadAllPlugins', () =>
        stellaris.loadAllPlugins({ skip: skipLoads })
      )
      stellaris.safeCall('initPageComponents', stellaris.initPageComponents)
      runPluginLifecycle(skipPlugins)
      stellaris.safeCall('setupScrollProtection', setupScrollProtection)
      refreshPageAfterSetup()
      return
    }

    if (loadAssets) {
      stellaris.safeCall('loadNeededCSS', stellaris.loadNeededCSS)
      stellaris.safeCall('loadNeededPlugins', () =>
        stellaris.loadNeededPlugins({ skip: skipLoads })
      )
      stellaris.safeCall('load.themePlugins', stellaris.load.themePlugins)
    }

    stellaris.safeCall('initPageComponents', stellaris.initPageComponents)
    runPluginLifecycle(skipPlugins)
    stellaris.safeCall('setupScrollProtection', setupScrollProtection)
    refreshPageAfterSetup()
  }

  const classifyInstantPageChange = () => {
    const nextPageKey = getCurrentPageKey()
    const prevPageKey = stellaris.pluginsConfig.lastPageKey
    const pendingMode = consumePendingNavigationMode()
    stellaris.pluginsConfig.lastPageKey = nextPageKey
    if (prevPageKey === nextPageKey) {
      return null
    }
    return pendingMode || PAGE_LIFECYCLE.NAVIGATE
  }

  const pageLifecycle = {
    log(mode) {
      const labels = {
        [PAGE_LIFECYCLE.BOOT]: 'New page loaded',
        [PAGE_LIFECYCLE.NAVIGATE]: 'Page loaded',
        [PAGE_LIFECYCLE.HISTORY]: 'Page restored from history',
        [PAGE_LIFECYCLE.BFCACHE]: 'Page restored from bfcache',
        [PAGE_LIFECYCLE.SAME_PAGE]: 'Skip duplicated page change',
      }
      console.log(`${labels[mode]}: ${window.location.pathname}`)
    },
    run(mode, options = {}) {
      const { syncPageKey = false, defer = false, fullLoad = false } = options
      if (syncPageKey) {
        syncCurrentPageKey()
      }
      this.log(mode)
      const lifecycleOptions = prepareRevealForLifecycle(mode)
      const execute = () =>
        runPageSetup({
          mode,
          loadAssets: lifecycleOptions.loadAssets,
          skipLoads: lifecycleOptions.skipLoads,
          skipPlugins: lifecycleOptions.skipPlugins,
          fullLoad,
        })
      if (defer) {
        runAfterPaint(execute)
      } else {
        execute()
      }
    },
    boot() {
      const mode =
        consumeHistoryNavigationHint() || getNavigationType() === 'back_forward'
          ? PAGE_LIFECYCLE.HISTORY
          : PAGE_LIFECYCLE.BOOT
      this.run(mode, {
        syncPageKey: true,
        fullLoad: true,
      })
    },
    onInstantChange() {
      const mode = classifyInstantPageChange()
      if (!mode) return
      this.run(mode)
    },
    onBFCacheRestore() {
      stellaris.pluginsConfig.pendingHistoryNavigation = false
      this.run(PAGE_LIFECYCLE.BFCACHE, {
        syncPageKey: true,
        defer: true,
      })
    },
  }
  
  const restorePageFromBFCache = () => {
    pageLifecycle.onBFCacheRestore()
  }
  
  // 立即启用滚动保护
  setupScrollProtection()

  document.addEventListener(
    'click',
    (event) => {
      const currentPageLink = getCurrentPageRouteLink(event)
      if (!currentPageLink) return
      currentPageLink.setAttribute('data-no-instant', 'true')
      event.preventDefault()
    },
    true
  )

  window.addEventListener(
    'popstate',
    () => {
      stellaris.pluginsConfig.pendingHistoryNavigation = true
      markHistoryNavigationHint()
    },
    true
  )

  window.addEventListener('pagehide', () => {
    // 如果在切页时脚本还没真正加载完成，不要缓存住旧 Promise，避免返回后无法重试。
    if (!('ScrollReveal' in window)) {
      stellaris.pluginsConfig.scrollRevealPromise = null
    }
  })

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      clearHistoryNavigationHint()
      restorePageFromBFCache()
    }
  })
  
  // 监听 hash 变化（点击 TOC）
  window.addEventListener('hashchange', () => {
    setTimeout(forceRevealVisibleElements, 50)
  }, { passive: true })
  
  // 最终兜底：10秒后无论如何都强制显示所有 reveal 元素，防止任何模块阻塞导致白屏
  setTimeout(() => {
    if (document.querySelector('body .reveal') === null) return
    if (document.documentElement.classList.contains('sr-loaded')) return
    stellaris.forceRevealAll()
  }, 10000)

  // 不依赖 window.load：某些注入脚本/统计脚本被拦截时可能延迟甚至阻断 load 事件。
  // 这里尽早初始化一次，load 事件仅作为补偿兜底。
  let booted = false
  const bootOnce = () => {
    if (booted) return
    booted = true
    stellaris.safeCall('initOnFirstLoad', stellaris.initOnFirstLoad)
  }
  // main.js 一般在页面底部引入，此时 DOM 已可用；直接启动可避免被后续脚本阻塞。
  bootOnce()
  window.addEventListener('load', bootOnce, { once: true })
  if (window.InstantClick && typeof window.InstantClick.on === 'function') {
    window.InstantClick.on('change', stellaris.initOnPageChange)
  }
})()
