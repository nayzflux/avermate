import { useMemo } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { CardTemplate, CardLayoutItem } from "@/hooks/use-card-layouts";
import GradeValue from "./grade-value";
import { Subject } from "@/types/subject";
import { Period } from "@/types/period";
import { Average } from "@/types/average";
import { Grade } from "@/types/grade";
import {
  average,
  averageOverTime,
  getBestGrade,
  getBestSubject,
  getWorstGrade,
  getWorstSubject,
  getSubjectAverageComparison,
  gradeImpact,
  addGeneralAverageToSubjects,
  buildGeneralAverageSubject,
} from "@/utils/average";
import { useTranslations } from "next-intl";
import * as HeroIcons from "@heroicons/react/24/outline";

// ===== Type Definitions =====

// Type for all available calculator functions
type CalculatorResult = {
  value: number | null;
  outOf?: number;
  description?: string;
  customAverageName?: string;
  growthPercentage?: number;
  comparisonPercentage?: number;
  comparisonType?: "higher" | "lower" | "same";
  subjectName?: string;
  gradeName?: string;
  // Additional metadata that might be useful for descriptions
  metadata?: Record<string, any>;
};

type CalculatorFunction = (
  params: any,
  subjects: Subject[],
  period: Period,
  periods: Period[],
  customAverages?: Average[],
  grade?: Grade
) => CalculatorResult;

// Translation keys for built-in cards
type DataCardsTranslationKey =
  | "generalAverage"
  | "sinceStart"
  | "noChangeSinceStart"
  | "comparedToGeneralAverage"
  | "noComparison"
  | "bestGrade"
  | "bestGradeWithSubject"
  | "noBestGrade"
  | "bestSubject"
  | "bestSubjectWithComparison"
  | "noBestSubject"
  | "worstGrade"
  | "worstGradeWithSubject"
  | "noWorstGrade"
  | "worstSubject"
  | "worstSubjectWithComparison"
  | "noWorstSubject"
  | "gradeImpact";

// Time range options for description customization
export type TimeRangeOption =
  | "sinceStart"
  | "thisWeek"
  | "thisMonth"
  | "thisYear"
  | "custom";

// Description formatter for built-in cards
type DescriptionFormatter = (
  result: CalculatorResult,
  t: any,
  customTimeRange?: TimeRangeOption,
  customParams?: Record<string, any>
) => string;

// Configuration for built-in cards
interface BuiltInCardConfig {
  titleKey: DataCardsTranslationKey;
  defaultIcon: keyof typeof HeroIcons;
  calculator: string;
  allowIconCustomization: boolean;
  allowTitleCustomization: boolean;
  allowCalculatorCustomization: boolean;
  formatDescription: DescriptionFormatter;
  allowedTimeRanges?: TimeRangeOption[];
  defaultTimeRange?: TimeRangeOption;
  customizableParams?: string[];
}

// ===== Calculator Functions =====

