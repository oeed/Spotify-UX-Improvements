import ArtistCollection from "albums/artist-collection.component";
import { Album, Artist, getAlbums } from "data.helper";
import React, { Component } from "react";

export interface ArtistAlbums {
  artist: Artist
  albums: Album[]
}

interface AlbumListState {
  artistsAlbums?: ArtistAlbums[]
}

export default class AlbumList extends Component<{}, AlbumListState> {

  state: AlbumListState = {}

  componentWillMount() {
    getAlbums().then(albums => {
      console.log(albums)
      const artistsAlbums = new Map<string, ArtistAlbums>()
      for (const album of albums) {
        let artistAlbums = artistsAlbums.get(album.artist.link)
        if (!artistAlbums) {
          artistsAlbums.set(album.artist.link, {
            artist: album.artist,
            albums: [album]
          })
        }
        else {
          artistAlbums.albums.push(album)
        }
      }   

      for (const artistAlbums of artistsAlbums.values()) {
        artistAlbums.albums.sort((a, b) => a.year - b.year)
      }
      
      const array = Array.from(artistsAlbums.values()).sort((a, b) => a.artist.name.localeCompare(b.artist.name))
      this.setState({ artistsAlbums: array })
    })
  }

  render() {
    const { artistsAlbums } = this.state
    if (!artistsAlbums) {
      return null
    }

    return <>
      {
        artistsAlbums.map((artistAlbums, i) =>
          <ArtistCollection key={ i } artistAlbums={ artistAlbums }/>
        )
      }
    </>
  }

}