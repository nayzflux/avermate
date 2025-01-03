import { generateId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
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

    depth: integer().notNull().default(0),

    isMainSubject: integer({ mode: "boolean" }).default(false).notNull(),

    isDisplaySubject: integer({ mode: "boolean" }).default(false).notNull(),

    createdAt: integer({ mode: "timestamp" }).notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
  },
  (t) => ({
    parentReference: foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "subjects_parent_id_fk",
    })
      .onDelete("cascade")
      .onUpdate("cascade"),
  })
);

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  parent: one(subjects, {
    fields: [subjects.parentId],
    references: [subjects.id],
    relationName: "parent_relation",
  }),
  childrens: many(subjects, { relationName: "parent_relation" }),
  grades: many(grades),
  user: one(users, {
    fields: [subjects.userId],
    references: [users.id],
  }),
}));

export const periods = sqliteTable("periods", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("per")),

  name: text().notNull(),

  startAt: integer({ mode: "timestamp" }).notNull(),
  endAt: integer({ mode: "timestamp" }).notNull(),

  createdAt: integer({ mode: "timestamp" }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const grades = sqliteTable("grades", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("gra")),

  name: text().notNull(),

  value: integer().notNull(),
  outOf: integer().notNull(),
  coefficient: integer().notNull(),

  passedAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }).notNull(),

  periodId: text()
    .references(() => periods.id, { onUpdate: "cascade", onDelete: "cascade" }),

  subjectId: text()
    .notNull()
    .references(() => subjects.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const gradesRelations = relations(grades, ({ one }) => ({
  subject: one(subjects, {
    fields: [grades.subjectId],
    references: [subjects.id],
  }),
  period: one(periods, {
    fields: [grades.periodId],
    references: [periods.id],
  }),
  user: one(users, {
    fields: [grades.userId],
    references: [users.id],
  }),
}));

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

export const usersRelations = relations(users, ({ many }) => ({
  subjects: many(subjects),
  grades: many(grades),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const sessions = sqliteTable("sessions", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ses", 32)),

  token: text().notNull(),

  expiresAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),

  ipAddress: text(),
  userAgent: text(),

  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accounts = sqliteTable("accounts", {
  id: text()
    .primaryKey()
    .notNull()
    .$defaultFn(() => generateId("acc")),

  accountId: text().notNull(),

  providerId: text().notNull(),

  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),

  accessToken: text(),
  accessTokenExpiresAt: integer({ mode: "timestamp" }),
  refreshToken: text(),
  refreshTokenExpiresAt: integer({ mode: "timestamp" }),
  scope: text(),
  idToken: text(),

  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),

  password: text(),
});

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const verifications = sqliteTable("verifications", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ver")),

  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: integer({ mode: "timestamp" }).notNull(),
  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
});

// Custom averages are the averages that the user can create, they are identified by an id, a name and and a list of ids of the subjects that are part of this average
// optionally, the user can specify a custom coefficient for each subject, if not specified, the coefficient is the one of the subject and whether or not the average should include it's children or only the subject itself
// finally, the user can specify if a custom average is a main average, meaning that it will be displayed on the main page of the app
// a custom average is not taken into account in the global average of the user it is only used to display the average of a specific set of subjects
// because of this, we need to store something like a json object in the database to store the list of subjects that are part of the average and their respective coefficients and whether or not the average should include the children of the subject

export const customAverages = sqliteTable("custom_averages", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ca")),

  name: text().notNull(),

  subjects: text().notNull(),

  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),

  isMainAverage: integer({ mode: "boolean" }).default(false).notNull(),

  createdAt: integer({ mode: "timestamp" }).notNull(),
});
