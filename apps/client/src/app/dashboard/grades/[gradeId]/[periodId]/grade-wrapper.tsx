"use client";

import GradeMoreButton from "@/components/buttons/dashboard/grade/grade-more-button";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Grade } from "@/types/grade";
import { Subject } from "@/types/subject";
import { Average } from "@/types/average";
import {
  getParents,
  gradeImpact,
  isGradeIncludedInCustomAverage,
} from "@/utils/average";
import { formatDate } from "@/utils/format";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  CalendarIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import { DifferenceBadge } from "../difference-badge";

export default function GradeWrapper({
  subjects,
  grade,
  periodId,
  customAverages,
  onBack,
}: {
  subjects: Subject[];
  grade: Grade;
  periodId: string;
  customAverages: Average[];
  onBack: () => void; // Receive the onBack prop from the parent
}) {
  const gradeParents = () => {
    if (!grade || !subjects) {
      return [];
    }

    const gradeParentsId = getParents(subjects, grade.subject.id);
    return subjects.filter((subject) => gradeParentsId.includes(subject.id));
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
      <div>
        <Button
          className="text-blue-600"
          variant="link"
          onClick={onBack} // Use onBack instead of router.back()
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-4">
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

        {/* For each custom average, display a card if the grade is included */}
        {customAverages.map((ca) => {
          // Check if this grade is part of the custom average
          if (!isGradeIncludedInCustomAverage(grade, subjects, ca)) {
            return null; // skip if not included
          }

          // If included, compute the impact of this single grade on that custom average
          const withGrade = ca
            ? gradeImpact(grade.id, undefined, subjects, ca)
            : null;
          // withGrade might be { difference, percentageChange } or null

          return (
            <DataCard
              key={ca.id}
              title={`Impact sur ${ca.name}`}
              description={`Visualisez l'impact de cette note sur le custom average: ${ca.name}`}
              icon={ArrowUpCircleIcon}
            >
              <DifferenceBadge diff={withGrade?.difference || 0} />
            </DataCard>
          );
        })}

        {gradeParents().map((parent: Subject) => (
          <DataCard
            key={parent.id}
            title={`Impact sur ${parent.name}`}
            description={`Visualisez l'impact de cette évaluation sur votre moyenne de la matière ${parent.name}`}
            icon={ArrowUpCircleIcon}
          >
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
          title={`Impact sur ${grade.subject.name}`}
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
