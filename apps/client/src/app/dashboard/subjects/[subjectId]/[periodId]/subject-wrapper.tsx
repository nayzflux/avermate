"use client";

import { DifferenceBadge } from "@/app/dashboard/grades/[gradeId]/difference-badge";
import SubjectMoreButton from "@/components/buttons/dashboard/subject/subject-more-button";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import AddGradeDialog from "@/components/dialogs/add-grade-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import {
  average,
  getBestGradeInSubject,
  getParents,
  getWorstGradeInSubject,
  subjectImpact,
} from "@/utils/average";
import { formatGradeValue } from "@/utils/format";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  BookOpenIcon,
  PlusCircleIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import SubjectAverageChart from "./subject-average-chart";

function SubjectWrapper({
  subjects,
  subject,
  period,
  onBack,
}: {
  subjects: Subject[];
  subject: Subject;
  period: Period;
  onBack: () => void;
}) {
  const parentSubjects = () => {
    if (!subject || !subjects) {
      return [];
    }

    const parentIds = getParents(subjects, subject.id);
    return subjects.filter((subj) => parentIds.includes(subj.id));
  };

  // const hasGrades =
  //   period.id === "full-year"
  //     ? subjects.some((subj) => subj.grades.length > 0)
  //     : subjects.some((subj) =>
  //         subj.grades.some((grade) => grade.periodId === period.id)
  //       );

  const hasGrades = (subjectId: string): boolean => {
    const currentSubject = subjects.find((subj) => subj.id === subjectId);

    if (!currentSubject) {
      return false;
    }

    // Check grades in the current subject
    const currentHasGrades =
      period.id === "full-year"
        ? currentSubject.grades.length > 0
        : currentSubject.grades.some((grade) => grade.periodId === period.id);

    if (currentHasGrades) {
      return true;
    }

    // Recursively check grades in sub-subjects
    const childSubjects = subjects.filter(
      (subj) => subj.parentId === currentSubject.id
    );
    return childSubjects.some((child) => hasGrades(child.id));
  };

  // Determine if there are grades in the selected subject or its sub-subjects
  const isGradePresent = hasGrades(subject.id);

  if (!isGradePresent) {
    return (
      <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
        <div>
          <Button
            className="text-blue-600"
            variant="link"
            onClick={onBack} // Use the onBack function instead of router.back()
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
            <h2 className="text-xl font-semibold text-center">
              Aucune note pour l&apos;instant
            </h2>
            <p className="text-center">
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
    <div className="flex flex-col gap-4 md:gap-8 m-auto max-w-[2000px]">
      <div>
        <Button className="text-blue-600" variant="link" onClick={onBack}>
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

      {/* Main Data Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subject Average */}
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
        {/* Coefficient */}
        <DataCard
          title="Coefficient"
          description={`Coefficient de ${subject?.name}`}
          icon={VariableIcon}
        >
          <p className="text-3xl font-bold">
            {formatGradeValue(subject?.coefficient || 0)}
          </p>
        </DataCard>
        {/* Subject Impact */}
        <DataCard
          title="Impact sur la moyenne générale"
          description={`Impact de ${subject?.name} sur la moyenne générale`}
          icon={ArrowUpCircleIcon}
        >
          <DifferenceBadge
            diff={
              subjects
                ? subjectImpact(subject.id, undefined, subjects)?.difference ||
                  0
                : 0
            }
          />
        </DataCard>

        {parentSubjects().map((parent) => (
          <DataCard
            key={parent.id}
            title={`Impact sur ${parent.name}`}
            description={`Impact de ${subject?.name} sur la moyenne de ${parent.name}`}
            icon={ArrowUpCircleIcon}
          >
            <DifferenceBadge
              diff={
                subjects
                  ? subjectImpact(subject.id, parent.id, subjects)
                      ?.difference || 0
                  : 0
              }
            />
          </DataCard>
        ))}
        <DataCard
          title="Meilleure note"
          description={`Votre plus belle performance en ${(() => {
            const bestGradeObj = getBestGradeInSubject(subjects, subject.id);
            return bestGradeObj?.subject?.name ?? "N/A";
          })()}`}
          icon={SparklesIcon}
        >
          <p className="text-3xl font-bold">
            {(() => {
              const bestGradeObj = getBestGradeInSubject(subjects, subject.id);
              return bestGradeObj?.grade !== undefined
                ? bestGradeObj.grade / 100
                : "N/A";
            })()}
          </p>
        </DataCard>

        {/* Worst grade */}
        <DataCard
          title="Pire note"
          description={`Votre moins bonne performance en ${(() => {
            const worstGradeObj = getWorstGradeInSubject(subjects, subject.id);
            return worstGradeObj?.subject?.name ?? "N/A";
          })()}`}
          icon={SparklesIcon}
        >
          <p className="text-3xl font-bold">
            {(() => {
              const worstGradeObj = getWorstGradeInSubject(
                subjects,
                subject.id
              );
              return worstGradeObj?.grade !== undefined
                ? worstGradeObj.grade / 100
                : "N/A";
            })()}
          </p>
        </DataCard>
      </div>

      <Separator />

      {/* Charts */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Evolution de la moyenne</h2>
        <SubjectAverageChart
          subjectId={subject.id}
          period={period}
          subjects={subjects}
        />
      </div>
    </div>
  );
}

export default SubjectWrapper;
