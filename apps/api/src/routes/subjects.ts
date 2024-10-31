import { getSession } from "@/lib/auth";
import { createSubject, getAllUserSubjects } from "@/services/subject";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono();

/**
 * Create a new subject
 */
const createSubjectSchema = z.object({
  name: z.string().min(1).max(32),
  coefficient: z.number().min(0).max(512),
});

app.post("/", zValidator("json", createSubjectSchema), async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const { name, coefficient } = c.req.valid("json");

  const subject = await createSubject({
    name: name,
    coefficient: coefficient,
    userId: session.userId,
  });

  return c.json({ subject: subject }, 201);
});

/**
 * Get all users subjects
 */
app.get("/", async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const subjects = await getAllUserSubjects(session.userId);

  return c.json({ subjects: subjects });
});

export default app;
