import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RecentGradeItem from "./recent-grade-item";

export default function RecentGradesCard() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-xl">Notes récentes</CardTitle>

        <CardDescription>
          Vous avez reçu 3 nouvelles notes cette semaine !
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-0.5">
          <RecentGradeItem />
          <RecentGradeItem />
          <RecentGradeItem />
          <RecentGradeItem />
          <RecentGradeItem />
        </div>
      </CardContent>
    </Card>
  );
}
