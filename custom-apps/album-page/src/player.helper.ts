import { Album } from "shared/data.helper";

export const playAlbum = (album: Album) => {
  // Spicetify.Player.setShuffle(false)
  Spicetify.PlaybackControl.playFromResolver(album.link, {
    context: album.link,
    reason: "playbtn",
  }, function(){
    // TODO: there's probably an error related thing passed there
  })
}

export const queueAlbum = (album: Album) => {
  Spicetify.addToQueue(album.link)
}