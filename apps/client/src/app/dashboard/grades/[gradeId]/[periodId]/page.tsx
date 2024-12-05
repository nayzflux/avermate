"use client";

import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { Grade } from "@/types/grade";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import GradeWrapper from "./grade-wrapper";
import gradeLoader from "@/components/skeleton/grade-loader";
import errorStateCard from "@/components/skeleton/error-card";

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

  if (isError || organizedSubjectsIsError) {
    return <div>
      {errorStateCard()}
    </div>;
  }

  if (isPending || organizedSubjectsIsPending
    // || true
  ) {
        return <div>{gradeLoader()}</div>;
  }

  return (
    <GradeWrapper
      subjects={
        organizedSubjects?.find((p) => p.period.id === periodId)?.subjects || []
      }
      grade={grade}
      periodId={periodId}
    />
  );
}
