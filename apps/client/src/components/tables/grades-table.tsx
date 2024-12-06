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
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { average } from "@/utils/average";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import AddSubjectButton from "../buttons/dashboard/add-subject-button";
import AddSubjectDialog from "../dialogs/add-subject-dialog";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import GradeBadge from "./grade-badge";
import errorStateCard from "../skeleton/error-card";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";

export default function GradesTable({
  subjects,
  periodId,
}: {
  subjects: Subject[];
  periodId: string;
}) {
  const {
    data: period,
    isError: isPeriodError,
    isPending: isPeriodPending,
  } = useQuery({
    queryKey: ["periods-name", periodId],
    queryFn: async () => {
      if (periodId === "full-year") {
        return null;
      }
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
  if (isPeriodError) {
    return <div>{errorStateCard()}</div>;
  }

  // Empty State
  if (subjects.length === 0) {
    return (
      <Card className="flex flex-col justify-center items-center p-4 gap-8 w-full h-[400px]">
        <BookOpenIcon className="w-12 h-12" />
        <div className="flex flex-col items-center gap-1">
          <h2 className="text-xl font-semibold">
            Aucune matière pour l&apos;instant
          </h2>
          <p>Ajouter une nouvelle matière pour commencer à suivre vos notes.</p>
        </div>
        <AddSubjectDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une matière
          </Button>
        </AddSubjectDialog>
      </Card>
    );
  }

  const periodName = periodId !== "full-year" ? period?.name : "Année complète";
  const overallAverage =
    average(undefined, subjects) !== null
      ? average(undefined, subjects)?.toFixed(2)
      : "—";

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

      <TableBody>{renderSubjects(subjects, periodId)}</TableBody>

      <TableFooter>
        <TableRow>
          <TableCell className="font-semibold" colSpan={2}>
            Moyenne générale
          </TableCell>
          <TableCell className="text-right font-semibold">
            {overallAverage}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

function getPaddingClass(depth: number) {
  // Tailwind spacing:
  // p-8 = 2rem, p-12 = 3rem, p-16 = 4rem, p-20 = 5rem
  // You can adjust these increments if needed.
  switch (depth) {
    case 1:
      return "pl-8"; // 2rem
    case 2:
      return "pl-12"; // 3rem
    case 3:
      return "pl-16"; // 4rem
    case 4:
      return "pl-20"; // 5rem
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

  // Create a vertical line for each depth level.
  // We'll space lines every 2rem. You can tweak this.
  const linePositions = Array.from(
    { length: depth },
    (_, i) => `calc(${getLinePosition(i + 1)} - 10px)` // Subtract 1px to avoid overlapping
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
                href={`/dashboard/subjects/${subject.id}/${periodId}`}
                className="border-b border-dotted border-white hover:opacity-80 text-primary transition-opacity"
              >
                {subject.name + ` (` + subject.coefficient / 100 + `)`}
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

function LoadingTable() {
  // Simulate a few subjects loading
  const items = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      {/* Desktop layout (unchanged) */}
      <Table className="w-full table-auto hidden md:table">
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
          {Array.from({ length: 10 }, (_, i) => (
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

      {/* Mobile layout */}
      <Table className="w-full table-auto md:hidden">
        <TableCaption>
          <div className="flex w-full justify-center">
            <Skeleton className="w-64 h-[14px]" />
          </div>
        </TableCaption>
        {/* No header on mobile */}
        <TableBody>
          {items.map((item) => (
            <React.Fragment key={item}>
              {/* Subject + average row on mobile */}
              <TableRow className="border-b">
                <TableCell className="w-full">
                  {/* Subject name skeleton */}
                  <Skeleton className="w-3/4 h-[20px] mb-1" />
                  {/* Mobile-only average skeleton */}
                  <Skeleton className="w-1/2 h-[14px]" />
                </TableCell>
              </TableRow>

              {/* Notes row on mobile */}
              <TableRow className="border-b">
                <TableCell className="w-full">
                  <div className="flex gap-2 flex-wrap pt-1 pb-2">
                    <Skeleton className="w-10 h-[20px]" />
                    <Skeleton className="w-10 h-[20px]" />
                    <Skeleton className="w-10 h-[20px]" />
                  </div>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

