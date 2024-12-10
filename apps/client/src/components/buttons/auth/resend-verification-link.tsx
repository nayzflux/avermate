"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { env } from "@/lib/env";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

const ResendVerificationLink = ({ email }: { email: string }) => {
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: async () => {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: `${env.NEXT_PUBLIC_CLIENT_URL}/onboarding`,
      });
    },
    onSuccess: () => {
      toaster.toast({
        title: "🔗 Lien renvoyé",
        description: `Un nouveau lien de vérification a été renvoyé à l'adresse ${email}.`,
      });
    },
    onError: () => {
      toaster.toast({
        title: "❌ Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      variant="outline"
      disabled={email === "" || isPending}
      onClick={() => mutate()}
    >
      {isPending && <Loader2Icon className="animate-spin" />}
      Renvoyer un lien de vérification
    </Button>
  );
};

export default ResendVerificationLink;
