import { db } from "@/db";
import { type Session, type User } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq, sql } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { customAverages, subjects } from "@/db/schema";
import { inArray } from "drizzle-orm";


const app = new Hono<{
  Variables: {
    session: {
      user: User;
      session: Session;
    } | null;
  };
}>();

/**
 * Schema Definitions
 */
const createCustomAverageSchema = z.object({
  name: z.string().min(1).max(64),
  subjects: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        customCoefficient: z
          .number()
          .min(1)
          .max(1000)
          .optional()
          .nullable(),
        includeChildren: z.boolean().optional().default(true),
      })
    )
    .min(1),
  isMainAverage: z.boolean().optional().default(false),
});


/**
 * Create a New Custom Average
 */
app.post("/", zValidator("json", createCustomAverageSchema), async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  // Extract and rename subjects to avoid naming conflicts
  const { name, subjects: subjectArray, isMainAverage } = c.req.valid("json");
  const subjectIds = subjectArray.map((s) => s.id);

  // Validate subject ownership

const userSubjects = await db.query.subjects.findMany({
  where: and(
    eq(subjects.userId, session.user.id),
    inArray(subjects.id, subjectIds)
  ),
});


  console.log(userSubjects);
  console.log(subjectIds);

  if (userSubjects.length !== subjectIds.length) {
    return c.json(
      { code: "INVALID_SUBJECTS", message: "One or more subjects are invalid." },
      400
    );
  }

  // Insert new average
  const newAverage = await db
    .insert(customAverages)
    .values({
      name,
      subjects: JSON.stringify(subjectArray),
      userId: session.user.id,
      isMainAverage: isMainAverage || false,
      createdAt: new Date(),
    })
    .returning()
    .get();

  return c.json({ customAverage: newAverage }, 201);
});

/**
 * Retrieve All Custom Averages for the Authenticated User
 */
app.get("/", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);

  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const averages = await db.query.customAverages.findMany({
    where: eq(customAverages.userId, session.user.id),
    orderBy: [sql`${customAverages.createdAt} DESC`],
  });

  const parsedAverages = averages.map((avg) => ({
    ...avg,
    subjects: JSON.parse(avg.subjects),
  }));

  return c.json({ customAverages: parsedAverages });
});

/**
 * Retrieve a Specific Custom Average by ID
 */

const updateCustomAverageSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  subjects: z
    .array(
      z.object({
        id: z.string().min(1).max(64),
        customCoefficient: z
          .number()
          .min(1)
          .max(1000)
          .optional()
          .nullable(),
        includeChildren: z.boolean().optional().default(true),
      })
    )
    .optional(),
  isMainAverage: z.boolean().optional(),
});

const averageIdParamSchema = z.object({
  averageId: z.string().min(1).max(64),
});


app.get(
  "/:averageId",
  zValidator("param", averageIdParamSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) throw new HTTPException(401);

    if (!session.user.emailVerified) {
      return c.json(
        { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
        403
      );
    }

    const { averageId } = c.req.valid("param");
    const average = await db.query.customAverages.findFirst({
      where: and(
        eq(customAverages.id, averageId),
        eq(customAverages.userId, session.user.id)
      ),
    });

    if (!average) throw new HTTPException(404);

    return c.json({ customAverage: { ...average, subjects: JSON.parse(average.subjects) } });
  }
);

/**
 * Update an Existing Custom Average
 */
app.patch(
  "/:averageId",
  zValidator("param", averageIdParamSchema),
  zValidator("json", updateCustomAverageSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) throw new HTTPException(401);

    if (!session.user.emailVerified) {
      return c.json(
        { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
        403
      );
    }

    const { averageId } = c.req.valid("param");
    const updateData = c.req.valid("json");

    const existingAverage = await db.query.customAverages.findFirst({
      where: and(
        eq(customAverages.id, averageId),
        eq(customAverages.userId, session.user.id)
      ),
    });

    if (!existingAverage) throw new HTTPException(404);

    // If subjects are provided, validate that they belong to the user
    if (updateData.subjects) {
      const subjectArray = updateData.subjects;
      const subjectIds = subjectArray.map((s) => s.id);

      const userSubjects = await db.query.subjects.findMany({
        where: and(
          eq(subjects.userId, session.user.id),
          inArray(subjects.id, subjectIds)
        ),
      });

      if (userSubjects.length !== subjectIds.length) {
        return c.json(
          { code: "INVALID_SUBJECTS", message: "One or more subjects are invalid." },
          400
        );
      }

      // Normalize customCoefficient values
      updateData.subjects = subjectArray.map((subject) => ({
        ...subject,
        customCoefficient: subject.customCoefficient ?? null,
      }));
    }

    const updatedAverage = await db
      .update(customAverages)
      .set({
        ...updateData,
        subjects: updateData.subjects ? JSON.stringify(updateData.subjects) : undefined,
      })
      .where(
        and(
          eq(customAverages.id, averageId),
          eq(customAverages.userId, session.user.id)
        )
      )
      .returning()
      .get();

    return c.json({ customAverage: updatedAverage });
  }
);



/**
 * Delete a Custom Average
 */
app.delete(
  "/:averageId",
  zValidator("param", averageIdParamSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) throw new HTTPException(401);

    if (!session.user.emailVerified) {
      return c.json(
        { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
        403
      );
    }

    const { averageId } = c.req.valid("param");
    const deletedAverage = await db
      .delete(customAverages)
      .where(
        and(
          eq(customAverages.id, averageId),
          eq(customAverages.userId, session.user.id)
        )
      )
      .returning()
      .get();

    if (!deletedAverage) throw new HTTPException(404);

    return c.json({ customAverage: deletedAverage });
  }
);

export default app;