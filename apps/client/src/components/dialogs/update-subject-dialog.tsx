"use client";

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateSubjectForm } from "../forms/update-subject-form";
import { Button } from "../ui/button";

export default function UpdateSubjectCredenza({
  subjectId,
}: {
  subjectId: string;
}) {
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
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la matière
        </Button>
      </CredenzaTrigger>

      <CredenzaContent className="max-h-screen h-[95%] ">
        <CredenzaHeader>
          <CredenzaTitle>Modifier la matière</CredenzaTitle>
          <CredenzaDescription>
            Modifier les données de la matière.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {!isPending && !isError && (
            <UpdateSubjectForm subject={subject} close={() => setOpen(false)} />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
