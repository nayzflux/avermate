"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Grade } from "@/types/grade";
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
import { handleError } from "@/utils/error-utils";

export default function DeleteGradeDialog({ grade }: { grade: Grade }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const toaster = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["grades", "delete", grade.id],
    mutationFn: async () => {
      const res = await apiClient.delete(`grades/${grade.id}`);
      const data = await res.json<{ grade: Grade }>();
      return data.grade;
    },
    onSuccess: (grade) => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["grades", grade.id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });

      toaster.toast({
        title: `Note supprimée`,
        description: `${grade.name} a été supprimée avec succès.`,
      });

      setOpen(false);

      router.back();
    },
    onError: (error) => {
      handleError(error, toaster, "Erreur lors de la suppression de la note.");
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
          <AlertDialogTitle>Supprimer {grade.name}</AlertDialogTitle>

          <AlertDialogDescription className="max-w-[300px]">
            Êtes vous sûr de vouloir supprimer {grade.name} ? Cette action ne
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
