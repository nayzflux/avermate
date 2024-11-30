"use client";

import GradeWrapper from "./grade-wrapper";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { Grade } from "@/types/grade";

export default function GradePage({
  params,
}: {
  params: Promise<{ gradeId: string; periodId: string }>;
}) {
  const { periodId, gradeId } = use(params);

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
    data: grade,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["grades", gradeId],
    queryFn: async () => {
      const res = await apiClient.get(`grades/${gradeId}`);
      const data = await res.json<{ grade: Grade }>();
      return data.grade;
    },
  });

  if (isPending || organizedSubjectsIsPending) {
    return <div>Loading...</div>;
  }

  // console.log(
  //   organizedSubjects?.find((p) => p.period.id === periodId)?.subjects || [],
  //   grade
  // );

  return (
    <GradeWrapper
      subjects={
        organizedSubjects?.find((p) => p.period.id === periodId)?.subjects  || []
      }
      grade={grade}
      periodId={periodId}
    />
  );
}
