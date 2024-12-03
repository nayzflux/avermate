"use client";

import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AddPeriodForm } from "../forms/add-period-form";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

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

      <CredenzaContent className="max-h-screen h-full ">
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une période</CredenzaTitle>
          <CredenzaDescription>
            Créer une nouvelle période avant d'ajouter des notes.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
        {!isPending && !isError && (
          <AddPeriodForm periods={periods} close={() => setOpen(false)} />
        )}</CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
