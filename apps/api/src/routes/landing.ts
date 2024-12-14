import { db } from "@/db";
import { users, grades, subjects } from "@/db/schema";
import { Hono } from "hono";

const app = new Hono();

// create a new get route that returns in the same json file: the number of users registered, the number of grades ever created, and the number of subjects ever created
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
