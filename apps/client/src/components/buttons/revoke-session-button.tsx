"use client";

import { useToast } from "@/hooks/use-toast";
import { authClient, useSession } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
}: {
  sessionId: string;
}) {
  const toaster = useToast();

  const router = useRouter();

  const { data: currentSession } = useSession();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationKey: ["revoke-session"],
    mutationFn: async () => {
      const data = await authClient.revokeSession({ id: sessionId });
      return data;
    },
    onSuccess: () => {
      // Send toast notification
      toaster.toast({
        title: `Session revoked`,
        description: "Session has been successfully revoked!",
      });

      if (sessionId === currentSession?.session?.id) {
        router.push("/");
      }
    },
    onError: () => {
      // Send toast notification
      toaster.toast({
        title: `Error`,
        description: "Something went wrong. Please try again later.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });

  function handleRevokeSession() {
    mutate();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Revoke</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke session</AlertDialogTitle>
          <AlertDialogDescription>
            User will be prompted to re-authenticate.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button variant="destructive" disabled={isPending} asChild>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => handleRevokeSession()}
            >
              {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
              Revoke session
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
