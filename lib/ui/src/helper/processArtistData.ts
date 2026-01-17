import { LinkResult, processLink } from "./processLink";
import {
  artistBaseSchemaWithTagType,
  eventArtistBaseSchemaType,
} from "@pkg/type";

// Configuration for social link processing
const LINK_CONFIG = [
  { key: "facebookLink", label: "Facebook", type: "Facebook" },
  { key: "instagramLink", label: "Instagram", type: "Instagram" },
  { key: "pixivLink", label: "Pixiv", type: "Pixiv" },
  { key: "twitchLink", label: "Twitch", type: "Twitch" },
  { key: "twitterLink", label: "Twitter", type: "Twitter" },
  { key: "youtubeLink", label: "Youtube", type: "Youtube" },
  { key: "plurkLink", label: "Plurk", type: "Plurk" },
  { key: "bahaLink", label: "Baha", type: "Baha" },
  { key: "officialLink", label: "官網", type: "Other" },
  { key: "storeLink", label: "商店", type: "Store" },
  { key: "myacgLink", label: "MYACG", type: "Other" },
] as const;

export function processArtistData(
  ArtistData: eventArtistBaseSchemaType | artistBaseSchemaWithTagType,
): LinkResult[] {
  return LINK_CONFIG.flatMap(({ key, label, type }) =>
    processLink(ArtistData[key], label, type),
  );
}
