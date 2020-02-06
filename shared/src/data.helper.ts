enum RequestMethod {
  sub = "SUB"
}

export const request = <T>(method: RequestMethod, uri: string, body: object) => new Promise<T>((resolve, reject) => {
  Spicetify.BridgeAPI.cosmosJSON({
    method,
    uri,
    body
  }, (error: Error | undefined, result: T | undefined) => {
    if (error) {
      reject(error)
    }
    else if (result) {
      resolve(result)
    }
  })
})

export interface Artist {
  // canBan: boolean
  // collectionLink: string // "spotify:user:1241876757:collection:artist:5INjqkS1o8h1imAzPqGZBb"
  // decorated: boolean
  // inferredOffline: "yes" | "no" // "yes"
  // isBanned: boolean
  // isFollowed: boolean
  // isVariousArtists: boolean
  link: string // "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
  // mostPlayedRank: number
  name: string // "Tame Impala"
  // numAlbumsInCollection: number
  // numTracksInCollection: number
  // offline: string // "no"
}

export interface Album {
  // addTime: number
  albumType: "album" | "single"
  artist: Artist
  artists: Artist[]
  // collectionLink: string // "spotify:user:1241876757:collection:album:0rxKf57PZvWEoU8v3m5W2q"
  // complete: boolean
  // copyrights: string[]
  covers: {
    default: string // "spotify:image:ab67616d00001e024ed139a5d193ec2b704cf28f"
    small: string // "spotify:image:ab67616d000048514ed139a5d193ec2b704cf28f"
    large: string // "spotify:image:ab67616d0000b2734ed139a5d193ec2b704cf28f"
    xlarge: string // "spotify:image:ab67616d0000b2734ed139a5d193ec2b704cf28f"
  }
  // decorated: boolean
  // groupLabel: string
  // index: number
  // inferredOffline: "yes" | "no"
  // isPremiumOnly: boolean
  link: string // "spotify:album:0rxKf57PZvWEoU8v3m5W2q"
  // mostPlayedRank: 0
  name: string // "Currents"
  // numDiscs: number
  // numTracks: number
  // numTracksInCollection: number
  // offline: "yes" | "no"
  // playability: boolean
  year: number
}

interface LocalTrack {
  // addTime: 1578878080
  // addedBy: {username: "", link: "spotify:user:", name: ""}
  album: {
    link: string, name: string
  }
  artists: {link: string, name: string}[]
  inCollection: false
  isAvailableInMetadataCatalogue: true
  isExplicit: false
  isLocal: true
  isPremiumOnly: false
  length: 114
  link: "spotify:local:King+Gizzard+%26+The+Lizard+Wizard:Live+In+Paris+%2719:Evil+Star+%28live+in+Paris+%2719%29:114"
  localFile: true
  locallyPlayable: true
  name: "Evil Star (live in Paris '19)"
  offline: "yes"
  playable: true
  playableLocalTrack: true
  rowId: "24"
  trackPlayState: {isPlayable: true}
}

interface Track {
  number: number
}

export const getAlbums = async () => {
  const response = await request<{ items: Album[] }>(RequestMethod.sub, "sp://core-collection/unstable/@/list/albums/all?decorate=true&filter=&sort=artist.name", {"policy":{"link":true,"collectionLink":true,"name":true,"artist":true,"covers":true}})
  return await getLocalAlbums(response.items)
}

const localAlbumTracks = new Map<string, { link: string, number: number }[]>()

export const getLocalAlbums = async (otherAlbums: Album[]) => {
  const artists = new Map<string, Artist>()
  for (const { artist } of otherAlbums) {
    if (!artists.has(artist.name)) {
      artists.set(artist.name, artist)
    }
  }
  
  const response = await request<{ rows: LocalTrack[] }>(RequestMethod.sub, "sp://local-files/v2/tracks?includeEpisodes=true", { "policy":{"rowId":true,"link":true,"name":true,"number":true,"playable":true,"locallyPlayable":true,"disc":true,"length":true,"artists":{"link":true,"name":true},"album":{"link":true,"name":true},"images":true,"image":true,"cover":true,"isLocal":true,"playableLocalTrack":true,"isExplicit":true,"isPremiumOnly":true,"covers":true,"offline":true,"inCollection":true,"addTime":true,"addedBy":{"link":true,"name":true,"username":true},"formatListAttributes":true,"manifestId":true,"mediaTypeEnum":true,"mosaic":true,"filename": true,"fileName":true, "year":true}})
  const albums = new Map<string, Album>()
  for (const track of response.rows) {
    let artist = artists.get(track.artists[0].name)
    if (!artist) {
      artist = track.artists[0]
    }

    let album = albums.get(track.album.link)
    if (!album) {
      album = {
        albumType: "album",
        artist,
        artists: [artist],
        link: track.album.link, // "spotify:album:0rxKf57PZvWEoU8v3m5W2q"
        name: track.album.name, // "Currents"
        year: 2019,
        covers: {
          default: "",
          small: "",
          large: "",
          xlarge: ""
        }
      }
    }
    albums.set(track.album.link, album)
    // console.log(track.name, track, await getTrackMetadata(track.link))

    const metadata = await getTrackMetadata(track.link)
    let tracks = localAlbumTracks.get(track.album.link)
    if (!tracks) {
      tracks = []
      localAlbumTracks.set(track.album.link, tracks)
    }

    tracks.push({ link: track.link, number: metadata.number })
    tracks.sort((a, b) => a.number - b.number)
  }

  // console.log('local response', response)
  // console.log(response.rows[0].link, await getTrackMetadata("spotify:track:6XY6yBdqrphxj92fRmeT9C"))
  // console.log(localAlbumTracks)
  // console.log(response.rows[0].album.link, await getAlbumTracks(response.rows[0].album.link))
  return [...otherAlbums, ...Array.from(albums.values())]
}

export type URILike<T extends { link: string } = { link: string }> = T | string

export const getURI = (value: URILike) => typeof value === "string" ? value : value.link

export const getAlbumTracks = async (album: URILike<Album>) => new Promise<string[]>((resolve, reject) => {
  const uri = getURI(album)
  const localTracks = localAlbumTracks.get(uri)
  console.log("local", localAlbumTracks, uri, localTracks)
  if (localTracks) {
    resolve(localTracks.map(track => track.link))
    return
  }

  Spicetify.BridgeAPI.request("album_tracks_snapshot", [uri, 0, -1], (function(err: Error | undefined, data: { array: string[] }) {
    if (err) {
      reject(err)
    }
    else {
      resolve(data.array)
    }
  }))
})

export const getTrackMetadata = async (uri: string) => new Promise<Track>((resolve, reject) => {
  Spicetify.BridgeAPI.request("track_metadata", [uri], (function(err: Error | undefined, data: Track) {
    if (err) {
      reject(err)
    }
    else {
      resolve(data)
    }
  }))
})

export const isLiked = async (item: URILike) => new Promise<boolean>(resolve => Spicetify.LiveAPI(getURI(item)).get("added", (err: any, res: boolean) => resolve(res)))