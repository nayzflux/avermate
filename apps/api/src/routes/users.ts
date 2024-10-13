import { getSession } from "@/lib/auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

app.get("/me", async (c) => {
  const session = await getSession(c);
  if (!session) throw new HTTPException(401);

  return c.json({ user: session.user });
});

export default app;
