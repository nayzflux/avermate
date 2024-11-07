import { auth } from "@/lib/auth";
import { Hono } from "hono";

const app = new Hono();

app.get("/*", (c) => auth.handler(c.req.raw));
app.post("/*", (c) => auth.handler(c.req.raw));

export default app;
