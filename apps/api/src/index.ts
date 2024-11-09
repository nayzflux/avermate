import { auth, type Session, type User } from "@/lib/auth";
import { env } from "@/lib/env";
import authRoutes from "@/routes/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>().basePath("/api");

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

// Session Middleware
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.route("/auth", authRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
