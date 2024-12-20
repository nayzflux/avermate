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
import { apiClient } from "@/lib/api";
import { Average } from "@/types/average";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { UpdateCustomAverageForm } from "../forms/update-average-form";
import { Button } from "../ui/button";

export default function UpdateAverageCredenza({ averageId }: { averageId: string }) {
  const [open, setOpen] = useState(false);

const {
  data: customAverage,
  isPending,
  isError,
} = useQuery({
  queryKey: ["average", averageId],
  queryFn: async () => {
    const res = await apiClient.get(`averages/${averageId}`);
    const data = await res.json<{ customAverage: Average }>();
    return data.customAverage;
  },
});


  return (
    <Credenza open={open} onOpenChange={setOpen}>
      <CredenzaTrigger asChild>
        <Button variant="ghost">
          <PencilIcon className="size-4 mr-2" />
          Modifier la moyenne
        </Button>
      </CredenzaTrigger>

      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Ajouter une moyenne personnalisée</CredenzaTitle>
          <CredenzaDescription>
            Créez une moyenne personnalisée pour des matières spécifiques.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="px-4 py-6 max-h-[100%] overflow-auto">
          {!isPending && !isError && (
            <UpdateCustomAverageForm
              customAverage={customAverage}
              close={() => setOpen(false)}
            />
          )}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
