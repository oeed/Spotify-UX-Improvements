import { getCurrentTheme, monitorDarkMode, updateSystemThemeClass } from "shared/dark-mode.helper"
import { broadcastSystemThemeChange, onNewFrameLoad } from "shared/injection.helper"

onNewFrameLoad(frame => {
  console.log("injecting theme", frame)
  updateSystemThemeClass(getCurrentTheme(), frame.document.body)
})

monitorDarkMode(theme => {
  updateSystemThemeClass(theme)
  broadcastSystemThemeChange(theme)
})