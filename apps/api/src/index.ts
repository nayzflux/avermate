import { env } from "@/lib/env";
import authRoutes from "@/routes/auth";
import gradesRoutes from "@/routes/grades";
import subjectsRoutes from "@/routes/subjects";
import usersRoutes from "@/routes/users";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

// CORS
app.use(
  cors({
    origin: env.ORIGIN_URL,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

// Authentication
app.route("/auth", authRoutes);
// Users
app.route("/users", usersRoutes);
// Subjects
app.route("/subjects", subjectsRoutes);
// Grades
app.route("/grades", gradesRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
