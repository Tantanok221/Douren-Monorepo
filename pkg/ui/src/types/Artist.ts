interface ArtistPrimitiveTypes{
  Author: string;
  Baha_link: string | null;
  Facebook_link: string | null;
  Instagram_link: string | null;
  Introduction: string | null;
  Myacg_link: string | null;
  Official_link: string | null;
  Photo: string | undefined;
  Pixiv_link: string | null;
  Plurk_link: string | null;
  Store_link: string | null;
  Twitch_link: string | null;
  Twitter_link: string | null;
  Youtube_link: string | null;
  uuid: number;
  Tags: string | null;
}

export interface ArtistTypes extends ArtistPrimitiveTypes {
  Event_DM:
    | {
        Booth_name: string | null;
      }[]
    | null;
}

export interface ArtistPageTypes extends ArtistTypes {
  Event_DM:
    | {
        Booth_name: string | null;
        DM: string | null;
        Event: {
          name: string | null;
        };
      }[]
    | null;
  Author_Product:
    | {
        Thumbnail: string;
        Title: string;
        Preview: string | null;
      }[]
    | null;
}

export interface ArtistEventType {
  Booth_name: string | null;
  DM: string | null;
  Location_Day01: string | null;
  Location_Day02: string | null;
  Location_Day03: string | null;
  Author_Main: ArtistPrimitiveTypes
}
