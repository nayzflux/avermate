"use client";

import GradeMoreButton from "@/components/buttons/dashboard/grade/grade-more-button";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { Subject } from "@/types/subject";
import { getParents, gradeImpact } from "@/utils/average";
import { formatDate } from "@/utils/format";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  CalendarIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {GetOrganizedSubjectsResponse} from "@/types/get-organized-subjects-response";
import { DifferenceBadge } from "./difference-badge";

export default function GradeWrapper({ 
  subjects,
  grade,
  periodId,
}: {
  subjects: Subject[];
  grade: Grade;
  periodId: string;
}) {
  const router = useRouter();

  // const {
  //   data: grade,
  //   isPending,
  //   isError,
  // } = useQuery({
  //   queryKey: ["grades", gradeId],
  //   queryFn: async () => {
  //     const res = await apiClient.get(`grades/${gradeId}`);
  //     const data = await res.json<{ grade: Grade }>();
  //     return data.grade;
  //   },
  // });

  // const {
  //   data: subjects,
  //   isError: isSubjectsPending,
  //   isPending: isSubjectsError,
  // } = useQuery({
  //   queryKey: ["subjects", "organized-by-periods"],
  //   queryFn: async () => {
  //     const res = await apiClient.get("subjects/organized-by-periods");
  //     let data = await res.json<GetOrganizedSubjectsResponse>();

  //     // filter the organized subjects by the periodId
  //     data.periods = data.periods.filter((period) => period.id === periodId);

  //     return data.periods[0].subjects;
  //   },
  // });

  const gradeParents = () => {
    if (!grade || !subjects) {
      return [];
    }

    const gradeParentsId = getParents(subjects, grade.subject.id);

    const gradeParents = subjects.filter((subject) =>
      gradeParentsId.includes(subject.id)
    );

    return gradeParents;
  }

  return (
    <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div>
        <Button
          className="text-blue-600"
          variant="link"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">{grade.name}</p>

        <GradeMoreButton grade={grade} />
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-3  gap-4">
        <DataCard
          title="Note obtenue"
          description={`Votre note obtenue lors de cette évaluation sur ${
            grade.outOf / 100
          }`}
          icon={SparklesIcon}
        >
          <GradeValue value={grade.value} outOf={grade.outOf} />
        </DataCard>

        <DataCard
          title="Matière"
          description="La matière de cette évaluation"
          icon={AcademicCapIcon}
        >
          <p className="texl-xl md:text-3xl font-bold">{grade.subject.name}</p>
        </DataCard>
        <DataCard
          title="Coefficient"
          description="Le coefficient de cette évaluation"
          icon={VariableIcon}
        >
          <p className="texl-xl md:text-3xl font-bold">
            {grade.coefficient / 100}
          </p>
        </DataCard>

        <DataCard
          title="Impact sur la moyenne générale"
          description="Visualisez l'impact de cette évaluation sur votre moyenne générale"
          icon={ArrowUpCircleIcon}
        >
          <DifferenceBadge
            diff={
              subjects
                ? gradeImpact(grade.id, undefined, subjects)?.difference || 0
                : 0
            }
          />
        </DataCard>

        <DataCard
          title="Impact sur la moyenne de la matière"
          description={`Visualisez l'impact de cette évaluation sur votre moyenne de la matière ${grade.subject.name}`}
          icon={ArrowUpCircleIcon}
        >
          <DifferenceBadge
            diff={
              subjects
                ? gradeImpact(grade.id, grade.subjectId, subjects)
                    ?.difference || 0
                : 0
            }
          />
        </DataCard>
        {gradeParents().map((parent: Subject) => (
          <DataCard
            key={parent.id}
            title={`Impact sur la moyenne de ${parent.name}`}
            description={`Visualisez l'impact de cette évaluation sur votre moyenne de la matière ${parent.name}`}
            icon={ArrowUpCircleIcon}
          >
            {/* <p className="text-3xl font-bold">
              {subjects &&
                formatDiff(
                  gradeImpact(grade.id, parent.id, subjects)?.difference || 0
                )}
            </p> */}
            <DifferenceBadge
              diff={
                subjects
                  ? gradeImpact(grade.id, parent.id, subjects)?.difference || 0
                  : 0
              }
            />
          </DataCard>
        ))}

        <DataCard
          title="Date de passage"
          description="La date de passage de cette évaluation"
          icon={CalendarIcon}
        >
          <p className="texl-xl md:text-3xl font-bold">
            {formatDate(new Date(grade.passedAt))}
          </p>
        </DataCard>

        <DataCard
          title="Date d'ajout"
          description="La date d'ajout de cette évaluation"
          icon={CalendarIcon}
        >
          <p className="texl-xl md:text-3xl font-bold">
            {formatDate(new Date(grade.createdAt))}
          </p>
        </DataCard>
      </div>
    </div>
  );
}
