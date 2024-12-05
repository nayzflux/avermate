"use client";

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaBody,
} from "@/components/ui/credenza";
import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateGradeForm } from "../forms/update-grade-form";
import { Button } from "../ui/button";

export default function UpdateGradeCredenza({ gradeId }: { gradeId: string }) {
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
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la note
        </Button>
      </CredenzaTrigger>

      <CredenzaContent className="max-h-screen h-[95%] ">
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
