import { pgTable, text, primaryKey, integer,timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const authorMain = pgTable("author_main", {
  uuid: integer("id").notNull().generatedByDefaultAsIdentity({ startWith: 1300 }).primaryKey(),
  author: text("author").notNull(),
  plurkLink: text("plurk_link"),
  bahaLink: text("baha_link"),
  twitchLink: text("twitch_link"),
  youtubeLink: text("youtube_link"),
  twitterLink: text("twitter_link"),
  facebookLink: text("facebook_link"),
  instagramLink: text("instagram_link"),
  pixivLink: text("pixiv_link"),
  tags: text("tags"),
  introduction: text("introduction"),
  photo: text("photo"),
  myacgLink: text("myacg_link"),
  storeLink: text("store_link"),
  email: text("email"),
  officialLink: text("official_link")
});

export const authorMainRelations = relations(authorMain, ({ many }) => ({
  products: many(authorProduct),
  events: many(eventDm)
}));

export const authorProduct = pgTable("author_product", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity({ startWith: 9 }),
  tag: text("tag"),
  preview: text("preview"),
  thumbnail: text("thumbnail").notNull(),
  title: text("title"),
  artistId: integer("artist_id").notNull()
});

export const authorProductRelations = relations(authorProduct, ({ one }) => ({
  artist: one(authorMain, {
    fields: [authorProduct.artistId],
    references: [authorMain.uuid]
  })
}));

export const event = pgTable("event", {
  id: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity({ startWith: 5 }),
  name: text("name").notNull()
});

export const eventRelations = relations(event, ({ many }) => ({
  eventDms: many(eventDm)
}));

export const eventDm = pgTable("event_dm", {
  uuid: integer("id").primaryKey().notNull().generatedAlwaysAsIdentity({ startWith: 1300 }),
  locationDay01: text("location_day01"),
  locationDay02: text("location_day02"),
  locationDay03: text("location_day03"),
  boothName: text("booth_name"),
  dm: text("dm"),
  artistId: integer("artist_id").notNull(),
  eventId: integer("event_id")
});

export const eventDmRelations = relations(eventDm, ({ one }) => ({
  artist: one(authorMain, {
    fields: [eventDm.artistId],
    references: [authorMain.uuid]
  }),
  event: one(event, {
    fields: [eventDm.eventId],
    references: [event.id]
  })
}));


export const owner = pgTable("owner", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  discordName: text("discord_name"),
  twitterName: text("twitter_name"),
  twitterLink: text("twitter_link"),
  githubName: text("github_name"),
  githubLink: text("github_link"),
  description: text("description"),
  title: text("title")
});

export const tag = pgTable("tag", {
  tag: text("tag").primaryKey(),
  count: integer("count"),
  index: integer("index").notNull()
});

export const authorTag = pgTable("author_tag", {
  authorId: integer("author_id").references(() => authorMain.uuid),
  tagId: text("tag_name").references(() => tag.tag)
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.authorId, table.tagId] })
  };
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});