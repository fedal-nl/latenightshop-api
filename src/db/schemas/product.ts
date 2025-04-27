import { integer, pgTable, varchar, text, doublePrecision, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { categoriesTable } from "./category.js";
import { usersTable } from "./user.js";


export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image_url: varchar({ length: 255}),
  price: doublePrecision().notNull(),
  category_id: integer().references(() => categoriesTable.id).notNull().default(1),
  stock: integer().notNull().default(0),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
  is_active: boolean().notNull().default(true),
});

// will be used to record the changes of the price of a product
export const productsPriceTable = pgTable("products_price", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  product_id: integer().references(() => productsTable.id).notNull(),
  price: doublePrecision().notNull(),
  changed_by_user_id: integer().references(() => usersTable.id).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow()
});

// Products table schema
// will be used for the validation
export const createProductsSchema = createInsertSchema(productsTable).omit({id: true});
// partial will make all the fields optional
export const updateProductsSchema = createInsertSchema(productsTable).omit({id: true}).partial();

// Products price table schema
export const createProductsPriceSchema = createInsertSchema(productsPriceTable).omit({id: true});
export const updateProductsPriceSchema = createInsertSchema(productsPriceTable).omit({id: true}).partial();