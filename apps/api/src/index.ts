import { type Session, type User } from "@/lib/auth";
import { env } from "@/lib/env";
import authRoutes from "@/routes/auth";
import gradesRoutes from "@/routes/grades";
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

app.route("/auth", authRoutes);

app.route("/grades", gradesRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
