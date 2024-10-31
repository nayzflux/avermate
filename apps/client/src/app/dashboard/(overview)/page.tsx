import GlobalAverageChart from "@/components/charts/global-average-chart";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import RecentGradesCard from "@/components/dashboard/recent-grades";
import { Separator } from "@/components/ui/separator";

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  return (
    <main className="flex flex-col gap-8">
      {/* Statistiques */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <DataCard
          title="Moyenne Générale"
          icon={"div"}
          description="+7% depuis le début du trimestre"
        >
          <GradeValue value={13.5} outOf={20} size="xl" />
        </DataCard>

        <DataCard
          title="Moyenne Générale"
          icon={"div"}
          description="+7% depuis le début du trimestre"
        >
          <GradeValue value={13.5} outOf={20} size="xl" />
        </DataCard>

        <DataCard
          title="Moyenne Générale"
          icon={"div"}
          description="+7% depuis le début du trimestre"
        >
          <GradeValue value={13.5} outOf={20} size="xl" />
        </DataCard>

        <DataCard
          title="Moyenne Générale"
          icon={"div"}
          description="+7% depuis le début du trimestre"
        >
          <GradeValue value={13.5} outOf={20} size="xl" />
        </DataCard>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Evolution de la moyenne générale */}
        <GlobalAverageChart />

        {/* Dernières notes */}
        <RecentGradesCard />
      </div>
    </main>
  );
}
