import { db } from "@/db";
import { grades, periods, subjects } from "@/db/schema";
import { type Session, type User } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, asc, eq, ne, sql } from "drizzle-orm";
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
 * Create a new subject
 */
const createSubjectSchema = z.object({
  name: z.string().min(1).max(64),
  coefficient: z
    .number()
    .min(1)
    .max(1000)
    .transform((f) => Math.round(f * 100)),
  parentId: z.string().min(1).max(64).optional().nullable(),
  depth: z.number().int().min(0).max(1000).optional(),
  isMainSubject: z.boolean().optional(),
  isDisplaySubject: z.boolean().optional(),
});

app.post("/", zValidator("json", createSubjectSchema), async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  // If email isnt verified
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { name, coefficient, parentId, isMainSubject, isDisplaySubject } =
    c.req.valid("json");

  let depth = 0;

  if (parentId) {
    const parentSubject = await db.query.subjects.findFirst({
      where: eq(subjects.id, parentId),
    });

    if (!parentSubject) throw new HTTPException(404);
    if (parentSubject.userId !== session.user.id) throw new HTTPException(403);

    depth = parentSubject.depth + 1;
  }

  // TODO: Error Handling
  const subject = await db
    .insert(subjects)
    .values({
      name,
      coefficient,
      parentId,
      depth,
      isMainSubject: isMainSubject,
      isDisplaySubject: isDisplaySubject,
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
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  // If email isnt verified
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const allSubjects = await db.query.subjects.findMany({
    where: eq(subjects.userId, session.user.id),
    with: {
      grades: true,
    },
    orderBy: sql`COALESCE(${subjects.parentId}, ${subjects.id}), ${subjects.parentId} IS NULL DESC, ${subjects.name} ASC`,
  });

  return c.json({ subjects: allSubjects });
});

app.get("/organized-by-periods", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  // If email isn't verified
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  // Fetch periods for the user
  const userPeriods = await db.query.periods.findMany({
    where: eq(periods.userId, session.user.id),
    orderBy: asc(periods.startAt),
  });

  // Fetch subjects with grades
  const subjectsWithGrades = await db.query.subjects.findMany({
    where: eq(subjects.userId, session.user.id),
    with: {
      grades: {
        columns: {
          id: true,
          name: true,
          value: true,
          outOf: true,
          coefficient: true,
          passedAt: true,
          periodId: true,
        },
      },
    },
    orderBy: asc(subjects.name),
  });

  // Organize subjects by periods
  const periodsWithSubjects = userPeriods.map((period) => {
    const subjectsInPeriod = subjectsWithGrades.map((subject) => {
      const gradesInPeriod = subject.grades.filter(
        (grade) => grade.periodId === period.id
      );

      return {
        ...subject,
        grades: gradesInPeriod, // Grades for this period, or an empty array
      };
    });

    return {
      period,
      subjects: subjectsInPeriod,
    };
  });

  // Calculate startAt and endAt for full-year period
  const sortedPeriods = userPeriods.sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  const fullYearStartAt =
    sortedPeriods && sortedPeriods.length > 0
      ? new Date(sortedPeriods[0].startAt)
      : new Date(new Date().getFullYear(), 8, 1);

  const fullYearEndAt =
    sortedPeriods && sortedPeriods.length > 0
      ? new Date(sortedPeriods[sortedPeriods.length - 1].endAt)
      : new Date(new Date().getFullYear() + 1, 5, 30);

  // Add hardcoded full-year period with all grades
  const fullYearPeriod = {
    id: "full-year",
    name: "Full Year",
    startAt: fullYearStartAt,
    endAt: fullYearEndAt,
    createdAt: new Date(),
    userId: session.user.id,
  };

  const allSubjectsWithAllGrades = subjectsWithGrades.map((subject) => ({
    ...subject,
    grades: subject.grades, // All grades for this subject
  }));

  periodsWithSubjects.push({
    period: fullYearPeriod,
    subjects: allSubjectsWithAllGrades,
  });

  return c.json({ periods: periodsWithSubjects });
});

// Get a specific subject organized by periods
const getSubjectByPeriodSchema = z.object({
  subjectId: z.string().min(1).max(64).nullable(),
});

