ALTER TABLE "session" DROP CONSTRAINT "session_username_unique";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN IF EXISTS "username";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");