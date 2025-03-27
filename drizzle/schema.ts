import { pgTable, integer, varchar, text, doublePrecision, unique, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const products = pgTable("products", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "products_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	image: varchar({ length: 255 }),
	price: doublePrecision().notNull(),
});

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	email: varchar({ length: 255 }).notNull(),
	password: varchar({ length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	role: varchar({ length: 255 }).default('user').notNull(),
	address: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});