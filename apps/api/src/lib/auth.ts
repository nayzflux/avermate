import { db } from "@/db";
import { sessions } from "@/db/schemas/sessions";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const SESSION_EXPIRES_IN = 30 * 60 * 60 * 24 * 1000;

const SESSION_COOKIE = "session";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = Buffer.from(bytes).toString("hex");
  return token;
}

export async function createSession(token: string, userId: string) {
  const sessionId = Bun.SHA256.hash(token).toString();

  const session = await db
    .insert(sessions)
    .values({
      id: sessionId,
      userId: userId,
      expiresAt: new Date(Date.now() + SESSION_EXPIRES_IN),
    })
    .returning()
    .get();

  return session;
}

export async function validateSessionToken(token: string) {
  // Hash token
  const sessionId = Bun.SHA256.hash(token).toString();

  // Get session from db
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: {
      user: {
        columns: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          password: false,
        },
      },
    },
  });

  // If session not found
  if (!session) return null;

  // If session expired
  if (Date.now() >= session.expiresAt.getTime()) {
    // Delete the session
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return null;
  }

  // If session expires in less than 15 days
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    // Update session expires at
    await db
      .update(sessions)
      .set({
        expiresAt: new Date(Date.now() + SESSION_EXPIRES_IN),
      })
      .where(eq(sessions.id, session.id));
  }

  return session;
}

export async function invalidateSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSession(c: Context, token: string, expiresAt: Date) {
  setCookie(c, SESSION_COOKIE, token, {
    sameSite: "strict",
    httpOnly: true,
    path: "/",
    secure: Bun.env.NODE_ENV === "development" ? false : true,
    expires: expiresAt,
  });
}

export function getSession(c: Context) {
  const sessionToken = getCookie(c, SESSION_COOKIE);

  if (!sessionToken) return null;

  return validateSessionToken(sessionToken);
}
