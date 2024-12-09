"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Grade } from "@/types/grade";
import RecentGradesList from "./recent-grades-list";

export default function RecentGradesCard({
  recentGrades,
}: {
  recentGrades: Grade[];
}) {
  const recentCount = recentGrades.filter(
    (grade) =>
      new Date(grade.createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  ).length;

  return (
    <Card className="lg:col-span-2 flex flex-col overflow-hidden min-w-0">
      <CardHeader>
        <CardTitle className="text-l">Notes récentes</CardTitle>
        <CardDescription>
          Vous avez reçu {recentCount} nouvelles notes cette semaine !
        </CardDescription>
      </CardHeader>

      <CardContent className="h-full overflow-hidden min-w-0">
        <RecentGradesList recentGrades={recentGrades} />
      </CardContent>
    </Card>
  );
}
