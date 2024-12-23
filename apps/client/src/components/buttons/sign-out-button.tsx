"use client";

import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";
import { LogOutIcon } from "lucide-react";
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
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function SignOutButton() {
  const router = useRouter();
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-out"],
    mutationFn: async () => {
      const data = await authClient.signOut();
    },
    onSuccess: () => {
      localStorage.removeItem("isOnboardingCompleted");
      localStorage.removeItem("selectedTab");

      router.push("/");

      toaster.toast({
        title: "Déconnecté",
        description: "À bientôt 👋!",
      });
    },
  });

  const handleSignOut = (e: any) => {
    e.preventDefault();
    mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="!text-red-500"
          onSelect={(e) => e.preventDefault()}
        >
          <LogOutIcon className="size-4 mr-2" />
          Se déconnecter
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Se déconnecter</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir vous déconnecter ?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Rester</AlertDialogCancel>

          <Button variant="destructive" asChild>
            <AlertDialogAction disabled={isPending} onClick={handleSignOut}>
              Se déconnecter
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
