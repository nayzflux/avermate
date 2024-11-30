import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecentGradesList from "./recent-grades-list";
import { useQuery } from "@tanstack/react-query";
import { Grade } from "@/types/grade";
import { apiClient } from "@/lib/api";

export default function RecentGradesCard({ periodId }: { periodId: string }) {
  const {
    data: recentGrades,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["recent-grades-title", "grades"],
    queryFn: async () => {
      const res = await apiClient.get(
        `grades?from=${new Date(Date.now() - 1000 * 60 * 60 * 24 * 14)}&limit=50`
      );

      const data = await res.json<{ grades: Grade[] }>();

      return data.grades;
    },
  });

  if (isPending) return (
    <div>
      loading...
    </div>
  );

  if (isError) return <div>Erreur lors du chargement des notes récentes</div>;



  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-l">Notes récentes</CardTitle>

        <CardDescription>
          Vous avez reçu { 
            recentGrades.filter((grade) => new Date(grade.createdAt) > new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)).length
          } nouvelles notes cette semaine !
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RecentGradesList periodId={periodId} />
      </CardContent>
    </Card>
  );
}
