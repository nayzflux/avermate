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
import { AddAverageForm } from "../forms/add-average-form";

export default function AddAverageDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une moyenne personnalisée</CredenzaTitle>
          <CredenzaDescription>
            Créez une moyenne personnalisée pour des matières spécifiques.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <AddAverageForm close={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
    // </div>
  );
}
