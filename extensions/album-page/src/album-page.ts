// spotify:app:collection-songs
// spotify:app:album-page
// spotify:app:collection:albums
function fixLinks() {
  // TODO: make these instant on page load
  document.querySelectorAll("a[href='spotify:app:collection-songs']").forEach(element => {
    element.setAttribute("href", "spotify:app:album-page")
    element.setAttribute("data-sidebar-list-item-uri", "spotify:app:album-page")
  })

  const main = document.getElementById("main")
  if (main) {
    main.scrollLeft = main.scrollWidth
  }
}

Spicetify.Player.addEventListener("appchange", function(event) {
  console.log(event)
  fixLinks()
})

window.addEventListener("load", () => {
  fixLinks()
  setTimeout(fixLinks, 1000)
  setTimeout(fixLinks, 300)
})

document.addEventListener("readystatechange", event => {
})


// see:


        // Don't add your app's own startup things here. Instead, create your own
        // middleware that listens for START_APP actions and kicks off its startup
        // there. If you need to wait until basic info about the app's state is
        // ready, such as the current URI, then listen for INITIALIZE_URI actions
        // instead of START_APP.