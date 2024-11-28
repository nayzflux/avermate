"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { Subject } from "@/types/subject";
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

export default function DeleteSubjectDialog({ subject }: { subject: Subject }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const toaster = useToast();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["subjects", "delete", subject.id],
    mutationFn: async () => {
      const res = await apiClient.delete(`subjects/${subject.id}`);
      const data = await res.json<{ subject: Subject }>();
      return data.subject;
    },
    onSuccess: (subject) => {
      queryClient.invalidateQueries({ queryKey: ["grades"] });
      queryClient.invalidateQueries({ queryKey: ["subjects", subject.id] });
      queryClient.invalidateQueries({ queryKey: ["subjects"] });

      toaster.toast({
        title: `Note supprimée`,
        description: `${subject.name} a été supprimée avec succès.`,
      });

      setOpen(false);

      router.back();
    },
    onError: (err) => {
      toaster.toast({
        title: `Erreur`,
        description: `Une erreur est survenue lors de la suppression de la note. Réessayez plus tard.`,
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
          <AlertDialogTitle>Supprimer {subject.name}</AlertDialogTitle>

          <AlertDialogDescription className="max-w-[300px]">
            Êtes vous sûr de vouloir supprimer {subject.name} ? Cette action ne
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
