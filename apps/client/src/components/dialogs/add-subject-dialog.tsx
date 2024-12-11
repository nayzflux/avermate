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
import { useState } from "react";
import { AddSubjectForm } from "../forms/add-subject-form";

export default function AddSubjectCredenza({
  children,
  parentId,
}: {
  children: React.ReactNode;
  parentId?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="flex items-center" asChild>
        {children}
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une matière</CredenzaTitle>
          <CredenzaDescription>
            Créer une nouvelle matière avant d&apos;ajouter des notes.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <AddSubjectForm close={() => setOpen(false)} parentId={parentId} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
