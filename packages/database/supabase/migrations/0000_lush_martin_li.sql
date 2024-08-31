CREATE TABLE IF NOT EXISTS "Author_Main" (
	"uuid" bigint PRIMARY KEY NOT NULL,
	"Author" text NOT NULL,
	"Plurk_link" text,
	"Baha_link" text,
	"Twitch_link" text,
	"Youtube_link" text,
	"Twitter_link" text,
	"Facebook_link" text,
	"Instagram_link" text,
	"Pixiv_link" text,
	"Booth_name" text,
	"Tags" text,
	"Introduction" text,
	"Photo" text,
	"Myacg_link" text,
	"Store_link" text,
	"Official_link" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Author_Product" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"Tag" text,
	"Preview" text,
	"Thumbnail" text NOT NULL,
	"Title" text,
	"artist_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "author_tag" (
	"author_id" bigint,
	"tag_name" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event_DM" (
	"uuid" bigserial PRIMARY KEY NOT NULL,
	"Location_Day01" text,
	"Location_Day02" text,
	"Location_Day03" text,
	"Booth_name" text,
	"DM" text,
	"artist_id" bigint NOT NULL,
	"event_id" bigint
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Owner" (
	"id" bigint PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"discord_name" text,
	"twitter_name" text,
	"twitter_link" text,
	"github_name" text,
	"github_link" text,
	"description" text,
	"title" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tag" (
	"tag" text PRIMARY KEY NOT NULL,
	"count" bigint,
	"index" bigint NOT NULL
);
