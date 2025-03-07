import { db } from "@/db";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { dataCards, dataCardsLayouts } from "@/db/schema";
import { customAlphabet } from "nanoid";
import { eq, and } from "drizzle-orm";

// Exemple de petite fonction pour générer un ID custom
const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(ALPHABET, 12);

function generateId(prefix: "dc" | "dcl") {
  return `${prefix}_${nanoid()}`;
}

// Cartes par défaut (best-grade, etc.)
const DEFAULT_BUILTIN_CARDS = [
  {
    identifier: "best-grade",
    config: `{"title":"Best Grade","description":{"formatter":"bestGrade","params":{}},"mainData":{"calculator":"bestGrade","params":{}},"icon":"StarIcon"}`
  },
  {
    identifier: "best-subject",
    config: `{"title":"Best Subject","description":{"formatter":"bestSubject","params":{}},"mainData":{"calculator":"bestSubject","params":{}},"icon":"TrophyIcon"}`
  },
  {
    identifier: "global-average",
    config: `{"title":"Global Average","description":{"formatter":"globalAverage","params":{}},"mainData":{"calculator":"globalAverage","params":{}},"icon":"CalculatorIcon"}`
  },
  {
    identifier: "worst-grade",
    config: `{"title":"Worst Grade","description":{"formatter":"worstGrade","params":{}},"mainData":{"calculator":"worstGrade","params":{}},"icon":"XCircleIcon"}`
  },
  {
    identifier: "worst-subject",
    config: `{"title":"Worst Subject","description":{"formatter":"worstSubject","params":{}},"mainData":{"calculator":"worstSubject","params":{}},"icon":"ExclamationTriangleIcon"}`
  },
];


