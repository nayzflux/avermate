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

export default function ListPresetsDialog({
  children
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

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
                <PresetList close={() => setOpen(false)} />
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
    // </div>
  );
}
