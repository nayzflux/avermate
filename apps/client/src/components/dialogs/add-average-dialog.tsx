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
import { useTranslations } from "next-intl";

import { z } from "zod";
const addCustomAverageSchema = z.object({
  name: z.string().min(1).max(64),
  subjects: z.array(
    z.object({
      id: z.string().min(1),
      customCoefficient: z.number().min(1).max(1000).nullable().optional(),
      includeChildren: z.boolean().optional(),
    })
  ),
  isMainAverage: z.boolean().default(false).optional(),
});
export type AddCustomAverageSchema = z.infer<typeof addCustomAverageSchema>;

const EMPTY_FORM_DATA: AddCustomAverageSchema = {
  name: "",
  subjects: [{ id: "", customCoefficient: null, includeChildren: false }],
  isMainAverage: false,
};

export default function AddAverageDialog({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Dashboard.Dialogs.AddAverage");
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<AddCustomAverageSchema>(EMPTY_FORM_DATA);

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
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("title")}</CredenzaTitle>
          <CredenzaDescription>{t("description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {open && (
            <AddAverageForm
              close={() => setOpen(false)}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
