"use client";

import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import RecentGradeItem from "./recent-grade-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentGradesList() {
  // Fetch recent grades
  const {
    data: recentGrades,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["recent-grades", "grades"],
    queryFn: async () => {
      const res = await apiClient.get(
        `grades?from=${new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)}&limit=5`
      );

      const data = await res.json<{ grades: Grade[] }>();

      return data.grades;
    },
  });

  if (isPending) return (
    <div>
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5 w-[80%]">
          <div className="font-semibold">
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="text-sm text-muted-foreground truncate">
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        <Skeleton className="w-20 h-6" />
      </div>
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5 w-[80%]">
          <div className="font-semibold">
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="text-sm text-muted-foreground truncate">
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        <Skeleton className="w-20 h-6" />
      </div>
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5 w-[80%]">
          <div className="font-semibold">
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="text-sm text-muted-foreground truncate">
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        <Skeleton className="w-20 h-6" />
      </div>
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5 w-[80%]">
          <div className="font-semibold">
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="text-sm text-muted-foreground truncate">
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        <Skeleton className="w-20 h-6" />
      </div>
      <div className="flex items-center justify-between gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer rounded-lg p-2">
        <div className="flex flex-col gap-0.5 w-[80%]">
          <div className="font-semibold">
            <Skeleton className="w-36 h-6" />
          </div>
          <div className="text-sm text-muted-foreground truncate">
            <Skeleton className="w-24 h-5" />
          </div>
        </div>

        <Skeleton className="w-20 h-6" />
      </div>
    </div>
  );

  if (isError) return <div>Error!</div>;

  if (recentGrades.length === 0) return <div>Aucune note récentes</div>;

  return (
    <div className="grid grid-cols-1 gap-0.5">
      {recentGrades.map((grade) => (
        <RecentGradeItem key={grade.id} grade={grade}/>
      ))}
    </div>
  );
}
