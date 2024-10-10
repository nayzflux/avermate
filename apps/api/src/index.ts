import authRoutes from "@/routes/auth";
import { Hono } from "hono";

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);

export default app;
