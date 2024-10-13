import { newId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { accounts } from "./accounts";
import { sessions } from "./sessions";

export const users = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId("u")),

  email: text().notNull().unique(),

  firstName: text().notNull(),
  lastName: text().notNull(),

  password: text(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
}));

export type InsertUser = typeof users.$inferInsert;
