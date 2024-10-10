import { Hono } from "hono";
import { Google } from "arctic";

const google = new Google(clientId, clientSecret, redirectURI);

const app = new Hono();

app.post("/")

export default app;