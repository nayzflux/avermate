import { db } from "@/db";
import { subjects } from "@/db/schema";
import { auth } from "@/lib/auth";
import { limitable } from "@/lib/limitable";
import { generateId } from "@/lib/nanoid";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getConnInfo } from "hono/bun";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const router = new Hono();

const presets: Preset[] = [
  {
    id: "CPE_PREPA_SUP_NUM",
    name: "Prépa CPE Sup Numérique",
    subjects: [
      {
        name: "Module Scientifique",
        isDisplaySubject: true,
        subjects: [
          {
            name: "Mathématiques",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Mathématiques - Écrit",
                coefficient: 7,
              },
              {
                name: "Mathématiques - Oral",
                coefficient: 3,
              },
            ],
          },
          {
            name: "Physique-Chimie",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Physique-Chimie - Écrit",
                coefficient: 7,
              },
              {
                name: "Physique-Chimie - Oral",
                coefficient: 3,
              },
              {
                name: "Physique-Chimie - TP",
                coefficient: 2,
              },
            ],
          },
          {
            name: "Sciences-Industrielles",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "SI - Écrit",
                coefficient: 4,
              },
              {
                name: "SI - Oral",
                coefficient: 1.5,
              },
              {
                name: "SI - TP",
                coefficient: 1.5,
              },
            ],
          },
          {
            name: "Informatique",
            isMainSubject: true,
            coefficient: 3,
          },
          /**
           * TIPE
           */
          {
            name: "TIPE",
            coefficient: 2,
          },
        ],
      },
      /**
       * Module Sciences Humaines
       */
      {
        name: "Module Sciences Humaines",
        isDisplaySubject: true,
        subjects: [
          /**
           * Français
           */
          {
            name: "Français",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Français - Écrit",
                coefficient: 6,
              },
              {
                name: "Français - Oral",
                coefficient: 3,
              },
            ],
          },
          /**
           * Anglais
           */
          {
            name: "Anglais",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Anglais - Écrit",
                coefficient: 5,
              },
              {
                name: "Anglais - Oral",
                coefficient: 2,
              },
            ],
          },
          /**
           * LV2
           */
          {
            name: "LV2",
            isMainSubject: true,
            coefficient: 3,
          },
          /**
           * TIPE Compétences Transversales
           */
          {
            name: "TIPE - Compétences Transversales",
            coefficient: 1,
          },
        ],
      },
    ],
  },
  /**
   * Prépa CPE Sup Chimie
   */
  {
    id: "CPE_PREPA_SUP_NUM",
    name: "Prépa CPE Sup Numérique",
    subjects: [
      {
        name: "Module Scientifique",
        isDisplaySubject: true,
        subjects: [
          {
            name: "Mathématiques",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Mathématiques - Écrit",
                coefficient: 7,
              },
              {
                name: "Mathématiques - Oral",
                coefficient: 3,
              },
            ],
          },
          {
            name: "Physique",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Physique - Écrit",
                coefficient: 6,
              },
              {
                name: "Physique - Oral",
                coefficient: 2,
              },
              {
                name: "Physique - TP",
                coefficient: 2,
              },
            ],
          },
          {
            name: "Chimie",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Chimie - Écrit",
                coefficient: 6,
              },
              {
                name: "Chimie - Oral",
                coefficient: 2,
              },
              {
                name: "Chimie - TP",
                coefficient: 2,
              },
            ],
          },
          {
            name: "Sciences-Industrielles",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "SI - Écrit",
                coefficient: 3,
              },
              {
                name: "SI - Oral",
                coefficient: 2,
              },
              {
                name: "SI - TP",
                coefficient: 2,
              },
            ],
          },
          {
            name: "Informatique",
            isMainSubject: true,
            coefficient: 3,
          },
          /**
           * TIPE
           */
          {
            name: "TIPE",
            coefficient: 2,
          },
        ],
      },
      /**
       * Module Sciences Humaines
       */
      {
        name: "Module Sciences Humaines",
        isDisplaySubject: true,
        subjects: [
          /**
           * Français
           */
          {
            name: "Français",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Français - Écrit",
                coefficient: 6,
              },
              {
                name: "Français - Oral",
                coefficient: 3,
              },
            ],
          },
          /**
           * Anglais
           */
          {
            name: "Anglais",
            isMainSubject: true,
            isDisplaySubject: true,
            subjects: [
              {
                name: "Anglais - Écrit",
                coefficient: 5,
              },
              {
                name: "Anglais - Oral",
                coefficient: 2,
              },
            ],
          },
          /**
           * LV2
           */
          {
            name: "LV2",
            isMainSubject: true,
            coefficient: 3,
          },
          /**
           * TIPE Compétences Transversales
           */
          {
            name: "TIPE - Compétences Transversales",
            coefficient: 1,
          },
        ],
      },
    ],
  },
];

type Preset = {
  id: string;
  name: string;
  subjects: PresetSubject[];
};

type PresetSubject = {
  name: string;
  isMainSubject?: boolean;
  isDisplaySubject?: boolean;
  coefficient?: number;
  subjects?: PresetSubject[];
};

/**
 * Get all presets
 */
router.get("/", async (c) => {
  return c.json({ presets });
});

/**
 * Use a preset
 */
router.post(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.enum(["CPE_PREPA_SUP_NUM"]),
    })
  ),
  async (c) => {
    const { id } = c.req.valid("param");

    const preset = presets.find((p) => p.id === id);

    if (!preset) throw new HTTPException(404);

    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) throw new HTTPException(401);

    // If email isnt verified
    if (!session.user.emailVerified) {
      return c.json(
        {
          code: "EMAIL_NOT_VERIFIED",
          message: "Email verification is required",
        },
        403
      );
    }

    const info = getConnInfo(c);

    const identifier = info.remote.address || "anon";

    const { isExceeded, remaining, limit, resetIn } = await limitable.verify(
      identifier,
      "preset"
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

    // Thx chat GPT
    const flattenSubjects = (
      subjects: PresetSubject[],
      parentId: string | null = null,
      depth: number = 0
    ): {
      id: string;
      name: string;
      parentId: string | null;
      coefficient: number;
      depth: number;
      isMainSubject: boolean;
      isDisplaySubject: boolean;
      createdAt: Date;
      userId: string;
    }[] => {
      return subjects.flatMap((subject) => {
        const id = generateId("sub");

        const flatSubject = {
          id,
          name: subject.name,
          coefficient: (subject?.coefficient || 1) * 100,
          isMainSubject: subject?.isMainSubject || false,
          isDisplaySubject: subject?.isDisplaySubject || false,
          parentId,
          createdAt: new Date(),
          depth,
          userId: session.user.id,
        };

        if (subject.subjects) {
          return [
            flatSubject,
            ...flattenSubjects(subject.subjects, id, depth + 1),
          ];
        }
        return flatSubject;
      });
    };

    const presetSubjects = flattenSubjects(preset.subjects);

    // Insert in database
    const insertedSubjects = await db
      .insert(subjects)
      .values(presetSubjects)
      .returning()
      .all();

    return c.json({ subjects: insertedSubjects }, 201);
  }
);

export default router;
