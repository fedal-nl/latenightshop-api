ALTER TABLE "categories" RENAME COLUMN "imageUrl" TO "image_url";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "categories" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "orderId" TO "order_id";--> statement-breakpoint
ALTER TABLE "order_items" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "products_price" RENAME COLUMN "productId" TO "product_id";--> statement-breakpoint
ALTER TABLE "products_price" RENAME COLUMN "changedByUser" TO "changed_by_user_id";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "image" TO "image_url";--> statement-breakpoint
ALTER TABLE "products" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_orders_id_fk";
--> statement-breakpoint
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products_price" DROP CONSTRAINT "products_price_productId_products_id_fk";
--> statement-breakpoint
ALTER TABLE "products_price" DROP CONSTRAINT "products_price_changedByUser_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_price" ADD CONSTRAINT "products_price_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products_price" ADD CONSTRAINT "products_price_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
