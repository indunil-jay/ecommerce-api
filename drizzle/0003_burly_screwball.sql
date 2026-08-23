ALTER TABLE "order_items" ALTER COLUMN "discount_amount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "discount_amount" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "discount_currency" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "order_items" ALTER COLUMN "discount_currency" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "shipping_zip_code" varchar;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "shipping_postal_code";