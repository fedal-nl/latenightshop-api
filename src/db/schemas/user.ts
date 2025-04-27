import { integer, pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  name: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default('user'),
  address: text(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

// will be used for the validation
export const createUsersSchema = createInsertSchema(usersTable).omit({id: true});
export const loginUsersSchema = createInsertSchema(usersTable).pick({email: true, password: true});

export const updateUsersSchema = createInsertSchema(usersTable).omit({id: true, role: true}).partial();