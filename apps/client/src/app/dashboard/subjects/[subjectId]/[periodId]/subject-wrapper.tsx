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
  fullYearPeriod as buildFullYearPeriod,
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
import errorStateCard from "@/components/skeleton/error-card";

/**
 * Helper to get relevant period IDs if the period is cumulative.
 * If "full-year", we ignore period IDs, so this just returns an empty array
 * (and we'll handle full-year logic in the calling code).
 */
function getRelevantPeriodIds(period: Period, periods: Period[]): string[] {
  if (period.id === "full-year") {
    // We'll treat "full-year" as “all grades,” so no filtering by ID
    return [];
  }

  // Sort all periods by start date
  const sorted = [...periods].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
  );
  const currentIndex = sorted.findIndex((p) => p.id === period.id);

  // If not found, fallback to just this period
  if (currentIndex === -1) {
    return [period.id];
  }

  if (period.isCumulative) {
    // Gather IDs from the first period up to the current one
    return sorted.slice(0, currentIndex + 1).map((p) => p.id);
  }

  // Non-cumulative => just the current period ID
  return [period.id];
}

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
  /**
   * Returns an array of parent subjects for the given `subject`.
   */
  const parentSubjects = () => {
    if (!subject || !subjects) {
      return [];
    }

    const parentIds = getParents(subjects, subject.id);
    return subjects.filter((subj) => parentIds.includes(subj.id));
  };

  /**
   * Determine if there's at least one grade in this subject (or any of its children)
   * that falls into the relevant period(s).
   */
  const hasGrades = (subjId: string): boolean => {
    const currentSubj = subjects.find((s) => s.id === subjId);
    if (!currentSubj) {
      return false;
    }

    // If it's "full-year", we consider *all* grades
    if (period.id === "full-year") {
      if (currentSubj.grades.length > 0) {
        return true;
      }
    } else {
      // If period is cumulative => gather all prior IDs
      const relevantIds = getRelevantPeriodIds(period, periods);

      // Check if at least one grade is in that set of IDs
      const currentHasGrades = currentSubj.grades.some((g) =>
        relevantIds.includes(g.periodId ?? "")
      );
      if (currentHasGrades) {
        return true;
      }
    }

    // Check recursively in children
    const children = subjects.filter((s) => s.parentId === currentSubj.id);
    return children.some((child) => hasGrades(child.id));
  };

  // If no subject or no periods, fallback
  if (!subject || !period) {
    return <div>{errorStateCard()}</div>;
  }

  // Evaluate whether we have relevant grades
  const isGradePresent = hasGrades(subject.id);

  // A small helper to dynamically size columns on extra-wide screens
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

  // If there's no grade found for the subject (and any children),
  // we show the "empty state" with the BookOpen icon
  if (!isGradePresent) {
    return (
      <div className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
        {/* Back Button */}
        <div>
          <Button className="text-blue-600" variant="link" onClick={onBack}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Retour
          </Button>
        </div>

        {/* Subject Title & More Button */}
        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold">{subject?.name}</p>
          {subject && <SubjectMoreButton subject={subject} />}
        </div>

        <Separator />

        {/* Coefficient card (optional) */}
        <DataCard
          title="Coefficient"
          description={`Coefficient de ${subject?.name}`}
          icon={VariableIcon}
        >
          <p className="text-3xl font-bold">
            {formatGradeValue(subject?.coefficient || 0)}
          </p>
        </DataCard>

        {/* Empty state */}
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

  // Otherwise, we *do* have some relevant grades => render the main UI
  return (
    <div className="flex flex-col gap-4 md:gap-8 mx-auto max-w-[2000px]">
      {/* Back Button */}
      <div>
        <Button className="text-blue-600" variant="link" onClick={onBack}>
          <ArrowLeftIcon className="size-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-2xl font-semibold">{subject?.name}</p>
        {subject && (
          <div className="flex gap-4">
            {/* If it's not a "category/parent" subject, show AddGradeDialog */}
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

        {/* Subject Impact on overall average */}
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

        {/* Custom Averages if subject is included */}
        {customAverages.map((ca) => {
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

        {/* Parent Subjects (impact on them) */}
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

        {/* Best Grade */}
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

        {/* Worst Grade */}
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
