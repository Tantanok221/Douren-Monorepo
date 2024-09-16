import { authorMainInsertSchema, authorMainSelectSchema } from "./authorMain.js";
import { authorProductInsertSchema, authorProductSelectSchema } from "./authorProduct.js";
import { eventInsertSchema, eventSelectSchema } from "./event.js";
import { eventDmInsertSchema, eventDmSelectSchema } from "./eventDm.js";
import { ownerInsertSchema, ownerSelectSchema } from "./owner.js";
import { tagInsertSchema, tagSelectSchema } from "./tag.js";
import { authorTagInsertSchema, authorTagSelectSchema } from "./authorTag.js";

export const zodSchema = { 
          authorMain: {
            InsertSchema: authorMainInsertSchema,
            SelectSchema: authorMainSelectSchema
          },
          authorProduct: {
            InsertSchema: authorProductInsertSchema,
            SelectSchema: authorProductSelectSchema
          },
          event: {
            InsertSchema: eventInsertSchema,
            SelectSchema: eventSelectSchema
          },
          eventDm: {
            InsertSchema: eventDmInsertSchema,
            SelectSchema: eventDmSelectSchema
          },
          owner: {
            InsertSchema: ownerInsertSchema,
            SelectSchema: ownerSelectSchema
          },
          tag: {
            InsertSchema: tagInsertSchema,
            SelectSchema: tagSelectSchema
          },
          authorTag: {
            InsertSchema: authorTagInsertSchema,
            SelectSchema: authorTagSelectSchema
          }
        };

export type zodSchemaType = {
        
          authorMain: {
            InsertSchema: authorMainInsertSchema,
            SelectSchema: authorMainSelectSchema
          },
          authorProduct: {
            InsertSchema: authorProductInsertSchema,
            SelectSchema: authorProductSelectSchema
          },
          event: {
            InsertSchema: eventInsertSchema,
            SelectSchema: eventSelectSchema
          },
          eventDm: {
            InsertSchema: eventDmInsertSchema,
            SelectSchema: eventDmSelectSchema
          },
          owner: {
            InsertSchema: ownerInsertSchema,
            SelectSchema: ownerSelectSchema
          },
          tag: {
            InsertSchema: tagInsertSchema,
            SelectSchema: tagSelectSchema
          },
          authorTag: {
            InsertSchema: authorTagInsertSchema,
            SelectSchema: authorTagSelectSchema
          }
      };
