"use client";

import errorStateCard from "@/components/skeleton/error-card";
import gradeLoader from "@/components/skeleton/grade-loader";
import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { Grade } from "@/types/grade";
import { Average } from "@/types/average";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GradeWrapper from "./grade-wrapper";

export default function GradePage() {
  const { periodId, gradeId } = useParams() as {
    periodId: string;
    gradeId: string;
  };

  let periodIdCorrected = periodId;

  if (periodIdCorrected == "null") {
    periodIdCorrected = "full-year";
  }

  const router = useRouter();

  const [returnUrl, setReturnUrl] = useState("/dashboard");

  useEffect(() => {
    // Try to get from localStorage
    const storedFrom = localStorage.getItem("backFromGradeOrSubject");
    if (storedFrom) {
      setReturnUrl(storedFrom);
    } else {
      setReturnUrl("/dashboard");
    }
  }, []);

  const handleBack = () => {
    router.push(returnUrl);
    localStorage.removeItem("backFromGradeOrSubject");
  };

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

  const {
    data: customAverages,
    isError: isCustomAveragesError,
    isPending: isCustomAveragesPending,
  } = useQuery({
    queryKey: ["customAverages"],
    queryFn: async () => {
      const res = await apiClient.get("averages");
      const data = await res.json<{ customAverages: Average[] }>();
      return data.customAverages;
    },
  });

  if (isError || organizedSubjectsIsError || isCustomAveragesError) {
    return <div>{errorStateCard()}</div>;
  }

  if (isPending || organizedSubjectsIsPending || isCustomAveragesPending) {
    return <div>{gradeLoader()}</div>;
  }

  return (
    <GradeWrapper
      onBack={handleBack}
      subjects={
        organizedSubjects?.find((p) => p.period.id === periodIdCorrected)
          ?.subjects || []
      }
      grade={grade}
      periodId={periodIdCorrected}
      customAverages={customAverages}
    />
  );
}
