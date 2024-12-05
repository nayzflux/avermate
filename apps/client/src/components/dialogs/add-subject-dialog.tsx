"use client";

import { useState } from "react";
import { AddSubjectForm } from "../forms/add-subject-form";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";

export default function AddSubjectCredenza({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="flex items-center" asChild>
        {children}
      </CredenzaTrigger>

      <CredenzaContent className="max-h-screen h-[95%] ">
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une matière</CredenzaTitle>
          <CredenzaDescription>
            Créer une nouvelle matière avant d'ajouter des notes.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <AddSubjectForm close={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
