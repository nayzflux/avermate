"use client";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { AddGradeForm } from "../forms/add-grade-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function AddGradeDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <PlusCircleIcon className="size-4 mr-2" />
          Ajouter une note
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une note</DialogTitle>
          <DialogDescription>
            Commencer à suivre votre évolution.
          </DialogDescription>
        </DialogHeader>

        <AddGradeForm close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