app.get(
  "/organized-by-periods/:subjectId",
  zValidator("param", getSubjectByPeriodSchema),
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

    const { subjectId } = c.req.valid("param");

    //if period is null, then get all the grades from all periods
    if (!subjectId) {
      const allSubjects = await db.query.subjects.findMany({
        where: eq(subjects.userId, session.user.id),
        with: {
          grades: true,
        },
        orderBy: sql`COALESCE(${subjects.parentId}, ${subjects.id}), ${subjects.parentId} IS NULL DESC, ${subjects.name} ASC`,
      });

      return c.json({ subjects: allSubjects });
    }

    // Fetch the subject with grades
    const subject = await db.query.subjects.findFirst({
      where: and(
        eq(subjects.id, subjectId),
        eq(subjects.userId, session.user.id)
      ),
      with: {
        grades: {
          columns: {
            id: true,
            name: true,
            value: true,
            outOf: true,
            coefficient: true,
            passedAt: true,
            periodId: true,
          },
        },
      },
    });

    if (!subject) throw new HTTPException(404);

    // Fetch periods for the user
    const userPeriods = await db.query.periods.findMany({
      where: eq(periods.userId, session.user.id),
      orderBy: asc(periods.startAt),
    });

    // Organize grades of the subject by periods
    const periodsWithGrades = userPeriods.map((period) => {
      const gradesInPeriod = subject.grades.filter(
        (grade) => grade.periodId === period.id
      );

      return {
        period,
        grades: gradesInPeriod,
      };
    });

    return c.json({ subject: { ...subject, periods: periodsWithGrades } });
  }
);

/**
 * Get subject by ID
 */
const getSubjectSchema = z.object({
  subjectId: z.string().min(1).max(64),
});

app.get("/:subjectId", zValidator("param", getSubjectSchema), async (c) => {
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
    .min(1)
    .max(1000)
    .transform((f) => Math.round(f * 100))
    .optional(),
  parentId: z.string().min(1).max(64).optional().nullable(),
  depth: z.number().int().min(0).max(1000).optional(),
  isMainSubject: z.boolean().optional(),
  isDisplaySubject: z.boolean().optional(),
});

const updateSubjectParamSchema = z.object({
  subjectId: z.string().min(1).max(64),
});

app.patch(
  "/:subjectId",
  zValidator("param", updateSubjectParamSchema),
  zValidator("json", updateSubjectBodySchema),
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

    const { subjectId } = c.req.valid("param");
    const data = c.req.valid("json");

    // Get the subject to be updated
    const subject = await db.query.subjects.findFirst({
      where: eq(subjects.id, subjectId),
    });

    if (!subject) throw new HTTPException(404);
    if (subject.userId !== session.user.id) throw new HTTPException(403);

    let newDepth = subject.depth;
    let depthDifference = 0;

    // If parentId is being updated
    if (data.parentId !== undefined) {
      const newParentId = data.parentId;

      if (newParentId) {
        // Prevent self-parenting
        if (newParentId === subjectId) {
          throw new HTTPException(400);
        }

        // Get the new parent subject
        const parentSubject = await db.query.subjects.findFirst({
          where: eq(subjects.id, newParentId),
        });

        if (!parentSubject) throw new HTTPException(404);
        if (parentSubject.userId !== session.user.id)
          throw new HTTPException(403);

        // Compute new depth
        newDepth = parentSubject.depth + 1;
      } else {
        // ParentId is null, depth is 0
        newDepth = 0;
      }

      // Compute depth difference
      depthDifference = newDepth - subject.depth;

      data.depth = newDepth;
    }

    // Update the subject
    const updatedSubject = await db
      .update(subjects)
      .set(data)
      .where(
        and(eq(subjects.id, subjectId), eq(subjects.userId, session.user.id))
      )
      .returning()
      .get();

    // If depth has changed, update the depths of the descendants
    if (depthDifference !== 0) {
      // Fetch all descendants of the subject
      const descendants = await db.query.subjects.findMany({
        where: and(
          eq(subjects.userId, session.user.id),
          sql`${subjects.id} IN (
            SELECT descendant.id
            FROM ${subjects} AS ancestor
            JOIN ${subjects} AS descendant
            ON descendant.parentId = ancestor.id
            WHERE ancestor.id = ${subjectId}
          )`,
          ne(subjects.id, subjectId)
        ),
      });

      // Update the depth of each descendant
      await Promise.all(
        descendants.map((descendant) =>
          db
            .update(subjects)
            .set({ depth: descendant.depth + depthDifference })
            .where(eq(subjects.id, descendant.id))
        )
      );
    }

    // If the subject is now a category (assuming `isMainSubject === true` indicates category)
    // delete all associated grades.
    if (data.isDisplaySubject === true) {
      await db.delete(grades).where(eq(grades.subjectId, subjectId));
    }

    return c.json({ subject: updatedSubject });
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
