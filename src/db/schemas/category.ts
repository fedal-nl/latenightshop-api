import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";


export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  image_url: varchar({ length: 255 }),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at"),
  is_active: boolean().notNull().default(true),
});
// will be used for the validation
export const createCategoriesSchema = createInsertSchema(categoriesTable).omit(
    { 
        id: true, 
        created_at: true, 
        updated_at: true, 
        is_active: true 
    }
);
export const updateCategoriesSchema = createInsertSchema(categoriesTable).omit({ id: true }).partial();
