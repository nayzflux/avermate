"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api";
import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { User } from "better-auth/types";
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

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const toaster = useToast();

  const { data: session } = authClient.useSession() as unknown as {
    data: { user: User };
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["users", "delete", session?.user?.id],
    mutationFn: async () => {
      const res = await apiClient.delete(`users/${session?.user?.id}`);
      const data = await res.json<{ user: User }>();
      return data.user;
    },
    onSuccess: (user) => {
      toaster.toast({
        title: `Compte supprimée`,
        description: `${user.email} a été supprimée avec succès.`,
      });

      setOpen(false);

      router.push("/");
    },
    onError: () => {
      toaster.toast({
        title: `Erreur`,
        description: `Une erreur est survenue lors de la suppression de votre compte. Réessayez plus tard.`,
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
        <Button variant="destructive">Supprimer votre compte</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer votre compte</AlertDialogTitle>

          <AlertDialogDescription>
            Votre compte sera définitivement supprimé de nos serveurs. Cette
            action est irréversible.
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
