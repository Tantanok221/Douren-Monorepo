import { ArtistTypes } from "../types/Artist";
import { LinkResult, processLink } from "@lib/ui";

export function processArtistData(ArtistData: ArtistTypes) {
  let link: LinkResult[] = [];
  link = processLink(ArtistData.Facebook_link, "Facebook", "Facebook");
  link = link.concat(
    processLink(ArtistData.Instagram_link, "Instagram", "Instagram"),
  );
  link = link.concat(processLink(ArtistData.Pixiv_link, "Pixiv", "Pixiv"));
  link = link.concat(processLink(ArtistData.Twitch_link, "Twitch", "Twitch"));
  link = link.concat(
    processLink(ArtistData.Twitter_link, "Twitter", "Twitter"),
  );
  link = link.concat(
    processLink(ArtistData.Youtube_link, "Youtube", "Youtube"),
  );
  link = link.concat(processLink(ArtistData.Plurk_link, "Plurk", "Plurk"));
  link = link.concat(processLink(ArtistData.Baha_link, "Baha", "Baha"));
  link = link.concat(processLink(ArtistData.Official_link, "官網", "Other"));
  link = link.concat(processLink(ArtistData.Store_link, "商店", "Store"));
  link = link.concat(processLink(ArtistData.Myacg_link, "MYACG", "Other"));
  return link;
}
