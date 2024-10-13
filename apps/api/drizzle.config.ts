import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schemas/*",
  out: "./drizzle",
  dialect: "turso",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
