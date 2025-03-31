"use client";

import ErrorStateCard from "@/components/skeleton/error-card";
import gradeLoader from "@/components/skeleton/grade-loader";
import { useCustomAverages } from "@/hooks/use-custom-averages";
import { useGrade } from "@/hooks/use-grade";
import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { useOrganizedSubjects } from "@/hooks/use-get-oragnized-subjects";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GradeWrapper from "./grade-wrapper";
import { useTranslations } from "next-intl";
import { usePeriods } from "@/hooks/use-periods";
import { fullYearPeriod } from "@/utils/average";
import { useSubjects } from "@/hooks/use-subjects";

export default function GradePage() {
  const { periodId, gradeId } = useParams() as {
    periodId: string;
    gradeId: string;
  };

  const t = useTranslations("Dashboard.Loader.GradeLoader");
  const tr = useTranslations("Dashboard.Pages.GradeWrapper"); // Initialize t

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
  } = useOrganizedSubjects();
  
  // useQuery({
  //   queryKey: ["subjects", "organized-by-periods"],
  //   queryFn: async () => {
  //     const res = await apiClient.get("subjects/organized-by-periods");
  //     const data = await res.json<GetOrganizedSubjectsResponse>();
  //     return data.periods;
  //   },
  // });

  const { data: grade, isPending, isError } = useGrade(gradeId);

  const {
    data: customAverages,
    isError: isCustomAveragesError,
    isPending: isCustomAveragesPending,
  } = useCustomAverages();

  const {
    data: subjects,
    isPending: isSubjectsPending,
    isError: isSubjectsError,
  } = useSubjects();

  const {
    data: periods,
    isPending: isPeriodPending,
    isError: isPeriodError,
  } = usePeriods();

  if (
    isError ||
    organizedSubjectsIsError ||
    isCustomAveragesError ||
    isSubjectsError ||
    isPeriodError
  ) {
    return <div>{ErrorStateCard()}</div>;
  }

  if (
    isPending ||
    organizedSubjectsIsPending ||
    isCustomAveragesPending ||
    isSubjectsPending ||
    isPeriodPending
    // || true
  ) {
    return <div>{gradeLoader(t)}</div>;
  }

  const period =
    periodId == "full-year"
      ? { ...fullYearPeriod(subjects), name: tr("fullYear") }
      : periods?.find((p) => p.id === periodId) || fullYearPeriod(subjects);

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
      period={period}
    />
  );
}
