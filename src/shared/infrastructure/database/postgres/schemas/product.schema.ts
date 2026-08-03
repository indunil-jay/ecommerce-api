import { boolean, decimal, integer, pgTable, varchar, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
    id: uuid("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    sku: varchar("sku", { length: 255 }).notNull().unique(),
    priceAmount: integer("price_amount").notNull(),
    priceCurrency: varchar("price_currency", { length: 3 }).default('usd').notNull(),
    stockQuantity: integer("stock_quantity").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})