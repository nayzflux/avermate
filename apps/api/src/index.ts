import { env } from "@/lib/env";
import authRoutes from "@/routes/auth";
import usersRoutes from "@/routes/users";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

app.use(
  cors({
    origin: env.ORIGIN_URL,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
