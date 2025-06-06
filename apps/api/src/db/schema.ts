import { generateId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
import {
  foreignKey,
  index,
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
    userIdIdx: index("user_id_idx").on(t.userId),
  }),
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

  isCumulative: integer({ mode: "boolean" }).notNull().default(false),

  createdAt: integer({ mode: "timestamp" }).notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
}, (t) => ({
  userIdIdx: index("user_id_idx").on(t.userId),
}));


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
}, (t) => ({
  userIdIdx: index("user_id_idx").on(t.userId),
  subjectIdIdx: index("subject_id_idx").on(t.subjectId),
}));

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
  cardTemplates: many(cardTemplates),
  cardLayouts: many(cardLayouts),
}));

export const sessions = sqliteTable("sessions", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ses", 32)),

  token: text().unique().notNull(),

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
}, (t) => ({
  userIdIdx: index("user_id_idx").on(t.userId),
  accountIdProviderIdIdx: index("account_id_provider_id_idx").on(
    t.accountId,
    t.providerId,
  ),
}));

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
}, (t) => ({
  userIdIdx: index("user_id_idx").on(t.userId),
}));

export const cardTemplates = sqliteTable("card_templates", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("ct")),

  type: text().notNull(), // 'built_in' or 'custom'
  identifier: text().notNull(),
  
  config: text().notNull(), // JSON string containing title, description template, etc.
  
  userId: text() // Only for custom templates
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),

  createdAt: integer({ mode: "timestamp" }).notNull(),
});

export const cardTemplatesRelations = relations(cardTemplates, ({ one }) => ({
  user: one(users, {
    fields: [cardTemplates.userId],
    references: [users.id],
  }),
}));

export const cardLayouts = sqliteTable("card_layouts", {
  id: text()
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId("cl")),

  userId: text()
    .notNull()
    .references(() => users.id, { onUpdate: "cascade", onDelete: "cascade" }),
    
  page: text().notNull(), // 'dashboard', 'grade', or 'subject'
  
  cards: text().notNull(), // JSON array of card positions and customizations
  
  createdAt: integer({ mode: "timestamp" }).notNull(),
  updatedAt: integer({ mode: "timestamp" }).notNull(),
});

export const cardLayoutsRelations = relations(cardLayouts, ({ one }) => ({
  user: one(users, {
    fields: [cardLayouts.userId],
    references: [users.id],
  }),
}));