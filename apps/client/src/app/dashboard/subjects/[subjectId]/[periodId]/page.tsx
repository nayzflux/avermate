"use client";

import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import SubjectWrapper from "./subject-wrapper";

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

  if (isPeriodError || organizedSubjectsIsError || organizedSubjectIsError) {
    return <div>Error!</div>;
  }

  if (
    organizedSubjectsIsPending ||
    organizedSubjectIsPending ||
    isPeriodPending
  ) {
    return <div>Loading...</div>;
  }

  return (
    <SubjectWrapper
      subjects={
        organizedSubjects?.find((p) => p.period.id === periodId)?.subjects || []
      }
      subject={organizedSubject}
      period={
        organizedSubjects?.find((p) => p.period.id === periodId)?.period || {
          id: "full-year",
          name: "Toute l'année",
          startAt: new Date(new Date().getFullYear(), 8, 1).toISOString(),
          endAt: new Date(new Date().getFullYear() + 1, 5, 30).toISOString(),
          userId: "",
          createdAt: "",
        }
      }
    />
  );
}
