CREATE TABLE "invite_history" (
	"id" text PRIMARY KEY NOT NULL,
	"inviter_id" text NOT NULL,
	"invited_user_id" text NOT NULL,
	"invite_code_used" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_invite_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"invite_code" text NOT NULL,
	"max_invites" integer DEFAULT 10 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_invite_settings_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "user_invite_settings_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
ALTER TABLE "invite_history" ADD CONSTRAINT "invite_history_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_history" ADD CONSTRAINT "invite_history_invited_user_id_user_id_fk" FOREIGN KEY ("invited_user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_invite_settings" ADD CONSTRAINT "user_invite_settings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;