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
import { FeedbackForm } from "../forms/feedback-form";

export default function FeedbackDialog({
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
                  <CredenzaTitle>
                      Faites nous part de vos suggestions
          </CredenzaTitle>
          <CredenzaDescription>
            Votre avis est très important pour nous. Nous sommes toujours à
            l'écoute de vos suggestions pour améliorer notre service.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          <FeedbackForm close={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
