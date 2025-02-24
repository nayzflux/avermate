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
import { useTranslations } from "next-intl";
import { z } from "zod";

export default function AddSubjectCredenza({
  children,
  parentId,
}: {
  children: React.ReactNode;
  parentId?: string;
}) {
  const t = useTranslations("Dashboard.Dialogs.AddSubject");
  const [open, setOpen] = useState(false);

  const AddSubjectSchema = z.object({
    name: z.string().min(1).max(64),
    coefficient: z.number().min(0).max(1000).optional(),
    parentId: z.string().nullable().optional(),
    isMainSubject: z.boolean().optional(),
    isDisplaySubject: z.boolean().optional(),
  });
  type TAddSubject = z.infer<typeof AddSubjectSchema>;

  const EMPTY_FORM_DATA: TAddSubject = {
    name: "",
    parentId: parentId ?? "",
    isDisplaySubject: false,
    isMainSubject: false,
    coefficient: undefined,
  };

  const [formData, setFormData] = useState<TAddSubject>(EMPTY_FORM_DATA);

  return (
    <Credenza
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          setFormData(EMPTY_FORM_DATA);
        }
      }}
    >
      <CredenzaTrigger className="flex items-center" asChild>
        {children}
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("title")}</CredenzaTitle>
          <CredenzaDescription>{t("description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {open && (
            <AddSubjectForm
              close={() => setOpen(false)}
              parentId={parentId}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}