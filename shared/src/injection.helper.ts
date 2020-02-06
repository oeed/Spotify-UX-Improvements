import { SystemTheme, updateSystemThemeClass } from "./dark-mode.helper"

const INJECTION_REQUEST = "spicetify-request-injection"
const INJECTION_RESPONSE = "spicetify-request-injected"
const SET_LIGHT_MODE = "spicetify-system-light"
const SET_DARK_MODE = "spicetify-system-dark"

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

export const listenForSystemThemeChanges = () => {
  window.addEventListener("message", event => {
    if (event.data === SET_DARK_MODE) {
      document.body.classList.remove("system-theme-light")
      document.body.classList.add("system-theme-dark")
    }
    else if (event.data === SET_LIGHT_MODE) {
      document.body.classList.remove("system-theme-dark")
      document.body.classList.add("system-theme-light")
    }
  })
}

export const broadcastSystemThemeChange = (theme: SystemTheme) => {
  const frames = document.getElementsByTagName("iframe")
  console.log("broadcastSystemThemeChange", frames, theme)
  for (let i = 0; i < frames.length; i++) {
    const frame = frames.item(i)
    updateSystemThemeClass(theme, frame?.contentDocument?.body)
    // frame?.contentWindow?.postMessage(theme === SystemTheme.light ? SET_LIGHT_MODE : SET_DARK_MODE, "*")
  }
}

export const onNewFrameLoad = (handler: (window: Window) => void) => window.addEventListener("message", event => {
  if (typeof event.data === "object" && "type" in event.data && event.data.type === "notify_ready") {
    console.log("Frame loaded", event.source)
    handler(event.source as Window)
  }
})