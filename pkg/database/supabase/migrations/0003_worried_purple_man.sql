ALTER TABLE "Event" RENAME TO "event";--> statement-breakpoint
ALTER TABLE "Event_DM" RENAME TO "event_dm";--> statement-breakpoint
ALTER TABLE "Owner" RENAME TO "owner";--> statement-breakpoint
ALTER TABLE "Tag" RENAME TO "tag";--> statement-breakpoint
ALTER TABLE "author_tag" DROP CONSTRAINT "author_tag_tag_name_Tag_tag_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_tag_name_tag_tag_fk" FOREIGN KEY ("tag_name") REFERENCES "public"."tag"("tag") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
