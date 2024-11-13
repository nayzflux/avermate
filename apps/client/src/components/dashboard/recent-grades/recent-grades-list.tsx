"use client";

import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import RecentGradeItem from "./recent-grade-item";

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

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error!</div>;

  if (recentGrades.length === 0) return <div>Aucune note récentes</div>;

  return (
    <div className="grid grid-cols-1 gap-0.5">
      {recentGrades.map((grade) => (
        <RecentGradeItem key={grade.id} grade={grade} />
      ))}
    </div>
  );
}
