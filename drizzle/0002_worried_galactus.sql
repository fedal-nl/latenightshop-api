CREATE TABLE IF NOT EXISTS "categories" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "categories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text,
	"imageUrl" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updatedAt" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products_price" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "products_price_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"productId" integer NOT NULL,
	"price" double precision NOT NULL,
	"changedByUser" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
/*
 * This is a to update the field with not null values because the default value will not be applied to existing rows.
 So when altering the table with not null values, first alter with null values and then update the field with not null values.
 */

/*
 * This is create a value in the table categories to be used as a foreign key in the products table.
 */
INSERT INTO "categories" ("name", "description", "imageUrl", "created_at", "updatedAt", "isActive") VALUES ('Default', 'Default category', 'https://example.com/default.jpg', now(), 'default.jpg', true);--> statement-breakpoint
/*
 * This is a to update the field with not null values because the default value will not be applied to existing rows.
 So when altering the table with not null values, first alter with null values and then update the field with not null values.
 */

ALTER TABLE "products" ADD COLUMN "category" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "isActive" boolean DEFAULT true;--> statement-breakpoint

/*
 * This is a to update the field with not null values because the default value will not be applied to existing rows.
 So when altering the table with not null values, first alter with null values and then update the field with not null values.
 */
UPDATE "products" SET "category" = 1 WHERE "category" IS NULL;--> statement-breakpoint
UPDATE "products" SET "created_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "products" SET "updated_at" = now() WHERE "updated_at" IS NULL;--> statement-breakpoint
UPDATE "products" SET "isActive" = true WHERE "isActive" IS NULL;--> statement-breakpoint

/*
 * This is a to update the field with not null values because the default value will not be applied to existing rows.
 So when altering the table with not null values, first alter with null values and then update the field with not null values.
 */
ALTER TABLE "products" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ALTER COLUMN "isActive" SET NOT NULL;--> statement-breakpoint

DO $$ BEGIN
 ALTER TABLE "products_price" ADD CONSTRAINT "products_price_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_price" ADD CONSTRAINT "products_price_changedByUser_users_id_fk" FOREIGN KEY ("changedByUser") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
