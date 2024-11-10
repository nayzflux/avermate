import { db } from "@/db";
import { subjects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono();

/**
 * Create a new subject
 */
const createSubjectSchema = z.object({
  name: z.string().min(1).max(64),
  coefficient: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .transform((f) => Math.round(f * 100)),
  parentId: z.string().min(1).max(64).optional(),
});

app.post("/", zValidator("json", createSubjectSchema), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new HTTPException(401);

  const { name, coefficient, parentId } = c.req.valid("json");

  if (parentId) {
    const parentSubject = await db.query.subjects.findFirst({
      where: eq(subjects.id, parentId),
    });

    if (!parentSubject) throw new HTTPException(404);
    if (parentSubject.userId !== session.user.id) throw new HTTPException(403);
  }

  // TODO: Error Handling
  const subject = await db
    .insert(subjects)
    .values({
      name,
      coefficient,
      parentId,
      createdAt: new Date(),
      userId: session.user.id,
    })
    .returning()
    .get();

  return c.json({ subject }, 201);
});

/**
 * Get all subjects
 */
app.get("/", async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new HTTPException(401);

  const allSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, session.user.id),
    with: {
      grades: true,
    },
    orderBy: sql`COALESCE(${subjects.parentId}, ${subjects.id}), ${subjects.parentId} IS NULL DESC, ${subjects.name} ASC`,
  });

  return c.json({ subjects: allSubjects });
});

/**
 * Get subject by ID
 */
const getSubjectSchema = z.object({
  subjectId: z.string().min(1).max(64),
});

app.get("/:subjectId", zValidator("param", getSubjectSchema), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) throw new HTTPException(401);

  const { subjectId } = c.req.valid("param");

  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, subjectId),
    with: {
      parent: true,
      childrens: true,
      grades: true,
    },
  });

  if (!subject) throw new HTTPException(404);
  if (subject.userId !== session.user.id) throw new HTTPException(403);

  return c.json({ subject });
});

/**
 * Update subject by ID
 */
const updateSubjectBodySchema = z.object({
  name: z.string().min(1).max(64).optional(),
  coefficient: z
    .number()
    .int()
    .min(1)
    .max(1000)
    .transform((f) => Math.round(f * 100))
    .optional(),
  parentId: z.string().min(1).max(64).optional(),
});

const updateSubjectParamSchema = z.object({
  subjectId: z.string().min(1).max(64),
});

app.patch(
  "/:subjectId",
  zValidator("param", updateSubjectParamSchema),
  zValidator("json", updateSubjectBodySchema),
  async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) throw new HTTPException(401);

    const { subjectId } = c.req.valid("param");
    const data = c.req.valid("json");

    const subject = await db
      .update(subjects)
      .set(data)
      .where(
        and(eq(subjects.id, subjectId), eq(subjects.userId, session.user.id))
      )
      .returning()
      .get();

    return c.json({ subject });
  }
);

/**
 * Delete subject by ID
 */
const deleteSubjectSchema = z.object({
  subjectId: z.string().min(1).max(64),
});

app.delete(
  "/:subjectId",
  zValidator("param", deleteSubjectSchema),
  async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });
    if (!session) throw new HTTPException(401);

    const { subjectId } = c.req.valid("param");

    const subject = await db
      .delete(subjects)
      .where(
        and(eq(subjects.id, subjectId), eq(subjects.userId, session.user.id))
      )
      .returning()
      .get();

    return c.json({ subject });
  }
);

export default app;
