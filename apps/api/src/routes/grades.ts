import { db } from "@/db";
import { grades, subjects, periods } from "@/db/schema";
import { type Session, type User } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono<{
  Variables: {
    session: {
      user: User;
      session: Session;
    } | null;
  };
}>();

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
  passedAt: z.coerce.date().refine((date) => date <= new Date(), {
      message: "Date cannot be in the future",
    }).optional().default(new Date()),
  subjectId: z.string().min(1).max(64),
  periodId: z.string().min(1).max(64).nullable(),
});

app.post("/", zValidator("json", createGradeSchema), async (c) => {
  const session = c.get("session");

  if (!session) throw new HTTPException(401);

  // If email isnt verified
  if (!session.user.emailVerified) {
    return c.json(
      {
        code: "EMAIL_NOT_VERIFIED",
        message: "Email verification is required",
      },
      403
    );
  }

  const { name, outOf, value, coefficient, passedAt, subjectId, periodId } =
    c.req.valid("json");

  const subject = await db.query.subjects.findFirst({
    where: eq(subjects.id, subjectId),
  });

  if (!subject) throw new HTTPException(404);
  if (subject.userId !== session.user.id) throw new HTTPException(403);


    // Check if the period exists and belongs to the user
  if (periodId) {
    const period = await db.query.periods.findFirst({
      where: eq(periods.id, periodId),
    });

    if (!period) throw new HTTPException(404);
    if (period.userId !== session.user.id) throw new HTTPException(403);
  }

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
      periodId,
    })
    .returning()
    .get();

  return c.json({ grade }, 201);
});

/**
 * Get all grades
 */

const getGradesQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  limit: z.coerce.number().int().optional(),
});

app.get("/", zValidator("query", getGradesQuerySchema), async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  // If email isnt verified
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { from, to, limit } = c.req.valid("query");

  let allGrades = await db.query.grades.findMany({
    where: and(
      eq(grades.userId, session.user.id),
      from && gte(grades.createdAt, from),
      to && lte(grades.createdAt, to)
    ),
    limit: limit,
    orderBy: desc(grades.createdAt),
    with: {
      subject: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
  });

  allGrades = allGrades.sort(
    (a, b) => b.passedAt.getTime() - a.passedAt.getTime()
  );

  return c.json({ grades: allGrades });
});

/**
 * Get a grade by ID
 */
const getGradeSchema = z.object({
  gradeId: z.string().min(1).max(64),
});

app.get("/:gradeId", zValidator("param", getGradeSchema), async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  // If email isnt verified
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { gradeId } = c.req.valid("param");

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
  passedAt: z.coerce.date().refine((date) => date <= new Date(), {
    message: "Date cannot be in the future",
  }).optional(),
  subjectId: z.string().min(1).max(64).optional(),
  periodId: z.string().min(1).max(64).optional().nullable(),
});

const updateGradeParamSchema = z.object({
  gradeId: z.string().min(1).max(64),
});

app.patch(
  "/:gradeId",
  zValidator("param", updateGradeParamSchema),
  zValidator("json", updateGradeBodySchema),
  async (c) => {
    const session = c.get("session");

    if (!session) throw new HTTPException(401);

    // If email isnt verified
    if (!session.user.emailVerified) {
      return c.json(
        {
          code: "EMAIL_NOT_VERIFIED",
          message: "Email verification is required",
        },
        403
      );
    }

    const { gradeId } = c.req.valid("param");
    const data = c.req.valid("json");

    // Check if the subject exists and belongs to the user
    if (data.subjectId) {
      const subject = await db.query.subjects.findFirst({
        where: eq(subjects.id, data.subjectId),
      });

      if (!subject) throw new HTTPException(404);
      if (subject.userId !== session.user.id) throw new HTTPException(403);
    }

    // Check if the period exists and belongs to the user
    if (data.periodId) {
      const period = await db.query.periods.findFirst({
        where: eq(periods.id, data.periodId),
      });

      if (!period) throw new HTTPException(404);
      if (period.userId !== session.user.id) throw new HTTPException(403);
    }

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
  const session = c.get("session");

  if (!session) throw new HTTPException(401);

  // If email isnt verified
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { gradeId } = c.req.valid("param");

  const grade = await db
    .delete(grades)
    .where(and(eq(grades.id, gradeId), eq(grades.userId, session.user.id)))
    .returning()
    .get();

  return c.json({ grade });
});

export default app;
