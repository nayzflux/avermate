import { newId } from "@/lib/nanoid";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const users = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => newId("u")),
  email: text().notNull().unique(),
  firstname: text().notNull(),
  lastname: text().notNull(),
  password: text(),
  createdAt: integer({ mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export default users;
