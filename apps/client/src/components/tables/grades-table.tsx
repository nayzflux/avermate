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

export default function GradesTable() {
  const {
    data: subjects,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });

  // Loading State
  if (isPending) {
    return <LoadingTable />;
  }

  // Error State
  if (isError) {
    return (
      <Card className="flex justify-center items-center p-4 w-full h-[400px]">
        <div className="">
          <h2 className="text-xl font-semibold">Erreur</h2>
          <p>Une erreur s'est produite lors du chargement des notes.</p>
        </div>
      </Card>
    );
  }

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
      <TableCaption>1er trimerstre</TableCaption>

      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px] md:w-[200px]">Matières</TableHead>

          <TableHead className="w-[50px] md:w-[100px] text-center">
            Moyennes
          </TableHead>

          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {subjects.map((subject) => (
          <TableRow key={subject.id}>
            <TableCell
              className={cn(
                "font-medium",
                subject.parentId !== null && "text-right"
              )}
            >
              <Link
                href={`/dashboard/subjects/${subject.id}`}
                className="border-b border-dotted border-white"
              >
                {subject.name}
              </Link>
            </TableCell>

            <TableCell className="text-center font-semibold">14.38</TableCell>

            <TableCell>
              <div className="flex gap-4 flex-wrap">
                {subject.grades.map((grade) => (
                  <GradeBadge
                    key={grade.id}
                    value={grade.value}
                    outOf={grade.outOf}
                    coefficient={grade.coefficient}
                  />
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Moyenne générale</TableCell>
          <TableCell className="text-right">14.38</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
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