// Map of available calculator functions
const calculators: Record<string, CalculatorFunction> = {
  // Global average calculator
  globalAverage: (params, subjects, period, periods) => {
    // Calculate growth over time
    const averagesOverTime = averageOverTime(
      subjects,
      undefined,
      period,
      periods,
      true
    );
    
    type TimeRangeKeys = "sinceStart" | "thisWeek" | "thisMonth" | "thisYear";

    const timeRange = (params?.timeRange ?? "sinceStart") as TimeRangeKeys;

    let growthValue = 0;

    if (averagesOverTime && averagesOverTime.length > 0) {
      const lastValue = averagesOverTime[averagesOverTime.length - 1];
      const firstValue = {
        "sinceStart": averagesOverTime.find((v) => v !== null),
        "thisWeek": averagesOverTime.find((v, i) => i >= averagesOverTime.length - 7 && v !== null),
        "thisMonth": averagesOverTime.find((v, i) => i >= averagesOverTime.length - 30 && v !== null),
        "thisYear": averagesOverTime.find((v, i) => i >= averagesOverTime.length - 365 && v !== null),
      };
      const firstValueTimeRange = firstValue[timeRange];
      if (
        firstValueTimeRange !== undefined &&
        lastValue !== null &&
        firstValueTimeRange !== null
      ) {
        growthValue = ((lastValue - firstValueTimeRange) / firstValueTimeRange) * 100;
      }
    }

    return {
      value:
        average(undefined, subjects) === null
          ? null
          : average(undefined, subjects)! * 100,
      outOf: 2000,
      growthPercentage: growthValue,
      metadata: {
        timeRange: params?.timeRange || "sinceStart",
      },
    };
  },

  // Custom average calculator
  customAverage: (params, subjects, _, __, customAverages) => {
    const customAverageId = params?.customAverageId;
    const customAverage = customAverageId
      ? customAverages?.find((ca) => ca.id === customAverageId)
      : undefined;

    if (!customAverage) return { value: null };

    // Calculate custom average
    const subjectsWithCustomAverage = addGeneralAverageToSubjects(
      subjects,
      customAverage
    );

    const virtualSubject =
      subjectsWithCustomAverage.find(
        (s: Subject) => s.id === customAverage.id
      ) || buildGeneralAverageSubject();

    const customVal = average(virtualSubject.id, subjectsWithCustomAverage);
    if (customVal === null) return { value: null };

    // Calculate comparison with global average
    const globalVal = average(undefined, subjects);
    let comparisonType: "higher" | "lower" | "same" = "same";
    let comparisonValue = 0;

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

    return {
      value: customVal * 100,
      outOf: 2000,
      comparisonType,
      comparisonPercentage: comparisonValue,
      customAverageName: customAverage.name,
    };
  },

  // Best grade calculator
  bestGrade: (params, subjects) => {
    const bestGrade = getBestGrade(subjects);
    return {
      value: bestGrade?.grade || null,
      outOf: bestGrade?.outOf || 2000,
      subjectName: bestGrade?.subject?.name,
      gradeName: bestGrade?.name,
    };
  },

  // Worst grade calculator
  worstGrade: (params, subjects) => {
    const worstGrade = getWorstGrade(subjects);
    return {
      value: worstGrade?.grade || null,
      outOf: worstGrade?.outOf || 2000,
      subjectName: worstGrade?.subject?.name,
      gradeName: worstGrade?.name,
    };
  },

  // Best subject calculator
  bestSubject: (params, subjects) => {
    const bestSubject = getBestSubject(subjects, true);
    const bestSubjectAverage = bestSubject
      ? average(bestSubject.id, subjects)
      : null;

    const comparison = bestSubject
      ? getSubjectAverageComparison(subjects, bestSubject.id, true)
      : null;

    return {
      value: bestSubjectAverage !== null ? bestSubjectAverage * 100 : null,
      outOf: 2000,
      subjectName: bestSubject?.name,
      comparisonPercentage: comparison?.percentageChange
        ? Math.abs(comparison.percentageChange)
        : undefined,
    };
  },

  // Worst subject calculator
  worstSubject: (params, subjects) => {
    const worstSubject = getWorstSubject(subjects, true);
    const worstSubjectAverage = worstSubject
      ? average(worstSubject.id, subjects)
      : null;

    const comparison = worstSubject
      ? getSubjectAverageComparison(subjects, worstSubject.id, true)
      : null;

    return {
      value: worstSubjectAverage !== null ? worstSubjectAverage * 100 : null,
      outOf: 2000,
      subjectName: worstSubject?.name,
      comparisonPercentage: comparison?.percentageChange
        ? Math.abs(comparison.percentageChange)
        : undefined,
    };
  },

  // Grade impact calculator
  gradeImpact: (params, subjects, _, __, customAverages, grade) => {
    if (!grade) return { value: null };

    const targetSubjectId = params?.subjectId || undefined;
    const customAverageId = params?.customAverageId;
    const customAverage = customAverageId
      ? customAverages?.find((ca: Average) => ca.id === customAverageId)
      : undefined;

    const impact = gradeImpact(
      grade.id,
      targetSubjectId,
      subjects,
      customAverage
    );

    return {
      value: impact?.difference || 0,
      metadata: {
        percentageChange: impact?.percentageChange,
      },
    };
  },
};

// ===== Description Formatters =====

// Add a utility function for safe translation
function safeTranslate(
  t: ReturnType<typeof useTranslations>,
  key: string,
  params?: Record<string, any>
): string {
  // This ensures that any string key can be passed to the translation function
  return (t as any)(key, params);
}

