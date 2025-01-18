ALTER TABLE "Author_Main" RENAME TO "author_main";--> statement-breakpoint
ALTER TABLE "Author_Product" RENAME TO "author_product";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Author" TO "author";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Plurk_link" TO "plurk_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Baha_link" TO "baha_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Twitch_link" TO "twitch_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Youtube_link" TO "youtube_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Twitter_link" TO "twitter_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Facebook_link" TO "facebook_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Instagram_link" TO "instagram_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Pixiv_link" TO "pixiv_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Tags" TO "tags";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Introduction" TO "introduction";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Photo" TO "photo";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Myacg_link" TO "myacg_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Store_link" TO "store_link";--> statement-breakpoint
ALTER TABLE "author_main" RENAME COLUMN "Official_link" TO "official_link";--> statement-breakpoint
ALTER TABLE "author_product" RENAME COLUMN "Tag" TO "tag";--> statement-breakpoint
ALTER TABLE "author_product" RENAME COLUMN "Preview" TO "preview";--> statement-breakpoint
ALTER TABLE "author_product" RENAME COLUMN "Thumbnail" TO "thumbnail";--> statement-breakpoint
ALTER TABLE "author_product" RENAME COLUMN "Title" TO "title";--> statement-breakpoint
ALTER TABLE "Event_DM" RENAME COLUMN "Location_Day01" TO "location_Day01";--> statement-breakpoint
ALTER TABLE "Event_DM" RENAME COLUMN "Location_Day02" TO "location_Day02";--> statement-breakpoint
ALTER TABLE "Event_DM" RENAME COLUMN "Location_Day03" TO "location_Day03";--> statement-breakpoint
ALTER TABLE "Event_DM" RENAME COLUMN "Booth_name" TO "booth_name";--> statement-breakpoint
ALTER TABLE "Event_DM" RENAME COLUMN "DM" TO "dm";--> statement-breakpoint
ALTER TABLE "author_tag" DROP CONSTRAINT "author_tag_author_id_Author_Main_uuid_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_author_id_author_main_uuid_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author_main"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
