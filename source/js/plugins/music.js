;(() => {
  const MetingJSWrapper = {
    watingForAPlayer: function (callback, checkInterval = 100, timeout = 5000) {
      let elapsedTime = 0

      const checkAPlayer = setInterval(() => {
        elapsedTime += checkInterval
        if (elapsedTime >= timeout) {
          clearInterval(checkAPlayer)
          console.error('APlayer loader timeout')
        }

        if (window.APlayer) {
          console.log('APlayer found')
          clearInterval(checkAPlayer)
          callback()
        }
      }, checkInterval)
    },
    init: function () {
      this.watingForAPlayer(() => {
        const els = document.getElementsByClassName('ds-music')
        for (let i = 0; i < els.length; i++) {
          const el = els[i]
          const metingargs = atob(el.getAttribute('metingargs'))
          el.innerHTML = `<meting-js ${metingargs}></meting-js>`
        }
      })
    },
  }
  stellaris.registerThemePlugin('.ds-music', MetingJSWrapper)
})()
