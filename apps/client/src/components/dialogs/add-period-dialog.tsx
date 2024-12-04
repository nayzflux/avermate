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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AddPeriodForm } from "../forms/add-period-form";

export default function AddPeriodCredenza({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Fetch existing periods to prevent overlapping
  const {
    data: periods,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["periods"],
    queryFn: async () => {
      const res = await apiClient.get("periods");

      const data = await res.json<{ periods: Period[] }>();

      // Parse and normalize dates
      // const periods = data.periods.map((period) => ({
      //   ...period,
      //   startAt: startOfDay(new Date(period.startAt)),
      //   endAt: startOfDay(new Date(period.endAt)),
      // }));

      return data.periods;
    },
  });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="flex items-center" asChild>
        {children}
      </CredenzaTrigger>

      <CredenzaContent className="px-4 py-4">
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une période</CredenzaTitle>
          <CredenzaDescription>
            Créer une nouvelle période avant d&apos;ajouter des notes.
          </CredenzaDescription>
        </CredenzaHeader>

        {!isPending && !isError && (
          <AddPeriodForm periods={periods} close={() => setOpen(false)} />
        )}
      </CredenzaContent>
    </Credenza>
  );
}
