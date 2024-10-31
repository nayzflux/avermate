import { getSession } from "@/lib/auth";
import { createGrade, getAllUserGrades } from "@/services/grade";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono();

/**
 * Create a new grade
 */
const createGradeSchema = z.object({
  name: z.string().min(1).max(64),
  value: z.number().min(0).max(1024),
  outOf: z.number().min(0).max(1024),
  subjectId: z.string().min(1).max(32),
  coefficient: z.number().min(0).max(512).optional().default(1),
});

app.post("/", zValidator("json", createGradeSchema), async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { name, value, outOf, subjectId, coefficient } = c.req.valid("json");

  const grade = await createGrade({
    name: name,
    value: value,
    outOf: outOf,
    coefficient: coefficient,
    subjectId: subjectId,
    userId: session.userId,
  });

  return c.json({ grade: grade }, 201);
});

/**
 * Get all users grades
 */
const getAllUserGradesQuery = z.object({
  from: z.string().date(),
  to: z.string().date(),
});

app.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const grades = await getAllUserGrades(session.userId);

  return c.json({ grades: grades });
});

export default app;
