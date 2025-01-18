ALTER TABLE "event_dm" ALTER COLUMN "uuid" DROP IDENTITY;
ALTER TABLE "author_main" ALTER COLUMN "id" SET START WITH 1300;--> statement-breakpoint
ALTER TABLE "author_product" ALTER COLUMN "id" SET START WITH 9;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "id" SET START WITH 5;--> statement-breakpoint
ALTER TABLE "event_dm" ALTER COLUMN "uuid" ADD GENERATED ALWAYS AS IDENTITY (sequence name "event_dm_uuid_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1300 CACHE 1);