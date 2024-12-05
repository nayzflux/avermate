"use client";

import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaBody
} from "@/components/ui/credenza";
import { useState } from "react";
import { AddSubjectForm } from "../forms/add-subject-form";

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
            Créer une nouvelle matière avant d&apos;ajouter des notes.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <AddSubjectForm close={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
