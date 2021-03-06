import React, { Component } from "react";

interface AlphabetScrollerProps { 
  characters: Set<string>
}

interface AlphabetScrollerState { 
  isMouseDown: boolean
  activeCharacter?: string
}

export const alphabetScrollerAnchor = (character: string) => `ap-list-${ character.toLowerCase() }`
export const characterFromAnchor = (anchor?: string) => {
  if (!anchor) { return }
  const match = /^#?ap-list-([a-z])/.exec(anchor)
  if (match) {
    return match[1]
  }
}

// TODO: allow dragging between them work



export default class AlphabetScroller extends Component<AlphabetScrollerProps, AlphabetScrollerState> {

  constructor(props: AlphabetScrollerProps) {
    super(props)
    this.state = { isMouseDown: false }
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.onMouseUp, true)
    window.addEventListener("hashchange", this.onHashChange, false)
    window.addEventListener("keypress", this.onKeyPress, false)
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onMouseUp, true)
    window.removeEventListener("hashchange", this.onHashChange, false)
    window.addEventListener("keypress", this.onKeyPress, false)
  }

  onMouseUp = () => this.setState({ isMouseDown: false })

  onHashChange = (event: HashChangeEvent) => {
    this.setState({ activeCharacter: characterFromAnchor(event.newURL.split("#")[1]) })
  }

  onKeyPress = (event: KeyboardEvent) => {
    const character = String.fromCharCode(event.which).toLowerCase()
    if (this.props.characters.has(character)) {
      this.setState({ activeCharacter: character })
      this.jumpTo(character)
    }
  }

  jumpTo(character: string) {
    var url = location.href
    location.href = `#${ alphabetScrollerAnchor(character) }`
    history.replaceState(null, "", url)
  }

  render() {
    const { activeCharacter } = this.state
    const sortedChars = Array.from(this.props.characters.values()).sort()
    return (
      <div className="ap-alphabet-scroller" onMouseDown={ () => this.setState({ isMouseDown: true }) }>
        { sortedChars.map(character =>
            <a
              key={ character }
              className={ character === activeCharacter ? "active" : undefined }
              href={ `#${ alphabetScrollerAnchor(character) }` }
              draggable={ false }
              onMouseEnter={ () => {
                if (this.state.isMouseDown) {
                  this.jumpTo(character)
                }
              } }
            >{ character.toUpperCase() }</a>
          )
        }
      </div>
    )
  }

}