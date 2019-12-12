import AlbumItem from "albums/album-item.component";
import { alphabetScrollerAnchor } from "misc/alphabet-scroller.component";
import React, { Component } from "react";
import { ArtistAlbums, getArtistCharacter } from "./album-list.component";

interface ArtistCollectionProps {
  artistAlbums: ArtistAlbums
}

export default class ArtistCollection extends Component<ArtistCollectionProps> {

  render() {
    const { artistAlbums: { artist, albums, needsAnchor } } = this.props
    return <>
      { needsAnchor &&
        <a className="ap-alphabet-link" id={ alphabetScrollerAnchor(getArtistCharacter(artist)) }/>
      }

      <div className="ap-artist-collection" >
        <h1>{ artist.name }</h1>
        <div className="ap-albums">
          { albums.map((album, i) => <AlbumItem key={ i } album={ album }/> )}
        </div>
      </div>
    </>
  }

}