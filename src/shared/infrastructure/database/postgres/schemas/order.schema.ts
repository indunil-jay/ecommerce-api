import { integer, pgEnum, pgTable, timestamp, uuid, varchar, text } from "drizzle-orm/pg-core";
import { customers } from "./customer.schema";
import { products } from "./product.schema";
import { relations } from "drizzle-orm";


export const orderStatusEnum = pgEnum('order_status', [
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
])

export const orders = pgTable('orders', {
    id: uuid('id').primaryKey(),
    customerId: uuid('customer_id').notNull().references(() => customers.id),
    status: orderStatusEnum('status').notNull().default('pending'),
    totalAmount: integer('total_amount').notNull(),
    currency: varchar('currency', { length: 3 }).notNull().default('usd'),
    shippingStreet: varchar('shipping_street'),
    shippingCity: varchar('shipping_city'),
    shippingState: varchar('shipping_state'),
    shippingCountry: varchar('shipping_country'),
    shippingZipCode: varchar('shipping_zip_code'),
    trackingNumber: varchar('tracking_number'),
    notes: text('notes'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


export const orderItems = pgTable('order_items', {
    id: uuid('id').primaryKey(),
    orderId: uuid('order_id').notNull().references(() => orders.id),
    productId: uuid('product_id').notNull().references(() => products.id),
    productName: varchar('product_name').notNull(),
    unitPriceAmount: integer('unit_price_amount').notNull(),
    unitPriceCurrency: varchar('unit_price_currency', { length: 3 }).notNull().default('usd'),
    quantity: integer('quantity').notNull(),
    discountAmount: integer('discount_amount'),
    discountCurrency: varchar('discount_currency', { length: 3 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
})


export const orderRelations = relations(orders, ({ many }) => ({
    items: many(orderItems)
}));


export const orderItemRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id]
    })
}))