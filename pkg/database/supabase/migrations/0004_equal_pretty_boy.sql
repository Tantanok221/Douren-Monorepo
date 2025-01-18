ALTER TABLE "author_main" RENAME COLUMN "uuid" TO "id";--> statement-breakpoint
ALTER TABLE "author_tag" DROP CONSTRAINT "author_tag_author_id_author_main_uuid_fk";
--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'author_main'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "author_main" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "author_product" ALTER COLUMN "id" DROP IDENTITY;
ALTER TABLE "event" ALTER COLUMN "id" DROP IDENTITY;
ALTER TABLE "author_main" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "author_main" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "author_main_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "author_product" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "author_product" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "author_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "author_tag" ALTER COLUMN "author_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_author_id_author_main_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author_main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
