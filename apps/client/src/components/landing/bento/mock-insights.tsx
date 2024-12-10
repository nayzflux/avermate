import { DifferenceBadge } from "@/app/dashboard/grades/[gradeId]/difference-badge";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import {
  AcademicCapIcon,
  ArrowUpCircleIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";

export const MockInsights = () => {
  return (
    <div className="grid grid-cols-2 3xl:grid-cols-3 gap-4">
      <DataCard
        title="Note obtenue"
        description="Votre note obtenue lors de cette évaluation sur 20"
        icon={SparklesIcon}
      >
        <GradeValue outOf={2000} value={1650} />
      </DataCard>

      <DataCard
        title="Impact sur la moyenne générale"
        description="Visualisez l'impact de cette évaluation sur votre moyenne générale"
        icon={ArrowUpCircleIcon}
      >
        <DifferenceBadge diff={1.4} />
      </DataCard>

      <DataCard
        className="hidden 3xl:flex"
        title="Impact sur Mathématiques"
        description="Visualisez l'impact de cette évaluation sur votre moyenne de la matière Mathématiques"
        icon={ArrowUpCircleIcon}
      >
        <DifferenceBadge diff={2.38} />
      </DataCard>

      <DataCard
        title="Coefficient"
        description="Le coefficient de cette évaluation"
        icon={VariableIcon}
      >
        <p className="texl-xl md:text-3xl font-bold">2</p>
      </DataCard>

      <DataCard
        title="Matières"
        description="La matière de cette évaluation"
        icon={AcademicCapIcon}
      >
        <p className="texl-xl md:text-3xl font-bold">Mathématiques - Ecrit</p>
      </DataCard>

      <DataCard
        title="Date de passage"
        description="La date de passage de cette évaluation"
        icon={AcademicCapIcon}
      >
        <p className="texl-xl md:text-3xl font-bold">04 déc. 2024</p>
      </DataCard>
    </div>
  );
};
