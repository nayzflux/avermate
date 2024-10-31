import { newId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";

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
export type User = typeof users.$inferSelect;

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

export type InsertSession = typeof sessions.$inferInsert;
export type Session = typeof users.$inferSelect;

export const accounts = sqliteTable(
  "accounts",
  {
    id: text()
      .primaryKey()
      .$defaultFn(() => newId("acc")),

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

export type InsertAccount = typeof accounts.$inferInsert;
export type Account = typeof accounts.$inferSelect;

export const subjects = sqliteTable("subjects", {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId("sub")),

  name: text().notNull(),

  coefficient: integer().notNull().default(1),

  userId: text().notNull(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subjectsRelations = relations(subjects, ({ many, one }) => ({
  grades: many(grades),
  user: one(users, { fields: [subjects.userId], references: [users.id] }),
}));

export type InsertSubject = typeof subjects.$inferInsert;
export type Subject = typeof subjects.$inferSelect;

export const grades = sqliteTable("grades", {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId("gra")),

  name: text().notNull(),

  value: integer().notNull(),
  outOf: integer().notNull(),

  coefficient: integer().notNull().default(1),

  subjectId: text().notNull(),
  userId: text().notNull(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const gradesRelations = relations(grades, ({ one }) => ({
  subject: one(subjects, {
    fields: [grades.subjectId],
    references: [subjects.id],
  }),

  user: one(users, { fields: [grades.userId], references: [users.id] }),
}));

export type InsertGrade = typeof grades.$inferInsert;
export type Grade = typeof grades.$inferSelect;