// Description formatters for built-in cards
const descriptionFormatters: Record<string, DescriptionFormatter> = {
  // Global average description formatter
  globalAverage: (result, t, customTimeRange = "sinceStart", customParams) => {
    const growth = result.growthPercentage ?? 0;
    const timeRangeKey =
      customTimeRange || result.metadata?.timeRange || "sinceStart";

    if (growth === 0) {
      return safeTranslate(t, "noChangeSinceStart");
    } else if (growth > 0) {
      return `+${growth.toFixed(2)}% ${safeTranslate(t, timeRangeKey)}`;
    } else {
      return `${growth.toFixed(2)}% ${safeTranslate(t, timeRangeKey)}`;
    }
  },

  // Custom average description formatter
  customAverage: (result, t) => {
    const comparisonType = result.comparisonType || "same";
    const comparisonValue = result.comparisonPercentage || 0;

    if (comparisonType === "same") {
      return safeTranslate(t, "noComparison");
    } else if (comparisonType === "higher") {
      return `+${comparisonValue}% ${safeTranslate(
        t,
        "comparedToGeneralAverage"
      )}`;
    } else {
      return `-${comparisonValue}% ${safeTranslate(
        t,
        "comparedToGeneralAverage"
      )}`;
    }
  },

  // Best grade description formatter
  bestGrade: (result, t) => {
    if (!result.subjectName) return safeTranslate(t, "noBestGrade");

    return safeTranslate(t, "bestGradeWithSubject", {
      subjectName: result.subjectName,
      gradeName: result.gradeName || "",
    });
  },

  // Worst grade description formatter
  worstGrade: (result, t) => {
    if (!result.subjectName) return safeTranslate(t, "noWorstGrade");

    return safeTranslate(t, "worstGradeWithSubject", {
      subjectName: result.subjectName,
      gradeName: result.gradeName || "",
    });
  },

  // Best subject description formatter
  bestSubject: (result, t) => {
    if (!result.subjectName || !result.comparisonPercentage) {
      return safeTranslate(t, "noBestSubject");
    }

    return safeTranslate(t, "bestSubjectWithComparison", {
      subjectName: result.subjectName,
      percentage: result.comparisonPercentage.toFixed(2),
    });
  },

  // Worst subject description formatter
  worstSubject: (result, t) => {
    if (!result.subjectName || !result.comparisonPercentage) {
      return safeTranslate(t, "noWorstSubject");
    }

    return safeTranslate(t, "worstSubjectWithComparison", {
      subjectName: result.subjectName,
      percentage: result.comparisonPercentage.toFixed(2),
    });
  },

  // Grade impact description formatter
  gradeImpact: (result, t) => {
    const percentageChange = result.metadata?.percentageChange;

    if (percentageChange) {
      return `${percentageChange > 0 ? "+" : ""}${percentageChange.toFixed(
        2
      )}%`;
    }

    return "";
  },
};

// ===== Built-in Card Configurations =====

// Configuration for built-in cards
export const builtInCardConfigs: Record<string, BuiltInCardConfig> = {
  ct_global_average: {
    titleKey: "generalAverage",
    defaultIcon: "AcademicCapIcon",
    calculator: "globalAverage",
    allowIconCustomization: true,
    allowTitleCustomization: false,
    allowCalculatorCustomization: false,
    formatDescription: descriptionFormatters.globalAverage,
    allowedTimeRanges: ["sinceStart", "thisWeek", "thisMonth", "thisYear"],
    defaultTimeRange: "sinceStart",
    customizableParams: ["timeRange"],
  },
  ct_best_grade: {
    titleKey: "bestGrade",
    defaultIcon: "PlusIcon",
    calculator: "bestGrade",
    allowIconCustomization: true,
    allowTitleCustomization: false,
    allowCalculatorCustomization: false,
    formatDescription: descriptionFormatters.bestGrade,
  },
  ct_worst_grade: {
    titleKey: "worstGrade",
    defaultIcon: "MinusIcon",
    calculator: "worstGrade",
    allowIconCustomization: true,
    allowTitleCustomization: false,
    allowCalculatorCustomization: false,
    formatDescription: descriptionFormatters.worstGrade,
  },
  ct_best_subject: {
    titleKey: "bestSubject",
    defaultIcon: "ArrowTrendingUpIcon",
    calculator: "bestSubject",
    allowIconCustomization: true,
    allowTitleCustomization: false,
    allowCalculatorCustomization: false,
    formatDescription: descriptionFormatters.bestSubject,
  },
  ct_worst_subject: {
    titleKey: "worstSubject",
    defaultIcon: "ArrowTrendingDownIcon",
    calculator: "worstSubject",
    allowIconCustomization: true,
    allowTitleCustomization: false,
    allowCalculatorCustomization: false,
    formatDescription: descriptionFormatters.worstSubject,
  },
  ct_grade_impact: {
    titleKey: "gradeImpact",
    defaultIcon: "ChartBarIcon",
    calculator: "gradeImpact",
    allowIconCustomization: true,
    allowTitleCustomization: false,
    allowCalculatorCustomization: false,
    formatDescription: descriptionFormatters.gradeImpact,
  },
};

