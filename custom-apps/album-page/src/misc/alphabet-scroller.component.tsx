import React, { Component } from "react";

interface AlphabetScrollerProps { 
  characters: Set<string>
}

export const alphabetScrollerAnchor = (character: string) => `ap-list-${ character.toLowerCase() }`

export default class AlphabetScroller extends Component<AlphabetScrollerProps> {

  render() {
    const sortedChars = Array.from(this.props.characters.values()).sort()
    console.log(sortedChars, this.props.characters)
    return (
      <div className="ap-alphabet-scroller">
        { sortedChars.map(character =>
            <a key={ character } href={ `#${ alphabetScrollerAnchor(character) }` }>{ character.toUpperCase() }</a>
          )
        }
      </div>
    )
  }

}