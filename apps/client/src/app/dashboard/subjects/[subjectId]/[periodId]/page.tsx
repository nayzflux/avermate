"use client";

import errorStateCard from "@/components/skeleton/error-card";
import subjectLoader from "@/components/skeleton/subject-loader";
import { apiClient } from "@/lib/api";
import { GetOrganizedSubjectsResponse } from "@/types/get-organized-subjects-response";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SubjectWrapper from "./subject-wrapper";

export default function SubjectPage() {
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
    isPeriodError ||
    organizedSubjectsIsError ||
    organizedSubjectIsError ||
    isSubjectError ||
    isSubjectsError
  ) {
    return <div>{errorStateCard()}</div>;
  }

  if (
    organizedSubjectsIsPending ||
    organizedSubjectIsPending ||
    isPeriodPending ||
    isSubjectPending ||
    isSubjectsPending
  ) {
    return <div>{subjectLoader()}</div>;
  }

  const sortedPeriods = period
    ?.slice()
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

  const currentDate = new Date().toISOString();

  return (
    <SubjectWrapper
      onBack={handleBack} // Pass the handleBack function to SubjectWrapper
      subjects={
        periodId === "full-year"
          ? subjects
          : organizedSubjects?.find((p) => p.period.id === periodId)
              ?.subjects || []
      }
      subject={organizedSubject}
      period={
        organizedSubjects?.find((p) => p.period.id === periodId)?.period || {
          id: "full-year",
          name: "Toute l'année",
          startAt:
            sortedPeriods && sortedPeriods.length > 0
              ? sortedPeriods[0].startAt
              : new Date(new Date().getFullYear(), 8, 1).toISOString(),
          endAt:
            sortedPeriods && sortedPeriods.length > 0
              ? new Date(sortedPeriods[sortedPeriods.length - 1].endAt).getTime() > new Date().getTime()
                ? currentDate
                : sortedPeriods[sortedPeriods.length - 1].endAt
              : new Date(new Date().getFullYear() + 1, 5, 30).toISOString(),
          userId: "",
          createdAt: "",
        }
      }
    />
  );
}
