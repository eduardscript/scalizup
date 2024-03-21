CREATE TABLE IF NOT EXISTS "tag" (
	"id" serial NOT NULL,
	"tag_group_id" serial NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT NOW(),
	"updated_at" timestamp
);
