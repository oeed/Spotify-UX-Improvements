import { getAlbumTracks, isLiked } from "shared/data.helper";
import { listenForInjectionRequests } from "shared/injection.helper";


(function AlbumPage() {
  if (!(Spicetify as any).EventDispatcher) {
    return setTimeout(AlbumPage, 50)
  }

  console.log('abum page extension')
  // spotify:app:collection-songs
  // spotify:app:album-page
  // spotify:app:collection:albums
  function fixLinks() {
    // TODO: make these instant on page load
    document.querySelectorAll("a[href='spotify:app:collection:albums']").forEach(element => {
      element.setAttribute("href", "spotify:app:album-page")
      element.setAttribute("data-sidebar-list-item-uri", "spotify:app:album-page")
    })
  }

  Spicetify.Player.addEventListener("appchange", function(event) {
    // fixLinks()
  })

  const main = document.getElementById("main")!
  window.addEventListener("load", () => {
    
    fixLinks()
    setTimeout(fixLinks, 1000)
    setTimeout(fixLinks, 300)
  })

  fixLinks()


  let lastScroll: number | undefined
  main.addEventListener("scroll", (event) => {
    lastScroll = main.scrollLeft
  })
  
  const dispatcher = (Spicetify as any).EventDispatcher

  dispatcher.addEventListener((Spicetify as any).Event.TYPES.VIEW_ACTIVATE, (event: any) => {
    console.log("acc", event, main.scrollLeft)
    if (lastScroll !== undefined) {
      main.scrollLeft = lastScroll
    }

  })
  
  dispatcher.addEventListener((Spicetify as any).Event.TYPES.VIEW_DEACTIVATE, (event: any) => {
    console.log("deacc", event, main.scrollLeft)
  })


  // let lastScroll: number | undefined
  let lastLastScroll: number | undefined
  let lastChangeTime: number | undefined
  // main.addEventListener("scroll", (event) => {
  //   console.log("scroll", event)
  // //   lastLastScroll = lastScroll
  // //   lastScroll = main.scrollLeft
  // //   lastChangeTime = Date.now()
  // })
  // main.addEventListener("scrollwheel", (event) => {
  //   console.log("scrollwheel", event)
  // //   lastLastScroll = lastScroll
  // //   lastScroll = main.scrollLeft
  // //   lastChangeTime = Date.now()
  // })
  ;
  console.log("1", ("EventDispatcher" in (Spicetify as any)));


  window.addEventListener("message", event => {
    if (typeof event.data === "object" && event.data.uri === "message-proxy-client-state") {
      const main = document.getElementById("main")
      if (!main) { return }

      // main.scrollLeft = main.scrollWidth

      // if (lastScroll !== undefined && lastLastScroll !== undefined && lastChangeTime && (Date.now() - lastChangeTime) < 100) {
      //   main.scrollLeft = lastLastScroll
      // }
    }
  })

  listenForInjectionRequests()



  // Skip songs when playing albums that aren't liked. Ignores albums that are fully unliked.
  Spicetify.Player.addEventListener("songchange", async () => {
    const data = Spicetify.Player.data || Spicetify.Queue;
    if (!data) return;

    // if this was queued don't skip it
    if (data.track.provider === "queue") { return }

    // if we're playing an album skip unliked tracks
    const albumURI = Spicetify.URI.fromString(data.context_uri)
    if (albumURI.type === Spicetify.URI.Type.ALBUM && data.track.metadata.album_uri === data.context_uri) {
      // first check if the whole album is unliked, in which case we don't skip anything
      const albumTracks = await getAlbumTracks(data.context_uri)
      let hasHeart = false
      for (const track of albumTracks) {
        if (await isLiked(track)) {
          hasHeart = true
          break
        }
      }

      if (hasHeart && !await isLiked(data.track.uri)) {
        Spicetify.Player.next();
      }
    }
  });

  // see:


          // Don't add your app's own startup things here. Instead, create your own
          // middleware that listens for START_APP actions and kicks off its startup
          // there. If you need to wait until basic info about the app's state is
          // ready, such as the current URI, then listen for INITIALIZE_URI actions
          // instead of START_APP.
        })()