import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono();

const deleteUserParams = z.object({
  id: z.string().min(1).max(64),
});

app.delete("/:id", zValidator("param", deleteUserParams), async (c) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) throw new HTTPException(401);

  const { id } = c.req.valid("param");

  if (session.user.id !== id) throw new HTTPException(403);

  const user = await db
    .delete(users)
    .where(eq(users.id, session.user.id))
    .returning()
    .get();

  return c.json({ user });
});

export default app;