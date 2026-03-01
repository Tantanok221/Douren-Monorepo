CREATE TABLE IF NOT EXISTS "booth" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "event_id" integer NOT NULL,
  "name" text NOT NULL,
  "location_day01" text,
  "location_day02" text,
  "location_day03" text
);
--> statement-breakpoint
ALTER TABLE "booth"
  ADD CONSTRAINT "booth_event_id_event_id_fk"
  FOREIGN KEY ("event_id") REFERENCES "public"."event"("id")
  ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "event_dm" ADD COLUMN IF NOT EXISTS "booth_id" integer;
--> statement-breakpoint
ALTER TABLE "event_dm"
  ADD CONSTRAINT "event_dm_booth_id_booth_id_fk"
  FOREIGN KEY ("booth_id") REFERENCES "public"."booth"("id")
  ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "booth_event_id_name_unique" ON "booth" ("event_id", "name");
--> statement-breakpoint
INSERT INTO "booth" ("event_id", "name", "location_day01", "location_day02", "location_day03")
SELECT DISTINCT
  "event_id",
  COALESCE(NULLIF("booth_name", ''), 'Unknown Booth') AS "name",
  "location_day01",
  "location_day02",
  "location_day03"
FROM "event_dm"
WHERE "event_id" IS NOT NULL;
--> statement-breakpoint
UPDATE "event_dm" AS edm
SET "booth_id" = b."id"
FROM "booth" AS b
WHERE edm."booth_id" IS NULL
  AND edm."event_id" = b."event_id"
  AND COALESCE(NULLIF(edm."booth_name", ''), 'Unknown Booth') = b."name"
  AND COALESCE(edm."location_day01", '') = COALESCE(b."location_day01", '')
  AND COALESCE(edm."location_day02", '') = COALESCE(b."location_day02", '')
  AND COALESCE(edm."location_day03", '') = COALESCE(b."location_day03", '');
