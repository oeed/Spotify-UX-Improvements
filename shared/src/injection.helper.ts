const INJECTION_REQUEST = "spicetify-request-injection"
const INJECTION_RESPONSE = "spicetify-request-injected"

export const requestInject = () => new Promise(resolve => {
  window.addEventListener("message", event => {
    if (event.data === INJECTION_RESPONSE) {
      console.info("Got Spicetify!", window.Spicetify)
      resolve()
    }
  })

  parent.postMessage(INJECTION_REQUEST, "https://zlink.app.spotify.com")
})

export const listenForInjectionRequests = () => window.addEventListener("message", event => {
  if (event.data === INJECTION_REQUEST && event.source) {
    (event.source as any).Spicetify = Spicetify;
    (event.source as Window).postMessage(INJECTION_RESPONSE, event.origin)
    console.info("Injected Spicetify into:", event.source)
  }
})