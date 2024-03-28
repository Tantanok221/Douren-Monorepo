import { ArtistTypes } from "../types/Artist";
import { LinkResult, processLink } from "./processLink";

export function processArtistData(ArtistData:ArtistTypes){
  let link: LinkResult[] = [];
  link = processLink(ArtistData.Facebook_link, ArtistData.Author, "Facebook");
    link = link.concat(processLink(ArtistData.Instagram_link, ArtistData.Author, "Instagram"));
    link = link.concat(processLink(ArtistData.Pixiv_link, ArtistData.Author, "Pixiv"));
    link = link.concat(processLink(ArtistData.Twitch_link, ArtistData.Author, "Twitch"));
    link = link.concat(processLink(ArtistData.Twitter_link, ArtistData.Author, "Twitter"));
    link = link.concat(processLink(ArtistData.Youtube_link, ArtistData.Author, "Youtube"));
    link = link.concat(processLink(ArtistData.Plurk_link, ArtistData.Author, "Plurk"));
    link = link.concat(processLink(ArtistData.Baha_link, ArtistData.Author, "Baha"));
    link = link.concat(processLink(ArtistData.Official_link, "官網", "Other"))
    link = link.concat(processLink(ArtistData.Store_link, "商店", "Store"))
    link = link.concat(processLink(ArtistData.Myacg_link, "MYACG", "Other"))
  return link
}