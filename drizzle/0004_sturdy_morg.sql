CREATE TABLE IF NOT EXISTS "tag_group" (
	"id" serial NOT NULL,
	"tenant_id" serial NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp
);
