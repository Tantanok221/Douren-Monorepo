import { z } from "zod";
import { ZodTagObject } from "@lib/ui";
import { LinkFormSchema } from "../../RichForm";

export const productFormSchema = z.object({
  title: z.string().min(1, { message: "請輸入作品名字" }),
  preview: z.string().optional(),
  thumbnail: z.string().optional(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;

export const eventArtistSchema = z.object({
  boothId: z.number().optional(),
  eventId: z.number().min(1, "請選擇一個活動"),
  artistId: z.number(),
  boothName: z.string().min(1, "請輸入攤位名字"),
  dm: z.string().optional(),
  locationDay01: z.string().optional(),
  locationDay02: z.string().optional(),
  locationDay03: z.string().optional(),
});

export type EventArtistSchema = z.infer<typeof eventArtistSchema>;

export const artistFormSchema = z
  .object({
    introduction: z.string().optional(),
    author: z.string().min(1, { message: "請輸入名字" }),
    tags: z.array(ZodTagObject),
    photo: z.string().optional(),
  })
  .merge(LinkFormSchema);

export type ArtistFormSchema = z.infer<typeof artistFormSchema>;
