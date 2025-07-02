import {
  ArtistFormSchema,
  EventArtistSchema,
} from "../components/EntityForm/schema";

// Transform database artist record to form schema
export function transformArtistToFormData(
  artistData: any,
): ArtistFormSchema | undefined {
  if (!artistData) return undefined;

  return {
    author: artistData.author || "",
    introduction: artistData.introduction || undefined,
    tags: [], // Empty array since tags are handled separately
    photo: artistData.photo || undefined,
    twitterLink: artistData.twitterLink || undefined,
    facebookLink: artistData.facebookLink || undefined,
    instagramLink: artistData.instagramLink || undefined,
    plurkLink: artistData.plurkLink || undefined,
    bahaLink: artistData.bahaLink || undefined,
    youtubeLink: artistData.youtubeLink || undefined,
    twitchLink: artistData.twitchLink || undefined,
    officialLink: artistData.officialLink || undefined,
    storeLink: artistData.storeLink || undefined,
    myacgLink: artistData.myacgLink || undefined,
    pixivLink: artistData.pixivLink || undefined,
    email: artistData.email || undefined,
  };
}

// Transform database eventArtist record to form schema
export function transformEventArtistToFormData(
  eventArtistData: any,
): EventArtistSchema | undefined {
  if (!eventArtistData) return undefined;

  return {
    eventId: eventArtistData.eventId || 1,
    artistId: eventArtistData.artistId || 1,
    boothName: eventArtistData.boothName || "",
    dm: eventArtistData.dm || undefined,
    locationDay01: eventArtistData.locationDay01 || undefined,
    locationDay02: eventArtistData.locationDay02 || undefined,
    locationDay03: eventArtistData.locationDay03 || undefined,
  };
}
