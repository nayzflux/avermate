"use client";

import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdatePeriodForm } from "../forms/update-period-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function UpdatePeriodDialog({ periodId }: { periodId: string }) {
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la période
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la période</DialogTitle>
          <DialogDescription>
            Modifier les données de la période.
          </DialogDescription>
        </DialogHeader>

        {!isPending && !isError && !isPeriodsPending && !isPeriodsError && (
          <UpdatePeriodForm period={period} periods={periods} close={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
