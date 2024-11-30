"use client";

import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateGradeForm } from "../forms/update-grade-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function UpdateGradeDialog({ gradeId }: { gradeId: string }) {
  const [open, setOpen] = useState(false);

  const {
    data: grade,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["grade", gradeId],
    queryFn: async () => {
      const res = await apiClient.get(`grades/${gradeId}`);
      const data = await res.json<{
        grade: Grade;
      }>();
      return data.grade;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la note
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la note</DialogTitle>
          <DialogDescription>
            Modifier les données de la note.
          </DialogDescription>
        </DialogHeader>

        {!isPending && !isError && (
          <UpdateGradeForm grade={grade} close={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
