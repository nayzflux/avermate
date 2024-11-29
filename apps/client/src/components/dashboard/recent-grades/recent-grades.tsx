import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecentGradesList from "./recent-grades-list";

export default function RecentGradesCard({
  periodId,
}: {
  periodId: string;
}) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-l">Notes récentes</CardTitle>

        <CardDescription>
          Vous avez reçu 3 nouvelles notes cette semaine !
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RecentGradesList periodId={periodId} />
      </CardContent>
    </Card>
  );
}
