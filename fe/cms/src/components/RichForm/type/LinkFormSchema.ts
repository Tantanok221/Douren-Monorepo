import { z } from "zod";

export const AllAvailableLinkType = {
  twitterLink: z.string(),
  facebookLink: z.string(),
  instagramLink: z.string(),
  plurkLink: z.string(),
  bahaLink: z.string(),
  youtubeLink: z.string(),
  twitchLink: z.string(),
  officialLink: z.string(),
  storeLink: z.string(),
  myacgLink: z.string(),
};
export const LinkTypeEnum = z.enum([
  "twitterLink",
  "facebookLink",
  "instagramLink",
  "plurkLink",
  "bahaLink",
  "youtubeLink",
  "twitchLink",
  "officialLink",
  "storeLink",
  "myacgLink",
]);

export type LinkTypeKeys = keyof typeof AllAvailableLinkType;

export const LinkFormSchema = z.object(AllAvailableLinkType);

export type LinkFormSchemaType = z.infer<typeof LinkFormSchema>;

export function GetLinkLabelFromKey(key: string): string {
  switch (key) {
    case "twitterLink":
      return "推特鏈接";
    case "facebookLink":
      return "FB鏈接";
    case "bahaLink":
      return "巴哈鏈接";
    case "instagramLink":
      return "IG鏈接";
    case "myacgLink":
      return "Myacg鏈接";
    case "officialLink":
      return "官網鏈接";
    case "plurkLink":
      return "普浪鏈接";
    case "storeLink":
      return "商店鏈接";
    case "twitchLink":
      return "圖奇鏈接";
    case "youtubeLink":
      return "YT鏈接";
  }
  return "";
}
