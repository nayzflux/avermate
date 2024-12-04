"use client";

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdatePeriodForm } from "../forms/update-period-form";
import { Button } from "../ui/button";

export default function UpdatePeriodCredenza({
  periodId,
}: {
  periodId: string;
}) {
  const [open, setOpen] = useState(false);

  const {
    data: period,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["period", periodId],
    queryFn: async () => {
      const res = await apiClient.get(`periods/${periodId}`);
      const data = await res.json<Period>();
      console.log(data);
      return data;
    },
  });

  const {
    data: periods,
    isPending: isPeriodsPending,
    isError: isPeriodsError,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");
      const data = await res.json<{ periods: Period[] }>();
      return data.periods;
    },
  });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la période
        </Button>
      </CredenzaTrigger>

      <CredenzaContent className="px-4 py-4">
        <CredenzaHeader>
          <CredenzaTitle>Modifier la période</CredenzaTitle>
          <CredenzaDescription>
            Modifier les données de la période.
          </CredenzaDescription>
        </CredenzaHeader>

        {!isPending && !isError && !isPeriodsPending && !isPeriodsError && (
          <UpdatePeriodForm
            period={period}
            periods={periods}
            close={() => setOpen(false)}
          />
        )}
      </CredenzaContent>
    </Credenza>
  );
}
