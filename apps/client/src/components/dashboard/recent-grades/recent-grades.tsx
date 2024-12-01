import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";
import RecentGradesList from "./recent-grades-list";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentGradesCard(
  {
    recentGrades,
  }: {
    recentGrades: Grade[];
  }
) {

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-l">Notes récentes</CardTitle>

        <CardDescription>
          Vous avez reçu{" "}
          {
            recentGrades.filter(
              (grade) =>
                new Date(grade.createdAt) >
                new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
            ).length
          }{" "}
          nouvelles notes cette semaine !
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RecentGradesList recentGrades={recentGrades} />
      </CardContent>
    </Card>
  );
}
