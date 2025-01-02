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
import { Average } from "@/types/average";
import {
  average,
  getBestGradeInSubject,
  getParents,
  getWorstGradeInSubject,
  subjectImpact,
  isSubjectIncludedInCustomAverage,
  buildCustomConfig,
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
import { cn } from "@/lib/utils";

function SubjectWrapper({
  subjects,
  subject,
  period,
  customAverages,
  onBack,
  periods,
}: {
  subjects: Subject[];
  subject: Subject;
  period: Period;
  customAverages: Average[];
  onBack: () => void;
  periods: Period[];
}) {
  const parentSubjects = () => {
    if (!subject || !subjects) {
      return [];
    }

    const parentIds = getParents(subjects, subject.id);
    return subjects.filter((subj) => parentIds.includes(subj.id));
  };

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

  function get4xlColsClass(cardCount: number) {
    switch (cardCount) {
      case 5:
        return "4xl:grid-cols-5";
      case 6:
        return "4xl:grid-cols-6";
      case 7:
        return "4xl:grid-cols-4";
      case 8:
        return "4xl:grid-cols-4";
      default:
        return "4xl:grid-cols-5";
    }
  }

  if (!isGradePresent) {
    return (
      <div className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
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
          {!subject.isDisplaySubject ? (
            <AddGradeDialog parentId={subject.id}>
              <Button variant="outline">
                <PlusCircleIcon className="size-4 mr-2" />
                Ajouter une note dans {subject.name}
              </Button>
            </AddGradeDialog>
          ) : (
            <AddGradeDialog>
              <Button variant="outline">
                <PlusCircleIcon className="size-4 mr-2" />
                Ajouter une note
              </Button>
            </AddGradeDialog>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
      <div>
        <Button className="text-blue-600" variant="link" onClick={onBack}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Retour
        </Button>
      </div>

      <div>
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">{subject?.name}</p>
          {subject && (
            <div className="flex gap-4">
              {!subject.isDisplaySubject ? (
                <AddGradeDialog parentId={subject.id}>
                  <Button className="hidden md:flex">
                    <PlusCircleIcon className="size-4 mr-2" />
                    Ajouter une note
                  </Button>
                </AddGradeDialog>
              ) : null}
              <SubjectMoreButton subject={subject} />
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Main Data Cards */}
      <div
        className={cn(
          `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4`,
          get4xlColsClass(
            5 +
              customAverages.filter((ca) =>
                isSubjectIncludedInCustomAverage(
                  subject,
                  subjects,
                  buildCustomConfig(ca)
                )
              ).length +
              parentSubjects().length
          )
        )}
      >
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

        {/* Render a card for each custom average if this subject is included */}
        {customAverages.map((ca) => {
          // Build the config map for this custom average
          const configMap = buildCustomConfig(ca);

          if (!isSubjectIncludedInCustomAverage(subject, subjects, configMap)) {
            return null;
          }

          const impact = subjectImpact(subject.id, undefined, subjects, ca);
          return (
            <DataCard
              key={ca.id}
              title={`Impact sur ${ca.name}`}
              description={`Impact de ${subject.name} sur la moyenne personnalisée ${ca.name}`}
              icon={ArrowUpCircleIcon}
            >
              <DifferenceBadge diff={impact?.difference || 0} />
            </DataCard>
          );
        })}

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
          periods={periods}
        />
      </div>
    </div>
  );
}

export default SubjectWrapper;
