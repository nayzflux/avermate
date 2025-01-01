"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Average } from "@/types/average";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/utils/error-utils";

import { Button } from "../ui/button";
import { Loader2Icon } from "lucide-react";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

export default function DeleteAverageDialog({ average }: { average: Average }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const toaster = useToast();

const { mutate, isPending } = useMutation({
  mutationKey: ["average", "delete", average.id],
  mutationFn: async () => {
    const res = await apiClient.delete(`averages/${average.id}`);
    if (!res.ok) {
      throw new Error(
        "Erreur lors de la suppression de la moyenne personnalisée."
      );
    }
    const data = await res.json<{ customAverage: Average }>();
    return data.customAverage;
  },
  onSuccess: (deletedAverage) => {
    queryClient.invalidateQueries({ queryKey: ["customAverages"] });
    toaster.toast({
      title: "Moyenne personnalisée supprimée",
      description: `${deletedAverage.name} a été supprimée avec succès.`,
    });
    setOpen(false);
  },
  onError: (error) => {
    handleError(error, toaster, "Erreur lors de la suppression de la moyenne personnalisée.");
  },
});


  const handleDelete = () => {
    mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex justify-start text-red-500 hover:text-red-400"
        >
          <TrashIcon className="size-4 mr-2" />
          Supprimer
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer {average.name}</AlertDialogTitle>
          <AlertDialogDescription className="max-w-[300px]">
            Êtes vous sûr de vouloir supprimer {average.name} ? Cette action est
            irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" asChild>
            <AlertDialogCancel
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annuler
            </AlertDialogCancel>
          </Button>
          <Button variant="destructive" asChild>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending && (
                <Loader2Icon className="size-4 mr-2 animate-spin" />
              )}
              Supprimer
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
