ALTER TABLE "tag" ALTER COLUMN "tag_group_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "tag" ALTER COLUMN "tag_group_id" DROP NOT NULL;