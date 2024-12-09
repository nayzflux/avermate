import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Period } from "@/types/period";
import { Subject } from "@/types/subject";
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

export default function DataCards({
  period,
  subjects,
}: {
  period: Period;
  subjects: Subject[];
}) {
  const averages = useMemo(() => {
    console.time("Calculating averages overtime");

    // Calculate the start and end dates
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);

    // Calculate the average grades over time
    const averages = averageOverTime(subjects, undefined, startDate, endDate);

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-2 md:gap-4 pb-4">
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
