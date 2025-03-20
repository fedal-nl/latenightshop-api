import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: 'postgresql', // 'mysql' | 'sqlite' | 'turso'
  schema: './src/db/schemas',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
})

// npx drizzle-kit push