interface ArtistPrimitiveTypes {
  uuid: number;
  author: string;
  plurkLink: string | null;
  bahaLink: string | null;
  twitchLink: string | null;
  youtubeLink: string | null;
  twitterLink: string | null;
  facebookLink: string | null;
  instagramLink: string | null;
  pixivLink: string | null;
  tags: string | null;
  introduction: string | null;
  photo: string | null;
  myacgLink: string | null;
  storeLink: string | null;
  email: string | null;
  officialLink: string | null;
}

export interface ArtistTypes extends ArtistPrimitiveTypes {
  events:
    | {
        boothName: string | null;
      }[]
    | null;
}

export interface ArtistPageTypes extends ArtistPrimitiveTypes {
  events:
    | {
        dm: string | null;
        boothName: string | null;
        locationDay01: string | null;
        locationDay02: string | null;
        locationDay03: string | null;
        event: {
          name: string | null;
        } | null;
      }[]
    | null;
  products:
    | {
        title: string | null;
        thumbnail: string;
        preview: string | null;
      }[]
    | null;
}

export interface eventArtistBaseSchemaType {
  Booth_name: string | null;
  DM: string | null;
  Location_Day01: string | null;
  Location_Day02: string | null;
  Location_Day03: string | null;
  Author_Main: ArtistPrimitiveTypes;
}
