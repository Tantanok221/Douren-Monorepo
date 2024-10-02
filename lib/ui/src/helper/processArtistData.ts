import { LinkResult, processLink } from "./processLink";
import { artistSchemaType } from "@pkg/type";

export function processArtistData(ArtistData: artistSchemaType) {
	let link: LinkResult[]
	link = processLink(ArtistData.facebookLink, "Facebook", "Facebook");
	link = link.concat(processLink(ArtistData.instagramLink, "Instagram", "Instagram"))
	link = link.concat(processLink(ArtistData.pixivLink, "Pixiv", "Pixiv"));
	link = link.concat(processLink(ArtistData.twitchLink, "Twitch", "Twitch"));
	link = link.concat(processLink(ArtistData.twitterLink, "Twitter", "Twitter"));
	link = link.concat(processLink(ArtistData.youtubeLink, "Youtube", "Youtube"));
	link = link.concat(processLink(ArtistData.plurkLink, "Plurk", "Plurk"));
	link = link.concat(processLink(ArtistData.bahaLink, "Baha", "Baha"));
	link = link.concat(processLink(ArtistData.officialLink, "官網", "Other"));
	link = link.concat(processLink(ArtistData.storeLink, "商店", "Store"));
	link = link.concat(processLink(ArtistData.myacgLink, "MYACG", "Other"));
	return link;
}
