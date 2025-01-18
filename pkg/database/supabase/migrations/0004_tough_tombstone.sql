ALTER TABLE "author_product" ALTER COLUMN "id" DROP IDENTITY;
ALTER TABLE "event" ALTER COLUMN "id" DROP IDENTITY;
ALTER TABLE "event_dm" ALTER COLUMN "id" DROP IDENTITY;
ALTER TABLE "author_main" ALTER COLUMN "id" DROP IDENTITY;
ALTER TABLE "author_main" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "author_main" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "author_main_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1300 CACHE 1);--> statement-breakpoint
ALTER TABLE "author_product" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "author_product" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "author_product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 9 CACHE 1);--> statement-breakpoint
ALTER TABLE "author_tag" ALTER COLUMN "author_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "event_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 5 CACHE 1);--> statement-breakpoint
ALTER TABLE "event_dm" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "event_dm_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1300 CACHE 1);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author_tag" ADD CONSTRAINT "author_tag_author_id_author_main_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."author_main"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
