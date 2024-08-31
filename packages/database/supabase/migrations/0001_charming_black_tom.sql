ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_author_id_tag_name_pk" PRIMARY KEY("author_id","tag_name");--> statement-breakpoint
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
