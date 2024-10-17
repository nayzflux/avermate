import { subjects } from "@/db/schemas/subjects";
import { newId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const grades = sqliteTable("grades", {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId("grade")),

  name: text().notNull(),

  value: integer().notNull(),

  coefficient: integer().notNull().default(1),

  subjectId: text().notNull(),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const gradesRelations = relations(grades, ({ one }) => ({
  subject: one(subjects, {
    fields: [grades.subjectId],
    references: [subjects.id],
  }),
}));
