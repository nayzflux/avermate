import { db } from "@/db";
import { dataCardsLayouts, dataCards, customAverages } from "@/db/schema";
import { type Session, type User } from "@/lib/auth";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono<{
  Variables: {
    session: {
      user: User;
      session: Session;
    } | null;
  };
}>();

// Schema Definitions
const dataCardConfigSchema = z.object({
  title: z.string(),
  description: z.object({
    formatter: z.string(),
    params: z.any().optional(),
  }),
  mainData: z.object({
    calculator: z.string(),
    params: z.any().optional(),
  }),
  icon: z.string(),
});

const updateDataCardConfigSchema = z.object({
  title: z.string().optional(),
  description: z.object({
    formatter: z.string().optional(),
    params: z.any().optional(),
  }).optional(),
  mainData: z.object({
    calculator: z.string().optional(),
    params: z.any().optional(),
  }).optional(),
  icon: z.string().optional(),
});

const createDataCardSchema = z.object({
  identifier: z.string().min(1),
  config: dataCardConfigSchema,
});

const updateDataCardSchema = z.object({
  id: z.string(),
  type: z.enum(['built_in', 'custom']),
  identifier: z.string().min(1),
  config: updateDataCardConfigSchema,
});

const updateLayoutSchema = z.object({
  cards: z.array(z.object({
    cardId: z.string(),
    position: z.number()
  })),
});


// Routes
app.get("/", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const cards = await db.query.dataCards.findMany({
    where: eq(dataCards.userId, session.user.id),
  });

  return c.json({ cards });
});

app.post(
  "/",
  zValidator("json", createDataCardSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) throw new HTTPException(401);
    if (!session.user.emailVerified) {
      return c.json(
        { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
        403
      );
    }

    const data = c.req.valid("json");

    const card = await db
      .insert(dataCards)
      .values({
        ...data,
        config: JSON.stringify(data.config),
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();

    return c.json({ card }, 201);
  }
);

app.patch("/:id", zValidator("json", updateDataCardSchema), async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }
  const { id } = c.req.param();
  const data = c.req.valid("json");

  const card = await db
    .update(dataCards)
    .set({
      ...data,
      config: JSON.stringify(data.config),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(dataCards.id, id),
        eq(dataCards.userId, session.user.id)
      )
    )
    .returning()
    .get();

  return c.json({ card });
});

app.delete("/:id", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { id } = c.req.param();

  const card = await db
    .delete(dataCards)
    .where(
      and(
        eq(dataCards.id, id),
        eq(dataCards.userId, session.user.id)
      )
    )
    .returning()
    .get();

  return c.json({ card });
});

app.get("/layouts", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const layout = await db.query.dataCardsLayouts.findFirst({
    where: eq(dataCardsLayouts.userId, session.user.id)
  });

  return c.json({ layout });
});

app.patch(
  "/layouts",
  zValidator("json", updateLayoutSchema),
  async (c) => {
    const session = c.get("session");
    if (!session) throw new HTTPException(401);
    if (!session.user.emailVerified) {
      return c.json(
        { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
        403
      );
    }

    const data = c.req.valid("json");

    const layout = await db.update(dataCardsLayouts).set({
      updatedAt: new Date(),
      cards: JSON.stringify(data.cards),
    }).where(eq(dataCardsLayouts.userId, session.user.id))
      .returning()
      .get();
    
    if (layout) {
      const customAverageDataCards = await db.query.dataCards.findMany({
        where: eq(dataCards.userId, session.user.id)
      });

      // For each template, check if it's in the layout and update isMainAverage accordingly
      for (const dataCard of customAverageDataCards) {
        const config = JSON.parse(dataCard.config);
        if (config.mainData.calculator === 'customAverage') {
          const isInLayout = data.cards.some((card: any) => card.cardId === dataCard.id);
          const customAverageId = config.mainData.params.customAverageId;

          await db
            .update(customAverages)
            .set({
              isMainAverage: isInLayout,
            })
            .where(
              and(
                eq(customAverages.id, customAverageId),
                eq(customAverages.userId, session.user.id)
              )
            );
        }
      }
    }

    return c.json({ layout });
  }
);

export default app;