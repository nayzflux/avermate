"use client";

import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { formatGradeValue } from "@/utils/format";
import {
  AcademicCapIcon,
  ArrowLeftIcon,
  ArrowUpCircleIcon,
  SparklesIcon,
  VariableIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import SubjectAverageChart from "./subject-average-chart";

function SubjectWrapper({ subjectId }: { subjectId: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: async () => {
      const res = await apiClient.get(`subjects/${subjectId}`);
      const data = await res.json<{ subject: Subject }>();
      return data.subject;
    },
  });

  const router = useRouter();

  return (
    <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div>
        <Button
          className="text-blue-600"
          variant="link"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="size-4 mr-2" />
          Retour
        </Button>
      </div>

      <div>
        {isPending ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <p className="text-2xl font-semibold">{data?.name}</p>
        )}
      </div>

      <Separator />

      {/* Data card */}
      <div className="grid grid-cols-2 gap-4">
        {/* Subject average */}
        <DataCard
          title="Moyenne"
          description="Votre moyenne actuelle"
          icon={AcademicCapIcon}
        >
          <GradeValue value={1340} outOf={2000} />
        </DataCard>

        {/* Subject impact on average */}
        <DataCard
          title="Impact sur la moyenne"
          description={`Visualisez l'impact de ${data?.name} sur votre moyenne générale`}
          icon={ArrowUpCircleIcon}
        >
          <p className="text-3xl font-bold">+1.2</p>
        </DataCard>

        {/* Coeff */}
        <DataCard
          title="Coefficient"
          description={`Coefficient de ${data?.name}`}
          icon={VariableIcon}
        >
          <p className="text-3xl font-bold">
            {formatGradeValue(data?.coefficient || 0)}
          </p>
        </DataCard>

        {/* Best grade */}
        <DataCard
          title="Meilleure note"
          description={`Votre plus belle performance en ${data?.name}`}
          icon={SparklesIcon}
        >
          <p className="text-3xl font-bold">19.8</p>
        </DataCard>
      </div>

      <Separator />

      {/* Charts of average evolution */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Evolution de la moyenne</h2>

        <SubjectAverageChart />
      </div>

      {/* Last grades */}
      
    </div>
  );
}

export default SubjectWrapper;
