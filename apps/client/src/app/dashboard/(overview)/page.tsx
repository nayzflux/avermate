"use client";

import GlobalAverageChart from "@/components/charts/global-average-chart";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import RecentGradesCard from "@/components/dashboard/recent-grades/recent-grades";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth";
import { BoxIcon } from "@radix-ui/react-icons";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Subject } from "@/types/subject";
import { average, averageOverTime, getBestMainSubject, getWorstMainSubject, getBestSubjectAverageComparaison, getWorstSubjectAverageComparaison, getBestGrade, getWorstSubjects, getWorstGrade } from "@/utils/average";

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  const { data: session } = authClient.useSession();

  const {
    data: subjects,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{
        subjects: Subject[];
      }>();
      return data.subjects;
    },
  });

  // Loading State
  if (isPending) {
    return <div>Loading...</div>;
  }

  // Error State
  if (isError) {
    return (
      <div>
        <h2>Error</h2>
        <p>An error occurred while loading the subjects.</p>
      </div>
    );
  }

  // Calculate the start and end dates
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  // Generate an array of dates
  const dates = [];
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dates.push(new Date(dt));
  }

  // Calculate the average grades over time
  const averages = averageOverTime(subjects, undefined, dates);

  //calculate the percentage of growth of the average between the first and last date
  const growth =
    averages.length > 1
      ? ((averages[averages.length - 1] - averages[0]) / averages[0]) * 100
      : 0;


  const bestSubject = getBestMainSubject(subjects);
  const bestSubjectAverage = average(bestSubject?.id, subjects);
  const bestSubjectAverageComparaison = getBestSubjectAverageComparaison(subjects);
  const worstSubject = getWorstMainSubject(subjects);
  const worstSubjectAverage = average(worstSubject?.id, subjects);
  const worstSubjectAverageComparaison = getWorstSubjectAverageComparaison(subjects);
  
  const bestGrade = getBestGrade(subjects);
  const worstGrade = getWorstGrade(subjects);

  return (
    <main className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-3xl font-bold">Vue d&apos;ensemble</h1>
        <h1 className="text-3xl font-normal">
          Welcome back{" "}
          {session?.user?.name ? session?.user?.name.split(" ")[0] : ""} 👋!
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
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
            <DataCard
              title="Overall average"
              icon={BoxIcon}
              description={
                growth > 0
                  ? `+${growth.toFixed(2)}% since the beginning`
                  : growth < 0
                  ? `${growth.toFixed(2)}% since the beginning`
                  : "No growth since the beginning"
              }
            >
              <GradeValue
                value={
                  average(undefined, subjects) !== null
                    ? (
                        Number(average(undefined, subjects)?.toFixed(2)) * 100
                      ).toString()
                    : "—"
                }
                outOf={2000}
                size="xl"
              />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description={
                bestGrade !== null
                  ? `In ${bestGrade?.subject?.name} ? Impressive ! (${bestGrade?.name})`
                  : "No best grade"
              }
            >
              <GradeValue
                value={
                  bestGrade !== null ? Number(bestGrade?.grade).toString() : "—"
                }
                outOf={
                  bestGrade !== null ? Number(bestGrade?.outOf).toString() : "—"
                }
                size="xl"
              />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description={
                bestSubjectAverage !== null
                  ? `${bestSubject?.name} is ${
                      bestSubjectAverageComparaison.toFixed(2) || "—"
                    }% higher than other subjects`
                  : "No best subject"
              }
            >
              <GradeValue
                value={
                  bestSubjectAverage !== null
                    ? (Number(bestSubjectAverage?.toFixed(2)) * 100).toString()
                    : "—"
                }
                outOf={2000}
                size="xl"
              />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description={
                worstGrade !== null
                  ? `In ${worstGrade?.subject?.name} ? Yep that’s bad (${worstGrade?.name})`
                  : "No worst grade"
              }
            >
              <GradeValue
                value={
                  worstGrade !== null
                    ? Number(worstGrade?.grade).toString()
                    : "—"
                }
                outOf={
                  worstGrade !== null
                    ? Number(worstGrade?.outOf).toString()
                    : "—"
                }
                size="xl"
              />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description={
                worstSubjectAverage !== null
                  ? `${worstSubject?.name} is ${
                      worstSubjectAverageComparaison.toFixed(2) || "—"
                    }% lower than other subjects`
                  : "No worst subject"
              }
            >
              <GradeValue
                value={
                  worstSubjectAverage !== null
                    ? (Number(worstSubjectAverage?.toFixed(2)) * 100).toString()
                    : "—"
                }
                outOf={2000}
                size="xl"
              />
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
              <GradeValue value={1535} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={2000} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={1535} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={200} outOf={2000} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={875} outOf={2000} size="xl" />
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
              <GradeValue value={1535} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={2000} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={1535} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={200} outOf={2000} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={875} outOf={2000} size="xl" />
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
              <GradeValue value={1535} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Best grade"
              icon={BoxIcon}
              description="In maths, impressive !"
            >
              <GradeValue value={2000} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Best subject"
              icon={BoxIcon}
              description="English is 5% higher than other subjects"
            >
              <GradeValue value={1535} outOf={2000} size="xl" />
            </DataCard>

            <DataCard
              title="Worst Grade"
              icon={BoxIcon}
              description="In SI, Yep that’s bad"
            >
              <GradeValue value={200} outOf={2000} size="xl" />
            </DataCard>
            <DataCard
              title="Worst subject"
              icon={BoxIcon}
              description="SI is 50% lower than other subjects"
            >
              <GradeValue value={875} outOf={2000} size="xl" />
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
