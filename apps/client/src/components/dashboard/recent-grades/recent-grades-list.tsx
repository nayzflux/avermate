"use client";

import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import RecentGradeItem from "./recent-grade-item";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentGradesList({
  recentGrades,
}: {
  recentGrades: Grade[];
}) {

  if (recentGrades.length === 0) return <div>Aucune note récentes</div>;

  return (
    <div className="grid grid-cols-1 gap-0.5">
      {recentGrades.slice(0, 5).map((grade) => (
      <RecentGradeItem key={grade.id} grade={grade} />
      ))}
    </div>
  );
}
