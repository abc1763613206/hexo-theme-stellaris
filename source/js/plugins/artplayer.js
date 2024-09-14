(() => {
    const ArtplayerWrapper = {
        init: function() {
            let artplayers = {}
            const els = document.getElementsByClassName('ds-artplayer');
            for (let i = 0; i < els.length; i++) {
                const el = els[i]
                const artplayer_id = el.getAttribute('artplayer-id')
                try {
                    artplayers[artplayer_id] = new Artplayer(JSON.parse(atob(el.getAttribute('artplayer-config'))));
                } catch (e) {
                    console.error(e)
                    if (e instanceof ReferenceError) {
                        setTimeout(() => {
                            artplayers[artplayer_id] = new Artplayer(JSON.parse(atob(el.getAttribute('artplayer-config'))));
                        }, 100)
                    } 
                }
            }
            const videos = document.getElementsByTagName('video');
            for (let i = 0; i < videos.length; i++) {
                const video = videos[i]
                video.crossOrigin = "anonymous"
            }
        }
    }
    stellaris.registerThemePlugin('.ds-artplayer', ArtplayerWrapper);
})()