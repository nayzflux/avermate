import { Subject } from "@/types/subject";
import { Period } from "@/types/period";
import { Average } from "@/types/average";
import { Grade } from "@/types/grade";
import { cn } from "@/lib/utils";
import DynamicDataCard from "./dynamic-data-card";
import { useMemo } from "react";

interface CardLayoutProps {
  page: "dashboard" | "grade" | "subject";
  subjects: Subject[];
  period: Period;
  periods: Period[];
  customAverages?: Average[];
  grade?: Grade;
  className?: string;
  templates: any;
  layout: any;
}

export default function CardLayout({
  page,
  subjects,
  period,
  periods,
  customAverages = [],
  grade,
  className,
  templates,
  layout,
}: CardLayoutProps) {
  // Get default layout if no custom layout exists
  const cardItems = useMemo(() => {
    if (layout?.cards) {
      return JSON.parse(layout.cards);
    }

    // Default layouts based on page type
    const defaultLayouts = {
      dashboard: [
        { templateId: "ct_global_average", position: 0 },
        { templateId: "ct_best_subject", position: 1 },
        { templateId: "ct_worst_subject", position: 2 },
        { templateId: "ct_best_grade", position: 3 },
        { templateId: "ct_worst_grade", position: 4 },
      ],
      grade: [
        { templateId: "ct_grade_value", position: 0 },
        { templateId: "ct_grade_impact", position: 1 },
      ],
      subject: [
        { templateId: "ct_subject_average", position: 0 },
        { templateId: "ct_subject_grades", position: 1 },
      ],
    };

    return defaultLayouts[page] || [];
  }, [layout, page]);

  if (!templates?.length) {
    return <div>No templates available</div>;
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

      //className="flex flex-row flex-wrap gap-4 pb-4"
    >
      {sortedCards.map((item) => {
        const template = templates.find(
          (t: { id: any }) => t.id === item.templateId
        );
        if (!template) return null;

        return (
          <DynamicDataCard
            key={`${template.id}-${item.position}`}
            template={{
              ...template,
              config:
                typeof template.config === "string"
                  ? JSON.parse(template.config)
                  : template.config,
            }}
            layoutItem={item} // Pass the layout item
            subjects={subjects}
            period={period}
            periods={periods}
            customAverages={customAverages}
            grade={grade}
            //className="flex-1 min-w-[300px]" // Add minimum width constraint
          />
        );
      })}
    </div>
  );
}
