"use client";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useState } from "react";
import { PresetList } from "../onboarding/preset-list";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Preset } from "@/types/get-preset-response";
import { GetPresetResponse } from "@/types/get-preset-response";

export default function ListPresetsDialog({
  children
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

    const {
      data: presets,
      isError,
      isLoading,
    } = useQuery<Preset[], Error>({
      queryKey: ["presets"],
      queryFn: async () => {
        const res = await apiClient.get("presets");
        const data = await res.json<GetPresetResponse>();
        return data.presets;
      },
    });

  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Sélectionnez un préset</CredenzaTitle>
          <CredenzaDescription>
            Choisissez le préset qui vous correspond le mieux.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {!isLoading && !isError && presets && (
            <PresetList presets={presets} close={() => setOpen(false)} />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
