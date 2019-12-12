import { Artist } from "shared/data.helper";

export const removeArticles = (str: string) => {
  let words = str.split(" ");
  if(words.length <= 1) return str;
  if( words[0].toLowerCase() == 'a' || words[0].toLowerCase() == 'the' || words[0].toLowerCase() == 'an' )
    return words.splice(1).join(" ");
  return str;
}

export const getArtistCharacter = (artist: Artist) => {
  return removeArticles(artist.name).substr(0, 1).toLowerCase()
}
