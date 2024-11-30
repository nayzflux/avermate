"use client";

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

import { apiClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Subject } from "@/types/subject";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import AddSubjectButton from "../buttons/dashboard/add-subject-button";
import AddSubjectDialog from "../dialogs/add-subject-dialog";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import GradeBadge from "./grade-badge";
import { average } from "@/utils/average";
import React from "react";
import { Period } from "@/types/period";

export default function GradesTable({
  subjects,
  periodId,
}: {
    subjects: Subject[];
    periodId: string;
}

) {
  // const {
  //   data: subjects,
  //   isError,
  //   isPending,
  // } = useQuery({
  //   queryKey: ["subjects"],
  //   queryFn: async () => {
  //     const res = await apiClient.get("subjects");
  //     const data = await res.json<{
  //       subjects: Subject[];
  //     }>();
  //     return data.subjects;
  //   },
  // });

  // // Loading State
  // if (isPending) {
  //   return <LoadingTable />;
  // }

  // // Error State
  // if (isError) {
  //   return (
  //     <Card className="flex justify-center items-center p-4 w-full h-[400px]">
  //       <div className="">
  //         <h2 className="text-xl font-semibold">Erreur</h2>
  //         <p>Une erreur s'est produite lors du chargement des notes.</p>
  //       </div>
  //     </Card>
  //   );
  // }

  // Fetch period data by id
  const {
    data: period,
    isError: isPeriodError,
    isPending: isPeriodPending,
  } = useQuery({
    queryKey: ["periods-name"],
    queryFn: async () => {
      const res = await apiClient.get(`periods/${periodId}`);
      const data = await res.json<Period>();
      return data;
    },
  });

  // Loading State
  if (isPeriodPending) {
    return <LoadingTable />;
  }

  // Error State

  // Empty State
  if (subjects.length === 0) {
    return (
      <Card className="flex flex-col justify-center items-center p-4 gap-8 w-full h-[400px]">
        <BookOpenIcon className="w-12 h-12" />

        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold">
            Aucune matière pour l'instant
          </h2>
          <p>Ajouter une nouvelle matière pour commencer à suivre vos notes.</p>
        </div>

        <AddSubjectDialog>
          <AddSubjectButton />
        </AddSubjectDialog>
      </Card>
    );
  }

  return (
    <Table>
      <TableCaption>{periodId !== "full-year" ? period?.name : "Année complète"}</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] md:w-[200px]">Matières</TableHead>
          <TableHead className="w-[50px] md:w-[100px] text-center">
            Moyennes
          </TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>{renderSubjects(subjects, periodId)}</TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Moyenne générale</TableCell>
          <TableCell className="text-right">
            {average(undefined, subjects) !== null
              ? average(undefined, subjects)?.toFixed(2)
              : "—"}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function getPaddingClass(depth: number) {
  switch (depth) {
    case 1:
      return "pl-8";
    case 2:
      return "pl-12";
    case 3:
      return "pl-16";
    case 4:
      return "pl-18";
    default:
      return "";
  }
}


function renderSubjects(subjects: Subject[], periodId: string, parentId: string | null = null) {
  return subjects
    .filter((subject) => subject.parentId === parentId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((subject) => (
      <React.Fragment key={subject.id}>
        <TableRow>
          <TableCell
            className={cn("font-medium", getPaddingClass(subject.depth))}
          >
            <Link
              href={`/dashboard/subjects/${subject.id}/${periodId}`}
              className="border-b border-dotted border-white"
            >
              {subject.name + ` (` + subject.coefficient / 100 + `)`}
            </Link>
          </TableCell>
          <TableCell className="text-center font-semibold">
            {average(subject.id, subjects) !== null
              ? average(subject.id, subjects)?.toFixed(2)
              : "—"}
          </TableCell>
          <TableCell>
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
        {renderSubjects(subjects, periodId, subject.id)}
      </React.Fragment>
    ));
}

function LoadingTable() {
  return (
    <Table>
      <TableCaption>
        <div className="flex w-full justify-center">
          <Skeleton className="w-64 h-[14px]" />
        </div>
      </TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] md:w-[200px]">
            <Skeleton className="w-full h-[18px]" />
          </TableHead>

          <TableHead className="w-[50px] md:w-[100px] text-center">
            <Skeleton className="w-full h-[18px]" />
          </TableHead>

          <TableHead>
            <Skeleton className="w-full h-[18px]" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="w-full h-[20px]" />
            </TableCell>

            <TableCell className="text-center font-semibold">
              <Skeleton className="w-full h-[20px]" />
            </TableCell>

            <TableCell>
              <Skeleton className="w-full h-[20px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
