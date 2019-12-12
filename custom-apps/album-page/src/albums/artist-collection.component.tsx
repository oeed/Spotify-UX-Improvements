import AlbumItem from "albums/album-item.component";
import { alphabetScrollerAnchor } from "misc/alphabet-scroller.component";
import { playAlbum } from "player.helper";
import React, { Component, MouseEvent } from "react";
import { getAlbums } from "shared/data.helper";
import { ArtistAlbums } from "./album-list.component";
import { getArtistCharacter } from "./album.helper";

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

      <div className="ap-artist-collection">
        <div className="ap-artist-header">
          <h1>{ artist.name }</h1>
          <button className="spoticon-shuffle-16" onClick={ this.onRandomAlbumClick }/>
        </div>
        <div className="ap-albums">
          { albums.map((album, i) => <AlbumItem key={ i } album={ album }/> )}
        </div>
      </div>
    </>
  }

  onRandomAlbumClick = async (event: MouseEvent) => {
    const albums = event.altKey ? await getAlbums() : this.props.artistAlbums.albums
    const album = albums[Math.floor(Math.random() * albums.length)]
    playAlbum(album)
  }

}