"use client";

import MobileAddButtons from "@/components/buttons/dashboard/mobile-add-buttons";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import errorStateCard from "@/components/skeleton/error-card";
import gradesLoader from "@/components/skeleton/grades-loader";
import GradesTable from "@/components/tables/grades-table";
import { Button } from "@/components/ui/button";
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
import { usePeriods } from "@/hooks/use-periods";
import { useSubjects } from "@/hooks/use-subjects";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function GradesPage() {
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

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
  } = useQuery({
    queryKey: ["subjects", "organized-by-periods"],
    queryFn: async () => {
      const res = await apiClient.get("subjects/organized-by-periods");
      const data = await res.json<{
        periods: { period: Period; subjects: Subject[] }[];
      }>();
      return data.periods;
    },
  });

  const {
    data: subjects,
    isError: subjectsIsError,
    isPending: subjectsIsPending,
  } = useSubjects();

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
  if (periodsIsError || organizedSubjectsIsError || subjectsIsError) {
    return <div>{errorStateCard()}</div>;
  }

  // Loading State
  if (
    periodsIsPending ||
    organizedSubjectsIsPending ||
    subjectsIsPending ||
    selectedTab === null
    // || true
  ) {
    return <div>{gradesLoader()}</div>;
  }

  return (
    <main className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
      <div className="flex gap-2 md:gap-16 justify-between items-center min-h-9">
        <h1 className="text-xl md:text-3xl font-bold">Vos notes</h1>

        <div className=" gap-4 hidden lg:flex">
          <AddGradeDialog>
            <Button>
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une note
            </Button>
          </AddGradeDialog>

          <AddSubjectDialog>
            <Button variant="outline">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une matière
            </Button>
          </AddSubjectDialog>

          <AddPeriodDialog>
            <Button variant="outline">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une période
            </Button>
          </AddPeriodDialog>
        </div>
        <div className="flex lg:hidden">
          <MobileAddButtons />
        </div>
      </div>

      <Separator />

      {/* Statistiques */}
      <Tabs
        value={selectedTab}
        onValueChange={(value) => {
          setSelectedTab(value);
          localStorage.setItem("selectedTab", value);
        }}
      >
        <div className="hidden md:flex gap-4">
          <ScrollArea>
            <div className="w-full relative h-10">
              <TabsList className="flex">
                {periods &&
                  periods.length > 0 &&
                  // Sort the periods by start date
                  periods
                    .sort(
                      (a, b) =>
                        new Date(a.startAt).getTime() -
                        new Date(b.startAt).getTime()
                    )
                    .map((period) => (
                      <TabsTrigger key={period.id} value={period.id}>
                        {period.name}
                      </TabsTrigger>
                    ))}
                <TabsTrigger value="full-year">Toute l&apos;année</TabsTrigger>
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
                  "Toute l'année"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {periods?.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
              <SelectItem value="full-year">Toute l&apos;année</SelectItem>
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
                <GradesTable
                  subjects={
                    organizedSubjects?.find((p) => p.period.id === period.id)
                      ?.subjects || []
                  }
                  periodId={period.id}
                />
              </TabsContent>
            ))}
        <TabsContent value="full-year">
          <GradesTable subjects={subjects} periodId="full-year" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
