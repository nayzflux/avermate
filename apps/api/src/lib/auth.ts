import { db } from "@/db";
import { env } from "@/lib/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { resend } from "./resend";

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

  emailVerification: {
    sendOnSignUp: true,

    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      console.info("Sending email verification to", user.id);

      await resend.emails.send({
        from: "Avermate <noreply@test.nayz.fr>",
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hello ${user.name}! Click <a href="${url}&callbackUrl=${env.CLIENT_URL}/dashboard">here</a> to verify your email.</p>`,
      });
    },
  },

  // User
  user: {
    changeEmail: {
      enabled: true,

      // TODO: Implement email verification
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        console.info("Sending email update request to", user.id);

        await resend.emails.send({
          from: "Avermate <noreply@test.nayz.fr>",
          to: newEmail,
          subject: "Email update",
          html: `<p>Hello ${user.name}! Your email has been updated. Click <a href="${url}">here</a> to verify your new email. ${url}</p>`,
        });
      },
    },

    fields: {
      image: "avatarUrl",
      // updatedAt: "updated_at",
      // createdAt: "created_at",
      // emailVerified: "email_verified",
    },

    // SEE: https://github.com/better-auth/better-auth/issues/371
    // additionalFields: {
    //   firstName: {
    //     type: "string",
    //     required: true,
    //   },
    //   lastName: {
    //     type: "string",
    //     required: true,
    //   },
    //   jobTitle: {
    //     type: "string",
    //     required: true,
    //   },
    //   isCPEAccount: {
    //     type: "boolean",
    //     required: true,
    //   }

    // },
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

    autoSignIn: true,

    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Password reset
    sendResetPassword: async ({ user, url }) => {
      console.info("Sending password reset to", user.id);

      await resend.emails.send({
        from: "Avermate <noreply@test.nayz.fr>",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Hello ${user.name}! Click <a href="${url}">here</a> to reset your password. ${url}</p>`,
      });
    },

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

    generateId: false,
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
