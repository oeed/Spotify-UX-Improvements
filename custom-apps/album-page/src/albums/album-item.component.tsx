import { playAlbum, queueAlbum } from "player.helper";
import React, { Component, MouseEvent } from "react";
import { Album } from "shared/data.helper";

interface AlbumItemProps { 
  album: Album
}

export default class AlbumItem extends Component<AlbumItemProps> {

  render() {
    const { album } = this.props
    return (
      <div className="ap-album" style={ { backgroundImage: `url(${ album.covers.large })` } } onMouseUp={ this.onCoverMouseUp }>
        <div className="ap-album-info spoticon-add-to-queue-16" onMouseUp={ this.onQueueMouseUp }></div>
      </div>
    )
  }

  onCoverMouseUp = (event: MouseEvent) => {
    if (event.button == 0) {
      // left
      playAlbum(this.props.album)
    }
    if (event.button == 1) {
      // middle
      window.location.href = this.props.album.link
    }
  }

  onQueueMouseUp = (event: MouseEvent) => {
    queueAlbum(this.props.album)
    event.stopPropagation()
  }

}