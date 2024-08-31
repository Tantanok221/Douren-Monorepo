import { pgTable, bigint, text, uuid, bigserial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const authorMain = pgTable('Author_Main', {
  uuid: bigint('uuid', { mode: 'number' }).primaryKey(),
  author: text('Author').notNull(),
  plurkLink: text('Plurk_link'),
  bahaLink: text('Baha_link'),
  twitchLink: text('Twitch_link'),
  youtubeLink: text('Youtube_link'),
  twitterLink: text('Twitter_link'),
  facebookLink: text('Facebook_link'),
  instagramLink: text('Instagram_link'),
  pixivLink: text('Pixiv_link'),
  boothName: text('Booth_name'),
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
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  tag: text('Tag'),
  preview: text('Preview'),
  thumbnail: text('Thumbnail').notNull(),
  title: text('Title'),
  artistId: bigint('artist_id', { mode: 'number' }).notNull(),
});

export const authorProductRelations = relations(authorProduct, ({ one }) => ({
  artist: one(authorMain, {
    fields: [authorProduct.artistId],
    references: [authorMain.uuid],
  }),
}));

export const event = pgTable('Event', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
});

export const eventRelations = relations(event, ({ many }) => ({
  eventDms: many(eventDm),
}));

export const eventDm = pgTable('Event_DM', {
  uuid: bigserial('uuid', { mode: 'number' }).primaryKey(),
  locationDay01: text('Location_Day01'),
  locationDay02: text('Location_Day02'),
  locationDay03: text('Location_Day03'),
  boothName: text('Booth_name'),
  dm: text('DM'),
  artistId: bigint('artist_id', { mode: 'number' }).notNull(),
  eventId: bigint('event_id', { mode: 'number' }),
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

export const ff42 = pgTable('Ff42', {
  uuid: uuid('uuid').defaultRandom().primaryKey(),
  author: text('Author'),
  boothName: text('Booth_name'),
  tag: text('Tag'),
  dm: text('DM'),
  photo: text('Photo'),
  twitterLink: text('Twitter_link'),
  twitterName: text('Twitter_name'),
  facebookLink: text('Facebook_link'),
  facebookName: text('Facebook_name'),
  instagramLink: text('Instagram_link'),
  instagramName: text('Instagram_name'),
  youtubeLink: text('Youtube_link'),
  youtubeName: text('Youtube_name'),
  twitchLink: text('Twitch_link'),
  twitchName: text('Twitch_name'),
  pixivLink: text('Pixiv_link'),
  pixivName: text('Pixiv_name'),
  plurkLink: text('Plurk_link'),
  plurkName: text('Plurk_name'),
  bahaLink: text('Baha_link'),
  bahaName: text('Baha_name'),
  day01Location: text('DAY01_location'),
  day02Location: text('DAY02_location'),
  day03Location: text('DAY03_location'),
  storeLink: text('Store_link'),
  officialLink: text('Official_link'),
});

export const owner = pgTable('Owner', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
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
  count: bigint('count', { mode: 'number' }),
  index: bigint('index', { mode: 'number' }).notNull(),
});

