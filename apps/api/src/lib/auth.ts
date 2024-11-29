import { db } from "@/db";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  appName: "Avermate",

  // Database
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),

  // Client URL
  trustedOrigins: [env.CLIENT_URL],

  // Session
  session: {
    // 7 days
    expiresIn: 7 * 24 * 60 * 60,
    // 1 day
    updateAge: 24 * 60 * 60,

    // fields: {
    //   expiresAt: "expires_at",
    //   ipAddress: "ip_address",
    //   userAgent: "user_agent",
    //   userId: "user_id",
    // },
  },

  // User
  user: {
    fields: {
      image: "avatarUrl",
      // updatedAt: "updated_at",
      // createdAt: "created_at",
      // emailVerified: "email_verified",
    },
  },

  // Account
  // account: {
  //   fields: {
  //     userId: "user_id",
  //     refreshToken: "refresh_token",
  //     accessToken: "access_token",
  //     idToken: "id_token",
  //     expiresAt: "expires_at",
  //     accountId: "account_id",
  //     providerId: "provider_id",
  //   },
  // },

  // Rate limiting 10 req each 10 minutes
  rateLimit: {
    window: 10 * 60,
    max: 10,
  },

  // Email / Password
  emailAndPassword: {
    enabled: true,

    password: {
      // Hash password using Argon2id
      async hash(password) {
        const hash = await Bun.password.hash(password, "argon2id");
        return hash;
      },

      // Verify password
      async verify(hash, password) {
        const isMatching = await Bun.password.verify(
          password,
          hash,
          "argon2id"
        );
        return isMatching;
      },
    },
  },

  // OAuth
  socialProviders: {
    // Google
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },

    // Microsoft
    microsoft: {
      enabled: true,
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
    },
  },

  // Cookie
  advanced: {
    cookiePrefix: "avermate",

    defaultCookieAttributes: {
      sameSite: "strict",
    },

    generateId: false,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
