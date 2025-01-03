import { Subject } from "@/types/subject";
import { startOfDay } from "date-fns";

export const getRandomDate = () => {
  const start = new Date(new Date().getFullYear(), 8, 1);
  const end = new Date(new Date().getFullYear() + 1, 5, 30);

  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  const normalizedDate = startOfDay(date);

  return normalizedDate.toISOString();
};

export const subjects = [
  {
    id: "sub_8ohpsrxv83id",
    name: "Module Scientifique",
    parentId: null,
    coefficient: 100,
    depth: 0,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [],
  },
  // {
  //   id: "sub_rjuwme7h99qy",
  //   name: "Module Littéraire",
  //   parentId: null,
  //   coefficient: 100,
  //   depth: 0,
  //   isMainSubject: false,
  //   isDisplaySubject: false,
  //   createdAt: new Date(),
  //   userId: "u_8d9m6qgq2xf5",
  //   grades: [],
  // },
  {
    id: "sub_ll8ou2dywa65",
    name: "Mathématiques",
    parentId: "sub_8ohpsrxv83id",
    coefficient: 100,
    depth: 1,
    isMainSubject: true,
    isDisplaySubject: true,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [],
  },
  {
    id: "sub_62sj3aw31h0c",
    name: "Physique-Chimie",
    parentId: "sub_8ohpsrxv83id",
    coefficient: 100,
    depth: 1,
    isMainSubject: true,
    isDisplaySubject: true,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [],
  },
  // {
  //   id: "sub_pzwiu4k2718l",
  //   name: "Sciences Industrielles",
  //   parentId: "sub_8ohpsrxv83id",
  //   coefficient: 100,
  //   depth: 1,
  //   isMainSubject: true,
  //   isDisplaySubject: true,
  //   createdAt: new Date(),
  //   userId: "u_8d9m6qgq2xf5",
  //   grades: [],
  // },
  {
    id: "sub_9dp4yngnpw5w",
    name: "Informatique",
    parentId: "sub_8ohpsrxv83id",
    coefficient: 300,
    depth: 1,
    isMainSubject: true,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      // {
      //   id: "grade_2",
      //   value: 15.5,
      //   outOf: 2000,
      //   coefficient: 200,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      {
        id: "grade_3",
        value: 1750,
        outOf: 2000,
        coefficient: 100,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_u3aiif2dnei4",
    name: "Français",
    parentId: "sub_rjuwme7h99qy",
    coefficient: 100,
    depth: 1,
    isMainSubject: true,
    isDisplaySubject: true,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [],
  },
  {
    id: "sub_916vdwzsayzu",
    name: "Anglais",
    parentId: "sub_rjuwme7h99qy",
    coefficient: 100,
    depth: 1,
    isMainSubject: true,
    isDisplaySubject: true,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [],
  },
  {
    id: "sub_5ibjf9qojvew",
    name: "LV2",
    parentId: "sub_rjuwme7h99qy",
    coefficient: 300,
    depth: 1,
    isMainSubject: true,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_2",
        value: 1125,
        outOf: 2000,
        coefficient: 100,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_svvlt6lvrdpx",
    name: "Mathématiques - Écrits",
    parentId: "sub_ll8ou2dywa65",
    coefficient: 700,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      // {
      //   id: "grade_1",
      //   value: 1200,
      //   outOf: 2000,
      //   coefficient: 300,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      // {
      //   id: "grade_2",
      //   value: 1350,
      //   outOf: 2000,
      //   coefficient: 200,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      // {
      //   id: "grade_4",
      //   value: 1425,
      //   outOf: 2000,
      //   coefficient: 200,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      {
        id: "grade_3",
        value: 1375,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_isti1ufqtpmo",
    name: "Mathématiques - Oraux",
    parentId: "sub_ll8ou2dywa65",
    coefficient: 300,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      // {
      //   id: "grade_1",
      //   value: 1500,
      //   outOf: 2000,
      //   coefficient: 100,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      {
        id: "grade_2",
        value: 1350,
        outOf: 2000,
        coefficient: 100,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_3",
        value: 1700,
        outOf: 2000,
        coefficient: 100,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_pnggy6vg5032",
    name: "Physique-Chimie - Ecrits",
    parentId: "sub_62sj3aw31h0c",
    coefficient: 700,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_1",
        value: 1200,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_2",
        value: 1350,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      // {
      //   id: "grade_3",
      //   value: 1500,
      //   outOf: 2000,
      //   coefficient: 300,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
    ],
  },
  {
    id: "sub_223affrwy8p5",
    name: "Physique-Chimie - Oraux",
    parentId: "sub_62sj3aw31h0c",
    coefficient: 300,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      // {
      //   id: "grade_1",
      //   value: 1200,
      //   outOf: 2000,
      //   coefficient: 300,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      // {
      //   id: "grade_2",
      //   value: 1350,
      //   outOf: 2000,
      //   coefficient: 300,
      //   periodId: "full-year",
      //   createdAt: getRandomDate(),
      //   passedAt: getRandomDate(),
      //   subjectId: "sub_u3aiif2dnei4",
      //   userId: "u_8d9m6qgq2xf5",
      //   name: "",
      // },
      {
        id: "grade_3",
        value: 1500,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_1xfo6f7wuh95",
    name: "Physique-Chimie - TP",
    parentId: "sub_62sj3aw31h0c",
    coefficient: 200,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_1",
        value: 1200,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_2",
        value: 1350,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_3",
        value: 1500,
        outOf: 2000,
        coefficient: 300,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  // {
  //   id: "sub_mtvyesk7yteg",
  //   name: "Sciences Industrielles - Ecrits",
  //   parentId: "sub_pzwiu4k2718l",
  //   coefficient: 400,
  //   depth: 2,
  //   isMainSubject: false,
  //   isDisplaySubject: false,
  //   createdAt: new Date(),
  //   userId: "u_8d9m6qgq2xf5",
  //   grades: [
  //     {
  //       id: "grade_1",
  //       value: 1200,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //     {
  //       id: "grade_2",
  //       value: 1350,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //     {
  //       id: "grade_3",
  //       value: 1500,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //   ],
  // },
  // {
  //   id: "sub_0uwoltd3hne5",
  //   name: "Sciences Industrielles - Oraux",
  //   parentId: "sub_pzwiu4k2718l",
  //   coefficient: 150,
  //   depth: 2,
  //   isMainSubject: false,
  //   isDisplaySubject: false,
  //   createdAt: new Date(),
  //   userId: "u_8d9m6qgq2xf5",
  //   grades: [
  //     {
  //       id: "grade_1",
  //       value: 1200,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //     {
  //       id: "grade_2",
  //       value: 1350,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //     {
  //       id: "grade_3",
  //       value: 1500,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //   ],
  // },
  // {
  //   id: "sub_u9om0ojs2q0l",
  //   name: "Sciences Industrielles - TP",
  //   parentId: "sub_pzwiu4k2718l",
  //   coefficient: 150,
  //   depth: 2,
  //   isMainSubject: false,
  //   isDisplaySubject: false,
  //   createdAt: new Date(),
  //   userId: "u_8d9m6qgq2xf5",
  //   grades: [
  //     {
  //       id: "grade_1",
  //       value: 1200,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //     {
  //       id: "grade_3",
  //       value: 1500,
  //       outOf: 2000,
  //       coefficient: 300,
  //       periodId: "full-year",
  //       createdAt: getRandomDate(),
  //       passedAt: getRandomDate(),
  //       subjectId: "sub_u3aiif2dnei4",
  //       userId: "u_8d9m6qgq2xf5",
  //       name: "",
  //     },
  //   ],
  // },
  {
    id: "sub_pd5innyfom96",
    name: "Français - Ecrits",
    parentId: "sub_u3aiif2dnei4",
    coefficient: 600,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_1",
        value: 1150,
        outOf: 2000,
        coefficient: 100,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_pd5innyfom96",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_3",
        value: 1300,
        outOf: 2000,
        coefficient: 200,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_pd5innyfom96",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_pkxa3g4myhl5",
    name: "Français - Oraux",
    parentId: "sub_u3aiif2dnei4",
    coefficient: 300,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_1",
        value: 1500,
        outOf: 2000,
        coefficient: 100,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_u3aiif2dnei4",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_jyfsu6nxhc7t",
    name: "Anglais - Ecrits",
    parentId: "sub_916vdwzsayzu",
    coefficient: 500,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_1",
        value: 1200,
        outOf: 2000,
        coefficient: 500,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_916vdwzsayzu",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_2",
        value: 1350,
        outOf: 2000,
        coefficient: 500,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_916vdwzsayzu",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_3",
        value: 1500,
        outOf: 2000,
        coefficient: 500,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_916vdwzsayzu",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
  {
    id: "sub_fqvxglnb7yie",
    name: "Anglais - Oraux",
    parentId: "sub_916vdwzsayzu",
    coefficient: 200,
    depth: 2,
    isMainSubject: false,
    isDisplaySubject: false,
    createdAt: new Date(),
    userId: "u_8d9m6qgq2xf5",
    grades: [
      {
        id: "grade_1",
        value: 1400,
        outOf: 2000,
        coefficient: 200,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_916vdwzsayzu",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_2",
        value: 1250,
        outOf: 2000,
        coefficient: 200,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_916vdwzsayzu",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
      {
        id: "grade_3",
        value: 1575,
        outOf: 2000,
        coefficient: 200,
        periodId: "full-year",
        createdAt: getRandomDate(),
        passedAt: getRandomDate(),
        subjectId: "sub_916vdwzsayzu",
        userId: "u_8d9m6qgq2xf5",
        name: "",
      },
    ],
  },
] satisfies Subject[];
