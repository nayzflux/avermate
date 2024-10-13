import { users } from "@/db/schemas/users";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
  id: text().primaryKey(),

  userId: text().notNull(),

  expiresAt: integer({ mode: "timestamp_ms" }).notNull(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));