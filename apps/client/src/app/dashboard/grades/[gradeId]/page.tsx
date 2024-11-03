"use client";

import DataCard from "@/components/dashboard/data-card";
import GradeValue from "@/components/dashboard/grade-value";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function GradePage() {
  return (
    <div className="flex flex-col gap-8 m-auto max-w-[2000px]">
      <div>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="size-4 mr-2" />
            Retour
          </Link>
        </Button>
      </div>

      <div>
        <p className="text-2xl font-semibold">DS 1 : Nombres complexes</p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <DataCard
          title="Commentaire"
          description="Bon travail, continuez comme ça !"
          icon="div"
        >
          <div></div>
        </DataCard>

        <DataCard
          title="Note obtenu"
          description="Votre note obtenu lors de cette évaluation"
          icon="div"
        >
          <GradeValue value={15} outOf={20} />
        </DataCard>

        <DataCard
          title="Matière"
          description="Votre note obtenu lors de cette évaluation"
          icon="div"
        >
          <p className="text-4xl font-bold">Mathématiques</p>
        </DataCard>
      </div>
    </div>
  );
}
