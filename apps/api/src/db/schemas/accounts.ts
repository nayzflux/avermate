import { newId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { users } from "./users";

export const accounts = sqliteTable(
  "accounts",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => newId("a")),

    userId: text().notNull(),

    providerUserId: text().notNull(),
    providerId: text().notNull(),

    createdAt: integer({ mode: "timestamp_ms" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => ({
    unique: unique().on(t.providerUserId, t.providerId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));
