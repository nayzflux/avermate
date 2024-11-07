import { generateId } from "@/lib/nanoid";
import {
  foreignKey,
  integer,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const subjects = sqliteTable(
  "subjects",
  {
    id: text()
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId("sub")),

    name: text().notNull(),

    parentId: text(),

    coefficient: integer().notNull(),

    createdAt: integer({ mode: "timestamp" }).notNull(),
  },
  (t) => ({
    parentReference: foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "subjects_parent_id_fk",
    }),
  })
);

export const grades = sqliteTable("grades", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("gra")),

  name: text().notNull(),

  value: integer().notNull(),
  outOf: integer().notNull(),
  coefficient: integer().notNull(),

  createdAt: integer({ mode: "timestamp" }).notNull(),
});

export const users = sqliteTable("users", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("u")),

  name: text().notNull(),

  email: text().notNull().unique(),
  emailVerified: integer({ mode: "boolean" }).notNull(),

  avatarUrl: text(),

  updatedAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ses", 32)),

  expiresAt: integer({ mode: "timestamp" }).notNull(),

  ipAddress: text(),
  userAgent: text(),

  userId: text()
    .notNull()
    .references(() => users.id),
});

export const accounts = sqliteTable("accounts", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId("acc")),

  accountId: text().notNull(),

  providerId: text().notNull(),

  userId: text()
    .notNull()
    .references(() => users.id),

  accessToken: text(),
  refreshToken: text(),
  idToken: text(),

  expiresAt: integer({ mode: "timestamp" }),

  password: text(),
});

export const verifications = sqliteTable("verifications", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ver")),

  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
});
