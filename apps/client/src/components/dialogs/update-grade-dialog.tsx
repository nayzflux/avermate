"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useGrade } from "@/hooks/use-grade";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { UpdateGradeForm } from "../forms/update-grade-form";
import { Button } from "../ui/button";

export default function UpdateGradeDialog({ gradeId }: { gradeId: string }) {
  const [open, setOpen] = useState(false);

  const { data: grade, isPending, isError } = useGrade(gradeId);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la note
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Modifier la note</CredenzaTitle>
          <CredenzaDescription>
            Modifier les données de la note.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {!isPending && !isError && (
            <UpdateGradeForm grade={grade} close={() => setOpen(false)} />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
