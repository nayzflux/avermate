"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetPresetResponse, Preset } from "@/types/get-preset-response";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Loader2Icon } from "lucide-react";
import { CheckIcon } from "lucide-react";

export const PresetList = ({ close }: { close: () => void }) => {
  const toaster = useToast();
  const queryClient = useQueryClient();

  // Fetch the list of presets
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

  // Define the mutation to apply a preset
  const { mutate, isPending } = useMutation<
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
    },
    onError: (err) => {
      toaster.toast({
        title: "Erreur lors de l'application du préset",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    },
  });

  // Handle the button click to apply a preset
  const handleClick = (preset: Preset) => {
    mutate({ presetId: preset.id });
  };

  if (isLoading) {
    return <div>Chargement des presets...</div>;
  }

  if (isError) {
    return <div>Erreur lors du chargement des presets.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {presets?.map((preset) => (
        <Card key={preset.id}>
          <CardHeader>
            <CardTitle>{preset.name}</CardTitle>
            <CardDescription>{preset.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleClick(preset)} disabled={isPending}>
              {isPending && (
                <Loader2Icon className="animate-spin mr-2 size-4" />
              )}
                      Sélectionner
                      <CheckIcon className="ml-1 size-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
