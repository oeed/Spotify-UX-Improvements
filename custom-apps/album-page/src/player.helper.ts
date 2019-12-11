import { Album } from "data.helper";

export const playAlbum = (album: Album) => {
  Spicetify.PlaybackControl.playFromResolver(album.link, {
    context: album.link,
    reason: "playbtn",
  }, function(){
    // TODO: there's probably an error related thing passed there
    console.log()})
}

export const queueAlbum = (album: Album) => {
  Spicetify.addToQueue(album.link)
}