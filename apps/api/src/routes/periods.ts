import { db } from "@/db";
import { periods } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono();

/**
 * Create a new period
 */

const createPeriodSchema = z.object({
  name: z.string().min(1).max(64),
  startAt: z.coerce.date().optional().default(new Date()),
    endAt: z.coerce.date().optional().default(new Date()),
});

app.post("/", zValidator("json", createPeriodSchema), async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) throw new HTTPException(401);

  const { name, startAt, endAt } = c.req.valid("json");

  if (startAt > endAt) {
    throw new HTTPException(400);
  }

  const period = await db
    .insert(periods)
    .values({
      name,
      startAt: new Date(startAt.getTime()), // Correction ici
      endAt: new Date(endAt.getTime()),     // Correction ici
      userId: session.user.id,
      createdAt: new Date(), // Ajout d'un timestamp pour la création
    })
    .returning()
    .get();

  return c.json(period);
});


/**
 * Get all periods
 */
app.get("/", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) throw new HTTPException(401);

  const period = await db.query.periods.findMany({
      where: eq(periods.userId, session.user.id),
    orderBy: desc(periods.startAt),
  });

    return c.json(period);
});

/**
 * Update a period by id
*/

const getPeriodSchema = z.object({
  periodId: z.string().min(1).max(64),
});

const updatePeriodSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  startAt: z.coerce.date().optional(),
  endAt: z.coerce.date().optional(),
});

app.put("/:periodId", zValidator("param", getPeriodSchema), zValidator("json", updatePeriodSchema), async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) throw new HTTPException(401);

  const { periodId } = c.req.valid("param");
  const { name, startAt, endAt } = c.req.valid("json");

  const period = await db
    .update(periods)
      .set({
        name,
        startAt: startAt ? new Date(startAt.getTime()) : undefined,
        endAt: endAt ? new Date(endAt.getTime()) : undefined,
    })
    .where(and(eq(periods.id, periodId), eq(periods.userId, session.user.id)))
    .returning()
    .get();

  if (!period) throw new HTTPException(404);

  return c.json(period);
});

/**
 * Delete a period by id
 */

const deletePeriodSchema = z.object({
    periodId: z.string().min(1).max(64),
});

app.delete("/:periodId", zValidator("param", deletePeriodSchema), async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) throw new HTTPException(401);

  const { periodId } = c.req.valid("param");

  const period = await db
    .delete(periods)
    .where(
      and(eq(periods.id, periodId), eq(periods.userId, session.user.id))
    )
    .returning()
    .get();

  return c.json(period);
});

export default app;