import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
import { Average } from "@/types/average";
import {
  average,
  averageOverTime,
  getBestGrade,
  getBestSubject,
  getSubjectAverageComparison,
  getWorstGrade,
  getWorstSubject,
} from "@/utils/average";
import {
  AcademicCapIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export default function DataCards({
  period,
  subjects,
  customAverages,
  periods,
}: {
  period: Period;
  subjects: Subject[];
    customAverages?: Average[];
    periods: Period[];
}) {
  const averages = useMemo(() => {
    console.time("Calculating averages overtime");

    // Calculate the start and end dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    // Calculate the average grades over time
    const averages = averageOverTime(subjects, undefined, period, periods);

    console.timeEnd("Calculating averages overtime");

    return averages;
  }, [subjects]);

  // Calculate the growth of the average over time
  const growth = useMemo(() => {
    if (!averages) return 0;
    if (averages.length === 0) return 0;

    const lastValue = averages[averages.length - 1];
    const firstValue = averages.find((value) => value !== null);

    if (!firstValue) return 0;
    if (!lastValue || lastValue === 0) return 0;

    const growth = ((lastValue - firstValue) / firstValue) * 100;

    return growth;
  }, [averages]);

  // Calculate the best and worst subjects and grades
  const {
    bestSubject,
    bestSubjectAverage,
    bestSubjectAverageComparaison,
    worstSubject,
    worstSubjectAverage,
    worstSubjectAverageComparaison,
    bestGrade,
    worstGrade,
  } = useMemo(() => {
    //calculate the percentage of growth of the average between the first and last date
    const bestSubject = getBestSubject(subjects, true);
    const bestSubjectAverage = bestSubject
      ? average(bestSubject.id, subjects)
      : null;
    const bestSubjectAverageComparaison = bestSubject
      ? getSubjectAverageComparison(subjects, bestSubject.id, true)
      : null;

    const worstSubject = getWorstSubject(subjects, true);
    const worstSubjectAverage = worstSubject
      ? average(worstSubject.id, subjects)
      : null;
    const worstSubjectAverageComparaison = worstSubject
      ? getSubjectAverageComparison(subjects, worstSubject.id, true)
      : null;

    const bestGrade = getBestGrade(subjects);
    const worstGrade = getWorstGrade(subjects);

    // console.log(subjects);
    // console.log("average", average(undefined, subjects));

    return {
      bestSubject,
      bestSubjectAverage,
      bestSubjectAverageComparaison,
      worstSubject,
      worstSubjectAverage,
      worstSubjectAverageComparaison,
      bestGrade,
      worstGrade,
    };
  }, [subjects]);

  const mainCustomAverages = customAverages?.filter((ca) => ca.isMainAverage);

  // if all datacards are in the empty state, return a global empty state
  if (
    average(undefined, subjects) === null &&
    bestGrade === null &&
    bestSubjectAverage === null &&
    worstGrade === null &&
    worstSubjectAverage === null
  ) {
    return null;
  }

  function get4xlColsClass(colCount: number) {
    switch (colCount) {
      case 5:
        return "4xl:grid-cols-5";
      case 6:
        return "4xl:grid-cols-6";
      default:
        return "4xl:grid-cols-5";
    }
  }

  const columns = 5 + (mainCustomAverages?.length ?? 0) >= 6 ? 6 : 5;
  return (
    <div
      className={cn(`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-4 pb-4`, get4xlColsClass(columns))}
    >
      <DataCard
        title="Moyenne générale"
        icon={AcademicCapIcon}
        description={
          growth > 0
            ? `+${growth.toFixed(2)}% depuis le début`
            : growth < 0
            ? `${growth.toFixed(2)}% depuis le début`
            : "Pas d'évolution depuis le début"
        }
      >
        {average(undefined, subjects) !== null ? (
          <GradeValue
            value={(average(undefined, subjects) || 0) * 100}
            outOf={2000}
            size="xl"
          />
        ) : null}
      </DataCard>

      {/* Main Custom Averages */}
      {mainCustomAverages?.map((ca) => {
        // 1) Compute the custom average
        const customVal = average(undefined, subjects, ca);
        if (customVal === null) {
          return null; // Skip if no subjects/grades included
        }

        // 2) Compute the global average for comparison
        const globalVal = average(undefined, subjects) ?? null;
        let comparisonType: "higher" | "lower" | "same" = "same";
        let comparisonValue = 0;

        // 3) Determine the difference from global average (assuming 0–20 scale)
        if (globalVal !== null && globalVal !== 0) {
          const diff = ((customVal - globalVal) / globalVal) * 100;

          if (diff > 0) {
            comparisonType = "higher";
            comparisonValue = +diff.toFixed(2);
          } else if (diff < 0) {
            comparisonType = "lower";
            comparisonValue = Math.abs(+diff.toFixed(2));
          }
        }

        // 4) Construct the description text
        // If comparisonType is "higher" -> e.g. “+5% par rapport à la moyenne générale”
        // If "lower" -> e.g. “-5% …”
        // Otherwise -> “Pas de comparaison”
        let descriptionText = "Pas de comparaison";
        if (comparisonType === "higher") {
          descriptionText = `+${comparisonValue}% par rapport à la moyenne générale`;
        } else if (comparisonType === "lower") {
          descriptionText = `-${comparisonValue}% par rapport à la moyenne générale`;
        }

        // 5) Display the DataCard
        return (
          <DataCard
            key={ca.id}
            title={ca.name}
            icon={AcademicCapIcon}
            description={descriptionText}
          >
            <GradeValue value={customVal * 100} outOf={2000} size="xl" />
          </DataCard>
        );
      })}

      <DataCard
        title="Meilleure Note"
        icon={PlusIcon}
        description={
          bestGrade !== null
            ? `En ${bestGrade?.subject?.name} ? Impressionant ! (${bestGrade?.name})`
            : "Pas de meilleure note"
        }
      >
        {bestGrade && (
          <GradeValue
            value={bestGrade.grade}
            outOf={bestGrade.outOf}
            size="xl"
          />
        )}
      </DataCard>

      <DataCard
        title="Meilleure Matière"
        icon={ArrowTrendingUpIcon}
        description={
          bestSubjectAverage !== null
            ? `${bestSubject?.name} est ${
                bestSubjectAverageComparaison?.percentageChange?.toFixed(2) ||
                "—"
              }% plus élevé que les autres matières`
            : "Pas de mailleure matière"
        }
      >
        {bestSubjectAverage !== null && (
          <GradeValue value={bestSubjectAverage * 100} outOf={2000} size="xl" />
        )}
      </DataCard>

      <DataCard
        title="Pire note"
        icon={MinusIcon}
        description={
          worstGrade !== null
            ? `En ${worstGrade?.subject?.name} ? Oui, c'est mauvais (${worstGrade?.name})`
            : "Pas de pire note"
        }
      >
        {worstGrade && (
          <GradeValue
            value={worstGrade.grade}
            outOf={worstGrade.outOf}
            size="xl"
          />
        )}
      </DataCard>
      <DataCard
        title="Pire matière"
        icon={ArrowTrendingDownIcon}
        description={
          worstSubjectAverage !== null
            ? `${worstSubject?.name} est ${
                worstSubjectAverageComparaison?.percentageChange?.toFixed(2) ||
                "—"
              }% plus bas que les autres matières`
            : "Pas de pire matière"
        }
      >
        {worstSubjectAverage !== null && (
          <GradeValue
            value={worstSubjectAverage * 100}
            outOf={2000}
            size="xl"
          />
        )}
      </DataCard>
    </div>
  );
}
