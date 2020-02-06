import { Album, getAlbumTracks } from "shared/data.helper";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class List<T> {
  data: T[]
  map: Function

  constructor(data: T[]) {
    this.data = data
    this.map = this.data.map
  }

  get(i: number) {
    return this.data[i]
  }

  // map(fn: Function) {
  //   return this.data.map(fn)
  // }
}

export const playAlbum = async (album: Album) => {
  if (Spicetify.Player.getShuffle()) {
    // For some reason setShuffle doesn't actually properly work, it shows in the UI but it doesn't effect the player
    // Spicetify.Player.setShuffle(false)
    window.parent.document.getElementById("player-button-shuffle")!.click()
    // await sleep(500)
  }

  if (Spicetify.URI.isLocalAlbum(album.link)) {
    console.log("local")
    const tracks = await getAlbumTracks(album)
    Spicetify.PlaybackControl.playRows(new List(tracks), { index: 0 }, function(a: any,b:any){
      console.log("played",a,b)
    })
  }
  else {
    Spicetify.PlaybackControl.playFromResolver(album.link, {
      context: album.link,
      reason: "playbtn",
    }, function(){
      // TODO: there's probably an error related thing passed there
    })
  }
}

export const queueAlbum = async (album: Album) => {
  if (Spicetify.URI.isLocalAlbum(album.link)) {
    const tracks = await getAlbumTracks(album)
    console.log(tracks)
    for (const track of tracks) {
      await Spicetify.addToQueue(track)
    }
  }
  else {
    await Spicetify.addToQueue(album.link);
  }
  // Spicetify.showNotification(`Queued '${ album.name }'`)
  (Spicetify as any).EventDispatcher.dispatchEvent(
    new (Spicetify as any).Event((Spicetify as any).Event.TYPES.SHOW_NOTIFICATION_BUBBLE, { messageHtml: `Queued '${ album.name }'` }))
}