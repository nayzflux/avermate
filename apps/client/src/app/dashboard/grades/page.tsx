"use client";

import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import AddPeriodDialog from "@/components/dialogs/add-period-dialog";
import AddSubjectDialog from "@/components/dialogs/add-subject-dialog";
import GradesTable from "@/components/tables/grades-table";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

export default function GradesPage() {
  const {
    data: periods,
    isError: periodsIsError,
    isPending: periodsIsPending,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<{
        periods: Period[];
      }>();

      // // Add a "full year" period to the periods array
      // if (data.periods && data.periods.length > 0) {
      //   data.periods.push({
      //     id: "1",
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

  // Error State
  if (periodsIsError || organizedSubjectsIsError || subjectsIsError) {
    return (
      <div>
        <h2>Error</h2>
        <p>An error occurred!</p>
      </div>
    );
  }

  // Loading State
  if (periodsIsPending || organizedSubjectsIsPending || subjectsIsPending) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col gap-8">
      <div className="flex gap-2 md:gap-16 justify-between items-center">
        <h1 className="text-xl md:text-3xl font-semibold">Vos notes</h1>

        <div className="flex gap-4">
          <AddGradeDialog />

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

          {/* <MoreButton /> */}
        </div>
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
        <ScrollArea>
          <div className="w-full relative h-10">
            <TabsList className="flex absolute">
              {periods &&
                periods.length > 0 &&
                //sort the periods by start date
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
