import { DifferenceBadge } from "@/app/dashboard/grades/[gradeId]/difference-badge";
import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { StarIcon } from "@heroicons/react/24/outline";

export const MockInsights = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <DataCard title="Note obtenue" description="" icon={StarIcon}>
        <GradeValue outOf={2000} value={1650} />
      </DataCard>

      <DataCard title="Coefficient" description="" icon={StarIcon}>
        <p className="texl-xl md:text-3xl font-bold">2</p>
      </DataCard>

      <DataCard
        title="Impact sur la moyenne générale"
        description=""
        icon={StarIcon}
      >
        <DifferenceBadge diff={1.4} />
      </DataCard>
    </div>
  );
};
