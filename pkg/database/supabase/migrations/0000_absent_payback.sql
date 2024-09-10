CREATE TABLE IF NOT EXISTS "Author_Main" (
	"uuid" integer PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Author" text NOT NULL,
	"Plurk_link" text,
	"Baha_link" text,
	"Twitch_link" text,
	"Youtube_link" text,
	"Twitter_link" text,
	"Facebook_link" text,
	"Instagram_link" text,
	"Pixiv_link" text,
	"Tags" text,
	"Introduction" text,
	"Photo" text,
	"Myacg_link" text,
	"Store_link" text,
	"Official_link" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Author_Product" (
	"id" integer PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Tag" text,
	"Preview" text,
	"Thumbnail" text NOT NULL,
	"Title" text,
	"artist_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "author_tag" (
	"author_id" bigint,
	"tag_name" text,
	CONSTRAINT "author_tag_author_id_tag_name_pk" PRIMARY KEY("author_id","tag_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" integer PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event_DM" (
	"uuid" integer PRIMARY KEY NOT NULL,
	"Location_Day01" text,
	"Location_Day02" text,
	"Location_Day03" text,
	"Booth_name" text,
	"DM" text,
	"artist_id" integer NOT NULL,
	"event_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Owner" (
	"id" integer PRIMARY KEY NOT NULL,
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
	"count" integer,
	"index" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_author_id_Author_Main_uuid_fk" FOREIGN KEY ("author_id") REFERENCES "public"."Author_Main"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_tag_name_Tag_tag_fk" FOREIGN KEY ("tag_name") REFERENCES "public"."Tag"("tag") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
