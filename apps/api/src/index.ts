import authRoutes from "@/routes/auth";
import usersRoutes from "@/routes/users";
import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);
app.route("/users", usersRoutes);

export default {
  fetch: app.fetch,
  port: 5000,
};
