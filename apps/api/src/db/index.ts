import * as schema from "@/db/schema";
import { env } from "@/lib/env";
import { createClient } from "@libsql/client/web";
import { drizzle } from "drizzle-orm/libsql/web";

// Create libsql client
const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

// Create drizzle client
export const db = drizzle(client, {
  casing: "snake_case",
  schema,
});
