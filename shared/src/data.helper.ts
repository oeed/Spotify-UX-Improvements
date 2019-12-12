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
  canBan: boolean
  collectionLink: string // "spotify:user:1241876757:collection:artist:5INjqkS1o8h1imAzPqGZBb"
  decorated: boolean
  inferredOffline: "yes" | "no" // "yes"
  isBanned: boolean
  isFollowed: boolean
  isVariousArtists: boolean
  link: string // "spotify:artist:5INjqkS1o8h1imAzPqGZBb"
  mostPlayedRank: number
  name: string // "Tame Impala"
  numAlbumsInCollection: number
  numTracksInCollection: number
  offline: string // "no"
}

export interface Album {
  addTime: number
  albumType: "album" | "single"
  artist: Artist
  artists: Artist[]
  collectionLink: string // "spotify:user:1241876757:collection:album:0rxKf57PZvWEoU8v3m5W2q"
  complete: boolean
  copyrights: string[]
  covers: {
    default: string // "spotify:image:ab67616d00001e024ed139a5d193ec2b704cf28f"
    small: string // "spotify:image:ab67616d000048514ed139a5d193ec2b704cf28f"
    large: string // "spotify:image:ab67616d0000b2734ed139a5d193ec2b704cf28f"
    xlarge: string // "spotify:image:ab67616d0000b2734ed139a5d193ec2b704cf28f"
  }
  decorated: boolean
  groupLabel: string
  index: number
  inferredOffline: "yes" | "no"
  isPremiumOnly: boolean
  link: string // "spotify:album:0rxKf57PZvWEoU8v3m5W2q"
  mostPlayedRank: 0
  name: string // "Currents"
  numDiscs: number
  numTracks: number
  numTracksInCollection: number
  offline: "yes" | "no"
  playability: boolean
  year: number
}

interface Track {}

export const getAlbums = async () => {
  const response = await request<{ items: Album[] }>(RequestMethod.sub, "sp://core-collection/unstable/@/list/albums/all?decorate=true&filter=&sort=artist.name", {"policy":{"link":true,"collectionLink":true,"name":true,"artist":true,"covers":true}})
  return response.items
}

export type URILike<T extends { link: string } = { link: string }> = T | string

export const getURI = (value: URILike) => typeof value === "string" ? value : value.link

export const getAlbumTracks = async (album: URILike<Album>) => new Promise<string[]>((resolve, reject) => {
  Spicetify.BridgeAPI.request("album_tracks_snapshot", [getURI(album), 0, -1], (function(err: Error | undefined, data: { array: string[] }) {
    if (err) {
      reject(err)
    }
    else {
      resolve(data.array)
    }
  }))
})

export const getTrackMetadata = async (uri: string) => new Promise<Track>((resolve, reject) => {
  Spicetify.BridgeAPI.request("track_metadata", [uri], (function(err: Error | undefined, data: { array: string[] }) {
    if (err) {
      reject(err)
    }
    else {
      resolve(data)
    }
  }))
})

export const isLiked = async (item: URILike) => new Promise<boolean>(resolve => Spicetify.LiveAPI(getURI(item)).get("added", (err: any, res: boolean) => resolve(res)))