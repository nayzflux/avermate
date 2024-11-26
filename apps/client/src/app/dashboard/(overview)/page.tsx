"use client";

import GlobalAverageChart from "@/components/charts/global-average-chart";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import RecentGradesCard from "@/components/dashboard/recent-grades/recent-grades";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { authClient } from "@/lib/auth";
import { GetPeriodsResponse } from "@/types/get-periods-response";
import { GetSubjectsResponse } from "@/types/get-subjects-response";
import {
  average,
  averageOverTime,
  getBestGrade,
  getBestMainSubject,
  getBestSubjectAverageComparaison,
  getWorstGrade,
  getWorstMainSubject,
  getWorstSubjectAverageComparaison,
} from "@/utils/average";
import {
  AcademicCapIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  const { data: session } = authClient.useSession();

  // Fetch subjects lists with grades from API
  const {
    data: subjects,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<GetSubjectsResponse>();
      return data.subjects;
    },
  });

  // Fetch periods from API
  const {
    data: periods,
    isError: periodsIsError,
    isPending: periodsIsPending,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<GetPeriodsResponse>();
      const periods = data.periods;

      // // Add a "full year" period to the periods array
      // if (data.periods && data.periods.length > 0) {
      //   data.periods.push({
      //     id: "full-year",
      //     name: "Full year",
      //     startAt: data.periods[0].startAt,
      //     endAt: data.periods[data.periods.length - 1].endAt,
      //     createdAt: new Date(),
      //     userId: "system",
      //   });
      // } else {
      //   // If there are no periods, create a "full year" period from the last 12 months
      //   const endDate = new Date();
      //   const startDate = new Date();
      //   startDate.setMonth(startDate.getMonth() - 12);
      //   data.periods.push({
      //     id: "1",
      //     name: "Full year",
      //     startAt: startDate,
      //     endAt: endDate,
      //     createdAt: new Date(),
      //     userId: "system",
      //   });
      // }

      return data.periods;
    },
  });

  const averages = useMemo(() => {
    if (isPending || isError) {
      return [];
    }

    console.time("Calculating averages overtime");

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

    console.timeEnd("Calculating averages overtime");

    return averages;
  }, [subjects]);

  // Calculate the growth of the average over time
  const growth = useMemo(() => {
    const growth =
      averages.length > 1
        ? ((averages[averages.length - 1] - averages[0]) / averages[0]) * 100
        : 0;

    return growth;
  }, [averages]);

  // Calculate the best and worst subjects and grades
  const {
    bestSubject,
    bestSubjectAverage,
    bestSubjectAverageComparaison,
    worstSubject,
    worstSubjectAverage,
    worstSubjectAverageComparaison,
    bestGrade,
    worstGrade,
  } = useMemo(() => {
    if (isPending || isError) {
      return {
        bestSubject: null,
        bestSubjectAverage: null,
        bestSubjectAverageComparaison: null,
        worstSubject: null,
        worstSubjectAverage: null,
        worstSubjectAverageComparaison: null,
        bestGrade: null,
        worstGrade: null,
      };
    }

    //calculate the percentage of growth of the average between the first and last date
    const bestSubject = getBestMainSubject(subjects);
    const bestSubjectAverage = average(bestSubject?.id, subjects);
    const bestSubjectAverageComparaison =
      getBestSubjectAverageComparaison(subjects);

    const worstSubject = getWorstMainSubject(subjects);
    const worstSubjectAverage = average(worstSubject?.id, subjects);
    const worstSubjectAverageComparaison =
      getWorstSubjectAverageComparaison(subjects);

    const bestGrade = getBestGrade(subjects);
    const worstGrade = getWorstGrade(subjects);

    return {
      bestSubject,
      bestSubjectAverage,
      bestSubjectAverageComparaison,
      worstSubject,
      worstSubjectAverage,
      worstSubjectAverageComparaison,
      bestGrade,
      worstGrade,
    };
  }, [subjects]);

  // Loading State
  if (isPending || periodsIsPending) {
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

  return (
    <main className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div className="flex flex-wrap items-center justify-between">
        <h1 className="text-3xl font-bold">Vue d&apos;ensemble</h1>
        <h1 className="text-3xl font-normal">
          Bonjour {session?.user?.name ? session?.user?.name.split(" ")[0] : ""}{" "}
          👋
        </h1>
      </div>

      <Separator />

      {/* Statistiques */}
      <Tabs
        defaultValue={
          // choose the period where we are currently in if it exists
          periods?.find(
            (period) =>
              new Date(period.startAt) <= new Date() &&
              new Date(period.endAt) >= new Date()
          )?.id || "full-year"
        }
      >
        <div className="flex flex-col gap-4">
          <ScrollArea>
            <div className="flex w-full">
              <TabsList className="flex">
                {periods?.map((period) => (
                  <TabsTrigger key={period.id} value={period.id}>
                    {period.name}
                  </TabsTrigger>
                ))}

                <TabsTrigger value="full-year">Toute l'année</TabsTrigger>
              </TabsList>
            </div>

            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {periods &&
            periods.length > 0 &&
            periods
              .sort(
                (a, b) =>
                  new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
              )
              .map((period) => (
                <TabsContent key={period.id} value={period.id}>
                  <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
                    <DataCard
                      title="Overall average"
                      icon={AcademicCapIcon}
                      description={
                        growth > 0
                          ? `+${growth.toFixed(2)}% since the beginning`
                          : growth < 0
                          ? `${growth.toFixed(2)}% since the beginning`
                          : "No growth since the beginning"
                      }
                    >
                      <GradeValue
                        value={(average(undefined, subjects) || 0) * 100}
                        outOf={2000}
                        size="xl"
                      />
                    </DataCard>

                    <DataCard
                      title="Best grade"
                      icon={PlusIcon}
                      description={
                        bestGrade !== null
                          ? `In ${bestGrade?.subject?.name} ? Impressive ! (${bestGrade?.name})`
                          : "No best grade"
                      }
                    >
                      {bestGrade && (
                        <GradeValue
                          value={bestGrade.grade}
                          outOf={bestGrade.outOf}
                          size="xl"
                        />
                      )}
                    </DataCard>

                    <DataCard
                      title="Best subject"
                      icon={ArrowTrendingUpIcon}
                      description={
                        bestSubjectAverage !== null
                          ? `${bestSubject?.name} is ${
                              bestSubjectAverageComparaison.toFixed(2) || "—"
                            }% higher than other subjects`
                          : "No best subject"
                      }
                    >
                      {bestSubjectAverage && (
                        <GradeValue
                          value={bestSubjectAverage * 100}
                          outOf={2000}
                          size="xl"
                        />
                      )}
                    </DataCard>

                    <DataCard
                      title="Worst Grade"
                      icon={MinusIcon}
                      description={
                        worstGrade !== null
                          ? `In ${worstGrade?.subject?.name} ? Yep that’s bad (${worstGrade?.name})`
                          : "No worst grade"
                      }
                    >
                      {worstGrade && (
                        <GradeValue
                          value={worstGrade.grade}
                          outOf={worstGrade.outOf}
                          size="xl"
                        />
                      )}
                    </DataCard>
                    <DataCard
                      title="Worst subject"
                      icon={ArrowTrendingDownIcon}
                      description={
                        worstSubjectAverage !== null
                          ? `${worstSubject?.name} is ${
                              worstSubjectAverageComparaison.toFixed(2) || "—"
                            }% lower than other subjects`
                          : "No worst subject"
                      }
                    >
                      {worstSubjectAverage && (
                        <GradeValue
                          value={worstSubjectAverage * 100}
                          outOf={2000}
                          size="xl"
                        />
                      )}
                    </DataCard>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {/* Evolution de la moyenne générale */}
                    <GlobalAverageChart />

                    {/* Dernières notes */}
                    <RecentGradesCard />
                  </div>
                </TabsContent>
              ))}
        </div>
      </Tabs>
    </main>
  );
}
