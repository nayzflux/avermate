import { db } from "@/db";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
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
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      // If already verified dont send email
      if (user.emailVerified) {
        return;
      }

      await resend.emails.send({
        from: `Avermate <${env.EMAIL_FROM}>`,
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hello ${user.name}! Click <a href="${url}">here</a> to verify your email.</p>`,
      });

      // console.log("Email verification link:", url, user.email);
    },
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  // User
  user: {
    changeEmail: {
      enabled: true,

      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        await resend.emails.send({
          from: `Avermate <${env.EMAIL_FROM}>`,
          to: newEmail,
          subject: "Email update",
          html: `<p>Hello ${user.name}! Your email has been updated. Click <a href="${url}">here</a> to verify your new email. ${url}</p>`,
        });

        // console.log(
        //   "Update email verification link:",
        //   url,
        //   user.email,
        //   newEmail
        // );
      },
    },

    fields: {
      image: "avatarUrl",
    },
  },

  // Rate limiting 10 req each 10 minutes
  rateLimit: {
    window: 10 * 60,
    max: 10,
  },

  // Email / Password
  emailAndPassword: {
    enabled: true,

    autoSignIn: true,

    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Password reset
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: `Avermate <${env.EMAIL_FROM}>`,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Hello ${user.name}! Click <a href="${url}">here</a> to reset your password. ${url}</p>`,
      });

      // console.log("Reset password link:", url, user.email);
    },

    password: {
      // Hash password using Argon2id
      async hash(password) {
        const hash = await Bun.password.hash(password, "argon2id");
        return hash;
      },

      // Verify password
      async verify({ hash, password }) {
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

    generateId: false,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
