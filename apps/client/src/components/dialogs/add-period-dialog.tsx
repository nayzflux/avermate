"use client";

import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AddPeriodForm } from "../forms/add-period-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function AddPeriodDialog({
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex items-center">{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une période</DialogTitle>
          <DialogDescription>
            Créer une nouvelle période avant d'ajouter des notes.
          </DialogDescription>
        </DialogHeader>

        {!isPending && !isError && (
          <AddPeriodForm periods={periods} close={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
