"use client";

import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Grade } from "@/types/grade";
import { getParents, gradeImpact } from "@/utils/average";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import { Subject } from "@/types/subject";

export default function GradeWrapper({ gradeId }: { gradeId: string }) {
  const { data: grade, isPending, isError } = useQuery({
    queryKey: ["grades", gradeId],
    queryFn: async () => {
      const res = await apiClient.get(`grades/${gradeId}`);
      const data = await res.json<{ grade: Grade }>();
      return data.grade;
    },
  });

  const {
    data: subjects,
    isPending: isSubjectsPending,
    isError: isSubjectsError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await apiClient.get("subjects");
      const data = await res.json<{ subjects: Subject[] }>();
      return data.subjects;
    },
  });


  if (isPending) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>There was an error</p>
      </div>
    );
  }

  const gradeParentsId = getParents(subjects, grade.subject.id);
  
  const gradeParents = subjects.filter((subject) => gradeParentsId.includes(subject.id));

  console.log(gradeParents);

  return (
    <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="size-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <div>
        <p className="text-2xl font-semibold">{grade.name}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
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
          <p className="text-4xl font-bold">{grade.subject.name}</p>
        </DataCard>
        <DataCard
          title="Coefficient"
          description="Le coefficient de cette évaluation"
          icon={VariableIcon}
        >
          <p className="text-4xl font-bold">{grade.coefficient / 100}</p>
        </DataCard>
        <DataCard
          title="Impact sur la moyenne générale"
          description="Visualisez l'impact de cette évaluation sur votre moyenne générale"
          icon={ArrowUpCircleIcon}
        >
          <p className="text-4xl font-bold">
            {(() => {
              const diff =
                gradeImpact(grade.id, undefined, subjects)?.difference || 0;
              return diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
            })()}
          </p>
        </DataCard>
        <DataCard
          title="Impact sur la moyenne de la matière"
          description={`Visualisez l'impact de cette évaluation sur votre moyenne de la matière ${grade.subject.name}`}
          icon={ArrowUpCircleIcon}
        >
          <p className="text-4xl font-bold">
            {(() => {
              const diff =
                gradeImpact(grade.id, grade.subjectId, subjects)?.difference || 0;
              return diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
            })()}
          </p>
        </DataCard>
        {
          gradeParents.map((parent) => (
            <DataCard
              key={parent.id}
              title={`Impact sur la moyenne de ${parent.name}`}
              description={`Visualisez l'impact de cette évaluation sur votre moyenne de la matière ${parent.name}`}
              icon={ArrowUpCircleIcon}
            >
              <p className="text-4xl font-bold">
                {(() => {
                  const diff =
                    gradeImpact(grade.id, parent.id, subjects)?.difference || 0;
                  return diff > 0 ? `+${diff.toFixed(2)}` : `${diff.toFixed(2)}`;
                })()}
              </p>
            </DataCard>
          ))
        }
        <DataCard
          title="Date de l'évaluation"
          description="La date de passage de cette évaluation"
          icon={VariableIcon}
        >
          <p className="text-4xl font-bold">
            {new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(grade.passedAt))}
          </p>
        </DataCard>
        <DataCard
          title="Date d'ajout"
          description="La date d'ajout de cette évaluation"
          icon={VariableIcon}
        >
          <p className="text-4xl font-bold">
            {new Intl.DateTimeFormat("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date(grade.createdAt))}
          </p>
        </DataCard>
      </div>
    </div>
  );
}
