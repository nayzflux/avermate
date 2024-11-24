"use client";

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

        <AddPeriodForm close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
