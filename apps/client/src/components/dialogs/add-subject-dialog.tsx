"use client";

import { useState } from "react";
import { AddSubjectForm } from "../forms/add-subject-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function AddSubjectDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="flex items-center"
        asChild
      >
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une matière</DialogTitle>
          <DialogDescription>
            Créer une nouvelle matière avant d'ajouter des notes.
          </DialogDescription>
        </DialogHeader>

        <AddSubjectForm close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
