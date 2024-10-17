import { newId } from "@/lib/nanoid";
import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { grades } from "./grades";

export const subjects = sqliteTable("subjects", {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId("subject")),

  name: text().notNull(),

  coefficient: integer().notNull().default(1),

  createdAt: integer({ mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subjectsRelations = relations(subjects, ({ many }) => ({
  grades: many(grades),
}));
