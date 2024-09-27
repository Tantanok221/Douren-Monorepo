import { ArtistEventType } from "./types/Artist.ts";
import { initializeGlobalStyles } from "./stitches.config.js";

initializeGlobalStyles();
export * from "./components";

export const mockArtistEventData: ArtistEventType = (
  {
    "Location_Day01": "A01",
    "Location_Day02": "A01",
    "Location_Day03": "A01",
    "Booth_name": "命由工作室",
    "DM": "https://imagedelivery.net/-OKLR_GOSRBj5AAtxDWCLw/cf631f59-e65c-4ee4-0483-e7c5b3c54a00/public",
    "Author_Main": {
      "Tags": "二創, 東方, 繪師",
      "uuid": 1,
      "Photo": "https://imagedelivery.net/-OKLR_GOSRBj5AAtxDWCLw/e04b9000-6278-4da3-3796-9b80cfa1af00/public",
      "Author": "Touka",
      "Baha_link": null,
      "Myacg_link": "https://www.myacg.com.tw/seller_market.php?seller=595530",
      "Pixiv_link": "https://www.pixiv.net/users/4972747",
      "Plurk_link": null,
      "Store_link": null,
      "Twitch_link": null,
      "Introduction": "大家好，這裡是命由工作室的Touka\r\n致力於創作東方Project二創與周邊，以每年舉辦一次東方合同誌企劃為目標！\r\n另外東方群像物語不定期連載中！",
      "Twitter_link": "https://twitter.com/daic5057",
      "Youtube_link": "https://www.youtube.com/@daic50577",
      "Facebook_link": "https://www.facebook.com/FreelLve",
      "Official_link": "https://www.facebook.com/daic5057",
      "Instagram_link": null
    }
  }
);