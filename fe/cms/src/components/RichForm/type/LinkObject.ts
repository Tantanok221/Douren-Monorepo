import { z } from "zod";
import { LinkTypeEnum } from "./LinkFormSchema.ts";

export const ZodLinkObject = z.object({
  LinkType: LinkTypeEnum,
  LinkUrl: z.string()
});

export type ZodLinkObjectType = z.infer<typeof ZodLinkObject>

