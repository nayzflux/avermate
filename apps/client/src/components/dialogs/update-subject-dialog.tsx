"use client";

import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateSubjectForm } from "../forms/update-subject-form";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function UpdateSubjectDialog({ subjectId }: { subjectId: string }) {
  const [open, setOpen] = useState(false);

  const {
    data: subject,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["subject", subjectId],
    queryFn: async () => {
      const res = await apiClient.get(`subjects/${subjectId}`);
      const data = await res.json<{
        subject: Subject;
      }>();
      return data.subject;
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la matière
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la matière</DialogTitle>
          <DialogDescription>
            Modifier les données de la matière.
          </DialogDescription>
        </DialogHeader>

        {!isPending && !isError && (
          <UpdateSubjectForm subject={subject} close={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
