import { integer, pgTable, varchar, text, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";


export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image: varchar({ length: 255}),
  price: doublePrecision().notNull(),
});


// will be used for the validation
export const createProductsSchema = createInsertSchema(productsTable).omit({id: true});

export const updateProductsSchema = createInsertSchema(productsTable).omit({id: true}).partial();