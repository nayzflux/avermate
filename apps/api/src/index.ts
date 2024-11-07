import { env } from "@/lib/env";
import authRoutes from "@/routes/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().basePath("/api");

// CORS
app.use(
  cors({
    origin: env.CLIENT_URL,
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.route("/auth", authRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
