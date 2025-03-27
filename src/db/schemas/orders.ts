import { integer, pgTable, varchar, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { usersTable } from "./user.js";
import { productsTable } from "./product.js";
import { z } from 'zod';

/*
Define the db tables, schemas for the api validations and responses.
*/

export const ordersTable = pgTable('orders', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    status: varchar({ length: 50 }).notNull().default('New'),
    userId: integer().references(() => usersTable.id).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orderItemsTable = pgTable('order_items', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    orderId: integer().references(() => ordersTable.id).notNull(),
    productId: integer().references(() => productsTable.id).notNull(),
    quantity: integer().notNull(),
    price: doublePrecision().notNull(),
    created_at: timestamp('created_at').notNull().defaultNow()
});

// specific create schema for the order
export const createOrdersSchema = createInsertSchema(ordersTable).omit(
    {
        id: true, 
        status: true, 
        userId: true,
        createdAt: true
    });

// specific create schema for the ordersItems
export const createOrderItemsSchema = createInsertSchema(orderItemsTable).omit(
    {
        id: true,
        orderId: true,
        created_at: true,

    })

// specific create schema for combining them for the create request.
export const createOrderWithItemSchema = z.object({
    order: createOrdersSchema,
    items: z.array(createOrderItemsSchema)
})

// for the update of an order
export const updateOrderSchema = createInsertSchema(ordersTable).pick({status: true})