import { auth, type Session, type User } from "@/lib/auth";
import { createMiddleware } from "hono/factory";

export const sessionMiddleware = createMiddleware<{
  Variables: {
    session: {
      user: User;
      session: Session;
    } | null;
  };
}>(async (c, next) => {
  const headers = c.req.raw.headers;

  // Get user session
  const session = await auth.api.getSession({
    headers,
  });

  if (!session) {
    c.set("session", null);

    await next();

    return;
  }

  c.set("session", session);

  console.log(
    `${new Date().toISOString()} - ${c.req.method} ${c.req.path} : Logged as ${
      session.user.id
    }`
  );

  await next();
});
