import { Album } from "data.helper";
import React, { Component } from "react";

interface AlbumItemProps { 
  album: Album
}

export default class AlbumItem extends Component<AlbumItemProps> {

  render() {
    const { album } = this.props
    return (
      <div className="ap-album" style={ { backgroundImage: `url(${ album.covers.large })` } }>
        <div className="ap-album-info spoticon-more-16"></div>
      </div>
    )
  }

}