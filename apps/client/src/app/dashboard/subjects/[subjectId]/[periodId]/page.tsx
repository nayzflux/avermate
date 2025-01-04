"use client";

import ErrorStateCard from "@/components/skeleton/error-card";
import subjectLoader from "@/components/skeleton/subject-loader";
import { useCustomAverages } from "@/hooks/use-custom-averages";
import { usePeriods } from "@/hooks/use-periods";
import { useSubjects } from "@/hooks/use-subjects";
import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { Subject } from "@/types/subject";
import { fullYearPeriod } from "@/utils/average";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubjectWrapper from "./subject-wrapper";
import { useTranslations } from "next-intl";

export default function SubjectPage() {
  const t = useTranslations("Dashboard.Loader.SubjectLoader");
  const { periodId, subjectId } = useParams() as {
    periodId: string;
    subjectId: string;
  };

  const router = useRouter();

  const [returnUrl, setReturnUrl] = useState("/dashboard");

  useEffect(() => {
    const storedFrom = localStorage.getItem("backFromGradeOrSubject");
    if (storedFrom) {
      setReturnUrl(storedFrom);
    } else {
      setReturnUrl("/dashboard");
    }
  }, []);

  const handleBack = () => {
    router.replace(returnUrl);
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
  } = usePeriods();

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
  } = useSubjects();

  const {
    data: customAverages,
    isError: isCustomAveragesError,
    isPending: isCustomAveragesPending,
  } = useCustomAverages();

  if (
    isPeriodError ||
    organizedSubjectsIsError ||
    organizedSubjectIsError ||
    isSubjectError ||
    isSubjectsError ||
    isCustomAveragesError
  ) {
    return <div>{ErrorStateCard()}</div>;
  }

  if (
    organizedSubjectsIsPending ||
    organizedSubjectIsPending ||
    isPeriodPending ||
    isSubjectPending ||
    isSubjectsPending ||
    isCustomAveragesPending
    // || true
  ) {
    return <div>{subjectLoader(t)}</div>;
  }

  const sortedPeriods = period
    ?.slice()
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

  const periods =
    periodId === "full-year"
      ? fullYearPeriod(subjects)
      : organizedSubjects?.find((p) => p.period.id === periodId)?.period ||
        fullYearPeriod(subjects);

  return (
    <SubjectWrapper
      onBack={handleBack}
      subjects={
        periodId === "full-year"
          ? subjects
          : organizedSubjects?.find((p) => p.period.id === periodId)
              ?.subjects || []
      }
      subject={organizedSubject}
      period={periods}
      customAverages={customAverages}
      periods={sortedPeriods}
    />
  );
}
