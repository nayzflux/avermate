import { type Session, type User } from "@/lib/auth";
import { env } from "@/lib/env";
import authRoutes from "@/routes/auth";
import gradesRoutes from "@/routes/grades";
import periodsRoutes from "@/routes/periods";
import presetsRoutes from "@/routes/presets";
import subjectsRoutes from "@/routes/subjects";
import usersRoutes from "@/routes/users";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { ratelimit } from "@/middlewares/ratelimit";

const app = new Hono<{
  Variables: {
    user: User | null;
    session: Session | null;
  };
}>().basePath("/api");

// Ratelimit
app.use(ratelimit);

// Logger
app.use(logger());

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

app.route("/subjects", subjectsRoutes);

app.route("/periods", periodsRoutes);

app.route("/users", usersRoutes);

app.route("/presets", presetsRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
