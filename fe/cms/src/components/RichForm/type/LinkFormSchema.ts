import { z } from "zod";

export const AllAvailableLinkType = {
  twitterLink: z.string().optional(),
  facebookLink: z.string().optional(),
  instagramLink: z.string().optional(),
  plurkLink: z.string().optional(),
  bahaLink: z.string().optional(),
  youtubeLink: z.string().optional(),
  twitchLink: z.string().optional(),
  officialLink: z.string().optional(),
  storeLink: z.string().optional(),
  myacgLink: z.string().optional(),
  pixivLink: z.string().optional(),
  email: z.string().optional()
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
  "pixivLink",
  "email"
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
      return "噗浪鏈接";
    case "storeLink":
      return "商店鏈接";
    case "twitchLink":
      return "圖奇鏈接";
    case "youtubeLink":
      return "YT鏈接";
    case "pixivLink":
      return "pixiv鏈接";
    case "email":
      return "email"
  }
  return "";
}
