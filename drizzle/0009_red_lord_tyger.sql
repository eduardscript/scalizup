ALTER TABLE "session" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_username_unique" UNIQUE("username");