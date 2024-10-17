import { db } from "@/db";
import { users } from "@/db/schemas/users";
import { createSession, generateSessionToken, setSession } from "@/lib/auth";
import { createUser } from "@/services/auth";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
// import { Google } from "arctic";

// const google = new Google(clientId, clientSecret, redirectURI);

const app = new Hono();

/**
 * Sign Up
 */
const signUpSchema = z.object({
  email: z.string().email().min(1).max(320),
  firstName: z.string().min(1).max(32),
  lastName: z.string().min(1).max(32),
  password: z.string().min(8).max(2048),
});

app.post("/sign-up", zValidator("json", signUpSchema), async (c) => {
  const { email, firstName, lastName, password } = c.req.valid("json");

  try {
    // Hash password
    const hash = await Bun.password.hash(password, "argon2id");

    // Create user
    const user = await createUser({
      email,
      firstName,
      lastName,
      password: hash,
    });

    // Create session
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    setSession(c, sessionToken, session.expiresAt);

    return c.json({ user }, 201);
  } catch (e) {
    // TODO: Error handling
    console.log(e);
    throw new HTTPException(500);
  }
});

/**
 * Sign In
 */
const signInSchema = z.object({
  email: z.string().email().min(1).max(320),
  password: z.string().min(8).max(2048),
});

app.post("/sign-in", zValidator("json", signInSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  // Get user
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) throw new HTTPException(403);
  if (!user.password) throw new HTTPException(403);

  // Verify password
  if (!(await Bun.password.verify(password, user.password)))
    throw new HTTPException(403);

  // Create session
  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  setSession(c, sessionToken, session.expiresAt);

  return c.json(
    {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
      },
    },
    200
  );
});

export default app;
