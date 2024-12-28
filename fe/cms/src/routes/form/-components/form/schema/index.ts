import { z } from "zod";
import { ZodTagObject } from "@lib/ui";
import { LinkFormSchema } from "@/components";

export const productFormSchema = z.object({
  title: z.string().min(1, { message: "請輸入作品名字" }),
  preview: z.string().optional(),
  thumbnail: z.string().optional(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;

export const eventArtistSchema = z.object({
  event_id: z.string().min(1, "請選擇一個活動"),
  artist_id: z.string().optional(),
  booth_name: z.string().min(1, "請輸入攤位名字"),
  DM: z.string().optional(),
  location_day01: z.string().optional(),
  location_day02: z.string().optional(),
  location_day03: z.string().optional(),
  photo: z.string().optional(),
});

export type EventArtistSchema = z.infer<typeof eventArtistSchema>;

export const artistFormSchema = z
  .object({
    introduction: z.string().optional(),
    author: z.string().min(1, { message: "請輸入名字" }),
    tags: z.array(ZodTagObject).min(1, { message: "請選擇標簽" }),
    photo: z.string().optional(),
  })
  .merge(LinkFormSchema);

export type ArtistFormSchema = z.infer<typeof artistFormSchema>;
