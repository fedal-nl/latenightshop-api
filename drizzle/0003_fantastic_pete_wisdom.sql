ALTER TABLE "products" ALTER COLUMN "category" SET DEFAULT 1;--> statement-breakpoint

ALTER TABLE "products" ADD COLUMN "stock" integer DEFAULT 0;
UPDATE "products" SET "stock" = 0 WHERE "stock" IS NULL;
ALTER TABLE "products" ALTER COLUMN "stock" SET NOT NULL;