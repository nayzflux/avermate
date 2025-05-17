import { Subject } from "@/types/subject";
import { Period } from "@/types/period";
import { Average } from "@/types/average";
import { Grade } from "@/types/grade";
import { cn } from "@/lib/utils";
import DynamicDataCard from "./dynamic-data-card";
import { useMemo } from "react";
import {
  CardLayout as CardLayoutType,
  CardLayoutItem,
  CardTemplate,
  DataCard,
} from "@/hooks/use-card-layouts";
import { builtInCardConfigs } from "./dynamic-data-card";

interface CardLayoutProps {
  page: "dashboard" | "grade" | "subject";
  subjects: Subject[];
  period: Period;
  periods: Period[];
  customAverages?: Average[];
  grade?: Grade;
  className?: string;
  templates?: CardTemplate[];
  layout?: CardLayoutType;
}

// Fallback built-in templates when API endpoints are not available yet
const BUILT_IN_TEMPLATES: CardTemplate[] = [
  {
    id: "ct_global_average",
    type: "built-in",
    identifier: "global_average",
    userId: "",
    config: {
      title: "General Average",
      description: {
        template: "Your performance is {growth} {timeRange}",
        variables: {},
      },
      mainData: {
        type: "average",
        calculator: "globalAverage",
        params: {
          timeRange: "sinceStart",
        },
      },
      icon: "AcademicCapIcon",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ct_best_subject",
    type: "built-in",
    identifier: "best_subject",
    userId: "",
    config: {
      title: "Best Subject",
      description: {
        template: "{subjectName} {percentage}% higher than other subjects",
        variables: {},
      },
      mainData: {
        type: "average",
        calculator: "bestSubject",
        params: {},
      },
      icon: "ArrowTrendingUpIcon",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ct_worst_subject",
    type: "built-in",
    identifier: "worst_subject",
    userId: "",
    config: {
      title: "Worst Subject",
      description: {
        template: "{subjectName} {percentage}% lower than other subjects",
        variables: {},
      },
      mainData: {
        type: "average",
        calculator: "worstSubject",
        params: {},
      },
      icon: "ArrowTrendingDownIcon",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ct_best_grade",
    type: "built-in",
    identifier: "best_grade",
    userId: "",
    config: {
      title: "Best Grade",
      description: {
        template: "In {subjectName}? Impressive! ({gradeName})",
        variables: {},
      },
      mainData: {
        type: "grade",
        calculator: "bestGrade",
        params: {},
      },
      icon: "PlusIcon",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ct_worst_grade",
    type: "built-in",
    identifier: "worst_grade",
    userId: "",
    config: {
      title: "Worst Grade",
      description: {
        template: "In {subjectName}? Not good ({gradeName})",
        variables: {},
      },
      mainData: {
        type: "grade",
        calculator: "worstGrade",
        params: {},
      },
      icon: "MinusIcon",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ct_grade_impact",
    type: "built-in",
    identifier: "grade_impact",
    userId: "",
    config: {
      title: "Grade Impact",
      description: {
        template: "Impact on your average",
        variables: {},
      },
      mainData: {
        type: "impact",
        calculator: "gradeImpact",
        params: {},
      },
      icon: "ChartBarIcon",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function CardLayout({
  page,
  subjects,
  period,
  periods,
  customAverages = [],
  grade,
  className,
  templates = [],
  layout,
}: CardLayoutProps) {
  // Get default layout if no custom layout exists
  const cardItems = useMemo(() => {
    if (layout?.cards) {
      try {
        const parsedCards =
          typeof layout.cards === "string"
            ? JSON.parse(layout.cards)
            : layout.cards;
        return parsedCards as CardLayoutItem[];
      } catch (error) {
        console.error("Error parsing card layout:", error);
        return [];
      }
    }

    // Default layouts based on page type
    const defaultLayouts: Record<string, CardLayoutItem[]> = {
      dashboard: [
        { templateId: "ct_global_average", position: 0 },
        { templateId: "ct_best_subject", position: 1 },
        { templateId: "ct_worst_subject", position: 2 },
        { templateId: "ct_best_grade", position: 3 },
        { templateId: "ct_worst_grade", position: 4 },
      ],
      grade: [{ templateId: "ct_grade_impact", position: 0 }],
      subject: [{ templateId: "ct_global_average", position: 0 }],
    };

    return defaultLayouts[page] || [];
  }, [layout, page]);

  // Use built-in templates as fallback if none are provided
  const availableTemplates = useMemo(() => {
    if (templates && templates.length > 0) {
      return templates;
    }
    return BUILT_IN_TEMPLATES;
  }, [templates]);

  // Show loading state instead of "No templates available"
  if (!availableTemplates.length) {
    return (
      <div className="animate-pulse flex flex-col gap-4">
        <div className="h-24 bg-muted rounded-md"></div>
        <div className="h-24 bg-muted rounded-md"></div>
      </div>
    );
  }

  // Sort cards by position
  const sortedCards = [...cardItems].sort((a, b) => a.position - b.position);

  return (
    <div
      className={cn(
        "grid gap-4 pb-4",
        {
          "grid-cols-1": sortedCards.length === 1,
          "grid-cols-1 md:grid-cols-2": sortedCards.length === 2,
          "grid-cols-1 md:grid-cols-3": sortedCards.length === 3,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4": sortedCards.length === 4,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5":
            sortedCards.length === 5,
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6":
            sortedCards.length >= 6,
        },
        className
      )}
    >
      {sortedCards.map((item) => {
        const template = availableTemplates.find(
          (t) => t.id === item.templateId
        );
        if (!template) return null;

        // Convert CardTemplate to DataCard format for backward compatibility
        const dataCard: DataCard = {
          id: template.id,
          identifier: template.identifier,
          userId: template.userId,
          config: {
            title: template.config.title,
            description: {
              formatter: typeof template.config.description === "object" ? 
                (template.config.description.template || "") : "",
              params: typeof template.config.description === "object" ? 
                (template.config.description.variables || {}) : {},
            },
            mainData: {
              calculator: typeof template.config.mainData === "object" ?
                (template.config.mainData.calculator || "globalAverage") : "globalAverage",
              params: typeof template.config.mainData === "object" ?
                (template.config.mainData.params || {}) : {},
            },
            icon: template.config.icon,
          },
          createdAt: template.createdAt,
          updatedAt: template.updatedAt,
        };

        // Add cardId to the layout item
        const extendedLayoutItem = {
          ...item,
          cardId: template.id, // Add cardId property
        };

        return (
          <DynamicDataCard
            key={`${template.id}-${item.position}`}
            template={dataCard}
            layoutItem={extendedLayoutItem}
            subjects={subjects}
            period={period}
            periods={periods}
            customAverages={customAverages}
            grade={grade}
          />
        );
      })}
    </div>
  );
}