// ===== Utility Functions =====

// Function to process description template with variables
function processTemplate(
  template: string,
  variables: Record<string, any>,
  subjects: Subject[],
  period: Period,
  periods: Period[],
  customAverages?: Average[],
  grade?: Grade
): string {
  let result = template;

  for (const [key, config] of Object.entries(variables)) {
    let value = "";

    if (config.type === "static") {
      value = config.value;
    } else if (config.type === "dynamic") {
      // Handle dynamic values based on the specified value
      switch (config.value) {
        case "periodName":
          value = period.name;
          break;
        case "subjectName":
          if (grade) value = grade.subject.name;
          break;
        case "averageGrowth": {
          const averages = averageOverTime(
            subjects,
            undefined,
            period,
            periods
          );
          if (averages.length > 0) {
            const lastValue = averages[averages.length - 1];
            const firstValue = averages.find((v) => v !== null);
            if (firstValue !== undefined && lastValue !== null) {
              const growth = ((lastValue - firstValue) / firstValue) * 100;
              value = `${growth > 0 ? "+" : ""}${growth.toFixed(2)}%`;
            }
          }
          break;
        }
        default:
          value = "Unknown";
      }
    } else if (config.type === "timeRange") {
      // Handle time range values
      switch (config.value) {
        case "sinceStart":
          value = "since the beginning";
          break;
        case "thisWeek":
          value = "this week";
          break;
        case "thisMonth":
          value = "this month";
          break;
        case "thisYear":
          value = "this year";
          break;
        default:
          value = config.value;
      }
    }

    result = result.replace(`{${key}}`, value);
  }

  return result;
}

// Get icon component from string name
function getIconComponent(iconName: string): React.ComponentType<any> {
  const Icon = (HeroIcons as any)[iconName];

  if (!Icon) {
    console.warn(`Icon "${iconName}" not found in HeroIcons`);
    return HeroIcons.QuestionMarkCircleIcon;
  }

  return Icon;
}

// Check if a card is a custom average card
const isCustomAverageCard = (template: CardTemplate) =>
  template.config.mainData.calculator === "customAverage";

// Check if a card is a built-in card
const isBuiltInCard = (
  template: CardTemplate,
  builtInCards: Record<string, BuiltInCardConfig>
) => template.id in builtInCards;

// ===== Component Props =====

interface ExtendedCardLayoutItem extends CardLayoutItem {
  customization?: {
    title?: string;
    description?: {
      template?: string;
      variables?: {
        [key: string]: any;
      };
    };
    mainData?: {
      params?: any;
      calculator?: string;
    };
    icon?: string;
  };
}

interface DynamicDataCardProps {
  template: CardTemplate;
  layoutItem?: ExtendedCardLayoutItem;
  subjects: Subject[];
  period: Period;
  periods: Period[];
  customAverages?: Average[];
  grade?: Grade;
  className?: string;
}

// ===== Component =====

