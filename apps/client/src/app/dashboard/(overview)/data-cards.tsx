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
  addGeneralAverageToSubjects,
  buildGeneralAverageSubject,
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
import { useTranslations } from "next-intl";
import ManageCardsButton from "@/components/dashboard/manage-cards-button";
import CardLayout from "@/components/dashboard/card-layout";
import { CardTemplate, CardLayout as CardLayoutType } from "@/hooks/use-card-layouts";

interface DataCardsProps {
  subjects: Subject[];
  period: Period;
  periods: Period[];
  customAverages?: Average[];
  templates?: CardTemplate[];
  layout?: CardLayoutType | null;
}

export default function DataCards({
  subjects,
  period,
  periods,
  customAverages,
  templates,
  layout,
}: DataCardsProps) {
  return (
    <>      
      <CardLayout
        page="dashboard"
        subjects={subjects}
        period={period}
        periods={periods}
        customAverages={customAverages}
        templates={templates}
        layout={layout}
      />
    </>
  );
}
