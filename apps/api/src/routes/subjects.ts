import { db } from "@/db";
import { users } from "@/db/schemas/users";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

/**
 * Get all users subjects
 */
app.get("/subjects", async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  const subjects = await db.query.subjects.findMany({
    where: eq(users.id, session.userId),
  });

  
});

export default app;
