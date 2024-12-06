"use client";

import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import RecentGradeItem from "./recent-grade-item";
import { Skeleton } from "@/components/ui/skeleton";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

export default function RecentGradesList({
  recentGrades,
}: {
  recentGrades: Grade[];
}) {
  if (recentGrades.length === 0)
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-full">
        <p className="">Aucune note récente</p>
        <AddGradeDialog>
          <Button variant="outline">
            <PlusCircleIcon className="size-4 mr-2" />
            Ajouter une note
          </Button>
        </AddGradeDialog>
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-0.5">
      {recentGrades.slice(0, 5).map((grade) => (
        <RecentGradeItem key={grade.id} grade={grade} />
      ))}
    </div>
  );
}
