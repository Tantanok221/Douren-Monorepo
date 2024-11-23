import { z } from "zod";

const AllAvailableLinkType = {
  twitterLink: z.string(),
  facebookLink: z.string(),
  instagramLink: z.string(),
  plurkLink: z.string(),
  bahaLink: z.string(),
  youtubeLink: z.string(),
  twitchLink: z.string(),
  officialLink: z.string(),
  storeLink: z.string(),
  myacgLink: z.string()
}
export const LinkTypeEnum = z.enum([
  'twitterLink',
  'facebookLink',
  'instagramLink',
  'plurkLink',
  'bahaLink',
  'youtubeLink',
  'twitchLink',
  'officialLink',
  'storeLink',
  'myacgLink'
]);

export type LinkTypeKeys = keyof typeof AllAvailableLinkType;

const LinkFormSchema = z.object(AllAvailableLinkType);

export type LinkFormSchemaType = z.infer<typeof LinkFormSchema>
