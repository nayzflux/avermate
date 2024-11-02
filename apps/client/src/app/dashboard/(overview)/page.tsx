import GlobalAverageChart from "@/components/charts/global-average-chart";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import RecentGradesCard from "@/components/dashboard/recent-grades";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dataIcons from "@/components/icons/data-icons";

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  return (
    <main className="flex flex-col gap-4 m-auto max-w-[2000px]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-inter font-medium">Dashboard</h1>
        <h1 className="text-2xl font-inter font-medium">
          Welcome back INSERT NAME!👋
        </h1>
      </div>

      {/* Statistiques */}
      <Tabs defaultValue="1">
        <TabsList>
          <TabsTrigger value="1">1st Trimester</TabsTrigger>
          <TabsTrigger value="2">2nd Trimester</TabsTrigger>
          <TabsTrigger value="3">3rd Trimester</TabsTrigger>
          <TabsTrigger value="f">Full Year</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>
        <TabsContent value="2">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>
        <TabsContent value="3">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>
        <TabsContent value="f">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Moyenne Générale"
              icon={dataIcons}
              description="+7% depuis le début du trimestre"
            >
              <GradeValue value={13.5} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
