import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const router = new Hono();

const presets = [
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
] satisfies {
  id: string;
  name: string;
  subjects: PresetSubject[];
}[];

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
  async (c) => {}
);

export default router;
