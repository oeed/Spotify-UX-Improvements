
import App from "app.component"
import React from "react"
import ReactDOM from "react-dom"

export const injectReact = () => {
  const root = document.getElementById("root")

  window.parent.postMessage({
    type: 'notify_ready',
    pageId: 'album-page'
  }, '*');
  
  ReactDOM.render(<App/>, root)
}
