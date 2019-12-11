
import App from "app.component"
import React from "react"
import ReactDOM from "react-dom"

export const injectReact = () => {
  console.log("inkect")

  const root = document.getElementById("root")
  
  ReactDOM.render(<App/>, root)
  console.log("redemred")

}
