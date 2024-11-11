"use client";

import GlobalAverageChart from "@/components/charts/global-average-chart";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import RecentGradesCard from "@/components/dashboard/recent-grades";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth";
import { BoxIcon } from "@radix-ui/react-icons";

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  const { data: session } = authClient.useSession();

  return (
    <main className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-3xl font-bold">Vue d&apos;ensemble</h1>
        <h1 className="text-3xl font-normal">
          Welcome back {session?.user?.name.split(" ")[0]} 👋!
        </h1>
      </div>

      <Separator />

      {/* Statistiques */}
      <Tabs defaultValue="1">
        <ScrollArea>
          <div className="w-full relative h-10">
            <TabsList className="flex absolute">
              <TabsTrigger value="1">1st Trimester</TabsTrigger>
              <TabsTrigger value="2">2nd Trimester</TabsTrigger>
              <TabsTrigger value="3">3rd Trimester</TabsTrigger>
              <TabsTrigger value="f">Full Year</TabsTrigger>
            </TabsList>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="1">
          <div className="grid grids-cols-1 xs:grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Overall average"
              icon={BoxIcon}
              description="+7% since the beginning"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={20} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={2} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={8.75} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>

        <TabsContent value="2">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Overall average"
              icon={BoxIcon}
              description="+7% since the beginning"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={20} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={2} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={8.75} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>

        <TabsContent value="3">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Overall average"
              icon={BoxIcon}
              description="+7% since the beginning"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={20} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={2} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={8.75} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
            {/* Evolution de la moyenne générale */}
            <GlobalAverageChart />

            {/* Dernières notes */}
            <RecentGradesCard />
          </div>
        </TabsContent>

        <TabsContent value="f">
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Overall average"
              icon={BoxIcon}
              description="+7% since the beginning"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={20} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={15.35} outOf={20} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={2} outOf={20} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={8.75} outOf={20} size="xl" />
            </DataCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
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
