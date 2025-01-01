import { db } from "@/db";
import { users, grades, subjects } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const userCount = await db.$count(users);
  const gradeCount = await db.$count(grades);
  const subjectCount = await db.$count(subjects);

  return c.json({
    userCount,
    gradeCount,
    subjectCount,
  });
});

export default app;
