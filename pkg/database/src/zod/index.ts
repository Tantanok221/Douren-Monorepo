import { authorMainInsertSchema, authorMainSelectSchema } from "./authorMain.js";
import { authorProductInsertSchema, authorProductSelectSchema } from "./authorProduct.js";
import { eventInsertSchema, eventSelectSchema } from "./event.js";
import { boothInsertSchema, boothSelectSchema } from "./booth.js";
import { eventDmInsertSchema, eventDmSelectSchema } from "./eventDm.js";
import { ownerInsertSchema, ownerSelectSchema } from "./owner.js";
import { tagInsertSchema, tagSelectSchema } from "./tag.js";
import { authorTagInsertSchema, authorTagSelectSchema } from "./authorTag.js";
import { userInsertSchema, userSelectSchema } from "./user.js";
import { userRoleInsertSchema, userRoleSelectSchema } from "./userRole.js";
import { sessionInsertSchema, sessionSelectSchema } from "./session.js";
import { accountInsertSchema, accountSelectSchema } from "./account.js";
import { verificationInsertSchema, verificationSelectSchema } from "./verification.js";
import { userInviteSettingsInsertSchema, userInviteSettingsSelectSchema } from "./userInviteSettings.js";
import { inviteHistoryInsertSchema, inviteHistorySelectSchema } from "./inviteHistory.js";

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
          booth: {
            InsertSchema: boothInsertSchema,
            SelectSchema: boothSelectSchema
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
          },
          user: {
            InsertSchema: userInsertSchema,
            SelectSchema: userSelectSchema
          },
          userRole: {
            InsertSchema: userRoleInsertSchema,
            SelectSchema: userRoleSelectSchema
          },
          session: {
            InsertSchema: sessionInsertSchema,
            SelectSchema: sessionSelectSchema
          },
          account: {
            InsertSchema: accountInsertSchema,
            SelectSchema: accountSelectSchema
          },
          verification: {
            InsertSchema: verificationInsertSchema,
            SelectSchema: verificationSelectSchema
          },
          userInviteSettings: {
            InsertSchema: userInviteSettingsInsertSchema,
            SelectSchema: userInviteSettingsSelectSchema
          },
          inviteHistory: {
            InsertSchema: inviteHistoryInsertSchema,
            SelectSchema: inviteHistorySelectSchema
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
          booth: {
            InsertSchema: boothInsertSchema,
            SelectSchema: boothSelectSchema
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
          },
          user: {
            InsertSchema: userInsertSchema,
            SelectSchema: userSelectSchema
          },
          userRole: {
            InsertSchema: userRoleInsertSchema,
            SelectSchema: userRoleSelectSchema
          },
          session: {
            InsertSchema: sessionInsertSchema,
            SelectSchema: sessionSelectSchema
          },
          account: {
            InsertSchema: accountInsertSchema,
            SelectSchema: accountSelectSchema
          },
          verification: {
            InsertSchema: verificationInsertSchema,
            SelectSchema: verificationSelectSchema
          },
          userInviteSettings: {
            InsertSchema: userInviteSettingsInsertSchema,
            SelectSchema: userInviteSettingsSelectSchema
          },
          inviteHistory: {
            InsertSchema: inviteHistoryInsertSchema,
            SelectSchema: inviteHistorySelectSchema
          }
      };
