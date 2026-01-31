CREATE TABLE "master_invite_usage" (
  "id" text PRIMARY KEY,
  "invite_code_used" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "master_invite_usage_invite_code_used_unique"
  ON "master_invite_usage" ("invite_code_used");
