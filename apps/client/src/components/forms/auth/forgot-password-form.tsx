"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth";
import { env } from "@/lib/env";
import { handleError } from "@/utils/error-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email().max(320),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const toaster = useToast();

  const { mutate, isPending } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async ({ email }: ForgotPasswordSchema) => {
      const data = await authClient.forgetPassword({
        email,
        redirectTo: `${env.NEXT_PUBLIC_CLIENT_URL}/auth/reset-password`,
      });

      return data;
    },
    onSuccess: (data) => {
      toaster.toast({
        title: `Email de réinitialisation du mot de passe envoyé`,
        description: "Veuillez vérifier votre email pour plus d'instructions.",
      });
    },

    onError: (error) => {
      handleError(error, toaster, "Erreur lors de l'envoi de l'email de réinitialisation du mot de passe.");
    },
  });

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordSchema) => {
    mutate(values);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    placeholder="email@exemple.com"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full" type="submit" disabled={isPending}>
            {isPending && <Loader2Icon className="animate-spin mr-2 size-4" />}
            Réinitialiser le mot de passe
          </Button>
        </form>
      </Form>
    </div>
  );
};
