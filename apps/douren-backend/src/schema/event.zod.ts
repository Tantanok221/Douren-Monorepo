import { s } from "@repo/database/db";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const CreateEventArtistSchema = createInsertSchema(s.eventDm, {
  uuid: (schema) => schema.uuid.optional(),
})

export const PutEventArtistSchema = createInsertSchema(s.eventDm)
export const CreateEventSchema = createInsertSchema(s.event,{
  id: (schema) => schema.id.optional(),
})
export type CreateEventArtistSchemaTypes = z.infer<typeof CreateEventArtistSchema>
export type PutEventArtistSchemaTypes = z.infer<typeof PutEventArtistSchema>