export const auth = betterAuth({
  appName: "Avermate",

  // Database
  database: drizzleAdapter(db, {
    provider: "sqlite",
    usePlural: true,
  }),

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Vérifie si on est bien dans le processus de sign-up
      if (ctx.path.startsWith("/sign-up")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const { user } = newSession;

          // =============================
          // 1) Insérer les cartes par défaut
          // =============================
          const createdAt = Math.floor(Date.now() / 1000);
          const updatedAt = createdAt;

          const insertedCardIds: string[] = [];

          for (const cardInfo of DEFAULT_BUILTIN_CARDS) {
            // On n'envoie PAS 'id' --> la DB le génère via $defaultFn(...)
            await db.insert(dataCards).values({
              identifier: cardInfo.identifier,
              config: cardInfo.config,
              userId: user.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            // Sur SQLite, on ne peut pas faire .returning(...) simplement ;
            // on refait donc un SELECT pour retrouver l'ID fraîchement créé
            // => on se base sur (userId + identifier) pour l'identifier.
            const [row] = await db
              .select({ id: dataCards.id })
              .from(dataCards)
              .where(
                and(
                  eq(dataCards.userId, user.id),
                  eq(dataCards.identifier, cardInfo.identifier)
                )
              )
              // On trie pour prendre la plus récente (au cas où double insert)
              // et on ne récupère qu'une ligne
              // .orderBy(desc(dataCards.createdAt)) // (optionnel)
              .limit(1);

            if (row) {
              insertedCardIds.push(row.id);
            }
          }

          // =============================
          // 2) Créer le layout par défaut
          // =============================
          // Positions [0..4] pour nos 5 cartes
          const defaultLayoutCards = insertedCardIds.map((cardId, index) => ({
            cardId,
            position: index,
          }));

          // Ici aussi, on n'envoie PAS 'id' => la DB le génère
          await db.insert(dataCardsLayouts).values({
            userId: user.id,
            cards: JSON.stringify(defaultLayoutCards),
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          // Optionnel : si tu veux relire l'ID du layout nouvellement créé,
          // tu peux faire un SELECT similaire, en te basant sur userId + 'cards' ?
          // ou sur createdAt. C'est à toi de voir si tu en as besoin.
        }
      }
    }),
  },

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
      // If already verified, don't send email
      if (user.emailVerified) return;

      const currentYear = new Date().getFullYear();
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vérifiez Votre Adresse E-mail</title>
      </head>
      <body style="margin:0; padding:0; background-color:#F3F4F6; font-family:sans-serif; color:#333333;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" style="max-width:600px; background:#FFFFFF; border-radius:8px; overflow:hidden; margin:0 20px;">
                <!-- Logo & Header -->
                <tr>
                  <td style="padding:24px; text-align:left;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <img
                            src="https://avermate.fr/icon512_maskable.png"
                            alt="Logo Avermate"
                            width="40"
                            style="display:block; border-radius:5px;"
                          />
                        </td>
                        <td style="vertical-align:middle; padding-left:8px;">
                          <p style="margin:0; font-size:16px; color:#333333; font-weight: bold;">Avermate</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Title Row -->
                <tr>
                  <td style="padding:0 24px; text-align:center;">
                    <h1 style="margin:0; font-size:24px; color:#333333;">Vérifiez Votre Adresse E-mail</h1>
                  </td>
                </tr>

                <!-- Body Content -->
                <tr>
                  <td style="padding:24px; text-align:center;">
                    <p style="color:#555555; font-size:16px; line-height:1.5; margin-bottom:24px;">
                      Bonjour <strong>${user.name}</strong>,
                      <br /><br />
                      Merci de vous être inscrit(e) sur Avermate ! Veuillez confirmer votre adresse e-mail 
                      en cliquant sur le bouton ci-dessous. Ce lien expirera dans 24 heures.
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" bgcolor="#18181b" style="border-radius:4px;">
                          <a 
                            href="${url}" 
                            target="_blank" 
                            style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:12px 24px; display:inline-block; border-radius:4px;"
                          >
                            Vérifier l&apos;adresse e-mail
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:16px;">
                    <p style="margin:0; color:#999999; font-size:12px;">
                      &copy; ${currentYear} Avermate. Tous droits réservés.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

      await resend.emails.send({
        from: `Avermate <${env.EMAIL_FROM}>`,
        to: user.email,
        subject: "Vérifiez votre adresse e-mail",
        html: htmlContent,
      });
    },
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  // User
  user: {
    deleteUser: {
      enabled: true,
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        const currentYear = new Date().getFullYear();
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Changement d'Adresse E-mail</title>
        </head>
        <body style="margin:0; padding:0; background-color:#F3F4F6; font-family:sans-serif; color:#333333;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" style="max-width:600px; background:#FFFFFF; border-radius:8px; overflow:hidden; margin:0 20px;">
                  <!-- Logo & Header -->
                  <tr>
                    <td style="padding:24px; text-align:left;">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="vertical-align:middle;">
                            <img
                              src="https://avermate.fr/icon512_maskable.png"
                              alt="Logo Avermate"
                              width="40"
                              style="display:block; border-radius:5px;"
                            />
                          </td>
                          <td style="vertical-align:middle; padding-left:8px;">
                            <p style="margin:0; font-size:16px; color:#333333; font-weight: bold;">Avermate</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Title Row -->
                  <tr>
                    <td style="padding:0 24px; text-align:center;">
                      <h1 style="margin:0; font-size:24px; color:#333333;">Adresse E-mail Mise à Jour</h1>
                    </td>
                  </tr>

                  <!-- Body Content -->
                  <tr>
                    <td style="padding:24px; text-align:center;">
                      <p style="color:#555555; font-size:16px; line-height:1.5; margin-bottom:24px;">
                        Bonjour <strong>${user.name}</strong>,
                        <br /><br />
                        Votre adresse e-mail a été mise à jour et est maintenant <strong>${newEmail}</strong>. 
                        Veuillez vérifier cette nouvelle adresse en cliquant sur le bouton ci-dessous.
                      </p>
                      <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                        <tr>
                          <td align="center" bgcolor="#18181b" style="border-radius:4px;">
                            <a 
                              href="${url}" 
                              target="_blank" 
                              style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:12px 24px; display:inline-block; border-radius:4px;"
                            >
                              Vérifier la nouvelle adresse
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="font-size:14px; color:#999999; margin-top:24px; line-height:1.4;">
                        Si vous n&apos;êtes pas à l&apos;origine de ce changement, veuillez contacter le support immédiatement.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td align="center" style="padding:16px; font-family:sans-serif; font-size:12px; color:#999999;">
                      &copy; ${currentYear} Avermate. Tous droits réservés.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `;

        await resend.emails.send({
          from: `Avermate <${env.EMAIL_FROM}>`,
          to: newEmail,
          subject: "Mise à jour de votre adresse e-mail",
          html: htmlContent,
        });
      },
    },

    fields: {
      image: "avatarUrl",
    },
  },

  // Rate limiting example (commented out)
  // rateLimit: {
  //   window: 10 * 60,
  //   max: 10,
  // },

  // Email / Password
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,

    // Password reset
    sendResetPassword: async ({ user, url }) => {
      const currentYear = new Date().getFullYear();
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Réinitialiser Votre Mot de Passe</title>
      </head>
      <body style="margin:0; padding:0; background-color:#F3F4F6; font-family:sans-serif; color:#333333;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#F3F4F6; padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" style="max-width:600px; background:#FFFFFF; border-radius:8px; overflow:hidden; margin:0 20px;">
                <!-- Logo & Header -->
                <tr>
                  <td style="padding:24px; text-align:left;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <img
                            src="https://avermate.fr/icon512_maskable.png"
                            alt="Logo Avermate"
                            width="40"
                            style="display:block; border-radius:5px;"
                          />
                        </td>
                        <td style="vertical-align:middle; padding-left:8px;">
                          <p style="margin:0; font-size:16px; color:#333333; font-weight: bold;">Avermate</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Title Row -->
                <tr>
                  <td style="padding:0 24px; text-align:center;">
                    <h1 style="margin:0; font-size:24px; color:#333333;">Réinitialiser Votre Mot de Passe</h1>
                  </td>
                </tr>

                <!-- Body Content -->
                <tr>
                  <td style="padding:24px; text-align:center;">
                    <p style="color:#555555; font-size:16px; line-height:1.5; margin-bottom:24px;">
                      Bonjour <strong>${user.name}</strong>,
                      <br /><br />
                      Nous avons reçu une demande de réinitialisation de votre mot de passe Avermate. 
                      Cliquez sur le bouton ci-dessous pour continuer. Ce lien expirera dans 24 heures.
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                      <tr>
                        <td align="center" bgcolor="#18181b" style="border-radius:4px;">
                          <a 
                            href="${url}" 
                            target="_blank" 
                            style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:12px 24px; display:inline-block; border-radius:4px;"
                          >
                            Réinitialiser le mot de passe
                          </a>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size:14px; color:#999999; margin-top:24px; line-height:1.4;">
                      Si vous n&apos;êtes pas à l&apos;origine de cette demande, veuillez ignorer cet e-mail.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td align="center" style="padding:16px; font-family:sans-serif; font-size:12px; color:#999999;">
                    &copy; ${currentYear} Avermate. Tous droits réservés.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
      `;

      await resend.emails.send({
        from: `Avermate <${env.EMAIL_FROM}>`,
        to: user.email,
        subject: "Réinitialisez votre mot de passe",
        html: htmlContent,
      });
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
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      prompt: "consent",
    },

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
