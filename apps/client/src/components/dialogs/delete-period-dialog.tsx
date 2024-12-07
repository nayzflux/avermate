"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Period } from "@/types/period";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { Button } from "../ui/button";

export default function DeletePeriodDialog({ period }: { period: Period }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const toaster = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["periods", "delete", period.id],
    mutationFn: async () => {
      const res = await apiClient.delete(`periods/${period.id}`);
      const data = await res.json<{ period: Period }>();
      return data.period;
    },
    onSuccess: (period) => {
      queryClient.invalidateQueries({ queryKey: ["periods"] });
      queryClient.invalidateQueries({ queryKey: ["period", period.id] });

      toaster.toast({
        title: `Période supprimée`,
        description: `${period.name} a été supprimée avec succès.`,
      });

      setOpen(false);
    },
      onError: (err) => {
        // console.log("the error was: ", err);
      toaster.toast({
        title: `Erreur`,
        description: `Une erreur est survenue lors de la suppression de la période. Réessayez plus tard.`,
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    mutate();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full flex justify-start text-red-500 hover:text-red-400"
          variant="ghost"
        >
          <TrashIcon className="size-4 mr-2" />
          Supprimer
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer {period.name}</AlertDialogTitle>

          <AlertDialogDescription className="max-w-[300px]">
            Êtes-vous sûr de vouloir supprimer {period.name} ? Cette action ne
            peut pas être annulée.
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
            <AlertDialogAction
              disabled={isPending}
              onClick={() => handleDelete()}
            >
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
