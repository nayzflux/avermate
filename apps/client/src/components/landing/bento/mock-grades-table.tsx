import GradeBadge from "@/components/tables/grade-badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { average } from "@/utils/average";
import Link from "next/link";
import React from "react";

const MockGradesTable = () => {
  const periodName = "Année complète";
  const overallAverage = "12.34";

  const subjects = [
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
        //   createdAt: "2021-09-01T00:00:00.000Z",
        //   passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
    //       createdAt: "2021-09-01T00:00:00.000Z",
    //       passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
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
          createdAt: "2021-09-01T00:00:00.000Z",
          passedAt: "2021-09-01T00:00:00.000Z",
          subjectId: "sub_916vdwzsayzu",
          userId: "u_8d9m6qgq2xf5",
          name: "",
        },
      ],
    },
  ] satisfies Subject[];

  return (
    <Table>
      <TableCaption>{periodName}</TableCaption>

      {/* Desktop Table Header */}
      <TableHeader className="hidden md:table-header-group">
        <TableRow>
          <TableHead className="w-[50px] md:w-[200px]">Matières</TableHead>
          <TableHead className="w-[50px] md:w-[100px] text-center">
            Moyennes
          </TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>{renderSubjects(subjects, "full-year", null)}</TableBody>

      <TableFooter>
        {/* Desktop Footer */}
        <TableRow className="hidden md:table-row">
          <TableCell className="font-semibold" colSpan={2}>
            Moyenne générale
          </TableCell>
          <TableCell className="text-right font-semibold">
            {overallAverage}
          </TableCell>
        </TableRow>
        {/* Mobile Footer */}
        <TableRow className="md:hidden">
          <TableCell className="font-semibold text-center" colSpan={3}>
            Moyenne générale: {overallAverage}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

function getPaddingClass(depth: number) {
  switch (depth) {
    case 1:
      return "pl-8";
    case 2:
      return "pl-12";
    case 3:
      return "pl-16";
    case 4:
      return "pl-20";
    default:
      return "";
  }
}

function getLinePosition(depth: number) {
  switch (depth) {
    case 1:
      return "2rem";
    case 2:
      return "3rem";
    case 3:
      return "4rem";
    case 4:
      return "5rem";
    default:
      return "0";
  }
}

function getIndentationLinesStyle(depth: number): React.CSSProperties {
  if (depth <= 0) return {};

  const linePositions = Array.from(
    { length: depth },
    (_, i) => `calc(${getLinePosition(i + 1)} - 10px)`
  );

  return {
    backgroundImage: linePositions
      .map(() => "linear-gradient(to bottom, #58585d 0%, #58585d 100%)")
      .join(", "),
    backgroundPosition: linePositions.join(", "),
    backgroundSize: "1px 100%",
    backgroundRepeat: "no-repeat",
  };
}

function renderSubjects(
  subjects: Subject[],
  periodId: string,
  parentId: string | null = null
) {
  return subjects
    .filter((subject) => subject.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((subject) => {
      const subjAverage =
        average(subject.id, subjects) !== null
          ? average(subject.id, subjects)?.toFixed(2)
          : "—";

      return (
        <React.Fragment key={subject.id}>
          <TableRow className="border-b">
            <TableCell
              style={getIndentationLinesStyle(subject.depth)}
              className={cn(
                "font-medium relative",
                getPaddingClass(subject.depth)
              )}
            >
              <Link
                href={`#features`}
                className="border-b border-dotted border-white hover:opacity-80 text-primary transition-opacity"
              >
                {subject.name +
                  (!subject.isDisplaySubject
                    ? ` (${subject.coefficient / 100})`
                    : "")}
              </Link>

              {/* Mobile-only average display (hidden on md+) */}
              <div className="md:hidden mt-1 text-sm text-gray-600">
                Moyenne: <span className="font-semibold">{subjAverage}</span>
              </div>
            </TableCell>

            {/* Desktop-only average column (hidden on mobile) */}
            <TableCell className="text-center font-semibold hidden md:table-cell">
              {subjAverage}
            </TableCell>

            {/* Desktop-only notes column (hidden on mobile) */}
            <TableCell className="hidden md:table-cell">
              <div className="flex gap-4 flex-wrap">
                {subject.grades.map((grade) => (
                  <GradeBadge
                    key={grade.id}
                    value={grade.value}
                    outOf={grade.outOf}
                    coefficient={grade.coefficient}
                    id={grade.id}
                    periodId={grade.periodId}
                  />
                ))}
              </div>
            </TableCell>
          </TableRow>

          {/* Mobile-only second row for notes */}
          <TableRow className="border-b md:hidden">
            <TableCell
              colSpan={1}
              style={getIndentationLinesStyle(subject.depth)}
              className={cn(getPaddingClass(subject.depth))}
            >
              <div className="flex gap-2 flex-wrap pt-1 pb-2">
                {subject.grades.map((grade) => (
                  <GradeBadge
                    key={grade.id}
                    value={grade.value}
                    outOf={grade.outOf}
                    coefficient={grade.coefficient}
                    id={grade.id}
                    periodId={grade.periodId}
                  />
                ))}
              </div>
            </TableCell>
          </TableRow>

          {renderSubjects(subjects, periodId, subject.id)}
        </React.Fragment>
      );
    });
}

export default MockGradesTable;
