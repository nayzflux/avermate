"use client";

import SubjectMoreButton from "@/components/buttons/dashboard/subject/subject-more-button";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import {
  average,
  getBestGradeInSubject,
  getWorstGradeInSubject,
  subjectImpact,
} from "@/utils/average";
import { formatDiff, formatGradeValue } from "@/utils/format";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import SubjectAverageChart from "./subject-average-chart";
import { Card } from "@/components/ui/card";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";

function SubjectWrapper({
  subjects,
  subject,
  period,
}: {
  subjects: Subject[];
  subject: Subject;
  period: Period;
}) {
  const router = useRouter();

  // Vérification des notes pour la période donnée
  const hasGrades = subjects.some((subj) =>
    subj.grades.some((grade) => grade.periodId === period.id)
  );

  // Affiche un message si aucune note n'est présente
  if (!hasGrades) {
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

        <div>
          <div className="flex justify-between items-center">
            <p className="text-2xl font-semibold">{subject?.name}</p>
            {subject && <SubjectMoreButton subject={subject} />}
          </div>
        </div>

        <Separator />
        <DataCard
          title="Coefficient"
          description={`Coefficient de ${subject?.name}`}
          icon={VariableIcon}
        >
          <p className="text-3xl font-bold">
            {formatGradeValue(subject?.coefficient || 0)}
          </p>
        </DataCard>
        <Card className="lg:col-span-5 flex flex-col justify-center items-center p-6 gap-8 w-full h-full">
          <BookOpenIcon className="w-12 h-12" />
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-xl font-semibold">
              Aucune note pour l&apos;instant
            </h2>
            <p>
              Ajouter une nouvelle note pour commencer à suivre vos moyennes.
            </p>
          </div>
          <AddGradeDialog>
            <Button variant="outline">
              <PlusCircleIcon className="size-4 mr-2" />
              Ajouter une note
            </Button>
          </AddGradeDialog>
        </Card>
      </div>
    );
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

      <div>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">{subject?.name}</p>
          {subject && <SubjectMoreButton subject={subject} />}
        </div>
      </div>

      <Separator />

      {/* Data card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject average */}
        <DataCard
          title="Moyenne"
          description={`Votre moyenne actuelle en ${subject?.name}`}
          icon={AcademicCapIcon}
        >
          <GradeValue
            value={(average(subject?.id, subjects) || 0) * 100}
            outOf={2000}
          />
        </DataCard>

        {/* Subject impact on average */}
        <DataCard
          title="Impact sur la moyenne"
          description={`Visualisez l'impact de ${subject?.name} sur votre moyenne générale`}
          icon={ArrowUpCircleIcon}
        >
          <p className="text-3xl font-bold">
            {formatDiff(subjectImpact(subject.id, subjects)?.difference || 0)}
          </p>
        </DataCard>

        {/* Coeff */}
        <DataCard
          title="Coefficient"
          description={`Coefficient de ${subject?.name}`}
          icon={VariableIcon}
        >
          <p className="text-3xl font-bold">
            {formatGradeValue(subject?.coefficient || 0)}
          </p>
        </DataCard>

        {/* Best grade */}
        <DataCard
          title="Meilleure note"
          description={`Votre plus belle performance en ${(() => {
            const bestGradeObj = getBestGradeInSubject(subjects, subject.id);
            if (bestGradeObj && bestGradeObj.grade !== undefined) {
              return bestGradeObj.subject.name;
            } else {
              return "N/A";
            }
          })()}`}
          icon={SparklesIcon}
        >
          <p className="text-3xl font-bold">
            {(() => {
              const bestGradeObj = getBestGradeInSubject(subjects, subject.id);
              if (bestGradeObj && bestGradeObj.grade !== undefined) {
                return bestGradeObj.grade / 100;
              } else {
                return "N/A";
              }
            })()}
          </p>
        </DataCard>

        {/* Worst grade */}
        <DataCard
          title="Pire note"
          description={`Votre moins bonne performance en ${(() => {
            const worstGradeObj = getWorstGradeInSubject(subjects, subject.id);
            if (worstGradeObj && worstGradeObj.grade !== undefined) {
              return worstGradeObj.subject.name;
            } else {
              return "N/A";
            }
          })()}`}
          icon={SparklesIcon}
        >
          <p className="text-3xl font-bold">
            {(() => {
              const worstGradeObj = getWorstGradeInSubject(
                subjects,
                subject.id
              );
              if (worstGradeObj && worstGradeObj.grade !== undefined) {
                return worstGradeObj.grade / 100;
              } else {
                return "N/A";
              }
            })()}
          </p>
        </DataCard>
      </div>

      <Separator />

      {/* Charts of average evolution */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Evolution de la moyenne</h2>

        <SubjectAverageChart
          subjectId={subject.id}
          period={period}
          subjects={subjects}
        />
      </div>

      {/* Last grades */}
    </div>
  );
}

export default SubjectWrapper;
