import { db } from "@/db";
import { cardTemplates, cardLayouts, customAverages } from "@/db/schema";
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
const cardConfigSchema = z.object({
  title: z.string(),
  description: z.object({
    template: z.string(),
    variables: z.record(z.object({
      type: z.enum(['static', 'dynamic', 'timeRange']),
      value: z.string(),
      options: z.any().optional(),
    })),
  }),
  mainData: z.object({
    type: z.enum(['grade', 'average', 'impact', 'text', 'custom']),
    calculator: z.string(),
    params: z.any().optional(),
  }),
  icon: z.string(),
});

const updateCardConfigSchema = z.object({
  title: z.string().optional(),
  description: z.object({
    template: z.string().optional(),
    variables: z.record(z.object({
      type: z.enum(['static', 'dynamic', 'timeRange']).optional(),
      value: z.string().optional(),
      options: z.any().optional(),
    })).optional(),
  }).optional(),
  mainData: z.object({
    type: z.enum(['grade', 'average', 'impact', 'text', 'custom']).optional(),
    calculator: z.string().optional(),
    params: z.any().optional(),
  }).optional(),
  icon: z.string().optional(),
});


const createTemplateSchema = z.object({
  type: z.enum(['built_in', 'custom']),
  identifier: z.string().min(1),
  config: cardConfigSchema,
});

const updateLayoutSchema = z.object({
  page: z.enum(['dashboard', 'grade', 'subject']),
  cards: z.array(z.object({
    templateId: z.string(),
    position: z.number(),
    customization: z.object({
      title: z.string().optional(),
      description: z.object({
        template: z.string(),
        variables: z.record(z.any()),
      }).optional(),
      mainData: z.object({
        params: z.record(z.any()),
      }).optional(),
    }).optional(),
  })),
});

const updateTemplateSchema = z.object({
  id: z.string(),
  type: z.enum(['built_in', 'custom']),
  identifier: z.string().min(1),
  config: updateCardConfigSchema,
});

// Routes
app.get("/templates", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const templates = await db.query.cardTemplates.findMany({
    where: eq(cardTemplates.userId, session.user.id),
  });

  return c.json({ templates });
});

app.post(
  "/templates",
  zValidator("json", createTemplateSchema),
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

    const template = await db
      .insert(cardTemplates)
      .values({
        ...data,
        config: JSON.stringify(data.config),
        userId: session.user.id,
        createdAt: new Date(),
      })
      .returning()
      .get();

    return c.json({ template }, 201);
  }
);

app.get("/layouts/:page", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { page } = c.req.param();

  const layout = await db.query.cardLayouts.findFirst({
    where: and(
      eq(cardLayouts.userId, session.user.id),
      eq(cardLayouts.page, page)
    ),
  });

  return c.json({ layout });
});

app.put(
  "/layouts/:page",
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

    const { page } = c.req.param();
    const data = c.req.valid("json");

    // Delete existing layout
    await db
      .delete(cardLayouts)
      .where(
        and(
          eq(cardLayouts.userId, session.user.id),
          eq(cardLayouts.page, page)
        )
      );

    // Create new layout
    const layout = await db
      .insert(cardLayouts)
      .values({
        userId: session.user.id,
        page,
        cards: JSON.stringify(data.cards),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()
      .get();

    // If this is the dashboard layout, sync isMainAverage field for custom averages
    if (page === 'dashboard') {
      // Get all custom average card templates
      const customAverageTemplates = await db.query.cardTemplates.findMany({
        where: and(
          eq(cardTemplates.userId, session.user.id),
          eq(cardTemplates.type, 'custom')
        ),
      });

      // For each template, check if it's in the layout and update isMainAverage accordingly
      for (const template of customAverageTemplates) {
        const config = JSON.parse(template.config);
        if (config.mainData.calculator === 'customAverage') {
          const isInLayout = data.cards.some((card: any) => card.templateId === template.id);
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

app.delete("/templates/:id", async (c) => {
  const session = c.get("session");
  if (!session) throw new HTTPException(401);
  if (!session.user.emailVerified) {
    return c.json(
      { code: "EMAIL_NOT_VERIFIED", message: "Email verification is required" },
      403
    );
  }

  const { id } = c.req.param();

  const template = await db
    .delete(cardTemplates)
    .where(
      and(
        eq(cardTemplates.id, id),
        eq(cardTemplates.userId, session.user.id),
        eq(cardTemplates.type, "custom")
      )
    )
    .returning()
    .get();

  return c.json({ template });
});

app.patch("/templates/:id", zValidator("json", updateTemplateSchema), async (c) => {
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

  console.log(data);

  const template = await db
    .update(cardTemplates)
    .set({
      ...data,
      config: JSON.stringify(data.config),
    })
    .where(
      and(
        eq(cardTemplates.id, id),
        eq(cardTemplates.userId, session.user.id)
      )
    )
    .returning()
    .get();

  return c.json({ template });
});

export default app;