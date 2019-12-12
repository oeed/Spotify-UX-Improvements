import { getAlbumTracks, isLiked } from "shared/data.helper"
import { listenForInjectionRequests } from "shared/injection.helper"

// spotify:app:collection-songs
// spotify:app:album-page
// spotify:app:collection:albums
function fixLinks() {
  // TODO: make these instant on page load
  // document.querySelectorAll("a[href='spotify:app:collection-songs']").forEach(element => {
  //   element.setAttribute("href", "spotify:app:album-page")
  //   element.setAttribute("data-sidebar-list-item-uri", "spotify:app:album-page")
  // })

  const main = document.getElementById("main")
  if (main) {
    main.scrollLeft = main.scrollWidth
  }
}

// Spicetify.Player.addEventListener("appchange", function(event) {
//   console.log(event)
//   fixLinks()
// })

window.addEventListener("load", () => {
  fixLinks()
  setTimeout(fixLinks, 1000)
  setTimeout(fixLinks, 300)
})

document.addEventListener("readystatechange", event => {
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