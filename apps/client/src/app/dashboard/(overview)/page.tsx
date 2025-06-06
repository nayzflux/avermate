"use client";

import GlobalAverageChart from "@/components/charts/global-average-chart";
import RecentGradesCard from "@/components/dashboard/recent-grades/recent-grades";
import DashboardLoader from "@/components/skeleton/dashboard-loader";
import ErrorStateCard from "@/components/skeleton/error-card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomAverages } from "@/hooks/use-custom-averages";
import { usePeriods } from "@/hooks/use-periods";
import { useRecentGrades } from "@/hooks/use-recent-grades";
import { useSubjects } from "@/hooks/use-subjects";
import { useOrganizedSubjects } from "@/hooks/use-get-oragnized-subjects";
import { apiClient } from "@/lib/api";
import { authClient } from "@/lib/auth";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { fullYearPeriod } from "@/utils/average";
import { useQuery } from "@tanstack/react-query";
import { Session, User } from "better-auth/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DataCards from "./data-cards";
import { useTranslations } from "next-intl"; // Import useTranslations

/**
 * Vue d'ensemble des notes
 */
export default function OverviewPage() {
  const t = useTranslations("Dashboard.Pages.OverviewPage"); // Initialize t
  const { data: session } = authClient.useSession() as unknown as {
    data: { session: Session; user: User };
  };

  type Account = {
    id: string;
    provider: string;
  };

  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  // Fetch subjects lists with grades from API
  const { data: subjects, isError, isPending } = useSubjects();

  // Fetch periods from API
  const {
    data: periods,
    isError: periodsIsError,
    isPending: periodsIsPending,
  } = usePeriods();

  // fetch subjects but organized by period
  const {
    data: organizedSubjects,
    isError: organizedSubjectsIsError,
    isPending: organizedSubjectsIsPending,
  } = useOrganizedSubjects();
  
  // 
  // = useQuery({
  //   queryKey: ["subjects", "organized-by-periods"],
  //   queryFn: async () => {
  //     const res = await apiClient.get("subjects/organized-by-periods");
  //     const data = await res.json<GetOrganizedSubjectsResponse>();
  //     return data.periods;
  //   },
  // });

  const {
    data: recentGrades,
    isError: isErrorRecentGrades,
    isPending: isPendingRecentGrades,
  } = useRecentGrades();

  const {
    data: accounts,
    isPending: isPendingAccount,
    isError: isErrorAccount,
  } = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      const accounts = (await authClient.listAccounts()) satisfies Account[];
      return accounts;
    },
  });

  const {
    data: customAverages,
    isError: isCustomAveragesError,
    isPending: isCustomAveragesPending,
  } = useCustomAverages();

  useEffect(() => {
    if (!periods) return;

    const savedTab = localStorage.getItem("selectedTab");

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

  // Error State
  if (
    isError ||
    periodsIsError ||
    organizedSubjectsIsError ||
    isErrorRecentGrades ||
    isErrorAccount ||
    isCustomAveragesError
  ) {
    return (
      <div>
        <ErrorStateCard />
      </div>
    );
  }

  // Loading State
  if (
    isPending ||
    periodsIsPending ||
    organizedSubjectsIsPending ||
    isPendingRecentGrades ||
    isPendingAccount ||
    isCustomAveragesPending ||
    selectedTab === null
  ) {
    return (
      <div>
        <DashboardLoader />
      </div>
    );
  }

  const sortedPeriods = periods
    ?.slice()
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

  const linkedProviders = new Set(accounts?.map((acc) => acc.provider));

  //todo implement a custom field
  if (
    new Date(session?.user?.createdAt).getTime() >
      Date.now() - 1000 * 60 * 10 &&
    (!subjects || subjects.length === 0) &&
    (linkedProviders.has("google") || linkedProviders.has("microsoft")) &&
    localStorage.getItem("isOnboardingCompleted") !== "true"
  ) {
    router.push("/onboarding");
  }

  return (
    <main className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
      <div className="flex flex-wrap items-center justify-between min-h-9">
        <h1 className="md:text-3xl font-bold text-xl">{t("overviewTitle")}</h1>
        <h1 className="md:text-3xl font-normal text-lg">
          {t("greeting", {
            name: session?.user?.name ? session?.user?.name.split(" ")[0] : "",
          })}{" "}
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
          localStorage.setItem("selectedTab", value);
        }}
      >
        <div className="flex flex-col gap-2 md:gap-4">
          <div className="hidden md:flex gap-4">
            <ScrollArea>
              <div className="flex w-full">
                <TabsList className="flex">
                  {periods?.map((period) => (
                    <TabsTrigger key={period.id} value={period.id}>
                      {t("periodName", { name: period.name })}
                    </TabsTrigger>
                  ))}

                  <TabsTrigger value="full-year">{t("fullYear")}</TabsTrigger>
                </TabsList>
              </div>

              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div className="flex md:hidden">
            <Select
              value={selectedTab}
              onValueChange={(value) => {
                setSelectedTab(value);
                localStorage.setItem("selectedTab", value);
              }}
            >
              <SelectTrigger>
                <SelectValue>
                  {periods?.find((period) => period.id === selectedTab)?.name ||
                    t("fullYear")}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {periods?.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {t("periodName", { name: period.name })}
                  </SelectItem>
                ))}
                <SelectItem value="full-year">{t("fullYear")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                    customAverages={customAverages}
                    periods={periods}
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
                        )?.period || fullYearPeriod(subjects)
                      }
                      periods={periods}
                    />

                    {/* Dernières notes */}
                    {subjects.length > 0 && (
                      <RecentGradesCard recentGrades={recentGrades} period={period} />
                    )}
                  </div>
                </TabsContent>
              ))}
          <TabsContent value="full-year">
            <DataCards
              subjects={subjects || []}
              period={fullYearPeriod(subjects)}
              customAverages={customAverages}
              periods={periods}
            />

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              <GlobalAverageChart
                subjects={subjects || []}
                period={fullYearPeriod(subjects)}
                periods={periods}
              />

              {subjects.length > 0 && (
                <RecentGradesCard recentGrades={recentGrades} period={fullYearPeriod(subjects)} />
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
