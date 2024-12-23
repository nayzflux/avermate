"use client";

import { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Preset } from "@/types/get-preset-response";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Loader2Icon, CheckIcon } from "lucide-react";
import { handleError } from "@/utils/error-utils";

export const PresetList = ({
  close,
  presets,
}: {
  close: () => void;
  presets: Preset[];
}) => {
  const toaster = useToast();
  const queryClient = useQueryClient();

  // State to track which preset is loading
  const [loadingPresetId, setLoadingPresetId] = useState<string | null>(null);

  // Define the mutation to apply a preset
  const mutation = useMutation<
    any, // Replace 'any' with your expected response type
    Error,
    { presetId: string }
  >({
    mutationKey: ["set-preset"],
    mutationFn: async ({ presetId }) => {
      const res = await apiClient.post(`presets/${presetId}`);
      const data = await res.json();
      return data;
    },
    onSuccess: (data) => {
      toaster.toast({
        title: `Préset appliqué avec succès !`,
        description: "Le préset a été appliqué avec succès.",
      });

      close();

      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      // Reset loading state
      setLoadingPresetId(null);
    },
    onError: (error) => {
      handleError(error, toaster);

      // Reset loading state
      setLoadingPresetId(null);
    },
  });

  // Handle the button click to apply a preset
  const handleClick = (preset: Preset) => {
    setLoadingPresetId(preset.id);
    mutation.mutate({ presetId: preset.id });
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {presets?.map((preset) => (
        <Card key={preset.id}>
          <CardHeader>
            <CardTitle>{preset.name}</CardTitle>
            <CardDescription>{preset.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleClick(preset)}
              disabled={loadingPresetId !== null}
            >
              {loadingPresetId === preset.id && (
                <Loader2Icon className="animate-spin mr-2 size-4" />
              )}
              Sélectionner
              {loadingPresetId === preset.id && (
                <CheckIcon className="ml-1 size-4" />
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
