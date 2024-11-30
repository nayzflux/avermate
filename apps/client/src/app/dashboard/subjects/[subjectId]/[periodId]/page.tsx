"use client";

import { use } from "react";
import SubjectWrapper from "./subject-wrapper";
import { useQuery } from "@tanstack/react-query";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { Period } from "@/types/period";

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subjectId: string; periodId: string }>;
}) {
  const { periodId, subjectId } = use(params);

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
    data: organizedSubject,
    isError: organizedSubjectIsError,
    isPending: organizedSubjectIsPending,
  } = useQuery({
    queryKey: ["subject", "organized-by-periods", subjectId],
    queryFn: async () => {
      const res = await apiClient.get(
        `subjects/organized-by-periods/${subjectId}`
      );
      const data = await res.json<{ subject: Subject }>();
      return data.subject;
    },
  });

  // Fetch period data
  const {
    data: period,
    isError: isPeriodError,
    isPending: isPeriodPending,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<{ periods: Period[] }>();
      return data.periods;
    },
  });

  const {
    data: subject,
    isError: isSubjectError,
    isPending: isSubjectPending,
  } = useQuery({
    queryKey: ["subjects", subjectId],
    queryFn: async () => {
      const res = await apiClient.get(`subjects/${subjectId}`);
      const data = await res.json<{ subject: Subject }>();
      return data.subject;
    },
  });

  const {
    data: subjects,
    isError: isSubjectsError,
    isPending: isSubjectsPending,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{ subjects: Subject[] }>();
      return data.subjects;
    },
  });

  if (
    organizedSubjectsIsPending ||
    organizedSubjectIsPending ||
    isPeriodPending
  ) {
    return <div>Loading...</div>;
  }

  // console.log(
  //   organizedSubjects?.find((p) => p.period.id === periodId)?.subjects || [],
  //   organizedSubject,
  //   period,
  //   organizedSubjects
  // );

    const sortedPeriods = period
      ?.slice()
      .sort(
        (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
      );

  return (
    <SubjectWrapper
      subjects={
        periodId === "full-year"
          ? subjects
          : organizedSubjects?.find((p) => p.period.id === periodId)
              ?.subjects || []
      }
      subject={organizedSubject}
      period={
        periodId === "full-year"
          ? {
              id: "full-year",
              name: "Toute l'année",
              startAt:
                sortedPeriods && sortedPeriods.length > 0
                  ? sortedPeriods[0].startAt
                  : new Date(new Date().getFullYear(), 8, 1).toISOString(),
              endAt:
                sortedPeriods && sortedPeriods.length > 0
                  ? sortedPeriods[sortedPeriods.length - 1].endAt
                  : new Date(new Date().getFullYear() + 1, 5, 30).toISOString(),
            }
          : organizedSubjects?.find((p) => p.period.id === periodId)?.period ||
            []
      }
    />
  );
}
