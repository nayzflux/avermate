import { db } from "@/db";
import { grades, subjects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono();

/**
 * Create a new grade
 */
const createGradeSchema = z.object({
  name: z.string().min(1).max(64),
  outOf: z
    .number()
    .min(0)
    .max(1000 * 10)
    .transform((f) => Math.round(f * 100)),
  value: z
    .number()
    .min(0)
    .max(1000 * 10)
    .transform((f) => Math.round(f * 100)),
  coefficient: z
    .number()
    .min(0)
    .max(1000 * 10)
    .transform((f) => Math.round(f * 100)),
  passedAt: z.coerce.date().max(new Date()).optional().default(new Date()),
  subjectId: z.string().min(1).max(64),
});

app.post("/", zValidator("json", createGradeSchema), async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) throw new HTTPException(401);

  const { name, outOf, value, coefficient, passedAt, subjectId } =
    c.req.valid("json");

  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, subjectId),
  });

  if (!subject) throw new HTTPException(404);
  if (subject.userId !== session.user.id) throw new HTTPException(403);

  // TODO: Error Handling
  const grade = await db
    .insert(grades)
    .values({
      name,
      outOf,
      value,
      coefficient,
      passedAt,
      createdAt: new Date(),
      userId: session.user.id,
      subjectId: subject.id,
    })
    .returning()
    .get();

  return c.json({ grade }, 201);
});

/**
 * Get a grade by ID
 */
const getGradeSchema = z.object({
  gradeId: z.string().min(1).max(64),
});

app.get("/:gradeId", zValidator("json", getGradeSchema), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new HTTPException(401);

  const { gradeId } = c.req.valid("json");

  const grade = await db.query.grades.findFirst({
    where: eq(grades.id, gradeId),
    with: {
      subject: true,
    },
  });

  if (!grade) throw new HTTPException(404);
  if (grade.userId !== session.user.id) throw new HTTPException(403);

  return c.json({ grade });
});

/**
 * Update a grade by ID
 */
const updateGradeBodySchema = z.object({
  name: z.string().min(1).max(64),
  outOf: z
    .number()
    .min(0)
    .max(1000 * 10)
    .transform((f) => Math.round(f * 100))
    .optional(),
  value: z
    .number()
    .min(0)
    .max(1000 * 10)
    .transform((f) => Math.round(f * 100))
    .optional(),
  coefficient: z
    .number()
    .min(0)
    .max(1000 * 10)
    .transform((f) => Math.round(f * 100))
    .optional(),
});

const updateGradeParamSchema = z.object({
  gradeId: z.string().min(1).max(64),
});

app.patch(
  "/:gradeId",
  zValidator("param", updateGradeParamSchema),
  zValidator("json", updateGradeBodySchema),
  async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) throw new HTTPException(401);

    const { gradeId } = c.req.valid("param");
    const data = c.req.valid("json");

    const grade = await db
      .update(grades)
      .set(data)
      .where(and(eq(grades.id, gradeId), eq(grades.userId, session.user.id)))
      .returning()
      .get();

    return c.json({ grade });
  }
);

/**
 * Delete a grade by ID
 */
const deleteGradeSchema = z.object({
  gradeId: z.string().min(1).max(64),
});

app.delete("/:gradeId", zValidator("param", deleteGradeSchema), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) throw new HTTPException(401);

  const { gradeId } = c.req.valid("param");

  const grade = await db
    .delete(grades)
    .where(and(eq(grades.id, gradeId), eq(grades.userId, session.user.id)))
    .returning()
    .get();

  return c.json({ grade });
});

export default app;
