"use client";

import GlobalAverageChart from "@/components/charts/global-average-chart";
import RecentGradesCard from "@/components/dashboard/recent-grades/recent-grades";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { authClient } from "@/lib/auth";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { GetPeriodsResponse } from "@/types/get-periods-response";
import { GetSubjectsResponse } from "@/types/get-subjects-response";
import { useQuery } from "@tanstack/react-query";
import { Session, User } from "better-auth/types";
import { useEffect, useState } from "react";
import DataCards from "./data-cards";
import dashboardLoader from "@/components/skeleton/dashboard-loader";
import { Grade } from "@/types/grade";
import Onboardding from "./onboarding/onboardding";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  const { data: session } = authClient.useSession() as unknown as {
    data: { session: Session; user: User };
  };

  const [selectedTab, setSelectedTab] = useState<string | null>(null);

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
      return data.periods;
    },
  });

  // fetch subjects but organized by period
  const {
    data: organizedSubjects,
    isError: organizedSubjectsIsError,
    isPending: organizedSubjectsIsPending,
  } = useQuery({
    queryKey: ["subjects", "organized-by-periods"],
    queryFn: async () => {
      const res = await apiClient.get("subjects/organized-by-periods");
      const data = await res.json<GetOrganizedSubjectsResponse>();
      return data.periods;
    },
  });

  const {
    data: recentGrades,
    isError: isPendingRecentGrades,
    isPending: isErrorRecentGrades,
  } = useQuery({
    queryKey: ["recent-grades", "grades"],
    queryFn: async () => {
      const res = await apiClient.get(
        `grades?from=${new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 14
        )}&limit=100`
      );

      const data = await res.json<{ grades: Grade[] }>();

      return data.grades;
    },
  });

  useEffect(() => {
    if (!periods) return;

    const savedTab = sessionStorage.getItem("selectedTab");

    if (savedTab) {
      setSelectedTab(savedTab);
    } else {
      const defaultTab =
        periods.find(
          (period) =>
            new Date(period.startAt) <= new Date() &&
            new Date(period.endAt) >= new Date()
        )?.id || "full-year";
      setSelectedTab(defaultTab);
    }
  }, [periods]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem("selectedTab");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Loading State
  if (
    isPending ||
    periodsIsPending ||
    organizedSubjectsIsPending ||
    isPendingRecentGrades ||
    selectedTab === null
    // || true
  ) {
    return <div>{dashboardLoader()}</div>;
  }

  // Error State
  if (
    isError ||
    periodsIsError ||
    organizedSubjectsIsError ||
    isErrorRecentGrades
  ) {
    return (
      <div>
        <h2>Error</h2>
        <p>An error occurred while loading the subjects.</p>
      </div>
    );
  }

  // // Onboarding
  // if (
  //   (!subjects || subjects.length === 0) &&
  //   (!periods || periods.length === 0) &&
  //   session?.user?.createdAt &&
  //   new Date(session?.user?.createdAt).getTime() > Date.now() - 1000 * 60 * 60 * 24
  // ) {
  //   return (
  //     <div>
  //       {Onboardding()}
  //     </div>
  //   );
  // }

  const sortedPeriods = periods
    ?.slice()
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

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
              new Date(period.startAt).getTime() <= new Date().getTime() &&
              new Date(period.endAt).getTime() >= new Date().getTime()
          )?.id || "full-year"
        }
        value={selectedTab}
        onValueChange={(value) => {
          setSelectedTab(value);
          sessionStorage.setItem("selectedTab", value);
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="hidden md:flex gap-4">
            <ScrollArea>
              <div className="flex w-full">
                <TabsList className="flex">
                  {periods?.map((period) => (
                    <TabsTrigger key={period.id} value={period.id}>
                      {period.name}
                    </TabsTrigger>
                  ))}

                <TabsTrigger value="full-year">Toute l&apos;année</TabsTrigger>
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
                  <DataCards
                    period={period}
                    subjects={
                      organizedSubjects?.find((p) => p.period.id === period.id)
                        ?.subjects || []
                    }
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
                    {/* Evolution de la moyenne générale */}
                    <GlobalAverageChart
                      subjects={
                        organizedSubjects?.find(
                          (p) => p.period.id === period.id
                        )?.subjects || []
                      }
                      period={
                        organizedSubjects?.find(
                          (p) => p.period.id === period.id
                        )?.period || {
                          id: "full-year",
                          name: "Toute l&apos;année",
                          startAt:
                            sortedPeriods && sortedPeriods.length > 0
                              ? sortedPeriods[0].startAt
                              : new Date(
                                  new Date().getFullYear(),
                                  8,
                                  1
                                ).toISOString(),
                          endAt:
                            sortedPeriods && sortedPeriods.length > 0
                              ? sortedPeriods[sortedPeriods.length - 1].endAt
                              : new Date(
                                  new Date().getFullYear() + 1,
                                  5,
                                  30
                                ).toISOString(),
                          userId: "",
                          createdAt: "",
                        }
                      }
                    />

                    {/* Dernières notes */}
                    <RecentGradesCard recentGrades={recentGrades} />
                  </div>
                </TabsContent>
              ))}
          <TabsContent value="full-year">
            <DataCards
              subjects={subjects || []}
              period={{
                id: "full-year",
                name: "Toute l&apos;année",
                startAt:
                  sortedPeriods && sortedPeriods.length > 0
                    ? sortedPeriods[0].startAt
                    : new Date(new Date().getFullYear(), 8, 1).toISOString(),
                endAt:
                  sortedPeriods && sortedPeriods.length > 0
                    ? sortedPeriods[sortedPeriods.length - 1].endAt
                    : new Date(
                        new Date().getFullYear() + 1,
                        5,
                        30
                      ).toISOString(),
                userId: "",
                createdAt: "",
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <GlobalAverageChart
                subjects={subjects || []}
                period={{
                  id: "full-year",
                  name: "Toute l&apos;année",
                  startAt:
                    sortedPeriods && sortedPeriods.length > 0
                      ? sortedPeriods[0].startAt
                      : new Date(new Date().getFullYear(), 8, 1).toISOString(),
                  endAt:
                    sortedPeriods && sortedPeriods.length > 0
                      ? sortedPeriods[sortedPeriods.length - 1].endAt
                      : new Date(
                          new Date().getFullYear() + 1,
                          5,
                          30
                        ).toISOString(),
                  userId: "",
                  createdAt: "",
                }}
              />
              <RecentGradesCard recentGrades={recentGrades} />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
