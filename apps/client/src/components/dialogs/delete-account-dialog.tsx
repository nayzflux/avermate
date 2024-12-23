"use client";

import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { QueryClient, useMutation } from "@tanstack/react-query";
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
import { handleError } from "@/utils/error-utils";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const toaster = useToast();

  const queryClient = new QueryClient();

  const { data: session } = authClient.useSession() as unknown as {
    data: { user: User };
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["users", "delete", session?.user?.id],
    mutationFn: async () => {
      const { message, success } = await authClient.deleteUser();
      return { message, success };
    },
    onSuccess: () => {
      toaster.toast({
        title: `Compte supprimée`,
        description: `Votre compe a été supprimée avec succès.`,
      });

      setOpen(false);

      router.push("/");

      queryClient.clear();
      queryClient.invalidateQueries();
      queryClient.cancelQueries();

      localStorage.clear();
    },
    onError: (error) => {
      handleError(error, toaster);
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
