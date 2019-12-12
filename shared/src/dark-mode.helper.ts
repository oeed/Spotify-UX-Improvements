export enum SystemTheme {
  dark = "dark",
  light = "light"
}

const THEME_QUERY = "theme-query"
let currentTheme = SystemTheme.light

export const getCurrentTheme = () => currentTheme

export const updateSystemThemeClass = (theme: SystemTheme, theBody: HTMLElement = document.body) => {
  if (theme === SystemTheme.dark) {
    theBody.classList.remove("system-theme-light")
    theBody.classList.add("system-theme-dark")
  }
  else {
    theBody.classList.remove("system-theme-dark")
    theBody.classList.add("system-theme-light")
  }
}

export const monitorDarkMode = (onChange: (theme: SystemTheme) => void) => {
  const socket = new WebSocket("ws://localhost:8943/dark-mode")

  let interval: number

  socket.addEventListener('open', () => {
    // check every minute just to be sure
    interval = window.setInterval(() => socket.send(THEME_QUERY), 60 * 1000)
  });

  socket.addEventListener("close", () => {
    console.log("Dark mode socket closed, retrying in 60s")
    window.clearInterval(interval)
    setTimeout(() => monitorDarkMode(onChange), 60 * 1000)
  })

  socket.addEventListener('message', event => {
    if (event.data === SystemTheme.dark) {
      currentTheme = SystemTheme.dark
      console.log("Changing theme to", event.data)
      onChange(SystemTheme.dark)
    }
    else if (event.data === SystemTheme.light) {
      currentTheme = SystemTheme.light
      console.log("Changing theme to", event.data)
      onChange(SystemTheme.light)
    }
  });
}