export default function DynamicDataCard({
  template,
  layoutItem,
  subjects,
  period,
  periods,
  customAverages = [],
  grade,
  className,
}: DynamicDataCardProps) {
  // Get translations for DataCards component
  const t = useTranslations("Dashboard.Components.DataCards");

  // Determine if this is a built-in or custom card
  const isBuiltIn = isBuiltInCard(template, builtInCardConfigs);
  const isCustomAvg = isCustomAverageCard(template);

  // Get built-in card config if applicable
  const builtInConfig = isBuiltIn ? builtInCardConfigs[template.id] : undefined;

  // Merge template config with customization
  const config = useMemo(() => {
    const baseConfig = template.config;
    const customization = layoutItem?.customization || {};

    // For built-in cards, respect the customization limitations
    if (builtInConfig) {
      return {
        title: builtInConfig.allowTitleCustomization
          ? customization.title || baseConfig.title
          : baseConfig.title,
        description: {
          template:
            customization.description?.template ||
            baseConfig.description.template,
          variables: {
            ...baseConfig.description.variables,
            ...(customization.description?.variables || {}),
          },
        },
        mainData: {
          type: baseConfig.mainData.type,
          calculator: builtInConfig.allowCalculatorCustomization
            ? customization.mainData?.calculator ||
              baseConfig.mainData.calculator
            : baseConfig.mainData.calculator,
          params: {
            ...(baseConfig.mainData.params || {}),
            ...(customization.mainData?.params || {}),
          },
        },
        icon: builtInConfig.allowIconCustomization
          ? customization.icon || baseConfig.icon
          : baseConfig.icon,
      };
    }

    // For custom cards, all customizations are allowed
    return {
      title: customization.title || baseConfig.title,
      description: {
        template:
          customization.description?.template ||
          baseConfig.description.template,
        variables: {
          ...baseConfig.description.variables,
          ...(customization.description?.variables || {}),
        },
      },
      mainData: {
        type: baseConfig.mainData.type,
        calculator: baseConfig.mainData.calculator,
        params: {
          ...(baseConfig.mainData.params || {}),
          ...(customization.mainData?.params || {}),
        },
      },
      icon: customization.icon || baseConfig.icon,
    };
  }, [template, layoutItem, builtInConfig]);

  // Calculate the main data
  const mainData = useMemo(() => {
    const calculator = calculators[config.mainData.calculator];
    if (!calculator) return { value: null };

    return calculator(
      config.mainData.params,
      subjects,
      period,
      periods,
      customAverages,
      grade
    );
  }, [config.mainData, subjects, period, periods, customAverages, grade]);

  // Get title based on type of card
  const title = useMemo(() => {
    // For built-in cards, use translation
    if (builtInConfig) {
      return safeTranslate(t, builtInConfig.titleKey);
    }

    // For custom average cards, use custom average name
    if (isCustomAvg && mainData.customAverageName) {
      return mainData.customAverageName;
    }

    // For other custom cards, use config title
    return config.title;
  }, [builtInConfig, isCustomAvg, config.title, t, mainData]);

  // Get description based on type of card
  const description = useMemo(() => {
    // For built-in cards, use formatter
    if (builtInConfig) {
      const timeRange =
        config.mainData.params?.timeRange || builtInConfig.defaultTimeRange;
      return builtInConfig.formatDescription(
        mainData,
        t,
        timeRange,
        config.mainData.params
      );
    }

    // For custom average cards, use custom average formatter
    if (isCustomAvg) {
      return descriptionFormatters.customAverage(mainData, t);
    }

    // For other custom cards, use template
    return processTemplate(
      config.description.template,
      config.description.variables,
      subjects,
      period,
      periods,
      customAverages,
      grade
    );
  }, [
    builtInConfig,
    isCustomAvg,
    config.description,
    config.mainData.params,
    subjects,
    period,
    periods,
    customAverages,
    grade,
    mainData,
    t,
  ]);

  // Get the icon component
  const Icon = getIconComponent(config.icon);

  // If no value is available, don't render the card
  if (mainData.value === null) {
    return null;
  }

  return (
    <Card className={cn("p-6 rounded-lg", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-between">
          <p className="font-semibold">{title}</p>
          <Icon className="size-6 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-0.5">
          {typeof mainData.value === "number" && mainData.outOf ? (
            <GradeValue
              value={mainData.value}
              outOf={mainData.outOf}
              size="xl"
            />
          ) : (
            <p className="text-3xl font-bold">{mainData.value}</p>
          )}

          <p className="text-xs text-muted-foreground font-light">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}
