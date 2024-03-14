
export interface ArtistTypes {
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
  uuid: number;
  Youtube_link: string | null;
  Event_DM: {
    Booth_name: string | null;
    DM: string | null;
    Event: string | null;
  }[]| null;
  Author_Tag: {
    Tag: string | null;
  }[]| null;
}
