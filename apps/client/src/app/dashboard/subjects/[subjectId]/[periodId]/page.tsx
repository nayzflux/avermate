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

  if (organizedSubjectsIsPending || organizedSubjectIsPending || isPeriodPending) {
    return <div>Loading...</div>;
  }

  // console.log(
  //   organizedSubjects?.find((p) => p.period.id === periodId)?.subjects || [],
  //   organizedSubject,
  //   period,
  //   organizedSubjects
  // );

  return (
    <SubjectWrapper
      subjects={
        organizedSubjects?.find((p) => p.period.id === periodId)?.subjects || []
      }
      subject={organizedSubject}
      period={
        organizedSubjects?.find((p) => p.period.id === periodId)?.period || []
      }
    />
  );
}
