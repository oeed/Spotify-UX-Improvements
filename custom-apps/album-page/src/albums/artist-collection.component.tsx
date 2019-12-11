import AlbumItem from "albums/album-item.component";
import React, { Component } from "react";
import { ArtistAlbums } from "./album-list.component";

interface ArtistCollectionProps {
  artistAlbums: ArtistAlbums
}

export default class ArtistCollection extends Component<ArtistCollectionProps> {

  render() {
    const { artistAlbums: { artist, albums } } = this.props
    return (
      <div className="ap-artist-collection">
        <h1>{ artist.name }</h1>
        <div className="ap-albums">
          { albums.map((album, i) => <AlbumItem key={ i } album={ album }/> )}
        </div>
      </div>
    )
  }

}