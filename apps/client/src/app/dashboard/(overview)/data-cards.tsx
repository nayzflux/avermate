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
  subjects,
  period,
}: {
  subjects: Subject[];
  period: Period;
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
    const firstValue = averages[0];

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
    const bestSubject = getBestSubject(subjects);
    const bestSubjectAverage = average(bestSubject?.id, subjects);
    const bestSubjectAverageComparaison = getSubjectAverageComparison(
      subjects,
      bestSubject?.id || "",
      true
    );

    const worstSubject = getWorstSubject(subjects);
    const worstSubjectAverage = average(worstSubject?.id, subjects);
    const worstSubjectAverageComparaison = getSubjectAverageComparison(
      subjects,
      worstSubject?.id || "",
      true
    );

    const bestGrade = getBestGrade(subjects);
    const worstGrade = getWorstGrade(subjects);

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
    <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 pb-4">
      <DataCard
        title="Overall average"
        icon={AcademicCapIcon}
        description={
          growth > 0
            ? `+${growth.toFixed(2)}% since the beginning`
            : growth < 0
            ? `${growth.toFixed(2)}% since the beginning`
            : "No growth since the beginning"
        }
      >
        <GradeValue
          value={(average(undefined, subjects) || 0) * 100}
          outOf={2000}
          size="xl"
        />
      </DataCard>

      <DataCard
        title="Best grade"
        icon={PlusIcon}
        description={
          bestGrade !== null
            ? `In ${bestGrade?.subject?.name} ? Impressive ! (${bestGrade?.name})`
            : "No best grade"
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
        title="Best subject"
        icon={ArrowTrendingUpIcon}
        description={
          bestSubjectAverage !== null
            ? `${bestSubject?.name} is ${
                bestSubjectAverageComparaison?.percentageChange?.toFixed(2) ||
                "—"
              }% higher than other subjects`
            : "No best subject"
        }
      >
        {bestSubjectAverage && (
          <GradeValue value={bestSubjectAverage * 100} outOf={2000} size="xl" />
        )}
      </DataCard>

      <DataCard
        title="Worst Grade"
        icon={MinusIcon}
        description={
          worstGrade !== null
            ? `In ${worstGrade?.subject?.name} ? Yep that’s bad (${worstGrade?.name})`
            : "No worst grade"
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
        title="Worst subject"
        icon={ArrowTrendingDownIcon}
        description={
          worstSubjectAverage !== null
            ? `${worstSubject?.name} is ${
                worstSubjectAverageComparaison?.percentageChange?.toFixed(2) ||
                "—"
              }% lower than other subjects`
            : "No worst subject"
        }
      >
        {worstSubjectAverage && (
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
