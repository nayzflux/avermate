"use client";

import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "better-auth/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function RevokeSessionButton({
  sessionId,
  sessionToken,
}: {
  sessionId: string;
  sessionToken: string;
}) {
  const toaster = useToast();

  const router = useRouter();

  const { data: currentSession } = authClient.useSession() as unknown as {
    data: { session: Session };
  };

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["revoke-session"],
    mutationFn: async () => {
      const data = await authClient.revokeSession({
        token: sessionToken,
      });
      return data;
        },
        onSuccess: () => {
      // Envoyer une notification toast
      toaster.toast({
        title: `Session révoquée`,
        description: "La session a été révoquée avec succès !",
      });

      if (sessionId === currentSession?.session?.id) {
        router.push("/");
      }
        },
        onError: () => {
      // Envoyer une notification toast
      toaster.toast({
        title: `Erreur`,
        description: "Une erreur s'est produite. Veuillez réessayer plus tard.",
      });
        },
        onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions-list"] });
        },
      });

      function handleRevokeSession() {
        mutate();
      }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      <Button variant="destructive">Révoquer</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Révoquer la session</AlertDialogTitle>
        <AlertDialogDescription>
        L'utilisateur sera invité à se réauthentifier.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Annuler</AlertDialogCancel>

        <Button variant="destructive" disabled={isPending} asChild>
        <AlertDialogAction
          disabled={isPending}
          onClick={() => handleRevokeSession()}
        >
          {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
          Révoquer la session
        </AlertDialogAction>
        </Button>
      </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
