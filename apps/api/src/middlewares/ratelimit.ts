import { limitable } from "@/lib/limitable";
import type { Context, Next } from "hono";
import { getConnInfo } from "hono/bun";

const restrictedMethods = ["POST", "PATCH", "PUT", "DELETE"];

export async function ratelimit(c: Context, next: Next) {
  const info = getConnInfo(c);

  console.time("ratelimit");

  if (!info) {
    return await next();
  }

  const forwardedFor = c.req.header("x-forwarded-for");
  const identifier = forwardedFor || info.remote.address || "anon";

  const rule = restrictedMethods.includes(c.req.method)
    ? "restricted"
    : "default";

  const { isExceeded, remaining, limit, resetIn } = await limitable.verify(
    identifier,
    rule
  );

  // Set rate limit headers
  c.header("RateLimit-Limit", limit.toString());
  c.header("RateLimit-Remaining", remaining.toString());
  c.header("RateLimit-Reset", resetIn.toString());

  if (isExceeded)
    return c.json(
      {
        code: "ERR_RATE_LIMIT_EXCEEDED",
        message: "You're being rate limited!",
      },
      429
    );

  console.time("ratelimit");

  await next();
}
