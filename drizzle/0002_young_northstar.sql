ALTER TABLE "tenant" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tenant" ADD COLUMN "is_enabled" boolean DEFAULT false;