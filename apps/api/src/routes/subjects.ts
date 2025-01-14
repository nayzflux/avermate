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

  // 1) Fetch periods for the user
  const userPeriods = await db.query.periods.findMany({
    where: eq(periods.userId, session.user.id),
    orderBy: asc(periods.startAt),
  });

  // 2) Fetch subjects with grades
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

  // 3) Sort periods by start date
  const sortedPeriods = [...userPeriods].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );

  // 4) Build the data structure: for each period, if isCumulative = true,
  //    include the grades from all *previous* periods plus the current one.
  const periodsWithSubjects = sortedPeriods.map((period, index) => {
    // Gather relevant period IDs
    const relevantPeriodIds = period.isCumulative
      ? sortedPeriods.slice(0, index + 1).map((p) => p.id)
      : [period.id];

    // Now, for each subject, we include only the grades whose `periodId` is in relevantPeriodIds
    const subjectsInPeriod = subjectsWithGrades.map((subject) => {
      const relevantGrades = subject.grades.filter((grade) =>
        relevantPeriodIds.includes(grade.periodId ?? "")
      );

      return {
        ...subject,
        grades: relevantGrades,
      };
    });

    return {
      period,
      subjects: subjectsInPeriod,
    };
  });

  // -- The following is the "full-year" logic you already have. --
  // Calculate startAt and endAt for the "full-year" period:
  const fullYearStartAt =
    sortedPeriods.length > 0
      ? new Date(sortedPeriods[0].startAt)
      : new Date(new Date().getFullYear(), 8, 1);

  const fullYearEndAt =
    sortedPeriods.length > 0
      ? new Date(sortedPeriods[sortedPeriods.length - 1].endAt)
      : new Date(new Date().getFullYear() + 1, 5, 30);

  // Hardcoded full-year period
  const fullYearPeriod = {
    id: "full-year",
    name: "Full Year",
    startAt: fullYearStartAt,
    endAt: fullYearEndAt,
    createdAt: new Date(),
    userId: session.user.id,
    isCumulative: false, // or true, depending on your logic
  };

  // All subjects with all grades
  const allSubjectsWithAllGrades = subjectsWithGrades.map((subject) => ({
    ...subject,
    grades: subject.grades,
  }));

  // Add the full-year period to the array
  periodsWithSubjects.push({
    period: fullYearPeriod,
    subjects: allSubjectsWithAllGrades,
  });

  // 5) Return the final result
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

    // if subjectId is null or empty, return all subjects
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

    // Fetch the single subject + its grades
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

    // Fetch periods for the user and sort them
    const userPeriods = await db.query.periods.findMany({
      where: eq(periods.userId, session.user.id),
      orderBy: asc(periods.startAt),
    });
    const sortedPeriods = [...userPeriods].sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

    // For each period, if isCumulative, gather all prior period IDs too
    const periodsWithGrades = sortedPeriods.map((p, index) => {
      const relevantPeriodIds = p.isCumulative
        ? sortedPeriods.slice(0, index + 1).map((p2) => p2.id)
        : [p.id];

      // Filter subject's own grades that match relevantPeriodIds
      const gradesInPeriod = subject.grades.filter((grade) =>
        relevantPeriodIds.includes(grade.periodId ?? "")
      );

      return {
        period: p,
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
      // Fetch all descendants of the subject using a simpler query
      const descendants = await db.query.subjects.findMany({
        where: and(
          eq(subjects.userId, session.user.id),
          eq(subjects.parentId, subjectId)  // Direct children only
        ),
      });

      // Update the depth of each descendant recursively
      const updateDescendantDepths = async (parentId: string, depthOffset: number) => {
        const children = await db.query.subjects.findMany({
          where: and(
            eq(subjects.userId, session.user.id),
            eq(subjects.parentId, parentId)
          ),
        });

        for (const child of children) {
          await db
            .update(subjects)
            .set({ depth: child.depth + depthOffset })
            .where(eq(subjects.id, child.id));

          // Recursively update children
          await updateDescendantDepths(child.id, depthOffset);
        }
      };

      await updateDescendantDepths(subjectId, depthDifference);
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
