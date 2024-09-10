import { pgTable, bigint, text, uuid, bigserial, primaryKey, integer } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const authorMain = pgTable('Author_Main', {
  uuid: integer('uuid').primaryKey().default(sql`gen_random_uuid()`),
  author: text('Author').notNull(),
  plurkLink: text('Plurk_link'),
  bahaLink: text('Baha_link'),
  twitchLink: text('Twitch_link'),
  youtubeLink: text('Youtube_link'),
  twitterLink: text('Twitter_link'),
  facebookLink: text('Facebook_link'),
  instagramLink: text('Instagram_link'),
  pixivLink: text('Pixiv_link'),
  tags: text('Tags'),
  introduction: text('Introduction'),
  photo: text('Photo'),
  myacgLink: text('Myacg_link'),
  storeLink: text('Store_link'),
  officialLink: text('Official_link'),
});

export const authorMainRelations = relations(authorMain, ({ many }) => ({
  products: many(authorProduct),
  events: many(eventDm),
}));

export const authorProduct = pgTable('Author_Product', {
  id: integer('id').primaryKey().notNull().default(sql`gen_random_uuid()`),
  tag: text('Tag'),
  preview: text('Preview'),
  thumbnail: text('Thumbnail').notNull(),
  title: text('Title'),
  artistId: integer('artist_id').notNull(),
});

export const authorProductRelations = relations(authorProduct, ({ one }) => ({
  artist: one(authorMain, {
    fields: [authorProduct.artistId],
    references: [authorMain.uuid],
  }),
}));

export const event = pgTable('Event', {
  id: integer('id').primaryKey().notNull().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
});

export const eventRelations = relations(event, ({ many }) => ({
  eventDms: many(eventDm),
}));

export const eventDm = pgTable('Event_DM', {
  uuid: integer('uuid').primaryKey().notNull(),
  locationDay01: text('Location_Day01'),
  locationDay02: text('Location_Day02'),
  locationDay03: text('Location_Day03'),
  boothName: text('Booth_name'),
  dm: text('DM'),
  artistId: integer('artist_id').notNull(),
  eventId: integer('event_id'),
});

export const eventDmRelations = relations(eventDm, ({ one }) => ({
  artist: one(authorMain, {
    fields: [eventDm.artistId],
    references: [authorMain.uuid],
  }),
  event: one(event, {
    fields: [eventDm.eventId],
    references: [event.id],
  }),
}));


export const owner = pgTable('Owner', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  discordName: text('discord_name'),
  twitterName: text('twitter_name'),
  twitterLink: text('twitter_link'),
  githubName: text('github_name'),
  githubLink: text('github_link'),
  description: text('description'),
  title: text('title'),
});

export const tag = pgTable('Tag', {
  tag: text('tag').primaryKey(),
  count: integer('count'),
  index: integer('index').notNull(),
});

export const authorTag = pgTable("author_tag", {
  authorId: bigint("author_id",{mode: "number"}).references(() => authorMain.uuid),
  tagId: text("tag_name").references(() => tag.tag),
},(table) =>{return {
  pk: primaryKey({columns: [table.authorId, table.tagId]})
}});
