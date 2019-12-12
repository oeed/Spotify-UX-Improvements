import ArtistCollection from "albums/artist-collection.component";
import AlphabetScroller from "misc/alphabet-scroller.component";
import React, { Component } from "react";
import { Album, Artist, getAlbums } from "shared/data.helper";
import { getArtistCharacter, removeArticles } from "./album.helper";


export interface ArtistAlbums {
  artist: Artist
  albums: Album[]
  needsAnchor: boolean
}

interface AlbumListState {
  artistsAlbums?: ArtistAlbums[]
  scrollerCharacters?: Set<string>
}

export default class AlbumList extends Component<{}, AlbumListState> {

  state: AlbumListState = {}

  componentDidMount() {
    getAlbums().then(albums => {
      const artistsAlbums = new Map<string, ArtistAlbums>()
      const scrollerCharacters = new Set<string>()
      for (const album of albums) {
        let artistAlbums = artistsAlbums.get(album.artist.link)
        if (!artistAlbums) {
          const artistCharacter = getArtistCharacter(album.artist)
          artistsAlbums.set(album.artist.link, {
            artist: album.artist,
            albums: [album],
            needsAnchor: !scrollerCharacters.has(artistCharacter)
          })
          scrollerCharacters.add(artistCharacter)
        }
        else {
          artistAlbums.albums.push(album)
        }
      }   

      for (const artistAlbums of artistsAlbums.values()) {
        artistAlbums.albums.sort((a, b) => a.year - b.year)
      }
      
      const albumsArray = Array.from(artistsAlbums.values()).sort((a, b) => removeArticles(a.artist.name).localeCompare(removeArticles(b.artist.name)))
      this.setState({ artistsAlbums: albumsArray, scrollerCharacters })
    })
  }

  render() {
    const { artistsAlbums, scrollerCharacters } = this.state
    if (!artistsAlbums || !scrollerCharacters) {
      return null
    }

    return (
      <div className="ap-list-wrapper">
        <div className="ap-list">
          {
            artistsAlbums.map((artistAlbums, i) =>
              <ArtistCollection key={ i } artistAlbums={ artistAlbums }/>
            )
          }
        </div>
        <AlphabetScroller characters={ scrollerCharacters }/>
      </div>
    )
  }

}