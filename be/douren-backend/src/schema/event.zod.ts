import { s } from "@pkg/database/db";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const CreateEventArtistSchema = createInsertSchema(s.eventDm, {
	uuid: (schema) => schema.optional(),
});

export const PutEventArtistSchema = createInsertSchema(s.eventDm);
export const CreateEventSchema = createInsertSchema(s.event, {
	id: (schema) => schema.optional(),
});
export type CreateEventSchemaTypes = z.infer<typeof CreateEventSchema>;

export type CreateEventArtistSchemaTypes = z.infer<
	typeof CreateEventArtistSchema
>;
export type PutEventArtistSchemaTypes = z.infer<typeof PutEventArtistSchema>;

export const GetEventArtistByIdSchema = z.object({
	id: z.string(),
});

export const UpdateEventArtistSchema = z.object({
	id: z.string(),
	data: CreateEventArtistSchema,
});
