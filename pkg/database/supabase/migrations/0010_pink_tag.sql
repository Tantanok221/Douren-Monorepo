ALTER TABLE "author_main" ADD COLUMN "user_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_main" ADD CONSTRAINT "author_main_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
