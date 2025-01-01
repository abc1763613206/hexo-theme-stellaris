;(() => {
  const ArtplayerWrapper = {
    injectSubtitleSwitch: function (artplayer) {
      if (artplayer.option.subtitle.url != '') {
        artplayer.controls.add({
          name: 'subtitle-switch',
          index: 10,
          position: 'right',
          html: '<i class="art-icon toggle-subtitle"><svg width="22" height="22" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M40.031 28.031v-4.031h-20.063v4.031h20.063zM40.031 36v-4.031h-8.063v4.031h8.063zM28.031 36v-4.031h-20.063v4.031h20.063zM7.969 24v4.031h8.063v-4.031h-8.063zM40.031 7.969q1.594 0 2.766 1.219t1.172 2.813v24q0 1.594-1.172 2.813t-2.766 1.219h-32.063q-1.594 0-2.766-1.219t-1.172-2.813v-24q0-1.594 1.172-2.813t2.766-1.219h32.063z"></path></svg></i>',
          tooltip: '显示/隐藏字幕',
          stat: true,
          style: {
            color: 'white',
          },
          click: function (item) {
            artplayer.notice.show = item.stat ? '隐藏字幕' : '显示字幕'
            artplayer.subtitle.show = !item.stat
            item.stat = !item.stat
            return item
          },
        })
      }
    },
    watingForArtplayer: function (
      callback,
      checkInterval = 100,
      timeout = 5000
    ) {
      let elapsedTime = 0

      const checkArtplayer = setInterval(() => {
        elapsedTime += checkInterval
        if (elapsedTime >= timeout) {
          clearInterval(checkArtplayer)
          console.error('Artplayer loader timeout')
        }

        if (window.Artplayer) {
          console.log('Artplayer found')
          clearInterval(checkArtplayer)
          callback()
        }
      }, checkInterval)
    },
    init: function () {
      let artplayers = {}
      this.watingForArtplayer(() => {
        const els = document.getElementsByClassName('ds-artplayer')
        for (let i = 0; i < els.length; i++) {
          const el = els[i]
          const artplayer_id = el.getAttribute('artplayer-id')
          artplayers[artplayer_id] = new Artplayer(
            JSON.parse(atob(el.getAttribute('artplayer-config')))
          )
          artplayers[artplayer_id].on('ready', () => {
            this.injectSubtitleSwitch(artplayers[artplayer_id])
          })
        }
        const videos = document.getElementsByTagName('video')
        for (let i = 0; i < videos.length; i++) {
          const video = videos[i]
          video.crossOrigin = 'anonymous'
        }
      })
    },
  }
  stellaris.registerThemePlugin('.ds-artplayer', ArtplayerWrapper)
})()
