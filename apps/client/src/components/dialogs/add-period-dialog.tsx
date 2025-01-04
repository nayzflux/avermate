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
import { usePeriods } from "@/hooks/use-periods";
import { useState } from "react";
import { AddPeriodForm } from "../forms/add-period-form";
import { useTranslations } from "next-intl";

export default function AddPeriodCredenza({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Dashboard.Dialogs.AddPeriod");
  const [open, setOpen] = useState(false);

  // Fetch existing periods to prevent overlapping
  const { data: periods, isError, isPending } = usePeriods();

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger className="flex items-center" asChild>
        {children}
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{t("title")}</CredenzaTitle>
          <CredenzaDescription>{t("description")}</CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {!isPending && !isError && (
            <AddPeriodForm periods={periods} close={() => setOpen(false)} />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
